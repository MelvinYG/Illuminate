import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navBar/navBar";
import './layout.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PropTypes from "prop-types";

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
  const { currentUser, authLoading } = useContext(AuthContext);

  if (authLoading) return <div>Checking session…</div>;
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export { Layout, RequiredAuth };
