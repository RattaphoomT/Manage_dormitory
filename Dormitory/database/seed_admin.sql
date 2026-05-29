USE dormitory_management;

INSERT INTO users (role_id, name, email, password, phone, status)
SELECT
  roles.id,
  'System Administrator',
  'admin@dorm.local',
  '$2y$12$Vn3nZGmDwkevIDQxOCpr8uixuEBX2wofCuNc89PUW0JAq45Ge0KqS',
  '080-000-0000',
  'active'
FROM roles
WHERE roles.name = 'owner'
ON DUPLICATE KEY UPDATE
  role_id = VALUES(role_id),
  name = VALUES(name),
  password = VALUES(password),
  phone = VALUES(phone),
  status = VALUES(status),
  updated_at = CURRENT_TIMESTAMP;
