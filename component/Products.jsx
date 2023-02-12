import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BasicSpeedDial from "./BasicSpeedDial";
import { BASE_URL, createAPIEndpoint } from "../api";
import { Box, Tooltip } from "@mui/material";
import { useStateContext } from "../hooks/useStateContext";
import { useState } from "react";
import defaultProductImage from "../image/defaultProductImage.png";
import ProductDialog from "./ProductDialog";
import { memo } from "react";

export default memo(function Product({ Category }) {
  const {
    dialog,
    showDialog,
    products,
    setProducts,
    cart,
    setCart,
    loggedin,
    setConnecting,
    showNotifyError,
    headerImage,
    setHeaderImage,
    category,
    AddToFav,
    showNotify,
  } = useStateContext();

  const [productList, setProductList] = useState([]);
  const [i, setIndex] = useState(-1);

  React.useLayoutEffect(() => {
    //  products.length==0&&
    setConnecting(true);
    createAPIEndpoint("Product")
      .fetch()
      .then((res) => {
        setConnecting(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setConnecting(false);
        showNotifyError(err.message);
        console.log(err);
      });
  }, []);

  React.useLayoutEffect(
    () => setProductList(products.filter((x) => x.category == Category)),
    [products, Category]
  );
  React.useLayoutEffect(() => {
    var c = category.find((x) => x.name == Category);
    c && setHeaderImage(c.image);
  }, [Category]);

  // console.log(productList, products,i);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img
          src={headerImage}
          style={{
            width: "95%",
            borderRadius: "12px",
            marginTop: "11px",
          }}
          loading="lazy"
        />
      </Box>
      {dialog && productList.length != 0 && i != -1 && (
        <ProductDialog list={productList} i={i} />
      )}
      {loggedin && <BasicSpeedDial />}
      <ImageList sx={{ width: "100%", height: "100%" }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">{Category}</ListSubheader>
        </ImageListItem>
        {productList.map((item, index) => (
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
              // subtitle={item.details}
              actionIcon={
                <div>
                  {loggedin && (
                    <>
                      <Tooltip
                        title={item.feature ? "Favorite" : "Add to Favorite"}
                      >
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={() => AddToFav(item)}
                        >
                          {item.feature ? (
                            <FavoriteIcon sx={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
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
                    </>
                  )}
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
                </div>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
});
