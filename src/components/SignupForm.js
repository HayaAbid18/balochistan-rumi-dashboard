import React, { useState } from 'react';
import './SignupForm.css';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = {};

  if (!fields.name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function SignupForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="signup-card success-card">
        <div className="success-icon">✓</div>
        <h2>Account Created!</h2>
        <p>Welcome, <strong>{form.name}</strong>. Your account has been created successfully.</p>
        <button
          className="btn-primary"
          onClick={() => { setForm(initialForm); setErrors({}); setSubmitted(false); }}
        >
          Sign up another account
        </button>
      </div>
    );
  }

  return (
    <div className="signup-card">
      <h1 className="signup-title">Create an account</h1>
      <p className="signup-subtitle">Fill in the details below to get started.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn-primary btn-full">
          Create Account
        </button>
      </form>

      <p className="login-link">
        Already have an account? <a href="#login">Log in</a>
      </p>
    </div>
  );
}
