import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BuildIcon from '@mui/icons-material/Build';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { apiRequest } from './services/api';

function StatCard({ item }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: item.color, width: 48, height: 48 }}>{item.icon}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
              {item.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.detail}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await apiRequest('/dashboard');
        setSummary(data);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    }

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const rooms = summary?.rooms || {};
    const tenants = summary?.tenants || {};
    const invoices = summary?.invoices || {};
    const contracts = summary?.contracts || {};

    return [
      { title: 'ห้องทั้งหมด', value: rooms.totalRooms || 0, detail: `มีผู้เช่า ${rooms.occupiedRooms || 0} ห้อง`, icon: <ApartmentIcon />, color: '#2563eb' },
      { title: 'ห้องว่าง', value: rooms.availableRooms || 0, detail: `ซ่อมบำรุง ${rooms.maintenanceRooms || 0} ห้อง`, icon: <MeetingRoomIcon />, color: '#16a34a' },
      { title: 'ผู้พักอาศัย', value: tenants.totalTenants || 0, detail: `สัญญาใกล้หมด ${contracts.expiringContracts || 0} ราย`, icon: <PeopleIcon />, color: '#7c3aed' },
      { title: 'ยอดบิลเดือนนี้', value: Number(invoices.invoiceTotal || 0).toLocaleString(), detail: `ค้างชำระ ${Number(invoices.outstandingTotal || 0).toLocaleString()} บาท`, icon: <PaidIcon />, color: '#ea580c' },
    ];
  }, [summary]);

  const revenue = summary?.revenue?.length ? summary.revenue : [{ month: 'ยังไม่มีข้อมูล', amount: 0 }];
  const maxRevenue = Math.max(1, ...revenue.map((item) => Number(item.amount)));
  const occupiedRooms = summary?.rooms?.occupiedRooms || 0;
  const totalRooms = summary?.rooms?.totalRooms || 0;
  const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const alerts = [
    { title: 'ใบแจ้งหนี้ค้างชำระ', subtitle: `${Number(summary?.invoices?.outstandingTotal || 0).toLocaleString()} บาท`, icon: <ReceiptLongIcon />, color: 'warning' },
    { title: 'งานซ่อมรอดำเนินการ', subtitle: `${summary?.repairs?.openRepairRequests || 0} รายการ`, icon: <BuildIcon />, color: 'info' },
    { title: 'สัญญาเช่าใกล้หมดอายุ', subtitle: `${summary?.contracts?.expiringContracts || 0} ราย ภายใน 30 วัน`, icon: <WarningAmberIcon />, color: 'error' },
  ];

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            แดชบอร์ดผู้ดูแลหอพัก
          </Typography>
          <Typography color="text.secondary">ภาพรวมการเข้าพัก การเงิน และงานบริการวันนี้</Typography>
        </Box>
        <Chip label="รอบบิลปัจจุบัน: มิถุนายน 2569" color="primary" sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }} />
      </Stack>

      {error && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderColor: 'error.light', bgcolor: 'error.light' }}>
          <Typography color="error.main">{error}</Typography>
        </Paper>
      )}

      <Grid container spacing={2.5}>
        {stats.map((item) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.title}>
            <StatCard item={item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  รายรับย้อนหลัง 6 เดือน
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ค่าเช่า ค่าน้ำ ค่าไฟ และค่าบริการอื่น
                </Typography>
              </Box>
              <Chip label="ข้อมูลจากการชำระเงินที่ตรวจแล้ว" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="end" sx={{ height: 260 }}>
              {revenue.map((item) => (
                <Stack key={item.month} alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 54,
                      height: `${Math.max(30, (Number(item.amount) / maxRevenue) * 210)}px`,
                      bgcolor: 'primary.main',
                      borderRadius: '6px 6px 2px 2px',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.month?.slice(5) || item.month}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              งานที่ต้องติดตาม
            </Typography>
            <List disablePadding>
              {alerts.map((item) => (
                <ListItem key={item.title} disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${item.color}.light` }}>{item.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.title} secondary={item.subtitle} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  อัตราเข้าพัก
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {occupiedRooms} จาก {totalRooms} ห้องมีผู้เช่า
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={occupancyRate} sx={{ height: 10, borderRadius: 5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">ว่าง {summary?.rooms?.availableRooms || 0} ห้อง</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {occupancyRate}%
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                สถานะการเก็บเงิน
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ออกใบแจ้งหนี้แล้ว</Typography>
                <Typography sx={{ fontWeight: 700 }}>{Number(summary?.invoices?.invoiceTotal || 0).toLocaleString()} บาท</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ค้างชำระ</Typography>
                <Typography sx={{ fontWeight: 700 }}>{Number(summary?.invoices?.outstandingTotal || 0).toLocaleString()} บาท</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">งานซ่อมเปิดอยู่</Typography>
                <Typography sx={{ fontWeight: 700 }}>{summary?.repairs?.openRepairRequests || 0} งาน</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
