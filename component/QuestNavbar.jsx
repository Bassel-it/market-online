import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import { useStateContext } from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
import { Slide, Tooltip } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";

const Search = styled("div")(({ theme }) => ({
  display:"flex",
  flexDirection:"row",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 1),
  height: "100%",
  position: "relative",
  // pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 0, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      width: "5ch",
      "&:focus": {
        width: "23ch",
        // position:"fixed"
      },
    },
    [theme.breakpoints.up("md")]: {
      width: "15ch",
      "&:focus": {
        width: "23ch",
        // position:"fixed"
      },
    },
  },
}));

export default function QuestNavbar() {
  // const { loginWithPopup, logout, loginWithRedirect, isAuthenticated } =  useAuth0();

  const {
    setSidebar,
    sideBar,
    mode,
    setMode,
    navbar,
    showNavbar,
    setSearchWord,
    showNotifyError
  } = useStateContext();

  const [localSearchProp,setlocalSearchProp]=useState('');

  const navigate = useNavigate();

  const Searching = () => {
    setSearchWord( localSearchProp);
    setlocalSearchProp('');
      navigate("/searchResult");
    // console.log(searchWord);
 }

  return (
    <div>
      <Slide timeout={{ enter: 1111, exit: 1222 }} in={navbar} direction="down">
        <AppBar
          onMouseLeave={() => showNavbar(false)}
          sx={{
            m: "1% 2.5%",
            borderRadius: "49px",
            position: "fixed",
            width: "95%",
            backgroundColor:
              mode == "light" ? "rgb(102, 157, 246,0.9)" : "rgb(0, 0, 0,0.9)",
            display: "flex",
            flexDirection: "column",
            zIndex: "999",
          }}
          // sx={{ backgroundColor :"rgb(0 0 0 / 80%)" }}
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
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Category
            </Typography>
            <Search>
              <SearchIconWrapper
                sx={{ zIndex: "15" }}
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
            {/* {!isAuthenticated && ( */}
              <Button onClick={() => navigate("/Login")} color="inherit">
                Login
              </Button>
            {/* )} */}
            <IconButton
              size="large"
              aria-label="Home"
              aria-haspopup="true"
              onClick={() => navigate("/")}
              color="inherit"
            >
              <HomeIcon />
            </IconButton>
            {mode == "dark" ? (
              <Tooltip title="Light mode">
                <IconButton
                  size="large"
                  aria-label="Home"
                  aria-haspopup="true"
                  onClick={() => setMode("light")}
                  color="inherit"
                >
                  <DarkMode />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Dark mode">
                <IconButton
                  size="large"
                  aria-label="Home"
                  aria-haspopup="true"
                  onClick={() => setMode("dark")}
                  color="inherit"
                >
                  <LightMode />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
    </div>
  );
}
