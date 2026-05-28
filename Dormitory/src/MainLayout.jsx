import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNav from './SideNav';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        <Outlet /> {/* หน้าเพจย่อยๆ จะถูกแสดงผลที่นี่ */}
      </Box>
    </Box>
  );
};

export default MainLayout;