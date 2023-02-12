import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WidgetsIcon from "@mui/icons-material/Widgets";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useNavigate } from "react-router-dom";
import { Backdrop } from "@mui/material";

export default function BasicSpeedDial() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    {
      icon: <PlaylistAddIcon />,
      name: "Add Product",
      onclick: () => navigate("/product/addProduct"),
    },
    {
      icon: <WidgetsIcon />,
      name: "My Products",
      onclick: () => navigate("/product/myProduct"),
    },
    {
      icon: <StarIcon sx={{ color: "yellow" }} />,
      name: "Favorite",
      onclick: () => navigate("/product/favorite"),
    },
    { icon: <ShareIcon />, name: "Share" },
  ];

  const navigate = useNavigate();
  return (
    <>
    <Box
      sx={{
        display:{xs:"none",md:"block"} ,
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "fixed",
        top: "50%",
        right: "1%",
        zIndex: "999",
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{position: "absolute", bottom: 16,
         right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onclick}
          />
        ))}
      </SpeedDial>
    </Box>
      {open&&
    <Box
     sx={{
      display:{xs:"block",md:"none"} ,
      height: window.innerHeight,
      width:window.innerWidth,
      transform: "translateZ(0px)",
      flexGrow: 1,
      position: "fixed",
      // top: "50%",
      // right: "1%",
      zIndex: "999",
    }}
     >
    <Backdrop   open={open} />
  </Box>
    }
     <Box
      sx={{
      display:{xs:"block",md:"none"} ,
      height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "fixed",
        top: "50%",
        right: "1%",
        zIndex: "999",
      }}
    >
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      sx={{position: "absolute",
       bottom: 16,
      right: 16 }}
      
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={action.onclick}

        />
      ))}
    </SpeedDial>
    </Box>
  </>
  );
}
