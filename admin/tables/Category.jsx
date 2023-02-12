import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { createAPIEndpoint } from "../../api";
import { BASE_URL } from "../../api";
import { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { useStateContext } from "../../hooks/useStateContext";
import ConfirmDialogSlide from "../ConfirmDialog";

export default function Category() {
  const defaultImage = BASE_URL + "wwwroot/Uploads/Category/defaultImage.png";
  const {setCategory,  showConfirmDialog, showNotify ,showNotifyError,setConnecting} =
    useStateContext();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState(false);
  const [dialog, showAddDialog] = useState(false);
  const [waitSave, setWaitSave] = useState(false);
  const [categoryIcon, setCategoryIcon] = useState(defaultImage);
  const [categoryImage, setCategoryImage] = useState(defaultImage);
  const [helperText, setHelperText] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    image: defaultImage,
    icon: defaultImage,
  });

  const refresh = () => {
    setSync(true);
    createAPIEndpoint("Category")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setSync(false);
      })
      .catch((err) => console.log(err));
  };

  const DeleteCategory = (id) => {
    setConnecting(true);
    createAPIEndpoint("Category")
      .delete(id)
      .then((res) =>{
    setConnecting(false);
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    showNotify("Delete Successfully");})
    .catch((err) => {
        console.log(err);
        showNotifyError(err.message)
      });

  };

  const saveChange = (p) => {
    // console.log("new", p);
    setConnecting(true);
    let pr = rows.find((x) => x.id == p.row.id);
    // console.log("old", pr);
    pr == p.row
      ?showNotify("no change detected")
      : createAPIEndpoint("Category")
          .put(p.row.id, p.row)
          .then((res) => {
    setConnecting(false);
    showNotify("Update Successfully")})
          .catch((err) => {
            console.log(err);
        showNotifyError(err.message)
      });
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === "image" || name === "icon") {
      setNewCategory({
        ...newCategory,
        [name]:
          BASE_URL +
          "wwwroot/Uploads/Category/" +
          e.target.files[0].name +
          "/image.png",
      });
      name === "image"
        ? setCategoryImage(e.target.files[0])
        : setCategoryIcon(e.target.files[0]);
    }
    // setTimeout(() => {
    //   console.log(newCategory);
    // }, 2555);
  };

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });

    if (rows.find((x) => x.name === value) == undefined) setHelperText("");
    else setHelperText("name is already Exist");

    // setTimeout(() => {
    //   console.log(newCategory);
    // }, 2555);
  };

  const validate = () => {
    let temp = {};
    //eslint-disable-next-line
    helperText == ""
      ? (temp.name = newCategory.name !== "" ? "" : "Required")
      : (temp.name = helperText);
    temp.image = newCategory.image !== defaultImage ? "" : "Image Required";
    temp.icon = newCategory.icon !== defaultImage ? "" : "Icon Required";
    setHelperText(temp.name);
    return Object.values(temp).every((x) => x == "");
  };

  const onImageUpload = () => {
    // Create an object of formData
    const imageData = new FormData();

    // Update the imageData object
    imageData.append("myFile", categoryImage, categoryImage.name);

    // Details of the uploaded file
    // console.log(categoryImage);

    // Request made to the backend api
    // Send imageData object
    axios.post(BASE_URL + "api/Category/UploadImage", imageData);
  };

  const onIconUpload = () => {
    // Create an object of formData
    const iconeData = new FormData();

    // Update the iconeData object
    iconeData.append("myFile", categoryIcon, categoryIcon.name);

    // Details of the uploaded file
    // console.log(categoryIcon);

    // Request made to the backend api
    // Send iconeData object
    axios.post(BASE_URL + "api/Category/UploadImage", iconeData);
  };

  const saveCategory = () => {
    setWaitSave(true);
    setConnecting(true)
    // console.log(newCategory);
    if (validate()) {
      onImageUpload();
      onIconUpload();
      createAPIEndpoint("Category")
        .post(newCategory)
        .then((res) =>{ 
    setWaitSave(false);
    setConnecting(false);
    showNotify("Category has been added succesfully")})
        .catch((err) => {
          console.log(err);
          showNotifyError(err.message)
        });
    }
  };

  React.useLayoutEffect(() => {
    setLoading(true);
    createAPIEndpoint("Category")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setCategory(res.data)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
       
      });
  }, []);

  const columns = [
    {
      field: "actions",
      type: "actions",
      getActions: (p) => [
        <GridActionsCellItem
          icon={<HighlightOffIcon sx={{ color: "red" }} />}
          label="Delete"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to delete (${p.row.name}) from Category Table ?`,
              confirmAction: () => DeleteCategory(p.row.id),
              object: JSON.stringify(p.row),
            })
          }
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="success" />}
          label="Edit"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to Save Your Changes  to Category Table ?`,
              confirmAction: () => saveChange(p),
              object: JSON.stringify(p.row),
            })
          }
        />,
      ],
    },
    { field: "id", type: "number", headerName: "id", width: 90 },
    {
      field: "imag",
      headerName: "Image",
      width: 65,
      renderCell: (p) => <Avatar src={p.row.image} />,
    },

    { field: "name", editable: true, headerName: "Category Name", width: 150 },
    {
      field: "image",
      headerName: "Image URL",
      width: 370,
      editable: true,
    },
    { field: "icon", headerName: "Icon URL", width: 370, editable: true },
    {
      field: "ico",
      headerName: "icon",
      width: 65,
      renderCell: (p) => <Avatar src={p.row.icon} />,
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <ConfirmDialogSlide />

      <Dialog
        // fullWidth={true}
        // maxWidth='false'
        sx={{
          //   backgroundColor:"#121212bd"
          letterSpacing: "0.19em",
          fontWeight: 550,
        }}
        onClose={() => {
          showAddDialog(false);
        }}
        open={dialog}
      >
        <Box>
          <Card
            sx={{
              // maxWidth:window.innerWidth,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <CardHeader sx={{ textAlign: "center" }} title={newCategory.name} />
            <Tooltip placement="top" arrow title="Add Product Image">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <CardMedia
                  component="img"
                  // height="194"
                  width={343}
                  // sx={{
                  //    maxWidth:window.innerWidth,
                  // }}
                  image={
                    categoryImage !== defaultImage
                      ? URL.createObjectURL(categoryImage)
                      : categoryImage
                  }
                  alt="Category image"
                />

                <input
                  hidden
                  onChange={handleChange}
                  name="image"
                  type="file"
                />
              </IconButton>
            </Tooltip>
            <CardContent>
              <TextField
                error={helperText == "" ? false : true}
                required
                fullWidth
                label="Category Name"
                name="name"
                value={newCategory.name}
                onChange={handleChangeName}
                variant="filled"
                color="secondary"
                focused
                helperText={helperText}
              />
            </CardContent>
            <Tooltip placement="bottom" arrow title="Add category icon">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <Avatar
                  height="144"
                  width="144"
                  src={
                    categoryIcon !== defaultImage
                      ? URL.createObjectURL(categoryIcon)
                      : categoryIcon
                  }
                />
                <input hidden onChange={handleChange} name="icon" type="file" />
              </IconButton>
            </Tooltip>
            <CardContent fullwidth="true">
              <Box sx={{ width: "99%", textAlign: "center" }}>
                <LoadingButton
                  onClick={saveCategory}
                  loading={waitSave}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="coutained"
                >
                  save
                </LoadingButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Dialog>

      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          variant="countained"
          onClick={() => showAddDialog(true)}
          startIcon={<AddBoxIcon />}
        >
          Add Category
        </Button>
        <LoadingButton
          onClick={refresh}
          loading={sync}
          loadingPosition="start"
          startIcon={<SyncIcon />}
          variant="countained"
        >
          Refresh
        </LoadingButton>
      </Stack>
      <DataGrid
        autoHeight
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(r) => r.id}
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        pageSize={9}
        rowsPerPageOptions={[5, 9, 18, 100]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
