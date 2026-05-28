import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Divider from '@mui/material/Divider';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // For Billing
import PaymentIcon from '@mui/icons-material/Payment'; // For Payments
import BuildIcon from '@mui/icons-material/Build'; // For Repair Requests
import SettingsIcon from '@mui/icons-material/Settings'; // For Users/Roles
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'แดชบอร์ด', icon: <DashboardIcon />, path: '/' },
  { text: 'จัดการห้องพัก', icon: <MeetingRoomIcon />, path: '/rooms' },
  { text: 'จัดการผู้พักอาศัย', icon: <PeopleIcon />, path: '/students' },
  { text: 'ระบบคิดค่าเช่า', icon: <ReceiptLongIcon />, path: '/billing' },
  { text: 'ระบบชำระเงิน', icon: <PaymentIcon />, path: '/payments' },
  { text: 'ระบบแจ้งซ่อม', icon: <BuildIcon />, path: '/repair-requests' },
  { text: 'ผู้ใช้งาน/สิทธิ์', icon: <SettingsIcon />, path: '/users' },
];

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // ไม่จำเป็นต้อง navigate เพราะ ProtectedRoute จะจัดการ redirect ให้อัตโนมัติ
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            ระบบบริหารจัดการหอพัก
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid rgba(0, 0, 0, 0.12)' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List subheader={<ListSubheader>ภาพรวม</ListSubheader>}>
            {menuItems.slice(0, 1).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <List subheader={<ListSubheader>การจัดการหลัก</ListSubheader>}>
            {menuItems.slice(1).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="ออกจากระบบ" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}