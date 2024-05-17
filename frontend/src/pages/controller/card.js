import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BasicSwitches from './switch';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import { deviceContext } from './DeviceProvider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const BElink = "https://hgs-backend.onrender.com";

export default function BasicCard(props) {
  const { text } = props
  const [fanLevelText, setFanLevelText] = React.useState(0);
  const [lightLevelText, lightFanLevelText] = React.useState(4);
  const { lightChecked, setLightChecked, fanChecked, setFanChecked, fanLevel, setFanLevel, doorOpen, setDoorOpen, lightLevel, setLightLevel } = React.useContext(deviceContext);
  

  const buttonSaveFanLevelText = async (event) => {
    setFanLevel(fanLevelText);
    try {
      const response = await axios.post(BElink + "/users/updateFanSpeed", 
      {
        fan_speed:parseInt(fanLevelText, 10),
      },{
        headers: {
        "Content-Type": "application/json",
        Authorization:localStorage.getItem('SavedToken')
      }})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const buttonSaveLightLevelText = async (event) => {
    setLightLevel(lightLevelText);
    try {
      const response = await axios.post(BElink + "/users/updateLightLevel", 
      {
        light_level:parseInt(lightLevelText, 10),
      },{
        headers: {
        "Content-Type": "application/json",
        Authorization:localStorage.getItem('SavedToken')
      }})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const onchangeFanLevelText = (event) => {
    fanLevelText = event.target.value;
  }

  const onchangeLightLevelText = (event) => {
    lightLevelText = event.target.value;
  }

  const handleFanLevel = async (event, newValue) => {
    setFanLevel(newValue);
    try {
      const response = await axios.post(BElink + "/users/updateFanSpeed",
      {
        fan_speed:parseInt(newValue, 10)}, {
        headers: {
        "Content-Type": "application/json",
        Authorization:localStorage.getItem('SavedToken')
      }})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLightLevel = async (event, newValue) => {
    setLightLevel(newValue);
    try {
      const response = await axios.post(BElink + "/users/updateLightLevel", 
      {
        light_level:parseInt(newValue, 10)}, {
        headers: {
        "Content-Type": "application/json",
        Authorization:localStorage.getItem('SavedToken')
      }})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }



  const handleChangeFanLevel = (event, newValue) => {
    setFanLevel(newValue);
  };

  const handleChangeLightLevel = (event, newValue) => {
    setLightLevel(newValue);
  };

  return (
    <Card
    sx={{ width: "50%", minWidth: 400, minHeight: 180}}>

      <CardContent>
        <Grid container justifyContent="space-between" >
            <Grid item>
            {text}
            </Grid>
            <Grid item justifyContent="flex-end" alignItems="top right">
                <BasicSwitches text={text}/>
            </Grid>
          </Grid>

          {text == "FAN" && 
          <Grid container justifyContent="space-between">
            <PrettoSlider
            disabled={!fanChecked} 
              defaultValue={50}
              min={30}
              max={100}
              aria-label="pretto slidert"
              valueLabelDisplay="auto"
              value={fanLevel}
              onChange={handleChangeFanLevel}
              onChangeCommitted={handleFanLevel}
              />
            
            <TextField
              id="outlined-number"
              label="Level"
              // value={fanLevelText} 
              type="number"
              onChange={onchangeFanLevelText}
              inputProps={{
                min: 30,
                max: 100,
                step: 1 // Optional step value
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
          />
          <Button 
            variant="text"
            onClick={(event) => {fanChecked && buttonSaveFanLevelText(event)}}
          > SAVE
          </Button>
          </Grid>
        }

          {text == "LIGHT" && 
          <Grid container justifyContent="space-between">
            <Slider
              disabled={!lightChecked}
              aria-label="Temperature"
              defaultValue={3}
              value={lightLevel}
              // getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={4}
              onChange={handleChangeLightLevel}
              onChangeCommitted={handleLightLevel}
            />
            
            <TextField
              id="outlined-number"
              label="Level"
              // value={fanLevelText} 
              type="number"
              onChange={onchangeLightLevelText}
              inputProps={{
                min: 1,
                max: 4,
                step: 1 // Optional step value
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
          />
          <Button 
            variant="text"
            onClick={(event) =>lightChecked && buttonSaveLightLevelText(event)}
          > SAVE
          </Button>
          </Grid>
        }
         
         {/* <Grid container justifyContent="space-between" alignItems="center">
            <Grid item sx={{ fontSize: 14, width: 'fit-content'}} color="text.secondary" gutterBottom>
                Active 3 hours ago
            </Grid>
        </Grid> */}


      </CardContent>
    </Card>
  );
}
