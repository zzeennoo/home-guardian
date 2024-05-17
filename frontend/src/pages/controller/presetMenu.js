import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import SimpleDialog from './subWindowDevices';

const BElink = "https://hgs-backend.onrender.com";


export default function PresetMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [listPreset, setListPreset] = React.useState([]);
  const [selectedPreset, setSelectedPreset] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (value) => {
    setOpenDialog(false);
    setSelectedPreset(value);
  };

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    let response = await axios.get(BElink + '/users/getHouseSetting?house_id=1', { headers: { Authorization:localStorage.getItem('SavedToken') }});
    setListPreset(response.data);
    console.log(response);
  };

  const applyPreset = async (preset) => {
    for (let i = 0; i < preset.length; i++) {
      if (preset[i].device_id == 8) {
        const response = await axios.post(BElink + "/users/updateFanSpeed", 
        {
          fan_speed:preset[i].device_data, 
          headers: {
          "Content-Type": "application/json",
          Authorization:localStorage.getItem('SavedToken')
        }});

        console.log(response);
      } else if (preset[i].device_id == 18) {
        const response = preset[i].device_status == "true" ? await axios.post(BElink + "/users/turnOnLight", { headers: { Authorization:localStorage.getItem('SavedToken') }}) 
        : await axios.post(BElink + "/users/turnOffLight",{ headers: { Authorization:localStorage.getItem('SavedToken') }});
        console.log(response);
      }
    }
  }
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPreset("");
  }
  const handleClose = async (presetName) => {
    setSelectedPreset(presetName)
    handleClickOpenDialog();
    let response = await axios.get(BElink + `/users/getSetOfHouseSetting?house_id=1&name=${presetName}`, { headers: { Authorization:localStorage.getItem('SavedToken') }});
    // applyPreset(response.data);
    console.log(response)
  };

  const addMorePreset = () => {

  }
  return (
    <div>
      <SimpleDialog
        selectedValue={selectedPreset}
        open={openDialog}
        onClose={handleCloseDialog}
      />
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Presetting menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {listPreset.map(preset => (

            <MenuItem onClick={(preset) => handleClose(preset)} key = {preset.name}> {preset.name} </MenuItem>
            
          ))}
        <Button onClick={addMorePreset}>Add more</Button>
      </Menu>
    </div>
  );
}