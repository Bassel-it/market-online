import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { BASE_URL, createAPIEndpoint } from "../../api";
import { useState } from "react";
import { Avatar } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import AddProduct from "../../component/AddProduct";
import ConfirmDialogSlide from "../ConfirmDialog";
import { useStateContext } from "../../hooks/useStateContext";

export default function Product() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState(false);
  const [dialog, showAddDialog] = useState(false);
  const { showNotify, showConfirmDialog,showNotifyError, setConnecting} = useStateContext();

  const refresh = () => {
    setSync(true);
    createAPIEndpoint("Product")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setSync(false);
      })
      .catch((err) => console.log(err));
  };

  const DeleteProduct = (id) => {
    setConnecting(true);
    // console.log(id);
    createAPIEndpoint("Product")
      .delete(id)
      .then((res) => {
        setRows((prevRows) => prevRows.filter((row) => row.productId !== id));
    setConnecting(false);
    showNotify("Delete Successfully");
      })
      .catch((err) => {
        console.log(err);
      showNotifyError(err.message)
      });
  };

  const saveChange = (p) => {
            setConnecting(true);
            // console.log("new", p);
    let pr = rows.find((x) => x.productId == p.row.productId);
    // console.log("old", pr);
    pr == p.row
      ? showNotify("no change detected")
      : createAPIEndpoint("Product")
          .put(p.row.productId, p.row)
          .then((res) => {
            setConnecting(false);
            showNotify("Update Successfully")})
          .catch((err) =>{
            console.log(err);
        showNotifyError(err.message)
      });
  };

  React.useLayoutEffect(() => {
    setLoading(true);
    createAPIEndpoint("Product")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
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
              text: `Do you want to delete ${p.row.name} from Product Table ?`,
              confirmAction: () => DeleteProduct(p.row.productId),
              object: JSON.stringify(p.row)

            })
          }
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="success" />}
          label="Edit"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to Save Your Changes  to Product Table ?`,
              confirmAction: () => saveChange(p),
              object: JSON.stringify(p.row)
            })
          }
        />,
      ],
    },
    {
      field: "imag",
      headerName: "Image",
      renderCell: (p) => <Avatar src={BASE_URL+ p.row.image} />,
    },

    { field: "productId", headerName: "ID", width: 70 },
    { field: "name", editable: true, headerName: "Name", width: 120 },
    {
      field: "price",
      editable: true,
      headerName: "Price",
      type: "number",
      width: 120,
    },
    { field: "ownerId", editable: true, headerName: "Owner ID", width: 90 },

    {
      field: "count",
      type: "number",
      editable: true,
      headerName: "Count",
      width: 70,
    },
    { field: "category", editable: true, headerName: "Category", width: 190 },
    {
      field: "available",
      type: "boolean",
      editable: true,
      headerName: "Available",
      width: 90,
    },
    {
      field: "feature",
      type: "boolean",
      editable: true,
      headerName: "Feature",
      width: 90,
    },

    {
      field: "image",
      headerName: "Image Url",
      editable: true,
      width: 450,
    },
    { field: "details", editable: true, headerName: "Details", width: 70 },
  ];
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <ConfirmDialogSlide />
      <Dialog
        // fullWidth={true}
        maxWidth='false'
        sx={{
            // backgroundColor:"#121212bd"
            zIndex:(theme) => theme.zIndex.drawer +1 ,
          letterSpacing: "0.19em",
          fontWeight: 550,
        }}
        onClose={() => {
          showAddDialog(false);
        }}
        open={dialog}
      >
        <AddProduct admin={true} />
      </Dialog>
      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          variant="countained"
          onClick={() => showAddDialog(true)}
          startIcon={<AddBoxIcon />}
        >
          Add Product
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
      components={{ Toolbar: GridToolbar }}
        autoHeight
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(r) => r.productId}
        rows={rows}
        columns={columns}
        pageSize={9}
        // editMode="cell"
        rowsPerPageOptions={[5, 9, 18,100]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
