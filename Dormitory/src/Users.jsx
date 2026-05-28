import React from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const users = [
  { id: 1, name: 'เจ้าของหอพัก', email: 'owner@dorm.local', role: 'owner', status: 'ใช้งาน' },
  { id: 2, name: 'แอดมินหน้าเคาน์เตอร์', email: 'admin@dorm.local', role: 'admin', status: 'ใช้งาน' },
  { id: 3, name: 'ช่างเอก', email: 'technician@dorm.local', role: 'technician', status: 'ใช้งาน' },
  { id: 4, name: 'มาลี มีสุข', email: 'tenant201@dorm.local', role: 'tenant', status: 'รอเปิดใช้งาน' },
];

const roleLabel = {
  owner: 'เจ้าของ',
  admin: 'ผู้ดูแล',
  staff: 'พนักงาน',
  technician: 'ช่าง',
  tenant: 'ผู้เช่า',
};

export default function Users() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ผู้ใช้งานและสิทธิ์
          </Typography>
          <Typography color="text.secondary">กำหนดบทบาท owner, admin, staff, technician และ tenant</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<AdminPanelSettingsIcon />}>จัดการ Role</Button>
          <Button variant="contained" startIcon={<AddIcon />}>เพิ่มผู้ใช้งาน</Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 760 }}>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ชื่อ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>อีเมล</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สิทธิ์หลัก</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={roleLabel[user.role]} color={user.role === 'owner' ? 'primary' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  {user.role === 'tenant' ? 'ดูบิล / แจ้งซ่อม / ชำระเงิน' : 'จัดการข้อมูลตามหน้าที่'}
                </TableCell>
                <TableCell>
                  <Chip label={user.status} color={user.status === 'ใช้งาน' ? 'success' : 'warning'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
