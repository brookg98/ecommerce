import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authAPI, LoginRequest, RegisterRequest } from '../api/auth';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setTokens, logout, user, isAuthenticated } = useAuthStore();

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const response = await authAPI.login(data);
      setTokens(response.data.access_token, response.data.refresh_token);

      const meResponse = await authAPI.getMe();
      setUser(meResponse.data);

      toast.success('Login successful!');
      navigate(meResponse.data.is_admin ? '/admin/dashboard' : '/');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return {
    register,
    login,
    logout: handleLogout,
    user,
    isAuthenticated,
  };
};
