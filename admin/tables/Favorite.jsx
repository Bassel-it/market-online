import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem,GridToolbar } from "@mui/x-data-grid";
import { createAPIEndpoint } from "../../api";
import { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  getBackgroundColor,
  getHoverBackgroundColor,
  getSelectedBackgroundColor,
  getSelectedHoverBackgroundColor,
} from "../StylingFunc";
import { styled } from "@mui/material/styles";
import { useStateContext } from "../../hooks/useStateContext";
import ConfirmDialogSlide from "../ConfirmDialog";

export default function Favorite() {
  const {  showConfirmDialog , showNotify, showNotifyError,setConnecting} = useStateContext();
 
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState(false);
  const [newFavorite, setNew] = useState([]);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--category": {
      backgroundColor: getBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.info.main,
            theme.palette.mode
          ),
        },
      },
    },
    "& .super-app-theme--product": {
      backgroundColor: getBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode
          ),
        },
      },
    },
  }));

  const addFavorite = () => {
    let n;
    if (rows.length == 0) n = 0;
    else n = rows[rows.length - 1].id + 1;

    setNew(
      [...newFavorite, n],
      setRows([...rows, { id: n, itemType: "", itemId: "", userId: 1 }])
    );
  };

  const refresh = () => {
    setSync(true);
    createAPIEndpoint("Favorite")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setNew([]);
        setSync(false);
      })
      .catch((err) => console.log(err));
  };

  const DeleteFavorite = (id) => {
    setConnecting(true);
    if (newFavorite.find((x) => x == id) == undefined)
      createAPIEndpoint("Favorite")
        .delete(id)
        .then((res) => {
    setConnecting(false);
    setNew(newFavorite.filter((n) => n !== id));
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    showNotify("Delete Successfully")
  })
        .catch((err) => {
          console.log(err);
          showNotifyError(err.message);
        });

   
  };

  const saveChange = (p) => {
    setConnecting(true);
    if (newFavorite.find((x) => x == p.row.id) == undefined) {
      // console.log("new", p);
      let pr = rows.find((x) => x.id == p.row.id);
      // console.log("old", pr);
     if( pr == p.row)
        {
    setConnecting(false);
    showNotify("no change detected")}
        else createAPIEndpoint("Favorite")
            .put(p.row.id, p.row)
            .then((res) => {
    setConnecting(false);
    showNotify("Update Successfully")})
            .catch((err) => console.log(err));
    } else {
      let n = {
        itemId: p.row.itemId,
        itemType: p.row.itemType,
        userId: p.row.userId,
      };
      createAPIEndpoint("Favorite")
        .post(n)
        .then((res) => {
          setNew(newFavorite.filter((ne) => ne !== p.row.id));
          showNotify("Row has been added succesfully");
    setConnecting(false);

        })
        .catch((err) => {
          console.log(err);
          showNotifyError(err.message)
        });
    }
  };

  React.useLayoutEffect(() => {
    setLoading(true);
    createAPIEndpoint("Favorite")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch((err) =>{
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
              text: `Do you want to delete row with ID: (${p.row.id}) from Favorite Table ?`,
              confirmAction: () => DeleteFavorite(p.row.id),
              object: JSON.stringify(p.row)

            })
          }
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="success" />}
          label="Edit"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to Save Your Changes  to Favorite Table ?`,
              confirmAction: () => saveChange(p),
              object: JSON.stringify(p.row)
            })
          }
        />,
      ],
    },
    { field: "id", type: "number", headerName: "id", width: 90 },
    {
      field: "itemType",
      headerName: "item type",
      editable: true,
      type:'singleSelect',
      valueOptions:['product','category'],
      width: 150,
      
    },
    { field: "itemId", headerName: "item ID",type: "number", editable: true, width: 90 },
    {
      field: "userId",
      type: "number",
      headerName: "User Id",
      editable: true,
      width: 90,
    },
  ];
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <ConfirmDialogSlide />
     
      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          variant="countained"
          onClick={addFavorite}
          startIcon={<GradeOutlinedIcon sx={{ color: "yellow" }} />}
        >
          Add Favorite
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

      <StyledDataGrid
        autoHeight
        // pagination
        // components={{
        //   Pagination:()=>     <Pagination count={10} color="secondary" />

        // }}
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(r) => r.id}
        rows={rows}
        columns={columns}
      components={{ Toolbar: GridToolbar }}

         pageSize={9}
        rowsPerPageOptions={[5, 9, 18,100]}
        checkboxSelection
        disableSelectionOnClick
        getRowClassName={(params) => `super-app-theme--${params.row.itemType}`}
      />
    </Box>
  );
}
