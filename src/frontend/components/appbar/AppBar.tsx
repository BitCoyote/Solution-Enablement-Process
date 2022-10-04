import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useGetUserQuery } from '../../services/usersSlice';
import { useGetUserPhotoQuery } from '../../services/microsoftSlice';
import { stringAvatar, generateColorHsl } from '../AvatarGenerator';

import NavButton from '../NavButton';

import './styles.css';
const Logo = require('../../assets/img/constellation-logo.png');

const pages = [
  {
    text: 'MySEPs',
    link: '/',
  },
  {
    text: 'All SEPs',
    link: 'all-seps',
  },
  {
    text: 'Create an SEP',
    link: '/',
  },
];
const settings = ['Logout'];

const ResponsiveAppBar = () => {
  const {
    data: userPhoto,
    isLoading,
    error: photoErr,
  } = useGetUserPhotoQuery();
  const theme = useTheme();

  const navigate: NavigateFunction = useNavigate();
  const { data: loggedInUser } = useGetUserQuery('me');
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const userName: string = loggedInUser?.displayName ?? '';

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChangeRoute = (route: string) => {
    navigate(route);
    handleCloseNavMenu();
  };

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        backgroundColor: theme.palette.common.white,
        borderBottom: '1px',
        borderColor: theme.palette.solidGrey.light,
        borderStyle: 'solid',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <img
            src={Logo}
            height="50px"
            alt="Constellation"
            style={{ marginTop: '5px' }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  onClick={() => handleChangeRoute(page.link)}
                >
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0, mr: 3, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NavButton
                key={page.text}
                arial-label="navigation buttons"
                onClick={() => handleChangeRoute(page.link)}
                className="nav-buttons"
              >
                {page.text}
              </NavButton>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={userName}>
              <IconButton sx={{ p: 0 }}>
                {isLoading ||
                ((typeof photoErr === 'undefined' ||
                  typeof photoErr === 'object') &&
                  typeof userPhoto === 'undefined') ? (
                  <Avatar
                    sx={{ bgcolor: generateColorHsl(userName) }}
                    {...stringAvatar(userName)}
                    alt="Profile picture"
                  />
                ) : (
                  <Avatar alt="Profile picture" src={userPhoto} />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '35px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
