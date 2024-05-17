import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import { DialogContent } from '@mui/material';
import { deviceContext } from './DeviceProvider';
import Slider from '@mui/material/Slider';
import axios from 'axios';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const setData = [
  {
      "device_id": 2,
      "device_name": "Door1",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 2,
      "device_state": false
  },
  {
      "device_id": 8,
      "device_name": "Fan1",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 49,
      "device_state": true
  },
  {
      "device_id": 9,
      "device_name": "Fan2",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 0,
      "device_state": true
  },
  {
      "device_id": 13,
      "device_name": "Temperature1",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 600,
      "device_state": false
  },
  {
      "device_id": 16,
      "device_name": "Light1",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 650,
      "device_state": false
  },
  {
      "device_id": 17,
      "device_name": "Light2",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 700,
      "device_state": false
  },
  {
      "device_id": 18,
      "device_name": "Light3",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 700,
      "device_state": false
  },
  {
      "device_id": 32,
      "device_name": "Alarm17",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 700,
      "device_state": false
  },
  {
      "device_id": 33,
      "device_name": "Humidity",
      "house_id": 1,
      "name": "Setting1",
      "device_data": 30,
      "device_state": false
  }
]
const BElink = "https://hgs-backend.onrender.com";
export default function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const { lightChecked, setLightChecked, fanChecked, setFanChecked, fanLevel, setFanLevel, doorOpen, setDoorOpen, lightLevel, setLightLevel } = React.useContext(deviceContext);
  const [lightPresetChecked, setLightPresetChecked] = React.useState(false);
  const [fanPresetChecked, setFanPresetChecked] = React.useState(false);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const onChageFanChecked = (event) => {
    setFanPresetChecked(event.target.checked);
  }

  const applyPreset = async () => {
    console.log(fanLevel);
    const response = await axios.post(BElink + "/users/updateSets", 

        [{device_id: 8,
        device_name: "Fan1",
        house_id: 1,
        name: "Setting1",
        device_data: 49,
        device_state: fanPresetChecked}],

        {
        "Content-Type": "application/json",
        Authorization:localStorage.getItem('SavedToken')
      });
  }

  const savePreset = () => {

  }

  return (
    <Dialog onClose={handleClose} open={open} >
      <DialogTitle>Presetting devices</DialogTitle>
      <DialogContent sx={{ padding: '20px' }} >
        <FormGroup>
            <FormControlLabel control={
            <Switch 
              defaultChecked
              onClick={onChageFanChecked}
            ></Switch>
            } label="FAN"  />
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
            <FormControlLabel control={<Switch defaultChecked />} label="LIGHT" />
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
            <FormControlLabel control={<Switch defaultChecked />} label="MAIN DOOR"/>
        </FormGroup>
        <Stack sx={{ margin: '20px' }}>
            <Button 
              variant="contained"
              onClick={applyPreset}
            >Save</Button>
        </Stack>
    </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};


// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }