import React, { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('StreamFlix ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="page-container container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <div className="glass-card" style={{ padding: '3rem', maxWidth: '500px' }}>
            <FaExclamationTriangle style={{ fontSize: '3rem', color: '#e50914', marginBottom: '1rem' }} />
            <h2>Something went wrong</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
              An unexpected application error occurred. Click below to reload the app.
            </p>
            <button className="btn btn-primary" onClick={this.handleReload}>
              Reload StreamFlix
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
