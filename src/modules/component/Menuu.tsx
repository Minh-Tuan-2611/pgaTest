import SubMenu from 'antd/lib/menu/SubMenu'
import React from 'react'
import {
    UserOutlined,
    TagOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';

import { ROUTES } from '../../configs/routes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Menuu() {

    let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    return (
        <Drawer variant="permanent" open={collapsed} style={{ position: 'relative', backgroundColor: '#323259' }}>
            <DrawerHeader />
            <Menu
                style={{ width: 245, backgroundColor: '#323259', color: '#fff', height: '100%' }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                <SubMenu key="sub2" icon={<UserOutlined style={{padding:'8px 24px 8px 0'}} onClick={() => {
                    if (collapsed === false) {
                        dispatch({
                            type: 'change_collapsed'
                        })
                    }
                }} />} title="User">
                    <Menu.Item onClick={() => {
                        navigate(ROUTES.userList)
                    }} style={{ backgroundColor: '#323259', margin: '0', color: '#fff',paddingLeft: '72px' }} key="5">User List</Menu.Item>
                </SubMenu>
                <hr className="text-white" />
                <SubMenu key="sub4" icon={<TagOutlined style={{padding:'8px 24px 8px 0'}} onClick={() => {
                    if (collapsed === false) {
                        dispatch({
                            type: 'change_collapsed'
                        })
                    }
                }} />} title="Catalog" >
                    <Menu.Item onClick={() => {
                        navigate(ROUTES.product)
                    }} style={{ backgroundColor: '#323259', margin: '0', color: '#fff',paddingLeft: '72px'}} key="9">Products</Menu.Item>
                </SubMenu>
            </Menu>
        </Drawer>
    )
}
