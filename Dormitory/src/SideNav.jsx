import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Divider from '@mui/material/Divider';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // For Billing
import PaymentIcon from '@mui/icons-material/Payment'; // For Payments
import BuildIcon from '@mui/icons-material/Build'; // For Repair Requests
import SettingsIcon from '@mui/icons-material/Settings'; // For Users/Roles
import LogoutIcon from '@mui/icons-material/Logout';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from './AuthContext';

const drawerWidth = 272;

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
    <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: { xs: 2, md: 3 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, md: 2 }}
            sx={{ width: '100%', minWidth: 0 }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                flex: 1,
                minWidth: 0,
                px: 1.5,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
                transition: 'border-color 160ms ease, background-color 160ms ease',
                '&:focus-within': {
                  bgcolor: '#ffffff',
                  borderColor: 'primary.main',
                },
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
              <InputBase
                placeholder="ค้นหาห้อง ผู้เช่า ใบแจ้งหนี้ หรืองานซ่อม..."
                sx={{ flex: 1, fontSize: 14 }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>

            <Stack direction="row" spacing={{ xs: 1, md: 1.25 }} alignItems="center" sx={{ flexShrink: 0, ml: 'auto' }}>
              <Tooltip title="ค้นหา">
                <IconButton
                  sx={{
                    display: { xs: 'inline-flex', md: 'none' },
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: '#ffffff',
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="การแจ้งเตือน">
                <IconButton
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: '#ffffff',
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  px: { xs: 0.5, sm: 1 },
                  py: 0.5,
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 800 }}>AD</Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Admin Dorm</Typography>
                  <Typography variant="caption" color="text.secondary">Owner</Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#101828',
            color: '#f9fafb',
            borderRight: 0,
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>
              <ApartmentIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>Dormitory</Typography>
              <Typography variant="caption" sx={{ color: '#98a2b3' }}>Management Suite</Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Box sx={{ overflow: 'auto', px: 1.5, pb: 2 }}>
          <List
            subheader={
              <ListSubheader sx={{ bgcolor: 'transparent', color: '#98a2b3', fontSize: 12, fontWeight: 800, lineHeight: '32px' }}>
                ภาพรวม
              </ListSubheader>
            }
          >
            {menuItems.slice(0, 1).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: '#d0d5dd',
                    '& .MuiListItemIcon-root': { color: '#98a2b3', minWidth: 40 },
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      '& .MuiListItemIcon-root': { color: '#ffffff' },
                    },
                    '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
          <List
            subheader={
              <ListSubheader sx={{ bgcolor: 'transparent', color: '#98a2b3', fontSize: 12, fontWeight: 800, lineHeight: '32px' }}>
                การจัดการหลัก
              </ListSubheader>
            }
          >
            {menuItems.slice(1).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: '#d0d5dd',
                    '& .MuiListItemIcon-root': { color: '#98a2b3', minWidth: 40 },
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      '& .MuiListItemIcon-root': { color: '#ffffff' },
                    },
                    '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: '#d0d5dd',
                  '& .MuiListItemIcon-root': { color: '#98a2b3', minWidth: 40 },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
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
