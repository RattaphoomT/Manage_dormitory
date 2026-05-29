# Dormitory Database

ฐานข้อมูลนี้ออกแบบสำหรับ MySQL/MariaDB และรองรับการต่อ Laravel API ภายหลัง

## สร้างฐานข้อมูล

รันจาก root ของโปรเจกต์:

```bash
mysql -u root -p < database/schema.sql
```

ถ้าใช้ user อื่น:

```bash
mysql -u your_user -p < database/schema.sql
```

## เข้าไปตรวจฐานข้อมูล

```bash
mysql -u root -p dormitory_management
```

ดูตารางทั้งหมด:

```sql
SHOW TABLES;
```

ดูข้อมูลห้องตัวอย่าง:

```sql
SELECT room_number, monthly_price, status FROM rooms;
```

## สร้างผู้ใช้ Admin เริ่มต้น

หลังจากสร้าง schema แล้ว ให้รัน:

```bash
mysql -u root -p < database/seed_admin.sql
```

บัญชีเริ่มต้น:

```text
email: admin@dorm.local
password: password
```

รหัสผ่านในฐานข้อมูลเก็บเป็น bcrypt hash เพื่อให้ใช้กับ Laravel ได้

## สร้าง MySQL User สำหรับแอป

รันใน SQL Workbench:

```sql
CREATE USER IF NOT EXISTS 'dormitory_app'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON dormitory_management.* TO 'dormitory_app'@'localhost';
FLUSH PRIVILEGES;
```

ค่าต่อฐานข้อมูลสำหรับ backend:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dormitory_management
DB_USERNAME=dormitory_app
DB_PASSWORD=change_this_password
```

## ลบแล้วสร้างใหม่

ใช้เมื่อต้องการ reset ฐานข้อมูล:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS dormitory_management;"
mysql -u root -p < database/schema.sql
```

## ตารางหลัก

- `roles`, `users`
- `buildings`, `floors`, `room_types`, `rooms`
- `tenants`, `contracts`
- `meter_records`, `invoices`, `payments`, `receipts`
- `repair_requests`, `repair_images`
- `notifications`
