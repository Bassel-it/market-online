import * as React from 'react';
import {  ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material/';
import { LicenseInfo } from '@mui/x-license-pro';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Category from './tables/Category';
import Product from './tables/Product';
import User from './tables/User';
import Message from './tables/Message';
import Notification from './tables/Notification';
import Favorite from './tables/Favorite';
import Bar from './Bar';
import Main from './Main';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'light' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));



export default function Dashboard() {
  LicenseInfo.setLicenseKey(
    'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
  );
  return (
   <ThemeProvider
        theme={createTheme({
         
          palette: {
            mode: 'dark',
            primary: { main: 'rgb(102, 157, 246)' },
            background: {
               paper: 'rgb(5, 30, 52)',
                        default: 'rgb(5, 30, 52)' 
                      },
            text:{primary:'rgb(102, 157, 246)'}
           
          },
          typography:{
                fontFamily:'"Roboto"'
              }
        })}
      > 
      <CssBaseline />

    <BrowserRouter>
       
        {/* 'rgb(5, 30, 52)' */}
        <Bar/>
        <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/CategoryTable' element={<Category/>}/>
        <Route path='/ProductTable' element={<Product/>}/>
        <Route path='/FavoriteTable' element={<Favorite/>}/>
        <Route path='/MessageTable' element={<Message/>}/>
        <Route path='/NotificationTable' element={<Notification/>}/>
        <Route path='/UserTable' element={<User/>}/>
          
        </Routes>
        
      </BrowserRouter>
      </ThemeProvider>
  );
}