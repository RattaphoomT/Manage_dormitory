import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ดึงสถานะการล็อกอินจาก localStorage เมื่อโหลดแอปพลิเคชัน
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // บันทึกสถานะลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  // ในแอปจริง ส่วนนี้จะเรียก API ไปยัง Backend
  const login = (username, password) => {
    // ตรวจสอบข้อมูลล็อกอินเบื้องต้น (dummy data)
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};