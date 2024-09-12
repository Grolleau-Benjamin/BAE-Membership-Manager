import './assets/styles/App.css'
import { useAuth } from './context/AuthContext'
import LoginPage from './views/Login'
import Home from './views/Home';

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {
        isAuthenticated ? 
          <Home />
        :
          <LoginPage />
      }
    </>
  )
}

export default App
