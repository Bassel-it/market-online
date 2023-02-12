import * as React from "react";
import { styled } from "@mui/material/styles";
import { BASE_URL } from "../api";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import defaultProduct from "../image/defaultProduct.jpg";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useStateContext } from "../hooks/useStateContext";
import IosShareIcon from "@mui/icons-material/IosShare";
import axios from "axios";
import { createAPIEndpoint } from "../api";
import { useEffect } from "react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AddProduct({ admin }) {
  // Initially, no file is selected
  const [selectedFile, setfile] = useState(defaultProduct);
  const {
    setCategory,
    category,
    user,
    showNotify,
    showNotifyError,
    setConnecting,
    compressedImage,
    CompressImageFun,
    setCompressedImage,
  } = useStateContext();
  const [product, setProduct] = useState({
    name: "",
    ownerId: user.memberId,
    price: 0,
    image: "wwwroot/Uploads/Product/default.jpg",
    category: "",
    available: false,
    details: "",
    count: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    category: "",
    count: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image" && e.target.files[0] != null) {
      CompressImageFun(e.target.files[0], 0.4);
      setProduct({
        ...product,
        [name]:
          "wwwroot/Uploads/Users/" +
          `${user.email}/Products/` +
          e.target.files[0].name,
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  //save image to server
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(user.email, selectedFile, selectedFile.name);

    // Details of the uploaded file
    // console.log(selectedFile);

    // Request made to the backend api
    // Send formData object
    axios.post(BASE_URL + "api/Product/UploadImage", formData);
  };

  //check inputs validation
  const validate = () => {
    let temp = {};
    //eslint-disable-next-line
    temp.name = product.name !== "" ? "" : "Required";
    temp.price = product.price !== 0 ? "" : "Required";
    temp.category = product.category !== "" ? "" : "Required";
    temp.count = product.count !== 0 ? "" : "Required";

    setErrors(temp);
    return Object.values(temp).every((x) => x == "");
  };

  //save product
  const saveProduct = () => {
    setConnecting(true);
    if (validate()) {
      product.image == "wwwroot/Uploads/Product/default.jpg"
        ? setProduct({
            ...product,
            image: "wwwroot/Uploads/Product/default.jpg",
          })
        : onFileUpload();
      createAPIEndpoint("Product")
        .post(product)
        .then((res) => {
          showNotify("Product has been added succesfully");
          setConnecting(false);
        })
        .catch((err) => showNotifyError(err.message));
    }else 
    setConnecting(false);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (compressedImage != null) setfile(compressedImage);
  }, [compressedImage]);

  useEffect(() => setCompressedImage(null), [selectedFile]);

  useEffect(() => {
    createAPIEndpoint("Category")
  .fetch()
  .then((res) => {
    setCategory(res.data)
  })
  .catch((err) => {
    console.log(err);
   
  });}, []);
  // console.log(category);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={
          admin
            ? { maxWidth: window.innerWidth }
            : { maxWidth: 345, mt: "66px" }
        }
      >
        <CardHeader
          avatar={
            <Tooltip title="save Product">
              <IconButton aria-label="save Product" onClick={saveProduct}>
                <IosShareIcon sx={{ fontSize: 35 }} />
              </IconButton>
            </Tooltip>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon sx={{ fontSize: 35 }} />
            </IconButton>
          }
          title={product.name}
          subheader={product.category}
        />
        <Tooltip placement="top" arrow title="Add Product Image">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            <CardMedia
              component="img"
              // height="194"
              width="343"
              image={
                selectedFile !== defaultProduct
                  ? URL.createObjectURL(selectedFile)
                  : defaultProduct
              }
              alt="Product image"
            />
            <input hidden onChange={handleChange} name="image" type="file" />
          </IconButton>
        </Tooltip>
        <CardContent>
          <TextField
            fullWidth
            label="Name of Product"
            name="name"
            value={product.name}
            onChange={handleChange}
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField
              type="number"
              label="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
            <Chip
              sx={
                admin ? { height: "inherit" } : { width: 69, height: "inherit" }
              }
              label="S.Y.P"
              variant="outlined"
            />
          </Stack>

          {errors.price != "" && (
            <span style={{ color: "red" }}>({errors.price})</span>
          )}
        </CardContent>

        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField
              type="number"
              label="Number of pieces"
              name="count"
              value={product.count}
              onChange={handleChange}
            />
            <Chip
              sx={
                admin ? { height: "inherit" } : { width: 69, height: "inherit" }
              }
              label="Piece"
              variant="outlined"
            />
          </Stack>
          {errors.count != "" && (
            <span style={{ color: "red" }}>({errors.count})</span>
          )}
        </CardContent>

        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={product.category}
              name="category"
              onChange={handleChange}
            >
              {category.map((x) => (
                <MenuItem key={x.name} value={x.name}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.category != "" && (
            <span style={{ color: "red" }}>({errors.category})</span>
          )}
        </CardContent>

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
          Add Details
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <TextField
              fullWidth
              label="About Products"
              multiline
              rows={4}
              name="details"
              value={product.details}
              onChange={handleChange}
            />
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
