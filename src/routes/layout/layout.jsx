import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navBar/navBar";
import './layout.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout({ children }) {
  return (
    <div className='layout'>
      <Navbar /> 
      <div className="content">
        {children || <Outlet />} 
      </div>
    </div>
  );
}

function RequiredAuth() {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export { Layout, RequiredAuth };
