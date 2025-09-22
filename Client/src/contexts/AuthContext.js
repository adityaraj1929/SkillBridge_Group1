import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  userType: null,
};

// Action types
const AUTH_ACTIONS = {
  USER_LOADED: 'USER_LOADED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.USER_LOADED:
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        userType: action.payload.userType,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        userType: action.payload.user.userType,
      };
    case AUTH_ACTIONS.LOGOUT:
    case AUTH_ACTIONS.AUTH_ERROR:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        userType: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Set up axios defaults
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUser();
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      dispatch({
        type: AUTH_ACTIONS.USER_LOADED,
        payload: res.data,
      });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const res = await axios.post('/api/auth/login', formData);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: res.data,
      });
      
      setAuthToken(res.data.token);
      await loadUser();
      
      return { success: true, data: res.data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Register volunteer
  const registerVolunteer = async (formData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const res = await axios.post('/api/auth/register/volunteer', formData);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: res.data,
      });
      
      setAuthToken(res.data.token);
      await loadUser();
      
      return { success: true, data: res.data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [],
      };
    }
  };

  // Register NGO
  const registerNGO = async (formData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const res = await axios.post('/api/auth/register/ngo', formData);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: res.data,
      });
      
      setAuthToken(res.data.token);
      await loadUser();
      
      return { success: true, data: res.data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [],
      };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    setAuthToken(null);
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const endpoint = state.userType === 'volunteer' ? '/api/users/profile' : '/api/ngos/profile';
      const res = await axios.put(endpoint, formData);
      
      dispatch({
        type: AUTH_ACTIONS.USER_LOADED,
        payload: { user: res.data.user || res.data.ngo, userType: state.userType },
      });
      
      return { success: true, data: res.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
        errors: error.response?.data?.errors || [],
      };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    registerVolunteer,
    registerNGO,
    updateProfile,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
