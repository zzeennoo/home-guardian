import React, { useState, useEffect } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // Alert component for styled snackbar
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WindPowerIcon from '@mui/icons-material/WindPower';
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical';
import Table from 'src/views/dashboard/Table';
import TotalEarning from 'src/views/dashboard/TotalEarning';
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview';

// ** Axios Import
import axios from 'axios';

const BackendLink = 'https://hgs-backend.onrender.com';

const Dashboard = () => {
  // ** States
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [fan_speed, setFanSpeed] = useState(null);
  const [light, setLight] = useState(null);
  const [openHighTempSnackbar, setOpenHighTempSnackbar] = useState(false); // >60 degrees
  const [openWarningTempSnackbar, setOpenWarningTempSnackbar] = useState(false); // >40 degrees but <=60 degrees

  const highTempThreshold = 45; // Threshold for high temperature in degrees Celsius
  const warningTempThreshold = 35; // Threshold for warning temperature in degrees Celsius


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackendLink}/users/getDashboardData`, {
          headers: {
            Authorization: localStorage.getItem('SavedToken'),
          },
        });
        

        const data = response.data;
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setFanSpeed(data.fan_speed);
        
        setLight(data.light_level);
        // Trigger the toast if temperature exceeds the threshold
        if (data.temperature > highTempThreshold && data.humidity < 15) {
          setOpenHighTempSnackbar(true);
        } else if (data.temperature > warningTempThreshold) {
          setOpenWarningTempSnackbar(true);
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors gracefully
      }
    };

    fetchData(); // Fetch data immediately for testing

    const intervalId = setInterval(fetchData, 8000); // Fetch data every 8 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array ensures data is fetched only once on component mount

  // Handler to close the snackbar
  const handleCloseSnackbar = (snackbarType) => {
    if (snackbarType === 'high') {
      setOpenHighTempSnackbar(false);
    } else if (snackbarType === 'warning') {
      setOpenWarningTempSnackbar(false);
    }
  };


  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TotalEarning />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={temperature ? `${temperature}°C` : 'Loading...'}
                icon={<DeviceThermostatIcon />}
                color='success'
                title='Current Temp'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={fan_speed === 0 ? '0%' : (fan_speed ? `${fan_speed}%` : 'Loading...')}
                title='Fan Speed'
                color='secondary'
                icon={<WindPowerIcon />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={humidity ? `${humidity}%` : 'Loading...'}
                title='Humidity'
                icon={<WaterDropOutlined />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={light === 0 ? '0' : ( light ? `${light}` : 'Loading...')}
                color='warning'
                title='Light Level'
                icon={<WbSunnyIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>

      {/* Snackbar to alert users if temperature is too high */}
      {/* Snackbar for high temperature (>60°C) */}
      <Snackbar
        open={openHighTempSnackbar}
        autoHideDuration={10000}
        onClose={() => handleCloseSnackbar('high')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => handleCloseSnackbar('high')}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: '#f44336',
            color: '#ffffff',
            '.MuiAlert-icon': { color: '#ffffff' },
          }}
        >
          Temperature is too high! Current temperature is {temperature}°C.
        </Alert>
      </Snackbar>

      {/* Snackbar for warning temperature (>40°C but <=60°C) */}
      <Snackbar
        open={openWarningTempSnackbar}
        autoHideDuration={8000}
        onClose={() => handleCloseSnackbar('warning')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => handleCloseSnackbar('warning')}
          severity="warning"
          sx={{
            width: '100%',
            backgroundColor: '#ff9800', // Opaque orange color for warning severity
            color: '#ffffff', // White color for text
            '.MuiAlert-icon': { color: '#ffffff' }, // White color for icon
          }}
        >
          Temperature is getting high! Current temperature is {temperature}°C.
        </Alert>
      </Snackbar>

    </ApexChartWrapper>
  );
};

export default Dashboard;
