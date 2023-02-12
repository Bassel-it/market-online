import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import iconic from '../image/iconic.png'
import { adminList } from './Main';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../hooks/useStateContext';
import LogoutIcon from '@mui/icons-material/Logout';
import profileMale from "../image/profileMale.png";
import { BASE_URL } from '../api';



function Bar() {
  const {setLoggedin ,user,setUser}=useStateContext();
  const navigate=useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Logout=()=>{
    setLoggedin(false);
    setUser({email:"",password:""})
    navigate("/");

  }

  let b="Sho{B}ing";
  return (
    <AppBar position="static">
      <Container 
      maxWidth="xl"
      >
        <Toolbar disableGutters>
        
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'none' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
        <Avatar src={iconic} variant='square' sx={{width:155,height:155}}/>

           
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
                display: { xs: 'block', md: 'block' },
              }}
            >
              {adminList.map((page) => (
                <MenuItem divider key={page.header} onClick={()=>{navigate(`/${page.header}Table`) ;handleCloseNavMenu() }}>
                  <Typography textAlign="center">{page.header}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
        
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
        <Avatar src={iconic} variant='square' sx={{width:155,height:155}}/>

           
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'none' } }}>
            {adminList.map((page) => (
              <Button
                key={page.header}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.header}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
               onClick={
               handleOpenUserMenu
              } 
               sx={{ p: 0 }}>
                <Avatar alt={user.firstName} src={BASE_URL+user.image} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              {/* {settings.map((setting) => ( */}
                <MenuItem  onClick={()=>{Logout(); handleCloseUserMenu()} } >
                  <Typography textAlign="center">Logout</Typography><LogoutIcon/>
                </MenuItem>
              {/* ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Bar;