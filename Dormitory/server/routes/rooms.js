import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const statusToThai = {
  available: 'ว่าง',
  occupied: 'มีผู้เช่า',
  reserved: 'จอง',
  maintenance: 'ซ่อม',
};

const statusToDb = {
  ว่าง: 'available',
  มีผู้เช่า: 'occupied',
  จอง: 'reserved',
  ซ่อม: 'maintenance',
  available: 'available',
  occupied: 'occupied',
  reserved: 'reserved',
  maintenance: 'maintenance',
};

function mapRoom(row) {
  return {
    id: row.id,
    name: row.room_number,
    building: row.building_name,
    floor: row.floor_number,
    type: row.room_type_name,
    status: statusToThai[row.status] || row.status,
    price: Number(row.monthly_price),
    tenant: row.tenant_name || '-',
  };
}

async function resolveRoomReferences(connection, room) {
  const buildingName = room.building || 'อาคาร A';
  const floorNumber = Number(room.floor || 1);
  const typeName = room.type || 'Standard';

  let [[building]] = await connection.query('SELECT id FROM buildings WHERE name = ? LIMIT 1', [buildingName]);
  if (!building) {
    const [result] = await connection.query('INSERT INTO buildings (name) VALUES (?)', [buildingName]);
    building = { id: result.insertId };
  }

  let [[floor]] = await connection.query(
    'SELECT id FROM floors WHERE building_id = ? AND floor_number = ? LIMIT 1',
    [building.id, floorNumber],
  );
  if (!floor) {
    const [result] = await connection.query(
      'INSERT INTO floors (building_id, floor_number, name) VALUES (?, ?, ?)',
      [building.id, floorNumber, `ชั้น ${floorNumber}`],
    );
    floor = { id: result.insertId };
  }

  let [[roomType]] = await connection.query('SELECT id FROM room_types WHERE name = ? LIMIT 1', [typeName]);
  if (!roomType) {
    const [result] = await connection.query(
      'INSERT INTO room_types (name, base_price, deposit_amount) VALUES (?, ?, ?)',
      [typeName, Number(room.price || 0), Number(room.price || 0) * 2],
    );
    roomType = { id: result.insertId };
  }

  return { buildingId: building.id, floorId: floor.id, roomTypeId: roomType.id };
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        rooms.id,
        rooms.room_number,
        rooms.monthly_price,
        rooms.status,
        buildings.name AS building_name,
        floors.floor_number,
        room_types.name AS room_type_name,
        tenants.full_name AS tenant_name
       FROM rooms
       JOIN buildings ON buildings.id = rooms.building_id
       JOIN floors ON floors.id = rooms.floor_id
       JOIN room_types ON room_types.id = rooms.room_type_id
       LEFT JOIN contracts ON contracts.room_id = rooms.id AND contracts.status = 'active'
       LEFT JOIN tenants ON tenants.id = contracts.tenant_id
       ORDER BY buildings.name, rooms.room_number`,
    );

    return res.json(rows.map(mapRoom));
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(422).json({ message: 'กรุณากรอกหมายเลขห้องและราคา' });
    }

    await connection.beginTransaction();
    const refs = await resolveRoomReferences(connection, req.body);

    const [result] = await connection.query(
      `INSERT INTO rooms (building_id, floor_id, room_type_id, room_number, monthly_price, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        refs.buildingId,
        refs.floorId,
        refs.roomTypeId,
        req.body.name,
        Number(req.body.price || 0),
        statusToDb[req.body.status] || 'available',
      ],
    );

    await connection.commit();
    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'หมายเลขห้องนี้มีอยู่แล้วในอาคารเดียวกัน' });
    }
    return next(error);
  } finally {
    connection.release();
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(422).json({ message: 'กรุณากรอกหมายเลขห้องและราคา' });
    }

    await connection.beginTransaction();
    const refs = await resolveRoomReferences(connection, req.body);

    const [result] = await connection.query(
      `UPDATE rooms
       SET building_id = ?, floor_id = ?, room_type_id = ?, room_number = ?, monthly_price = ?, status = ?
       WHERE id = ?`,
      [
        refs.buildingId,
        refs.floorId,
        refs.roomTypeId,
        req.body.name,
        Number(req.body.price || 0),
        statusToDb[req.body.status] || 'available',
        req.params.id,
      ],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'ไม่พบห้องพักที่ต้องการแก้ไข' });
    }

    await connection.commit();
    return res.json({ message: 'Room updated' });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'หมายเลขห้องนี้มีอยู่แล้วในอาคารเดียวกัน' });
    }
    return next(error);
  } finally {
    connection.release();
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const [[contract]] = await pool.query(
      'SELECT id FROM contracts WHERE room_id = ? AND status = ? LIMIT 1',
      [req.params.id, 'active'],
    );

    if (contract) {
      return res.status(409).json({ message: 'ไม่สามารถลบห้องที่มีสัญญาเช่า active อยู่' });
    }

    const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบห้องพักที่ต้องการลบ' });
    }

    return res.json({ message: 'Room deleted' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'ไม่สามารถลบได้เพราะมีประวัติเอกสารผูกอยู่' });
    }
    return next(error);
  }
});

export default router;
