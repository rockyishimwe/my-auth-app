import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

// Mock the API service
jest.mock('../services/api', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn()
  }
}));

describe('AuthForm Component', () => {
  const renderWithProvider = (component) => {
    return render(
      <AuthProvider>
        {component}
      </AuthProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Form', () => {
    it('should render login form fields', () => {
      renderWithProvider(<AuthForm mode="login" />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      renderWithProvider(<AuthForm mode="login" />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      renderWithProvider(<AuthForm mode="login" />);
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please provide a valid email/i)).toBeInTheDocument();
      });
    });

    it('should call login API with correct data', async () => {
      const { authService } = require('../services/api');
      authService.login.mockResolvedValue({
        data: {
          user: { _id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'test-token'
        }
      });

      renderWithProvider(<AuthForm mode="login" />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('should show error message on login failure', async () => {
      const { authService } = require('../services/api');
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      renderWithProvider(<AuthForm mode="login" />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Form', () => {
    it('should render register form fields', () => {
      renderWithProvider(<AuthForm mode="register" />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      renderWithProvider(<AuthForm mode="register" />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      renderWithProvider(<AuthForm mode="register" />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should call register API with correct data', async () => {
      const { authService } = require('../services/api');
      authService.register.mockResolvedValue({
        data: {
          user: { _id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'test-token'
        }
      });

      renderWithProvider(<AuthForm mode="register" />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Form Switching', () => {
    it('should switch between login and register modes', () => {
      renderWithProvider(<AuthForm mode="login" />);
      
      const switchButton = screen.getByText(/don't have an account\? sign up/i);
      fireEvent.click(switchButton);

      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      renderWithProvider(<AuthForm mode="login" />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      expect(passwordInput.type).toBe('password');
      
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });
});
