import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material'
import { useGetUserQuery } from '../../services/usersSlice/usersSlice'
import { useGetUserPhotoQuery } from '../../services/microsoftSlice/microsoftSlice'
import { stringAvatar, generateColorHsl } from '../avatarGenerator'
import NavButton from '../NavButton'
import './styles.css'

const Logo = require('../../assets/img/constellation-logo.png')

const pages = ['MySEPs', 'All SEPs', 'Create an SEP']

const ResponsiveAppBar = () => {
  const { data: userPhoto,
    isSuccess: photoIsSuccess,
    isLoading,
    isError: photoIsError,
    error: photoErr } = useGetUserPhotoQuery()
  const theme = useTheme()
  const { data: loggedInUser } = useGetUserQuery('me');
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const userName: string = loggedInUser?.displayName ?? ''

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  useEffect(() => {
    console.log("🚀 ~ file: AppBar.tsx ~ line 135 ~ ResponsiveAppBar ~ isLoading || !photoErr || !userPhoto", (isLoading && photoErr && typeof userPhoto === 'undefined'))
    console.log("🚀 ~ file: AppBar.tsx ~ line 45 ~ useEffect ~ userPhoto", typeof userPhoto === 'undefined')
    console.log("🚀 ~ file: AppBar.tsx ~ line 45 ~ useEffect ~ photoErr", typeof photoErr  === 'object')
    console.log("🚀 ~ file: AppBar.tsx ~ line 45 ~ useEffect ~ isLoading", isLoading)
    
  }, [userPhoto,photoErr,isLoading]);

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        backgroundColor: theme.palette.common.white,
        borderBottom: '1px',
        borderColor: theme.palette.solidGrey.light,
        borderStyle: 'solid'
      }}
    >
      <Container maxWidth={false} >
        <Toolbar disableGutters >
          <img src={Logo} height="50px" style={{ marginTop: '5px' }} />
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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0, mr: 3, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NavButton
                key={page}
                arial-label="navigation buttons"
                onClick={handleCloseNavMenu}
                className="nav-buttons"
              >
                {page}
              </NavButton>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <>

              <Tooltip title={userName}>
                <IconButton sx={{ p: 0 }}>

                  {(isLoading || (typeof photoErr  === 'undefined' ||typeof photoErr  === 'object')  && typeof userPhoto === 'undefined') ?
                    <Avatar
                      sx={{ bgcolor: generateColorHsl(userName) }}
                      {...stringAvatar(userName)}
                    />
                    :
                    <Avatar
                      alt='Profile picture'
                      src={userPhoto}
                    />

                  }
                </IconButton>
              </Tooltip>
            </>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
