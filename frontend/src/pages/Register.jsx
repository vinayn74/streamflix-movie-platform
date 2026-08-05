import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFilm } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Register.css';

/**
 * Register Component
 * Powered by AuthContext API & custom useAuth hook
 */
const Register = ({ onRegisterSuccess }) => {
  useDocumentTitle('Create Account');
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';


  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail,
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await register(formData.name, formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      if (onRegisterSuccess) {
        onRegisterSuccess(res.data);
      }
      navigate('/home');
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
          <h2>Create Account</h2>
          <p>Join thousands of movie fans streaming in 4K UHD.</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          {/* <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>I agree to the <a href="#terms" className="forgot-link">Terms of Service</a> & <a href="#privacy" className="forgot-link">Privacy Policy</a></span>
            </label>
          </div> */}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-switch-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
