import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BasicSpeedDial from "./BasicSpeedDial";
import { BASE_URL, createAPIEndpoint } from "../api";
import { Tooltip } from "@mui/material";
import { useStateContext } from "../hooks/useStateContext";
import defaultProductImage from "../image/defaultProductImage.png";
import ProductDialog from "./ProductDialog";
import { useState } from "react";
import { useEffect } from "react";

export default function Favorite({}) {
  const {
    user,
    dialog,
    showDialog,
    loggedin,
    cart,
    setCart,
    favorite,
    setFavorite,
    setConnecting,
    products,
    setProducts,
    removeFromFav,
    showNotify,
  } = useStateContext();

  const [i, setIndex] = useState(-1);
  const [tempFav, setTempFav] = useState([]);

  React.useLayoutEffect(() => {
    setConnecting(true);
    products.length == 0 &&
      createAPIEndpoint("Product")
        .fetch()
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => console.log(err));
    createAPIEndpoint("Favorite/product")
      .fetchById(user.memberId)
      .then((res) => {
        setConnecting(false);
        setTempFav(res.data);
        // console.log(res.data,products);
      })
      .catch((err) => console.log(err));

    //  setLoading(false);
  }, []);

  useEffect(() => {
    if (tempFav.length != 0 && products.length != 0) {
      setConnecting(true);
      let favo = [];
      let fp;
      tempFav.map((f) => {
        fp = products.find((x) => x.productId == f.itemId);
        if (fp !== undefined) favo = [...favo, fp];
      });
      favo.length != 0 && setFavorite(favo);
      setConnecting(false);
    }
  }, [tempFav]);

  // console.log(tempFav)
  // console.log(favorite, products);

  return (
    <>
      {dialog && favorite.length != 0 && i != -1 && (
        <ProductDialog list={favorite} i={i} />
      )}
      {loggedin && <BasicSpeedDial />}
      <ImageList sx={{ width: "100%", height: "100%" }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader
            component="div"
            // sx={{ backgroundColor: "#121212d6" }}
          >
            My Favorite
          </ListSubheader>
        </ImageListItem>
        {favorite.length != 0 &&
          favorite.map((item, index) => {
            return (
              <ImageListItem key={index}>
                {item.image == "" ? (
                  <img
                    style={{ borderRadius: "12px" }}
                    src={defaultProductImage}
                    srcSet={`${
                      BASE_URL + item.image
                    }?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <img
                    style={{ borderRadius: "12px" }}
                    src={`${BASE_URL + item.image}?w=248&fit=crop&auto=format`}
                    srcSet={`${
                      BASE_URL + item.image
                    }?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.name}
                    loading="lazy"
                  />
                )}
                <ImageListItemBar
                  position="top"
                  sx={{
                    borderRadius: "12px",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={item.name}
                  subtitle={item.price + " S.Y.P"}
                />
                <ImageListItemBar
                  sx={{
                    borderRadius: "12px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  // title={item.name}
                  // subtitle={item.details}
                  actionIcon={
                    <>
                      <Tooltip title="Favorite">
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                        >
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add to Cart">
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={() => {
                            setCart([...cart, item]);
                            showNotify("Added successfully");
                          }}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="remove from favorite">
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={() => removeFromFav(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="details">
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={() => {
                            setIndex(index);
                            showDialog(true);
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                />
              </ImageListItem>
            );
          })}
      </ImageList>
    </>
  );
}
