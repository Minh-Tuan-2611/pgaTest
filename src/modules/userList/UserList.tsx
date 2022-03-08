import Cookies from 'js-cookie'
import React from 'react'
import { ROUTES } from '../../configs/routes'
import Header from '../component/Header'
import Menuu from '../component/Menuu'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function UserList() {

  if (Cookies.get('token')) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        <Menuu />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{backgroundColor: 'rgb(33, 33, 57)',height:'1000px'}}>
          <DrawerHeader />
          <p className="text-white">User List</p>
        </Box>
      </Box>
    )
  }
  else {
    window.location.pathname = ROUTES.login;
    return <div></div>
  }
}
