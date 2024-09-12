import React, { useState } from 'react';
import User from '../types/User';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../functions/fetch'; 
import '../assets/styles/UserCard.css';

interface UserCardProps {
  user: User;
  deleteUser: (_id: string) => void;
  updateUser: (updatedUser: User) => void;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const UserCard: React.FC<UserCardProps> = ({ user, deleteUser, updateUser, setError }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: user.username,
    password: '',
    role: user.role,
  });
  const { token, logout } = useAuth();
  
  const isModified = formData.username !== user.username || formData.role !== user.role || formData.password.length > 0;

  const handleUpdateUser = async () => {
    const sendData: Partial<User> = {};
    if (formData.username !== user.username) sendData.username = formData.username;
    if (formData.role !== user.role) sendData.role = formData.role;
    if (formData.password.length > 0) sendData.password = formData.password;

    const url = `${import.meta.env.VITE_API_URL}/users/${user._id}`;
    const result = await fetchWithAuth(url, "PATCH", token, sendData);
    if (result?.logout) {
      logout();
    } else if (result?.error) {
      setError(result.error);
    } else {
      updateUser(result);
      setFormData({ ...formData, password: '' })
      setOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    const url = `${import.meta.env.VITE_API_URL}/users/${user._id}`;
    const result = await fetchWithAuth(url, "DELETE", token);
    if (result?.logout) {
      logout();
    } else if (result?.error) {
      setError(result.error);
    } else {
      deleteUser(result._id);
      setOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGeneratePassword = () => {
    setFormData((prevData) => ({
      ...prevData,
      password: Math.random().toString(36).slice(-12),
    }));
  };

  return (
    <div className={`userCard ${open ? 'open' : ''}`}>
      <div className='user-header'>
        <div className='user-info'>
          <h1>{user.username}</h1>
          <p className='user-id'>ID: {user._id}</p>
          <p className='user-role'>Rôle: { user.role }</p>
        </div>
        <button className='collapse-btn' onClick={() => setOpen(!open)}>
          {open ? 'Annuler' : 'Modifier/Supprimer'}
        </button>
      </div>

      {open && (
        <div className='user-form'>
          <div className='input-group-row'>
            <div className='input-group'>
              <label>Username</label>
              <input
                type='text'
                className='username-select'
                name='username'
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className='input-group'>
              <label>Role</label>
              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className='role-select'
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
          </div>

          <div className='input-group'>
            <label>Password</label>
            <div className='password-group'>
              <input
                type='text'
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type='button'
                onClick={handleGeneratePassword}
                className='generate-btn'
              >
                Générer
              </button>
            </div>
          </div>

          <div className='button-group'>
            <button
              className={`submit-btn ${isModified ? 'btn-modify' : 'btn-delete'}`}
              onClick={isModified ? handleUpdateUser : handleDeleteUser}
            >
              {isModified ? 'Modifier' : 'Supprimer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
