// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // <-- aquí se guarda el usuario
      setRole(response.data.user.role);
    } catch (error) {
      // manejo de error
    }
  };
  
  const register = async (nombreUsuario, email, password, tipoUsuario) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { nombreUsuario, email, password, tipoUsuario });
      // Haz login automático después de registrar
      await login({ email, password });
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error de registro.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token }
          });
          setUser(res.data);
          setRole(res.data.role); // Asumiendo que el backend retorna el rol
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setRole(null);
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const value = {
    user,
    role,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}