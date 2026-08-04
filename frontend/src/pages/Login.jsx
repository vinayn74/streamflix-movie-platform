import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFilm, FaGoogle, FaGithub } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import './Login.css';

/**
 * Login Component
 * Powered by AuthContext API & custom useAuth hook
 */
const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || '/home';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess(res.data);
      }
      navigate(fromPath, { replace: true });
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop"></div>
      <div className="auth-container glass-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="brand-icon-wrapper">
              <FaFilm className="brand-icon" />
            </div>
            <span className="brand-name">STREAM<span className="brand-accent">FLIX</span></span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to access your personal watchlist and recommendations.</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <div className="label-flex">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Social Auth */}
        <div className="social-auth-buttons">
          <button className="btn btn-secondary social-btn">
            <FaGoogle className="google-icon" /> Google
          </button>
          <button className="btn btn-secondary social-btn">
            <FaGithub /> GitHub
          </button>
        </div>

        {/* Footer Toggle Link */}
        <div className="auth-footer">
          <p>New to StreamFlix? <Link to="/register" className="auth-switch-link">Sign up now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
