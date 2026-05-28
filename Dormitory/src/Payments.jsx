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
import FactCheckIcon from '@mui/icons-material/FactCheck';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReceiptIcon from '@mui/icons-material/Receipt';

const payments = [
  { id: 'PAY-001', invoice: 'INV-256906-101', tenant: 'สมศักดิ์ ใจดี', method: 'PromptPay QR', amount: 4300, paidAt: '2569-06-03 09:20', status: 'ตรวจแล้ว' },
  { id: 'PAY-002', invoice: 'INV-256906-201', tenant: 'มาลี มีสุข', method: 'แนบสลิป', amount: 6500, paidAt: '2569-06-04 21:10', status: 'รอตรวจ' },
  { id: 'PAY-003', invoice: 'INV-256906-205', tenant: 'อนันต์ แก้วดี', method: 'เงินสด', amount: 3800, paidAt: '2569-06-05 11:45', status: 'ออกใบเสร็จแล้ว' },
];

const statusColor = {
  ตรวจแล้ว: 'success',
  รอตรวจ: 'warning',
  ออกใบเสร็จแล้ว: 'primary',
};

export default function Payments() {
  const totalPaid = payments.reduce((sum, item) => sum + item.amount, 0);
  const pending = payments.filter((item) => item.status === 'รอตรวจ').length;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ระบบชำระเงิน
          </Typography>
          <Typography color="text.secondary">ตรวจสลิป รับชำระ และออกใบเสร็จให้ผู้พักอาศัย</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<QrCode2Icon />}>สร้าง QR PromptPay</Button>
          <Button variant="contained" startIcon={<FactCheckIcon />}>ตรวจสลิป</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">รับชำระรวม</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{totalPaid.toLocaleString()} บาท</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">รอตรวจสลิป</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{pending}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">ช่องทางหลัก</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>PromptPay</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 860 }}>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>เลขที่ชำระ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ใบแจ้งหนี้</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ผู้ชำระ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ช่องทาง</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>จำนวนเงิน</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>วันที่ชำระ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>เอกสาร</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{payment.id}</TableCell>
                <TableCell>{payment.invoice}</TableCell>
                <TableCell>{payment.tenant}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell align="right">{payment.amount.toLocaleString()} บาท</TableCell>
                <TableCell>{payment.paidAt}</TableCell>
                <TableCell>
                  <Chip label={payment.status} color={statusColor[payment.status]} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Button size="small" startIcon={<ReceiptIcon />}>ใบเสร็จ</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
