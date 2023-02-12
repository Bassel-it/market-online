import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { createAPIEndpoint } from "../../api";
import { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
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

export default function Message() {
  const { showNotify, showNotifyError, setConnecting, showConfirmDialog } =
    useStateContext();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState(false);
  const [newMessage, setNew] = useState([]);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--true": {
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
    "& .super-app-theme--false": {
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

  const addMessage = () => {
    let n;
    if (rows.length == 0) n = 0;
    else n = rows[rows.length - 1].id + 1;
    let d = new Date().toISOString();

    setNew(
      [...newMessage, n],
      setRows([
        ...rows,
        {
          userId: 1,
          from: 2,
          details: "",
          open: false,
          title: "",
          id: n,
          time: d,
        },
      ])
    );
  };

  const refresh = () => {
    setSync(true);
    createAPIEndpoint("Message")
      .fetch()
      .then((res) => {
        setRows(res.data);
        setNew([]);
        setSync(false);
      })
      .catch((err) => console.log(err));
  };

  const DeleteMessage = (id) => {
    setConnecting(true);
    if (newMessage.find((x) => x == id) == undefined)
      createAPIEndpoint("Message")
        .delete(id)
        .then((res) => {
          setNew(newMessage.filter((n) => n !== id));
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          setConnecting(false);
          showNotify("Delete Successfully");
        })
        .catch((err) => {
          console.log(err);
          showNotifyError(err.message);
        });
  };

  const saveChange = (p) => {
    setConnecting(true);

    if (newMessage.find((x) => x == p.row.id) == undefined) {
      // console.log("new", p);
      let pr = rows.find((x) => x.id == p.row.id);
      // console.log("old", pr);
      pr == p.row
        ? showNotify("no change detected")
        : createAPIEndpoint("Message")
            .put(p.row.id, p.row)
            .then((res) => {
              setConnecting(false);
              showNotify("Update Successfully")})
            .catch((err) =>{
              console.log(err);
          showNotifyError(err.message)
        });
    } else {
      let n = {
        userId: p.row.userId,
        details: p.row.details,
        open: p.row.open,
        from: p.row.from,
        title: p.row.title,
        time: p.row.time,
      };
      createAPIEndpoint("Message")
        .post(n)
        .then((res) => {
          setNew(newMessage.filter((ne) => ne !== p.row.id));
              setConnecting(false);
              showNotify("Message Sent succesfully");
        })
        .catch((err) =>{
          console.log(err);
      showNotifyError(err.message)
    });
    }
  };

  React.useLayoutEffect(() => {
    setLoading(true);
    createAPIEndpoint("Message")
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
          Click={() =>
            showConfirmDialog({
              text: `Do you want to delete (${p.row.title}) from Message Table ?`,
              confirmAction: () => DeleteMessage(p.row.id),
              object: JSON.stringify(p.row),
            })
          }
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="success" />}
          label="Edit"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to Save Your Changes  to Message Table ?`,
              confirmAction: () => saveChange(p),
              object: JSON.stringify(p.row),
            })
          }
        />,
      ],
    },

    { field: "id", headerName: "ID", width: 70 },
    { field: "title", editable: true, headerName: "Title", width: 220 },
    {
      field: "userId",
      editable: true,
      type: "number",
      headerName: "User ID",
      width: 90,
    },
    {
      field: "from",
      editable: true,
      type: "number",
      headerName: "Sender Id",
      width: 220,
    },

    {
      field: "open",
      type: "boolean",
      editable: true,
      headerName: "Opened",
      width: 90,
    },

    { field: "details", editable: true, headerName: "Details", width: 370 },
    {
      field: "time",
      type: "dateTime",
      headerName: "Time",
      width: 250,
      valueFormatter: (p) => {
        return (
          p.value.slice(0, p.value.indexOf("T")) +
          " at " +
          p.value.slice(p.value.indexOf("T") + 1, p.value.length - 7)
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <ConfirmDialogSlide />

      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          variant="countained"
          onClick={addMessage}
          startIcon={<SendIcon />}
        >
          Send Message
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
        // autoPageSize
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(r) => r.id}
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        pageSize={9}
        // editMode="cell"
        rowsPerPageOptions={[5, 9, 18, 100]}
        checkboxSelection
        disableSelectionOnClick
        getRowClassName={(params) => `super-app-theme--${params.row.open}`}
      />
    </Box>
  );
}
