import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from './MainLayout';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Rooms from './Rooms';
import Students from './Students';
import Billing from './Billing';
import Payments from './Payments';
import RepairRequests from './RepairRequests';
import Users from './Users';
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/students" element={<Students />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/repair-requests" element={<RepairRequests />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default App
