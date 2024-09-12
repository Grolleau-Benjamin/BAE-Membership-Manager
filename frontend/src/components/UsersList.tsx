import React, { useState, useMemo, useCallback } from 'react';
import User from '../types/User';
import UserCard from './UserCard';
import UserForm from './UserForm';

interface UsersListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

interface Filter {
  username: string;
  admin: boolean;
  user: boolean;
}

const UsersList: React.FC<UsersListProps> = ({ users, setUsers, setError }) => {
  const [filter, setFilter] = useState<Filter>({
    username: '',
    admin: true, 
    user: true
  });
  const [showForm, setShowForm] = useState<boolean>(false);

  const filteredList = useMemo(() => {
    return users.filter((u) => {
      return u.username.toLowerCase().includes(filter.username.toLowerCase()) 
        && ((u.role === "admin" && filter.admin) || (u.role === "user" && filter.user));
    });
  }, [users, filter]);

  const addUser = useCallback((newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  }, [setUsers]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) => prevUsers.map((u) => u._id === updatedUser._id ? updatedUser : u));
  }, [setUsers]);

  const deleteUser = useCallback((_id: string) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u._id !== _id));
  }, [setUsers]);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <>
      <h1 className='main-title'>Recherche</h1>
      <div className='search-filter-container'>
        <input
          value={filter.username}
          onChange={(e) => setFilter({ ...filter, username: e.target.value })}
          placeholder='Recherche par username'
          className='search-input'
        />
        <div className='filter-options'>
          <label>
            <input
              type='checkbox'
              checked={filter.admin}
              onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, admin: e.target.checked }))}
            />
            Admin
          </label>
          <label>
            <input
              type='checkbox'
              checked={filter.user}
              onChange={(e) => setFilter((prevFilter) => ({ ...prevFilter, user: e.target.checked }))}
            />
            User
          </label>
        </div>
      </div>

      <h1 className='list-title'>
        Liste des utilisateurs
        <i
          className={`fa ${showForm ? 'fa-minus' : 'fa-plus'}`}
          aria-hidden="true"
          aria-label={showForm ? 'Cacher le formulaire' : 'Afficher le formulaire'}
          style={{ 
            marginLeft: '10px', 
            cursor: 'pointer',
            border: 'solid 3px black',
            borderRadius: '50%',
            padding: '5px'
          }}
          onClick={toggleForm}
        ></i>
      </h1>

      {showForm && (
        <UserForm
          addUser={addUser}
          closeForm={toggleForm}
          setError={setError}
        />
      )}

      <div className='usersList'>
        {filteredList.map((u: User) => (
          <UserCard
            key={u._id}
            user={u}
            deleteUser={deleteUser}
            updateUser={updateUser}
            setError={setError}
          />
        ))}
      </div>
    </>
  );
};

export default UsersList;
