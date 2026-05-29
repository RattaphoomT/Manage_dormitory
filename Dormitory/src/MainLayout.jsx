import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNav from './SideNav';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SideNav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, md: 3.5 },
          py: 3,
          mt: '72px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
