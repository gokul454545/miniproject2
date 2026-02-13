import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          Privacy Checker
        </Link>
        <div className="navbar-nav ms-auto d-flex flex-row gap-2 align-items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link text-white">
                Dashboard
              </Link>
              <Link to="/assessment" className="nav-link text-white">
                New Assessment
              </Link>
              <button type="button" onClick={onLogout} className="btn btn-danger btn-sm ms-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-white">
                Login
              </Link>
              <Link to="/register" className="nav-link text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
