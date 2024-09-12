import React, { useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/Login.css';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ general?: string, fields?: { username?: boolean, password?: boolean } }>({});

  const handleErrors = (errorData: any) => {
    if (typeof errorData.message === 'string') {
      setErrors({ general: errorData.message });
    } else if (Array.isArray(errorData.message)) {
      const fieldErrors: { username?: boolean, password?: boolean } = {};

      if (errorData.message.includes('username should not be empty')) {
        fieldErrors.username = true;
      }
      if (errorData.message.includes('password should not be empty')) {
        fieldErrors.password = true;
      }

      setErrors({ fields: fieldErrors });
    }
  };

  const handleLogin = useCallback(async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/login`;
    setErrors({});

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleErrors(errorData);
      } else {
        const data = await response.json();
        login(data.access_token, data.role, data.username);
      }
    } catch (error) {
      console.log("Une erreur réseau est survenue");
      setErrors({ general: "Une erreur réseau est survenue. Veuillez réessayer." });
    }
  }, [username, password, login]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'username' | 'password') => {
    if (e.key === 'Enter') {
      if (field === 'username') {
        passwordInputRef.current?.focus();
      } else if (field === 'password') {
        handleLogin();
      }
    }
  };

  const getInputClass = (field: 'username' | 'password') => {
    return `login-input ${errors.fields?.[field] ? 'error' : ''}`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <img alt="Logo 2024" src="/logo2024.jpg" className="login-image" />
        </div>
        <div className="login-right">
          <h2><i className="fa-regular fa-user"></i> Connexion</h2>

          {errors.general && <ErrorMessage message={errors.general} />}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'username')}
            className={getInputClass('username')}
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordInputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'password')}
            className={getInputClass('password')}
          />

          <button onClick={handleLogin} className="login-button">Se connecter</button>
        </div>
      </div>
    </div>
  );
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p className="error-message">
    <i className="fa-solid fa-bomb"></i> {message}
  </p>
);


export default LoginPage;
