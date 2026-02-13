import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Login failed');
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card card-shadow border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="h3 fw-bold mb-4 text-center">Login</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="mt-4 mb-0 text-center text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
