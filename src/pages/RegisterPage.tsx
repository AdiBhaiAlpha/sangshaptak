import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Google OAuth handles both sign-up and login in one flow
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
