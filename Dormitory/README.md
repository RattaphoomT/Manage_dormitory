# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Dormitory Management

## Run Backend + Frontend

ตั้งค่าไฟล์ `.env` ให้ตรงกับ MySQL ของคุณ:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dormitory_management
DB_USERNAME=dormitory_app
DB_PASSWORD=change_this_password

JWT_SECRET=dev_change_this_to_a_long_random_secret
```

รัน backend API:

```bash
npm run dev:api
```

รัน frontend:

```bash
npm run dev
```

หรือรันพร้อมกัน:

```bash
npm run dev:full
```

ตรวจ backend และฐานข้อมูล:

```bash
curl http://localhost:4000/api/health
```

บัญชี admin เริ่มต้น:

```text
username: admin
email: admin@dorm.local
password: password
```

## API Endpoints

```text
POST /api/auth/login
GET  /api/health
GET  /api/dashboard
GET  /api/rooms
POST /api/rooms
PUT  /api/rooms/:id
DELETE /api/rooms/:id
GET  /api/tenants
```
