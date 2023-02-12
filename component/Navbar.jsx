import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import CategoryIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import MailIcon from "@mui/icons-material/Mail";
import DraftsTwoToneIcon from "@mui/icons-material/DraftsTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useStateContext } from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { BASE_URL, createAPIEndpoint } from "../api";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import profileMale from '../image/profileMale.png';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useState } from "react";
import ProductDialog from "./ProductDialog";
import { ListItemIcon, Slide } from "@mui/material";
import { Stack } from "@mui/system";


const Search = styled("div")(({ theme }) => ({
   display:"flex",
  flexDirection:"row",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 1),
  height: "100%",
  position: "relative",
  // pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1,0 , 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {
  
  const {
    dialog,showDialog,
    setLoggedin,
    user,
    setUser,
    cart,
    message,
    setMessage,
    notification,
    navbar,
    showNavbar,
    sideBar,
    setSidebar,
    setNotification,
    mode,
    setMode,
    setSearchWord,
   
    showNotifyError
  } = useStateContext();
  // const{snackbar,setSnackbar}=React.useState("Notification");
  const navigate = useNavigate();
  const [i,setIndex]=useState(-1);
  const [localSearchProp,setlocalSearchProp]=useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [cartAnchor, setCartAnchore] = useState(null);
  const [messageAnchor, setMessageAnchore] = useState(null);
  const [notificationAnchor, setNotificationAnchore] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isCartDisplay = Boolean(cartAnchor);
  const isMessageDisplay = Boolean(messageAnchor);
  const isNotificationDisplay = Boolean(notificationAnchor);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const cartOpen = (e) => {
    setCartAnchore(e.currentTarget);
  };
  const cartClose = () => {
    setCartAnchore(null);
  };
  const messageOpen = (e) => {
    setMessageAnchore(e.currentTarget);
  };
  const messageClose = () => {
    setMessageAnchore(null);
  };
  const notificationOpen = (e) => {
    setNotificationAnchore(e.currentTarget);
  };
  const notificationClose = () => {
    setNotificationAnchore(null);
  };




  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={()=> {handleMenuClose(); navigate('/profile')}}>Profile</MenuItem>
      <MenuItem onClick={()=> handleMenuClose()}>Setting</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          setLoggedin(false);
          setUser({email:'',password:''});
          navigate('/')
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );


  const cartId = "cart";
  const displayCart = (
    <Menu
      anchorEl={cartAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={cartId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isCartDisplay}
      onClose={cartClose}
    >
      {cart.length != 0 ? (
        cart.map((p,index) => (
          <MenuItem divider  key={index}>
            <Stack width="100%" direction='row' onClick={()=> {setIndex(index,showDialog(true));cartClose()}}>
              <ListItemAvatar>
              <Avatar alt={`${p.productId}`} src={BASE_URL+ p.image} />
            </ListItemAvatar>
            <ListItemText
              primary={p.name}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {p.category}--- Price:{p.price}
                    <br />
                  </Typography>
                  {p.details}
                </React.Fragment>
              }
            /></Stack>
            <ListItemIcon
            children={<Tooltip arrow placement="right" title="remove from cart">
              <IconButton onClick={()=>{cart.splice(index,1); cartClose()}} edge="end">
            <ClearOutlinedIcon/>
            </IconButton>
            </Tooltip>}
            />
              
            
          </MenuItem>
        ))
      ) : (
        <ListItem alignItems="flex-start">
          <ListItemText primary="No Content" />
        </ListItem>
      )}
    </Menu>
  );

  const messageId = "message";
  const displayMessage = (
    <Menu
      anchorEl={messageAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={messageId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMessageDisplay}
      onClose={messageClose}
    >
      {message.length != 0 ? (
        message.map((p,index) => (
          <MenuItem divider key={index}>
            <ListItemAvatar>
              <Avatar
                alt={`${p.id}`}
                // src={}
              />
            </ListItemAvatar>
            <ListItemText
              primary={p.from}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {" "}
                    {p.title}
                    <br />
                    {p.details}
                    <br />
                  </Typography>
                  {p.time}
                </React.Fragment>
              }
            />
          </MenuItem>
        ))
      ) : (
        <ListItem alignItems="flex-start">
          <ListItemText primary="No Content" />
        </ListItem>
      )}
    </Menu>
  );

  const notificationId = "notification";
  const displayNotification = (
    <Menu
      anchorEl={notificationAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={notificationId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isNotificationDisplay}
      onClose={notificationClose}
    >
      {notification.length != 0 ? (
        notification.map((p,index) => (
          <MenuItem divider key={index}>
            <ListItemAvatar>
              <Avatar
                alt={`${p.id}`}
                //  src={}
              />
            </ListItemAvatar>
            <ListItemText
              primary={p.title}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {p.details}
                    <br />
                  </Typography>
                  {p.time}
                </React.Fragment>
              }
            />
          </MenuItem>
        ))
      ) : (
        <ListItem alignItems="flex-start">
          <ListItemText primary="No Content" />
        </ListItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {navigate("/");handleMobileMenuClose()}}>
        <IconButton
          size="large"
          aria-label="Home"
          aria-haspopup="true"
          color="inherit"
        >
          <HomeIcon />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem onClick={messageOpen}>
        <IconButton
          aria-controls={messageId}
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
        >
          <Badge badgeContent={message.length} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={notificationOpen}>
        <IconButton
          aria-controls={notificationId}
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={notification.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={cartOpen}>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          aria-controls={cartId}
          aria-haspopup="true"
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartTwoToneIcon htmlColor="cyan" />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
        // sx={{ width:177 ,height:177}}
        alt="Remy Sharp"
        src={user.image==null?profileMale:BASE_URL+ user.image}
      />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const Searching = () => {
    setSearchWord( localSearchProp);
    setlocalSearchProp('');
      navigate("/searchResult");
    // console.log(searchWord);
 }

  React.useEffect(() => {
    createAPIEndpoint("message")
      .fetchById(user.memberId)
      .then((res) => setMessage(res.data))
      .catch((err) => console.log(err));
    createAPIEndpoint("notification")
      .fetchById(user.memberId)
      .then((res) => setNotification(res.data))
      .catch((err) => console.log(err));
  }, []);

  // console.log(user);
  return (
    <div  >
     

{dialog&&(
      cart.length  != 0 && i != -1 && (
        <ProductDialog list={cart} i={i} />
      ))}

<Slide  timeout={{enter:1111,exit:1222}} in={navbar} direction="down">
     
     
        <AppBar
        
  onMouseLeave={() => showNavbar(false)}
  sx={{
    m:"1% 2.5%",
    borderRadius:"49px",
     position: "fixed",
     width: "95%",
    backgroundColor: mode=='light'?'rgb(102, 157, 246,0.9)':"rgb(0, 0, 0,0.9)",
    display: "flex",
    flexDirection: "column",
    zIndex: "999",
  }}
          // position="fixed"
          // sx={{ backgroundColor: "rgb(0 0 0 / 80%)" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => setSidebar(!sideBar)}
            >
              <CategoryIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Category
            </Typography>
            <Search>
              <SearchIconWrapper
               sx={{ zIndex: "99" }}
               onClick={() => localSearchProp != "" ? Searching():showNotifyError("please write something in search Box..")}
              >
                <SearchIcon sx={{ cursor: "pointer" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                name="search"
                value={localSearchProp}
                onChange={(e) => {
                  setlocalSearchProp(e.target.value);
                  
                }}
              />
               <SearchIconWrapper
               sx={{ zIndex: "99" }}
               onClick={() => setlocalSearchProp('')}
              ><ClearIcon sx={{ cursor: "pointer" }}/>
              </SearchIconWrapper>
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title="Shopping Cart">
                <IconButton
                  edge="end"
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  aria-haspopup="true"
                  aria-controls={cartId}
                  onClick={cartOpen}
                >
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartTwoToneIcon htmlColor="cyan" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Message">
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  aria-controls={messageId}
                  onClick={messageOpen}
                >
                  <Badge badgeContent={message.length} color="error">
                    <DraftsTwoToneIcon htmlColor="yellow" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notification">
                <IconButton
                  edge="start"
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  aria-controls={notificationId}
                  onClick={notificationOpen}
                >
                  <Badge badgeContent={notification.length} color="error">
                    {/* <NotificationsIcon /> */}
                    <NotificationsNoneTwoToneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="My Account">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
        // sx={{ width:177 ,height:177}}
        alt="Remy Sharp"
        src={user.image==null?profileMale:BASE_URL+ user.image}
      />
                </IconButton>
              </Tooltip>
              <Tooltip title="Home">
                <IconButton
                  size="large"
                  aria-label="Home"
                  aria-haspopup="true"
                  onClick={() => navigate("/")}
                  color="inherit"
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {mode == "dark" ? (
              <Tooltip title="Light mode">
                <IconButton
                  size="large"
                  aria-label="Home"
                  aria-haspopup="true"
                  onClick={() => setMode("light")}
                  color="inherit"
                >
                  <DarkModeIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Dark mode">
                <IconButton
                  size="large"
                  aria-label="Home"
                  aria-haspopup="true"
                  onClick={() =>setMode("dark")}
                  color="inherit"
                >
                  <LightModeIcon />
                </IconButton>
              </Tooltip>
            )}

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
          {renderMobileMenu}
        {renderMenu}
        {displayMessage}
        {displayCart}
        {displayNotification}
        </AppBar>
       
      </Slide>
    </div>
  );
}
