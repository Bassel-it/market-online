import React from "react";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import InfoIcon from "@mui/icons-material/Info";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { BASE_URL, createAPIEndpoint } from "../api";
import { Tooltip, Typography } from "@mui/material";
import { useStateContext } from "../hooks/useStateContext";
// import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkIcon from "@mui/icons-material/Link";
import defaultProductImage from "../image/defaultProductImage.png";

const shareList = [
  {
    url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    icon: <FacebookOutlinedIcon />,
    name: "Facebook",
  },
  {
    url: `https://wa.me/?text=${window.location.href}`,
    icon: <WhatsAppIcon />,
    name: "Whatsapp",
  },

  {
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}`,
    icon: <TwitterIcon />,
    name: "Twitter",
  },
  { url: ``, icon: <LinkIcon />, name: "Copy Link" },
];

function ProductDialog({ list, i }) {
  const {
    dialog,
    showDialog,
    products,
    cart,
    setCart,
    loggedin,
    user,
    showNotify,
    showNotifyError,
  } = useStateContext();

  const [details, showDetails] = useState(false);
  const [owner, setOwner] = useState({});
  const [shareAnchor, setShareAnchor] = useState();
  const [currentProduct, setcurrentProduct] = useState(i);

  const isShareDisplay = Boolean(shareAnchor);

  

  const AddToFav = (e) => {
    let rec = {
      itemType: "product",
      itemId: e.view.document.activeElement.id,
      userId: user.memberId,
    };
    createAPIEndpoint("Favorite")
      .post(rec)
      .then((res) => showNotify("Added successfully"))
      .catch((err) => {
        showNotifyError(err.response.data);
      });
  };

  const openShare = (e) => {
    setShareAnchor(e.currentTarget);
  };
  const closeShare = () => {
    setShareAnchor(null);
  };

  const NavigatePrev = () => {
    let i = currentProduct - 1;
    i < 0 ? setcurrentProduct(list.length - 1) : setcurrentProduct(i);
  };

  const NavigateNext = () => {
    let i = currentProduct + 1;
    i == list.length ? setcurrentProduct(0) : setcurrentProduct(i);
  };

  useEffect(() => {
    list[currentProduct] &&
      createAPIEndpoint("Member")
        .fetchById(list[currentProduct].ownerId)
        .then((res) => {
          // console.log("owner", res.data);
          setOwner(res.data);
        })
        .catch((err) => console.log("error", err));
  }, [currentProduct]);

  // console.log(list, list[currentProduct]);

  const shareId = "share";
  const displayShare = (
    <Menu
      anchorEl={shareAnchor}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      id={shareId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isShareDisplay}
      onClose={closeShare}
    >
      {shareList.map((item) => (
        <MenuItem key={item.name}>
          <ListItemButton
            // selected={selectedIndex === 1}
            onClick={
              item.name == "Copy Link"
                ? () => navigator.clipboard.writeText(window.location.href)
                : () => window.open(item.url)
            }
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </MenuItem>
      ))}
    </Menu>
  );
  return (
    <>
      <Dialog
        // fullWidth={true}
        maxWidth="true"
        sx={{
          //   backgroundColor:"#121212bd"
          letterSpacing: "0.19em",
          fontWeight: 550,
        }}
        onClose={() => {
          showDialog(false);
        }}
        open={dialog}
      >
        <>
          {/* Mobile */}
          <Box
            sx={{
              maxWidth: "999px",
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              //   backgroundColor:"#121212bd"
            }}
          >
            {/* <Tooltip title="Previous Product" placement="left-end">
      <IconButton onClick={() => NavigatePrev()}>
          <NavigateBeforeIcon />
        </IconButton>
        </Tooltip> */}

            <CardMedia
              component="img"
              width="443"
              image={list[currentProduct].image==''?defaultProductImage:BASE_URL+list[currentProduct].image}
              alt="Product image"
            />
            {/* <IconButton onClick={() => showDetails(!details)}>
          <ArrowDropDownIcon />
        </IconButton> */}
            <Slide in={details} direction="up" mountOnEnter unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  //   , backgroundColor:"#121212bd"

                  p: "12px",
                  justifyContent: "space-between",
                }}
              >
                <Grow in={details}>
                  <Card sx={{ mt: "6px" }}>
                    <CardHeader
                      avatar={
                        <Avatar src={BASE_URL+ owner.image} aria-label="recipe"></Avatar>
                      }
                      // action={
                      //   <IconButton aria-label="settings">
                      //     <MoreVertIcon  />
                      //   </IconButton>
                      // }
                      title={owner.firstName + " " + owner.lastName}
                      subheader={owner.email}
                    />
                  </Card>
                </Grow>
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 1000 } : {})}
                >
                  <span>Product Name : {list[currentProduct].name}</span>
                </Grow>
                {/* Conditionally applies the timeout prop to change the entry speed.  */}
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 1500 } : {})}
                >
                  <Typography>
                    <span>Category : {list[currentProduct].category}</span>
                    <br />
                    <span>Price : {list[currentProduct].price} SYP</span>
                    <br />
                    <span>Count : {list[currentProduct].count} Pieces</span>
                    <br />
                    <span>
                      Available :{" "}
                      {list[currentProduct].avialable ? "Yes" : "No"}
                    </span>
                    <br />
                    <span>Details : {list[currentProduct].details}</span>
                    <br />
                  </Typography>
                </Grow>
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 2000 } : {})}
                >
                  <div style={{ position: "relative" }}>
                    {loggedin && (
                      <>
                        <Tooltip
                          title={
                            list[currentProduct].feature
                              ? "Favorite"
                              : "Add to Favorite"
                          }
                        >
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={AddToFav}
                          >
                            {list[currentProduct].feature ? (
                              <FavoriteIcon sx={{ color: "red" }} />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add to Cart">
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={()=> setCart([...cart, list[currentProduct]])}
                          >
                            <AddShoppingCartIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="send message to owner">
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={() =>
                              window.open(
                                `https://wa.me/${owner.phoneNumber}?text=hello`
                              )
                            }
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton
                            aria-controls={shareId}
                            size="large"
                            aria-label="share this list[currentProduct]"
                            color="inherit"
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            onClick={openShare}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {displayShare}
                  </div>
                </Grow>
              </Box>
            </Slide>
            {/* <Tooltip title="Next Product" placement="right-end">
      <IconButton onClick={() => NavigateNext()}>
          <NavigateNextIcon />
        </IconButton>
        </Tooltip>
       */}
          </Box>

          {/* Desktop */}
          <Box
            sx={{
              maxWidth: "999px",
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              //   backgroundColor:"#121212bd"
            }}
          >
            {/* <Tooltip title="Previous Product" placement="left-end">
      <IconButton onClick={() => NavigatePrev()}>
          <NavigateBeforeIcon />
        </IconButton>
        </Tooltip> */}

            <CardMedia
              component="img"
              height="543"
              image={BASE_URL+list[currentProduct].image}
              alt="Product image"
            />
            {/* <IconButton onClick={() => showDetails(!details)}>
          <ChevronRightIcon />
        </IconButton> */}
            <Slide in={details} direction="left" mountOnEnter unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  //   , backgroundColor:"#121212bd"

                  width: "444px",
                  p: "12px",
                  justifyContent: "space-between",
                }}
              >
                <Grow in={details}>
                  <Card sx={{ mt: "6px" }}>
                    <CardHeader
                      avatar={
                        <Avatar src={BASE_URL+owner.image} aria-label="recipe"></Avatar>
                      }
                      // action={
                      //   <IconButton aria-label="settings">
                      //     <MoreVertIcon  />
                      //   </IconButton>
                      // }
                      title={owner.firstName + " " + owner.lastName}
                      subheader={"Email : " + owner.email}
                    />
                  </Card>
                </Grow>
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 1000 } : {})}
                >
                  <span>Product Name : {list[currentProduct].name}</span>
                </Grow>
                {/* Conditionally applies the timeout prop to change the entry speed.  */}
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 1500 } : {})}
                >
                  <Typography>
                    <span>Category : {list[currentProduct].category}</span>
                    <br />
                    <span>Price : {list[currentProduct].price} SYP</span>
                    <br />
                    <span>Count : {list[currentProduct].count} Pieces</span>
                    <br />
                    <span>
                      Available :{" "}
                      {list[currentProduct].avialable ? "Yes" : "No"}
                    </span>
                    <br />
                    <span>Details : {list[currentProduct].details}</span>
                    <br />
                  </Typography>
                </Grow>
                <Grow
                  in={details}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(details ? { timeout: 2000 } : {})}
                >
                  <div style={{ position: "relative" }}>
                    {loggedin && (
                      <>
                        <Tooltip
                          title={
                            list[currentProduct].feature
                              ? "Favorite"
                              : "Add to Favorite"
                          }
                        >
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={AddToFav}
                          >
                            {list[currentProduct].feature ? (
                              <FavoriteIcon sx={{ color: "red" }} />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add to Cart">
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={()=> setCart([...cart, list[currentProduct]])}

                          >
                            <AddShoppingCartIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="message owner on Whatsapp">
                          <IconButton
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${list[currentProduct].name}`}
                            onClick={() =>
                              window.open(
                                `https://wa.me/${owner.phoneNumber}?text=hello`
                              )
                            }
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton
                            aria-controls={shareId}
                            size="large"
                            aria-label="share this list[currentProduct]"
                            color="inherit"
                            id={list[currentProduct].productId}
                            // sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            onClick={openShare}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {displayShare}
                  </div>
                </Grow>
              </Box>
            </Slide>
            {/* <Tooltip title="Next Product" placement="right-end">
      <IconButton onClick={() => NavigateNext()}>
          <NavigateNextIcon />
        </IconButton>
        </Tooltip> */}
          </Box>
        </>
      </Dialog>
      {/* navigation */}
      <Box
        sx={{
          display: "flex",
          transform: "translateZ(0px)",
          flexGrow: 1,
          flexDirection: "row",
          position: "fixed",
          bottom: { md: "5%", xs: "88%" },
          zIndex: "9999",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Previous Product" placement="left-end">
          <IconButton onClick={() => NavigatePrev()}>
            <NavigateBeforeIcon sx={{ color: "white", fontSize: 45 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="show Datails" placement="bottom">
          <IconButton onClick={() => showDetails(!details)}>
            <InfoIcon sx={{ color: { md: "purple" }, fontSize: 35 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Product" placement="right-end">
          <IconButton onClick={() => NavigateNext()}>
            <NavigateNextIcon sx={{ color: "white", fontSize: 45 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}

export default ProductDialog;
