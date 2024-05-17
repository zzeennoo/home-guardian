import * as React from 'react';
import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import Slider from '@mui/material/Slider';
import { deviceContext } from './DeviceProvider';



const label = { inputProps: { 'aria-label': 'Switch demo' } };

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));


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

const BElink = "https://hgs-backend.onrender.com"
export default function BasicSwitches(props) {
  const { text } = props

  const { lightChecked, setLightChecked, fanChecked, setFanChecked, fanLevel, setFanLevel, doorOpen, setDoorOpen, lightLevel, setLightLevel } = useContext(deviceContext);

  const handleChangeFan = async (event) => {
    setFanChecked(event.target.checked);
    event.target.checked ? setFanLevel(50) : setFanLevel(30);
    try {
      const response = event.target.checked ? await axios.post(BElink + "/users/turnOnFan", null, { headers: { Authorization:localStorage.getItem('SavedToken') }})
      : await axios.post(BElink + "/users/turnOffFan", null, { headers: { Authorization:localStorage.getItem('SavedToken') }});
      console.log(response);
    } catch (error) {
      console.log(error);
    }

  }


  const handleChangeLight = async (event) => {
    setLightChecked(event.target.checked);
    setLightLevel(1);

    try {
      const response = event.target.checked ? await axios.post(BElink + "/users/turnOnLight", null, { headers: { Authorization:localStorage.getItem('SavedToken') }})
      : await axios.post(BElink + "/users/turnOffLight", null, { headers: { Authorization:localStorage.getItem('SavedToken') }});
      console.log(response);
    } catch (error) {
      console.log(error);
    }

  }


  const handleChangeDoor = async (event) => {
    setDoorOpen(event.target.checked);

    try {
      const response = event.target.checked ? await axios.post(BElink + "/users/openDoor", null, { headers: { Authorization:localStorage.getItem('SavedToken') }}) 
      : await axios.post(BElink + "/users/closeDoor", null, { headers: { Authorization:localStorage.getItem('SavedToken') }});
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleOnChange = (event) => {
    if (text == "LIGHT")
      handleChangeLight(event);
    else if (text == "FAN")
      handleChangeFan(event);
    else if (text == "MAIN DOOR")
    handleChangeDoor(event);
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          control={<IOSSwitch
            sx={{
              m: 1,
              transform: 'scale(1)',
            }}
            defaultChecked
            checked={(text == "LIGHT" && lightChecked) ||  (text == "FAN" && fanChecked) || (text == "MAIN DOOR" && doorOpen)} 
            onChange={handleOnChange}/>}
            labelPlacement='top'
            label=""
        />
    </FormGroup>


    </div>
  );
}
