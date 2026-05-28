import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const initialRows = [
  { id: 'T-1001', name: 'สมศักดิ์ ใจดี', room: '101', phone: '081-234-5678', contractEnd: '2569-12-31', status: 'พักอาศัย', balance: 0 },
  { id: 'T-1002', name: 'มาลี มีสุข', room: '201', phone: '082-345-6789', contractEnd: '2569-08-31', status: 'พักอาศัย', balance: 1200 },
  { id: 'T-1003', name: 'จอห์น โด', room: '301', phone: '083-456-7890', contractEnd: '2569-06-30', status: 'จอง', balance: 0 },
];

const emptyStudent = {
  id: null,
  name: '',
  room: '',
  phone: '',
  contractEnd: '',
  status: 'พักอาศัย',
  balance: 0,
};

const statusColor = {
  พักอาศัย: 'success',
  จอง: 'info',
  แจ้งย้ายออก: 'warning',
  ย้ายออกแล้ว: 'default',
};

export default function Students() {
  const [students, setStudents] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(emptyStudent);

  const isEditing = currentStudent.id !== null;

  const handleClickOpen = () => {
    setCurrentStudent(emptyStudent);
    setOpen(true);
  };

  const handleEditOpen = (student) => {
    setCurrentStudent(student);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const normalizedStudent = {
      ...currentStudent,
      balance: Number(currentStudent.balance || 0),
    };

    if (isEditing) {
      setStudents(students.map((student) => (student.id === currentStudent.id ? normalizedStudent : student)));
    } else {
      const newId = `T-${Math.floor(1000 + Math.random() * 9000)}`;
      setStudents([...students, { ...normalizedStudent, id: newId }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้พักอาศัยนี้?')) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const activeTenants = students.filter((student) => student.status === 'พักอาศัย').length;
  const pendingMoveOut = students.filter((student) => student.status === 'แจ้งย้ายออก').length;
  const totalBalance = students.reduce((sum, student) => sum + student.balance, 0);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            จัดการผู้พักอาศัย
          </Typography>
          <Typography color="text.secondary">ข้อมูลผู้เช่า สัญญา ห้องพัก และยอดค้างชำระ</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen} sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}>
          เพิ่มผู้พักอาศัย
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">ผู้พักอาศัยปัจจุบัน</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{activeTenants}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">แจ้งย้ายออก</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{pendingMoveOut}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">ยอดค้างรวม</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{totalBalance.toLocaleString()} บาท</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer>
        <Table sx={{ minWidth: 900 }} aria-label="tenants table">
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>รหัสผู้เช่า</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ชื่อ-สกุล</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ห้องพัก</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>เบอร์โทรศัพท์</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>หมดสัญญา</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ค้างชำระ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>เครื่องมือ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.contractEnd || '-'}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={statusColor[row.status]} size="small" />
                </TableCell>
                <TableCell align="right" sx={{ color: row.balance > 0 ? 'error.main' : 'text.primary', fontWeight: row.balance > 0 ? 700 : 400 }}>
                  {row.balance.toLocaleString()} บาท
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="แก้ไข">
                    <IconButton size="small" onClick={() => handleEditOpen(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ลบ">
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>{isEditing ? 'แก้ไขข้อมูลผู้พักอาศัย' : 'เพิ่มผู้พักอาศัยใหม่'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="ชื่อ-สกุล" name="name" value={currentStudent.name} onChange={handleFormChange} fullWidth autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="ห้องพัก" name="room" value={currentStudent.room} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="เบอร์โทรศัพท์" name="phone" value={currentStudent.phone} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="วันหมดสัญญา" name="contractEnd" value={currentStudent.contractEnd} onChange={handleFormChange} fullWidth placeholder="2569-12-31" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="สถานะ" name="status" value={currentStudent.status} onChange={handleFormChange} fullWidth>
                {Object.keys(statusColor).map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="ยอดค้างชำระ" name="balance" type="number" value={currentStudent.balance} onChange={handleFormChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleSave} variant="contained">บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
