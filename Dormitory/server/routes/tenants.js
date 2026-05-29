import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const statusToThai = {
  active: 'พักอาศัย',
  reserved: 'จอง',
  move_out_requested: 'แจ้งย้ายออก',
  moved_out: 'ย้ายออกแล้ว',
};

const statusToDb = {
  พักอาศัย: 'active',
  จอง: 'reserved',
  แจ้งย้ายออก: 'move_out_requested',
  ย้ายออกแล้ว: 'moved_out',
  active: 'active',
  reserved: 'reserved',
  move_out_requested: 'move_out_requested',
  moved_out: 'moved_out',
};

function mapTenant(row) {
  return {
    id: row.tenant_code,
    databaseId: row.id,
    name: row.full_name,
    room: row.room_number || '',
    phone: row.phone,
    contractEnd: row.end_date || '',
    status: statusToThai[row.status] || row.status,
    balance: Number(row.balance),
  };
}

function nextTenantCode() {
  return `T-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function findRoom(connection, roomNumber) {
  if (!roomNumber || roomNumber === '-') {
    return null;
  }

  const [[room]] = await connection.query(
    'SELECT id, monthly_price FROM rooms WHERE room_number = ? LIMIT 1',
    [roomNumber],
  );

  return room || null;
}

async function upsertActiveContract(connection, tenantId, roomNumber, contractEnd, tenantStatus = 'active') {
  const room = await findRoom(connection, roomNumber);
  if (!room) {
    return;
  }

  const endDate = contractEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
  const [[activeContract]] = await connection.query(
    'SELECT id, room_id FROM contracts WHERE tenant_id = ? AND status = ? LIMIT 1',
    [tenantId, 'active'],
  );

  if (activeContract) {
    if (activeContract.room_id !== room.id) {
      await connection.query(
        `UPDATE rooms
         SET status = 'available'
         WHERE id = ?
           AND NOT EXISTS (
             SELECT 1 FROM contracts
             WHERE contracts.room_id = rooms.id
               AND contracts.status = 'active'
               AND contracts.id <> ?
           )`,
        [activeContract.room_id, activeContract.id],
      );
    }

    await connection.query(
      `UPDATE contracts
       SET room_id = ?, end_date = ?, rent_amount = ?
       WHERE id = ?`,
      [room.id, endDate, room.monthly_price, activeContract.id],
    );
  } else {
    await connection.query(
      `INSERT INTO contracts
        (tenant_id, room_id, contract_no, start_date, end_date, rent_amount, deposit_amount, status)
       VALUES (?, ?, ?, CURDATE(), ?, ?, ?, 'active')`,
      [
        tenantId,
        room.id,
        `CT-${Date.now()}-${tenantId}`,
        endDate,
        room.monthly_price,
        room.monthly_price * 2,
      ],
    );
  }

  await connection.query(
    'UPDATE rooms SET status = ? WHERE id = ?',
    [tenantStatus === 'reserved' ? 'reserved' : 'occupied', room.id],
  );
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        tenants.id,
        tenants.tenant_code,
        tenants.full_name,
        tenants.phone,
        tenants.status,
        DATE_FORMAT(contracts.end_date, '%Y-%m-%d') AS end_date,
        rooms.room_number,
        COALESCE(SUM(CASE WHEN invoices.status IN ('unpaid', 'partially_paid', 'overdue') THEN invoices.total_amount ELSE 0 END), 0) AS balance
       FROM tenants
       LEFT JOIN contracts ON contracts.tenant_id = tenants.id AND contracts.status = 'active'
       LEFT JOIN rooms ON rooms.id = contracts.room_id
       LEFT JOIN invoices ON invoices.contract_id = contracts.id
       GROUP BY tenants.id, tenants.tenant_code, tenants.full_name, tenants.phone, tenants.status, contracts.end_date, rooms.room_number
       ORDER BY tenants.created_at DESC`,
    );

    return res.json(rows.map(mapTenant));
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO tenants (tenant_code, full_name, phone, status)
       VALUES (?, ?, ?, ?)`,
      [
        nextTenantCode(),
        req.body.name,
        req.body.phone,
        statusToDb[req.body.status] || 'active',
      ],
    );

    await upsertActiveContract(connection, result.insertId, req.body.room, req.body.contractEnd, statusToDb[req.body.status] || 'active');
    await connection.commit();

    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});

router.put('/:tenantCode', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[tenant]] = await connection.query(
      'SELECT id FROM tenants WHERE tenant_code = ? LIMIT 1',
      [req.params.tenantCode],
    );

    if (!tenant) {
      await connection.rollback();
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้พักอาศัย' });
    }

    await connection.query(
      `UPDATE tenants
       SET full_name = ?, phone = ?, status = ?
       WHERE id = ?`,
      [
        req.body.name,
        req.body.phone,
        statusToDb[req.body.status] || 'active',
        tenant.id,
      ],
    );

    await upsertActiveContract(connection, tenant.id, req.body.room, req.body.contractEnd, statusToDb[req.body.status] || 'active');
    await connection.commit();

    return res.json({ message: 'Tenant updated' });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});

router.delete('/:tenantCode', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[tenant]] = await connection.query(
      'SELECT id FROM tenants WHERE tenant_code = ? LIMIT 1',
      [req.params.tenantCode],
    );

    if (!tenant) {
      await connection.rollback();
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้พักอาศัย' });
    }

    await connection.query(
      `UPDATE rooms
       JOIN contracts ON contracts.room_id = rooms.id
       SET rooms.status = 'available'
       WHERE contracts.tenant_id = ? AND contracts.status = 'active'`,
      [tenant.id],
    );
    await connection.query('UPDATE contracts SET status = ? WHERE tenant_id = ?', ['terminated', tenant.id]);
    await connection.query('UPDATE tenants SET status = ? WHERE id = ?', ['moved_out', tenant.id]);
    await connection.commit();

    return res.json({ message: 'Tenant deleted' });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'ไม่สามารถลบได้เพราะมีเอกสารหรือประวัติธุรกรรมผูกอยู่' });
    }
    return next(error);
  } finally {
    connection.release();
  }
});

export default router;
