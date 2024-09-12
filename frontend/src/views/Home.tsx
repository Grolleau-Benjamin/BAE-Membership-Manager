import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdherentsList from '../components/AdherentsList'; 
import Adherent from '../types/Adherent';
import User from '../types/User';

import '../assets/styles/Home.css';
import UsersList from '../components/UsersList';

const Home: React.FC = () => {
  const { token, username, role, logout, isAdmin } = useAuth();
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<"adherents" | "users">("adherents"); 
  const [error, setError] = useState<string | boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, [error]);


  const fetchUser = useCallback(() => {
    const url = `${import.meta.env.VITE_API_URL}/users`;
    handleFetch(url, token, setUsers, logout, setError);
  }, [token, logout]);

  const fetchAdherents = useCallback(() => {
    const url = `${import.meta.env.VITE_API_URL}/adherents`;
    handleFetch(url, token, setAdherents, logout, setError);
  }, [token, logout]);

  const checkLocalStorage = () => {
    try {
      const storedValue = localStorage.getItem('user');
      if (!storedValue) { 
        logout();
        return;
      }

      const parsedValue = JSON.parse(storedValue);
      if (parsedValue.token !== token || parsedValue.username !== username || parsedValue.role !== role) {
        logout();
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du localStorage:", err);
      setError("Local storage check failed.");
      logout(); 
    }
  };

  useEffect(() => {
    fetchAdherents();

    if (isAdmin) {
      fetchUser();
    }

    const intervalId = setInterval(checkLocalStorage, 5000);
    return () => clearInterval(intervalId);
  }, [token, username, role]);

  return (
    <>
      <div id='home-view'>
        <div className='left'> 
          <div className="top-section">
            <h1 className="username">{ username }</h1>
            <h3 className="role"> 
              { role === "admin" 
                ? <i className="fa-regular fa-chess-king"></i> 
                : <i className="fa-solid fa-chess-pawn"></i>
              } { role } 
            </h3>
            <button className="btn-logout" onClick={logout}>Se déconnecter</button>

            <div className="navigation">
              <button 
                className={`nav-btn ${currentView === 'adherents' ? 'active' : ''}`} 
                onClick={() => setCurrentView("adherents")}
              >
                <i className="fa-solid fa-users"></i> Adhérents
              </button>
              {isAdmin && (
                <button 
                  className={`nav-btn ${currentView === 'users' ? 'active' : ''}`} 
                  onClick={() => setCurrentView("users")}
                >
                  <i className="fa-solid fa-user-shield"></i> Utilisateurs
                </button>
              )}
            </div>
          </div>

          <div className="bottom-section">
            <div className='stat'>
              <h4>Statistiques</h4>
              <p><strong>Adhérents:</strong> {adherents.length}</p>
              {isAdmin && <p><strong>Utilisateurs:</strong> {users.length}</p>}
            </div>

            {error && (
              <div className='error-message'>
                <p><i className="fa-solid fa-triangle-exclamation"></i> {error}</p>
              </div>
            )}
          </div>
        </div>

        {currentView === "adherents" ? (
          <div className='right'>
            <AdherentsList 
              adherents={adherents} 
              setAdherents={setAdherents}
              setError={setError}
            />
          </div>
        ) : (
          <div className='right purple'>
            <UsersList
              users={users}
              setUsers={setUsers}
              setError={setError}
            />
          </div>
        )}
        <div id='mobile-menu'>
          <p className="mobile-username"> 
            {role === "admin" ? <i className="fa-regular fa-chess-king"></i> : <i className="fa-regular fa-chess-pawn"></i>}
          </p>
          <p className='mobile-username'>
            {username}
          </p>
          <div className='menu-mobile-buttons'>
            <button 
              className={`mobile-nav-btn ${currentView === 'adherents' ? 'active' : ''}`} 
              onClick={() => setCurrentView("adherents")}
            >
              <i className="fa-solid fa-users"></i>
            </button>
            {isAdmin && (
              <button 
                className={`mobile-nav-btn ${currentView === 'users' ? 'active' : ''}`} 
                onClick={() => setCurrentView("users")}
              >
                <i className="fa-solid fa-user-shield"></i>
              </button>
            )}
          </div>
          <button className="btn-logout" onClick={logout}>
            <i className="fa-solid fa-sign-out-alt"></i>
          </button>
        </div>

      </div>
    </>
  );
}

export default Home;

const handleFetch = async (
  url: string, 
  token: string | null, 
  setFunc: React.Dispatch<React.SetStateAction<any[]>>, 
  logout: () => void, setError: React.Dispatch<React.SetStateAction<string | boolean>>
) => {
  try {
    const response = await fetch(url, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.statusCode === 401){ 
        logout();
        return;
      } else {
        setError(data.message);
      }
    } else {
      const data = await response.json();
      setFunc(data); 
    }
  } catch (err) {
    console.error("Une erreur réseau est survenue:", err);
    setError("A network error occurred.");
  }
};

