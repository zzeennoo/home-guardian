import React, { createContext, useState, useEffect } from 'react';

// ** Axios Import
import axios from 'axios';
export const deviceContext = createContext();

export const DeviceProvider = ({ children }) => {
    const [lightChecked, setLightChecked] = useState(false);
    const [fanChecked, setFanChecked] = React.useState(false);
    const [doorOpen, setDoorOpen] = React.useState(false);
    const [fanLevel, setFanLevel] = React.useState(50);
    const [lightLevel, setLightLevel] = React.useState(1);

    useEffect(() => {
        const BackendLink = 'https://hgs-backend.onrender.com';
        const fetchData = async () => {
          try {
            const response = await axios.get(`${BackendLink}/users/getDashboardData`, {
              headers: {
                Authorization: localStorage.getItem('SavedToken'),
              },
            });


            const data = response.data;
            setLightChecked(data.light);
            setFanChecked(data.fan);
            setFanLevel(data.fan_speed);
            setLightLevel(data.light_level);
            setDoorOpen(data.door);
          } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors gracefully
          }
        };

        fetchData(); // Fetch data immediately for testing

        // remove set fetch interval, this code only run when component mount
      }, []); // Empty dependency array ensures data is fetched only once on component mount

      useEffect(() => {
        if (fanChecked) {
          const BackendLink = 'https://hgs-backend.onrender.com';
          const fetchFanData = async () => {
        try {
          const response = await axios.get(`${BackendLink}/users/getDashboardData`, {
            headers: {
          Authorization: localStorage.getItem('SavedToken'),
            },
          });
          const data = response.data;
          // setFanChecked(data.fan);
          setFanLevel(data.fan_speed);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors gracefully
        }
          };
          fetchFanData(); // Fetch data immediately for testing

          // remove fetch interval this code will only run when fanchecked changes
        }
      }, [fanChecked]); // Empty dependency array ensures data is fetched only once on component mount


      useEffect(() => {
        if (lightChecked) {
          const BackendLink = 'https://hgs-backend.onrender.com';
          const fetchLightData = async () => {
        try {
          const response = await axios.get(`${BackendLink}/users/getDashboardData`, {
            headers: {
          Authorization: localStorage.getItem('SavedToken'),
            },
          });
          const data = response.data;
          // setLightChecked(data.light);
          setLightLevel(data.light_level);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors gracefully
        }
          };

          fetchLightData(); // Fetch data immediately for testing

          // remove fetch interval this code only run when lightchecked changed
        }
      }, [lightChecked]); // depency, only change when lightChecked changes

    return (
    <deviceContext.Provider value={{ lightChecked, setLightChecked, fanChecked, setFanChecked, fanLevel, setFanLevel, doorOpen, setDoorOpen, lightLevel, setLightLevel }}>
        {children}
    </deviceContext.Provider>
    );
}
