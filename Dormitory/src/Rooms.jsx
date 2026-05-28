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

const roomStatuses = ['ว่าง', 'มีผู้เช่า', 'จอง', 'ซ่อม'];
const roomTypes = ['Standard', 'Deluxe', 'Suite'];

const initialRows = [
  { id: 1, name: '101', building: 'อาคาร A', floor: 1, type: 'Standard', status: 'มีผู้เช่า', price: 3500, tenant: 'สมศักดิ์ ใจดี' },
  { id: 2, name: '102', building: 'อาคาร A', floor: 1, type: 'Standard', status: 'ว่าง', price: 3500, tenant: '-' },
  { id: 3, name: '201', building: 'อาคาร A', floor: 2, type: 'Deluxe', status: 'มีผู้เช่า', price: 5000, tenant: 'มาลี มีสุข' },
  { id: 4, name: '202', building: 'อาคาร A', floor: 2, type: 'Deluxe', status: 'ซ่อม', price: 5000, tenant: '-' },
  { id: 5, name: '301', building: 'อาคาร B', floor: 3, type: 'Suite', status: 'จอง', price: 7200, tenant: 'รอยืนยันสัญญา' },
];

const emptyRoom = { id: null, name: '', building: 'อาคาร A', floor: 1, type: 'Standard', status: 'ว่าง', price: '', tenant: '-' };

const statusColor = {
  ว่าง: 'success',
  มีผู้เช่า: 'primary',
  จอง: 'info',
  ซ่อม: 'warning',
};

export default function Rooms() {
  const [rooms, setRooms] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(emptyRoom);

  const isEditing = currentRoom.id !== null;

  const handleClickOpen = () => {
    setCurrentRoom(emptyRoom);
    setOpen(true);
  };

  const handleEditOpen = (room) => {
    setCurrentRoom(room);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const normalizedRoom = {
      ...currentRoom,
      floor: Number(currentRoom.floor),
      price: Number(currentRoom.price),
      tenant: currentRoom.tenant || '-',
    };

    if (isEditing) {
      setRooms(rooms.map((room) => (room.id === currentRoom.id ? normalizedRoom : room)));
    } else {
      const newId = rooms.length ? Math.max(...rooms.map((room) => room.id)) + 1 : 1;
      setRooms([...rooms, { ...normalizedRoom, id: newId }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?')) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };

  const occupied = rooms.filter((room) => room.status === 'มีผู้เช่า').length;
  const available = rooms.filter((room) => room.status === 'ว่าง').length;
  const maintenance = rooms.filter((room) => room.status === 'ซ่อม').length;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            จัดการห้องพัก
          </Typography>
          <Typography color="text.secondary">ติดตามสถานะห้อง ราคา ประเภท และผู้เช่าปัจจุบัน</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen} sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}>
          เพิ่มห้องพัก
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">มีผู้เช่า</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{occupied}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">ห้องว่าง</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{available}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">ซ่อมบำรุง</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{maintenance}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer>
        <Table sx={{ minWidth: 860 }} aria-label="rooms table">
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ห้อง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>อาคาร/ชั้น</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ประเภท</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ผู้เช่า</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ราคา/เดือน</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>เครื่องมือ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                <TableCell>{row.building} / ชั้น {row.floor}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.tenant}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={statusColor[row.status]} size="small" />
                </TableCell>
                <TableCell align="right">{row.price.toLocaleString()} บาท</TableCell>
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
        <DialogTitle sx={{ fontWeight: 800 }}>{isEditing ? 'แก้ไขข้อมูลห้องพัก' : 'เพิ่มห้องพักใหม่'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="หมายเลขห้อง" name="name" value={currentRoom.name} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="อาคาร" name="building" value={currentRoom.building} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="ชั้น" name="floor" type="number" value={currentRoom.floor} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="ประเภทห้อง" name="type" value={currentRoom.type} onChange={handleFormChange} fullWidth>
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="สถานะ" name="status" value={currentRoom.status} onChange={handleFormChange} fullWidth>
                {roomStatuses.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="ราคา/เดือน" name="price" type="number" value={currentRoom.price} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="ผู้เช่าปัจจุบัน" name="tenant" value={currentRoom.tenant} onChange={handleFormChange} fullWidth />
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
