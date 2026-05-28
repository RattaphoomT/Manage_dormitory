import React from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const requests = [
  { id: 'RP-001', room: '201', title: 'แอร์ไม่เย็น', category: 'ไฟฟ้า/แอร์', priority: 'สูง', assignee: 'ช่างเอก', status: 'กำลังซ่อม', createdAt: '2569-06-05' },
  { id: 'RP-002', room: '102', title: 'ก๊อกน้ำรั่ว', category: 'ประปา', priority: 'กลาง', assignee: 'รอมอบหมาย', status: 'ใหม่', createdAt: '2569-06-06' },
  { id: 'RP-003', room: '305', title: 'หลอดไฟเสีย', category: 'ไฟฟ้า', priority: 'ต่ำ', assignee: 'ช่างนนท์', status: 'เสร็จแล้ว', createdAt: '2569-06-02' },
];

const statusColor = {
  ใหม่: 'info',
  กำลังซ่อม: 'warning',
  เสร็จแล้ว: 'success',
};

const priorityColor = {
  สูง: 'error',
  กลาง: 'warning',
  ต่ำ: 'default',
};

export default function RepairRequests() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ระบบแจ้งซ่อม
          </Typography>
          <Typography color="text.secondary">รับเรื่อง แนบรูป มอบหมายช่าง และติดตามสถานะงานซ่อม</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<AssignmentIndIcon />}>มอบหมายช่าง</Button>
          <Button variant="contained" startIcon={<AddIcon />}>เพิ่มงานซ่อม</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {['ใหม่', 'กำลังซ่อม', 'เสร็จแล้ว'].map((status) => (
          <Grid item xs={12} sm={4} key={status}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">{status}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {requests.filter((item) => item.status === status).length}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 860 }}>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>เลขที่งาน</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ห้อง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>รายการ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>หมวด</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ความเร่งด่วน</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ผู้รับผิดชอบ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>วันที่แจ้ง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{request.id}</TableCell>
                <TableCell>{request.room}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>
                  <Chip label={request.priority} color={priorityColor[request.priority]} size="small" />
                </TableCell>
                <TableCell>{request.assignee}</TableCell>
                <TableCell>{request.createdAt}</TableCell>
                <TableCell>
                  <Chip label={request.status} color={statusColor[request.status]} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
