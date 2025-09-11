import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Work,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: null },
    { text: 'Opportunities', path: '/opportunities', icon: <Work /> },
  ];

  const authMenuItems = isAuthenticated
    ? [
        { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
        { text: 'Profile', path: '/profile', icon: <Person /> },
      ]
    : [
        { text: 'Login', path: '/login', icon: null },
        { text: 'Register as Volunteer', path: '/register/volunteer', icon: null },
        { text: 'Register as NGO', path: '/register/ngo', icon: null },
      ];

  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          component={Link}
          to={item.path}
          sx={{
            backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          {item.text}
        </Button>
      ))}
      
      {isAuthenticated ? (
        <>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            sx={{
              backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Dashboard
          </Button>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.[0] || user?.organizationName?.[0] || <AccountCircle />}
            </Avatar>
          </IconButton>
        </>
      ) : (
        <>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/register/volunteer"
            sx={{ ml: 1 }}
          >
            Join as Volunteer
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/register/ngo"
            sx={{ ml: 1 }}
          >
            Register NGO
          </Button>
        </>
      )}
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          SkillBridge
        </Typography>
        <List>
          {[...menuItems, ...authMenuItems].map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(25,118,210,0.1)' : 'transparent',
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              {item.icon && <Box sx={{ mr: 2 }}>{item.icon}</Box>}
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {isAuthenticated && (
            <ListItem
              button
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <Box sx={{ mr: 2 }}>
                <ExitToApp />
              </Box>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  const renderProfileMenu = () => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <Person sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        <Dashboard sx={{ mr: 1 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ExitToApp sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            SkillBridge
          </Typography>

          {renderDesktopMenu()}
        </Toolbar>
      </AppBar>
      
      {renderMobileMenu()}
      {renderProfileMenu()}
    </>
  );
};

export default Navbar;
