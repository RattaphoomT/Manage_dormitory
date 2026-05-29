import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const login = email || username;
    const normalizedLogin = login === 'admin' ? 'admin@dorm.local' : login;

    if (!normalizedLogin || !password) {
      return res.status(422).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const [rows] = await pool.query(
      `SELECT users.id, users.name, users.email, users.password, users.status, roles.name AS role
       FROM users
       JOIN roles ON roles.id = users.role_id
       WHERE users.email = ?
       LIMIT 1`,
      [normalizedLogin],
    );

    const user = rows[0];
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });

    return res.json({ token, user: payload });
  } catch (error) {
    return next(error);
  }
});

export default router;
