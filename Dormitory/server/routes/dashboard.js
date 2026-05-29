import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [[roomStats]] = await pool.query(
      `SELECT
        COUNT(*) AS totalRooms,
        SUM(status = 'available') AS availableRooms,
        SUM(status = 'occupied') AS occupiedRooms,
        SUM(status = 'maintenance') AS maintenanceRooms
       FROM rooms`,
    );

    const [[tenantStats]] = await pool.query(
      `SELECT COUNT(*) AS totalTenants
       FROM tenants
       WHERE status IN ('active', 'reserved', 'move_out_requested')`,
    );

    const [[invoiceStats]] = await pool.query(
      `SELECT
        COALESCE(SUM(total_amount), 0) AS invoiceTotal,
        COALESCE(SUM(CASE WHEN status IN ('unpaid', 'partially_paid', 'overdue') THEN total_amount ELSE 0 END), 0) AS outstandingTotal
       FROM invoices
       WHERE billing_month = DATE_FORMAT(CURDATE(), '%Y-%m')`,
    );

    const [[repairStats]] = await pool.query(
      `SELECT COUNT(*) AS openRepairRequests
       FROM repair_requests
       WHERE status IN ('new', 'assigned', 'in_progress')`,
    );

    const [paymentRows] = await pool.query(
      `SELECT
        DATE_FORMAT(paid_at, '%Y-%m') AS month,
        COALESCE(SUM(amount), 0) AS amount
       FROM payments
       WHERE paid_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
         AND status = 'verified'
       GROUP BY DATE_FORMAT(paid_at, '%Y-%m')
       ORDER BY month`,
    );

    const [[contractStats]] = await pool.query(
      `SELECT COUNT(*) AS expiringContracts
       FROM contracts
       WHERE status = 'active'
         AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`,
    );

    return res.json({
      rooms: roomStats,
      tenants: tenantStats,
      invoices: invoiceStats,
      repairs: repairStats,
      contracts: contractStats,
      revenue: paymentRows,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
