import { Dropdown, Menu } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import ButtonConfirmLogout from '../ButtonConfirm/ButtonConfirmLogout';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function Header() {

    let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

    let email = localStorage.getItem('emailLogin');

    let id = localStorage.getItem('idUser');

    const dispatch = useDispatch();

    const menu = (
        <div className="">
            <Menu>
                <Menu.Item key="0">
                    <NavLink to={`/userDetail/${id}`}>
                        {<p style={{ color: '#666' }}>{email}</p>}
                    </NavLink>
                </Menu.Item>
                <Menu.Item onClick={() => {
                    dispatch({
                        type: 'change_modal',
                        title: 'Log out',
                        content: 'Are you sure want to log out ?',
                        button: <ButtonConfirmLogout />
                    })
                }} key="1" data-toggle="modal" data-target="#modelId">

                    Log out

                </Menu.Item>
            </Menu>
        </div>
    );

    return (
        <AppBar position="fixed" open={collapsed} style={{ marginLeft: '0', width: '100%', backgroundColor: '#323259' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => {
                        dispatch({
                            type: 'change_collapsed'
                        })
                    }}
                    edge="start"

                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" noWrap component="div">
                    Gear Focus Admin
                </Typography>
                <Dropdown overlay={menu} overlayStyle={{ zIndex: '2000' }}>

                    <i className="fa-solid fa-user" style={{ position: 'absolute', right: '15px' }}></i>

                </Dropdown>
            </Toolbar>
        </AppBar>
    )
}
