import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BasicSpeedDial from "./BasicSpeedDial";
import { BASE_URL, createAPIEndpoint } from "../api";
import { Tooltip } from "@mui/material";
import defaultProductImage from "../image/defaultProductImage.png";
import { useStateContext } from "../hooks/useStateContext";
import ProductDialog from "./ProductDialog";
import { useEffect } from "react";
import { useState } from "react";

export default function MyProduct() {
  const {
    products,
    setProducts,
    dialog,
    showDialog,
    user,
    loggedin,
    setConnecting,
    showNotify,
    showNotifyError,
    AddToFav
  } = useStateContext();
  const [productList, setProductList] = useState([]);
  const [i,setIndex]=useState(-1);

 

  const deleteProduct = (item) => {
    setConnecting(true);
    createAPIEndpoint("Product")
      .delete(item.productId)
      .then((res) => {
        setConnecting(false);
        setProductList(prev=>prev.filter(x=>x.productId!=item.productId))
        showNotify("deleted Succesfully");
      })
      .catch((err) =>{
        showNotifyError(err.response.data);
    setConnecting(false);

      });
  };

 

  useEffect(() => {
    //  products.length==0&&
    createAPIEndpoint("Product")
      .fetch()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
    //  setLoading(false);
  }, []);

  useEffect(
    () => {
  setConnecting(true);
      setProductList(products.filter((x) => x.ownerId == user.memberId))
  setConnecting(false);
    },

      [products]
  );

  

  // console.log(products);

  return (
    <>
       {dialog&&(
      productList.length  != 0 && i != -1 && (
        <ProductDialog list={productList} i={i} />
      ))}
       {loggedin&&           <BasicSpeedDial />
}
      <ImageList sx={{ width: "100%", height: "100%" }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">My Products</ListSubheader>
        </ImageListItem>
        {productList.length!=0&& productList.map((item,index) => 
          
              <ImageListItem key={index}>
               {item.image==''?
                <img
                style={{ borderRadius:"12px" }}
                  src={defaultProductImage}
                  srcSet={`${BASE_URL+item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.name}
                  loading="lazy"
                />:
                <img
                style={{ borderRadius:"12px" }}
                  src={`${BASE_URL+ item.image}?w=248&fit=crop&auto=format`}
                  srcSet={`${BASE_URL+item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.name}
                  loading="lazy"
                />}
                <ImageListItemBar
                position="top"
                  sx={{
                    borderRadius:"12px" ,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={item.name}
                  // subtitle={item.details}
                 
                />
                <ImageListItemBar
                  sx={{
                    borderRadius:"12px" ,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  // title={item.name}
                  // subtitle={item.details}
                  actionIcon={
                    <>
                      <Tooltip
                        title={item.feature ? "Favorite" : "Add to Favorite"}
                      >
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={()=> AddToFav(item)}
                          >
                          {item.feature ? (
                            <FavoriteIcon sx={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="delete">
                        <IconButton
                          id={item.productId}
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.name}`}
                          onClick={()=> deleteProduct(item)}
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
            )
        }
      </ImageList>
    </>
  );
}
