import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    try {
      await auth.login(username, password);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container component="main" maxWidth="lg">
        <Paper
          sx={{
            overflow: 'hidden',
            borderRadius: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            minHeight: 620,
          }}
        >
          <Box sx={{ bgcolor: '#101828', color: '#ffffff', p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 8 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                  <ApartmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Dormitory</Typography>
                  <Typography variant="caption" sx={{ color: '#98a2b3' }}>Management Suite</Typography>
                </Box>
              </Stack>

              <Typography variant="h3" sx={{ fontWeight: 900, maxWidth: 480, lineHeight: 1.15, mb: 2 }}>
                บริหารหอพักได้ครบในที่เดียว
              </Typography>
              <Typography sx={{ color: '#d0d5dd', maxWidth: 460 }}>
                ตรวจห้องว่าง ออกบิล รับชำระเงิน และติดตามงานซ่อมผ่านระบบหลังบ้านที่ออกแบบสำหรับทีมปฏิบัติงานจริง
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 6 }}>
              {[
                ['50', 'ห้องทั้งหมด'],
                ['87%', 'เก็บเงินแล้ว'],
                ['5', 'งานซ่อมค้าง'],
              ].map(([value, label]) => (
                <Grid size={{ xs: 4 }} key={label}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>{value}</Typography>
                  <Typography variant="caption" sx={{ color: '#98a2b3' }}>{label}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ p: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', mb: 2 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                เข้าสู่ระบบ
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                ใช้บัญชีผู้ดูแลเพื่อเข้าใช้งานระบบ
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="ชื่อผู้ใช้"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    helperText="ทดสอบด้วย admin หรือ admin@dorm.local"
                  />
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    helperText="ทดสอบด้วย password"
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
                  <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="จดจำฉัน" />
                  <Link href="#" variant="body2" underline="hover">ลืมรหัสผ่าน?</Link>
                </Stack>
                <Button type="submit" fullWidth variant="contained" size="large">
                  เข้าสู่ระบบ
                </Button>
                <Divider sx={{ my: 3 }} />
                <Typography variant="caption" color="text.secondary">
                  ระบบสาธิตสำหรับออกแบบ UI ก่อนเชื่อมต่อ Laravel API
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
