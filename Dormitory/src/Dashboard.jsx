import React from 'react';
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

const stats = [
  { title: 'ห้องทั้งหมด', value: '50', detail: '3 อาคาร / 5 ชั้น', icon: <ApartmentIcon />, color: '#2563eb' },
  { title: 'ห้องว่าง', value: '7', detail: 'พร้อมปล่อยเช่า 5 ห้อง', icon: <MeetingRoomIcon />, color: '#16a34a' },
  { title: 'ผู้พักอาศัย', value: '82', detail: 'สัญญาใกล้หมด 4 ราย', icon: <PeopleIcon />, color: '#7c3aed' },
  { title: 'รายได้เดือนนี้', value: '154,800', detail: 'เก็บแล้ว 87%', icon: <PaidIcon />, color: '#ea580c' },
];

const revenue = [
  { month: 'ม.ค.', amount: 122000 },
  { month: 'ก.พ.', amount: 136000 },
  { month: 'มี.ค.', amount: 129000 },
  { month: 'เม.ย.', amount: 148500 },
  { month: 'พ.ค.', amount: 154800 },
  { month: 'มิ.ย.', amount: 151200 },
];

const alerts = [
  { title: 'ใบแจ้งหนี้ค้างชำระ', subtitle: '12 รายการ รวม 38,400 บาท', icon: <ReceiptLongIcon />, color: 'warning' },
  { title: 'งานซ่อมรอดำเนินการ', subtitle: '5 รายการ ต้องมอบหมายช่าง', icon: <BuildIcon />, color: 'info' },
  { title: 'สัญญาเช่าใกล้หมดอายุ', subtitle: '4 ราย ภายใน 30 วัน', icon: <WarningAmberIcon />, color: 'error' },
];

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
  const maxRevenue = Math.max(...revenue.map((item) => item.amount));

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

      <Grid container spacing={2.5}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <StatCard item={item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={8}>
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
              <Chip label="เฉลี่ย 140,250 บาท/เดือน" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="end" sx={{ height: 260 }}>
              {revenue.map((item) => (
                <Stack key={item.month} alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 54,
                      height: `${Math.max(30, (item.amount / maxRevenue) * 210)}px`,
                      bgcolor: 'primary.main',
                      borderRadius: '6px 6px 2px 2px',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.month}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  อัตราเข้าพัก
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  43 จาก 50 ห้องมีผู้เช่า
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={86} sx={{ height: 10, borderRadius: 5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">ว่าง 7 ห้อง</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  86%
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                สถานะการเก็บเงิน
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ออกใบแจ้งหนี้แล้ว</Typography>
                <Typography sx={{ fontWeight: 700 }}>50 ใบ</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ชำระแล้ว</Typography>
                <Typography sx={{ fontWeight: 700 }}>43 ใบ</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">รอตรวจสลิป</Typography>
                <Typography sx={{ fontWeight: 700 }}>5 ใบ</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
