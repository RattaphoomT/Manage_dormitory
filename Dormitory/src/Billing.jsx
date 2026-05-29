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
  TextField,
  Typography,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const invoices = [
  { id: 'INV-256906-101', room: '101', rent: 3500, water: 120, electric: 680, other: 0, total: 4300, status: 'ชำระแล้ว' },
  { id: 'INV-256906-201', room: '201', rent: 5000, water: 180, electric: 1120, other: 200, total: 6500, status: 'ค้างชำระ' },
  { id: 'INV-256906-301', room: '301', rent: 7200, water: 0, electric: 0, other: 0, total: 7200, status: 'รอออกบิล' },
];

const meters = [
  { room: '101', waterLast: 220, waterNow: 232, electricLast: 1320, electricNow: 1405 },
  { room: '201', waterLast: 410, waterNow: 428, electricLast: 2988, electricNow: 3128 },
  { room: '301', waterLast: 0, waterNow: 0, electricLast: 0, electricNow: 0 },
];

const statusColor = {
  ชำระแล้ว: 'success',
  ค้างชำระ: 'error',
  รอออกบิล: 'warning',
};

export default function Billing() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ระบบคิดค่าเช่าอัตโนมัติ
          </Typography>
          <Typography color="text.secondary">บันทึกมิเตอร์ คำนวณค่าน้ำค่าไฟ และสร้างใบแจ้งหนี้รายเดือน</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<CalculateIcon />}>คำนวณรอบบิล</Button>
          <Button variant="contained" startIcon={<ReceiptLongIcon />}>สร้างใบแจ้งหนี้</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>มิเตอร์น้ำ/ไฟ</Typography>
            <Stack spacing={2}>
              {meters.map((item) => (
                <Grid container spacing={1.5} key={item.room}>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontWeight: 700 }}>ห้อง {item.room}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="น้ำครั้งก่อน" value={item.waterLast} size="small" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="น้ำปัจจุบัน" value={item.waterNow} size="small" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="ไฟครั้งก่อน" value={item.electricLast} size="small" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="ไฟปัจจุบัน" value={item.electricNow} size="small" fullWidth />
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>เลขที่บิล</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ห้อง</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ค่าเช่า</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>น้ำ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ไฟ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>รวม</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{invoice.id}</TableCell>
                    <TableCell>{invoice.room}</TableCell>
                    <TableCell align="right">{invoice.rent.toLocaleString()}</TableCell>
                    <TableCell align="right">{invoice.water.toLocaleString()}</TableCell>
                    <TableCell align="right">{invoice.electric.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={invoice.status} color={statusColor[invoice.status]} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
}
