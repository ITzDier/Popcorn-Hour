import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Recupera user y role desde localStorage, si existen
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('role');
    return storedRole ? storedRole : null;
  });
  const [loading, setLoading] = useState(true);

  // Configura axios para enviar el token en cada petición
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      // CORREGIDO: Usar ruta relativa
      const response = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.user.role);
      setUser(response.data.user);
      setRole(response.data.user.role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      throw error;
    }
  };

  // El registro ahora envía el campo "role" y no "tipoUsuario"
  const register = async (nombreUsuario, email, password, role = "estandar") => {
    try {
      // CORREGIDO: Usar ruta relativa
      await axios.post('/api/auth/register', { nombreUsuario, email, password, role });
      // Haz login automático después de registrar
      await login({ email, password });
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error de registro.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Verifica sesión al montar el context
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // CORREGIDO: Usar ruta relativa
      axios.get('/api/auth/me')
        .then(res => {
          setUser(res.data);
          setRole(res.data.role);
          localStorage.setItem('user', JSON.stringify(res.data));
          localStorage.setItem('role', res.data.role);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          setUser(null);
          setRole(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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