import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import User from '../types/User';

import '../assets/styles/Form.css';

interface UserFormProps {
  addUser: (user: User) => void;
  closeForm: () => void;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const generatePassword = (): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = '';
  for (let i = 0; i < 20; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const UserForm: React.FC<UserFormProps> = ({ addUser, closeForm, setError }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const { token, logout } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordGeneration = () => {
    const newPassword = generatePassword();
    setFormData({
      ...formData,
      password: newPassword,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères.");
      return;
    }

    const submitData = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
    };

    const url = `${import.meta.env.VITE_API_URL}/users`;

    try {
      const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.statusCode === 401) {
          logout();
          return;
        } else {
          setError(data.message);
        }
      } else {
        const newUser = await response.json();
        addUser(newUser.user); 
        closeForm(); 
      }
    } catch (err) {
      console.error("Une erreur réseau est survenue:", err);
      setError("Une erreur réseau est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className='input-group'> 
        <label>Username:</label>
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
          placeholder='Username'
          required
        />
      </div>
      <div className='input-password'>
        <label>Password:</label>
        <div>
          <input
            type='text'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            required
          />
          <button 
            type="button" 
            onClick={handlePasswordGeneration} 
            className="gen-password-btn"
          >
            <i className="fas fa-key"></i>
          </button>
        </div>
      </div>
      <div className='submit-div'>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="role-select"
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
        </select>        
        <button type="submit" className="submit-btn">Ajouter</button>
      </div>
    </form>
  );
};

export default UserForm;
