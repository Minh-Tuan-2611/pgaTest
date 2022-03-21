import Cookies from 'js-cookie'
import React from 'react'
import { ROUTES } from '../../configs/routes'
import Header from '../component/Header'
import Menuu from '../component/Menuu'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AddUserContent from './AddUserContent'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function AddUser() {
  if (Cookies.get('token')) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        <Menuu />
        <div className="" style={{ width: '100%' }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{ backgroundColor: 'rgb(33, 33, 57)', paddingBottom: '10px' }}>
            <DrawerHeader />
            <AddUserContent />
          </Box>
        </div>
      </Box>
    )
  }
  else {
    window.location.pathname = ROUTES.login;
    return <div></div>
  }
}
