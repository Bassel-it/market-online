import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem,GridToolbar } from "@mui/x-data-grid";
import { BASE_URL, createAPIEndpoint } from "../../api";
import { useState } from "react";
import { Avatar } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SaveIcon from "@mui/icons-material/Save";
import SyncIcon from "@mui/icons-material/Sync";
import { Stack } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import { useStateContext } from "../../hooks/useStateContext";
import ConfirmDialogSlide from "../ConfirmDialog";



export default function User() {
  const { showNotify, showConfirmDialog,setConnecting,showNotifyError,user } = useStateContext();
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState(false);
 

  const refresh = () => {
    setSync(true);
    createAPIEndpoint("Member/admin/getUnprotectedMember")
      .post(user)
      .then((res) => {
        setRows(res.data);
        setSync(false);
      })
      .catch((err) => console.log(err));
  };

  const DeleteUser = (id)=>{
    setConnecting(true);
    // console.log(id);
    createAPIEndpoint("Member")
      .delete(id)
      .then((res) =>{
    setConnecting(false);
    setRows((prevRows) => prevRows.filter((row) => row.memberId !== id));  
      showNotify("Delete Successfully")
    })
      .catch((err) =>{
        console.log(err);
        showNotifyError(err.response.data)
      });
    
    }

    const saveChange = (p) => {
      // console.log("new", p);
    setConnecting(true);
    let pr = rows.find((x) => x.memberId == p.row.memberId);
      // console.log("old", pr);
      pr == p.row
        ? showNotify("no change detected")
        : createAPIEndpoint("Member")
            .put(p.row.memberId, p.row)
            .then((res) =>  {
              setConnecting(false);
              showNotify("Update Successfully")})
            .catch((err) =>{
              console.log(err);
          showNotifyError(err.message)
        });
    };

 


  



    React.useLayoutEffect(() => {
      setLoading(true);
      createAPIEndpoint("Member/admin/getUnprotectedMember")
        .post(user)
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
          icon={<PersonRemoveIcon sx={{ color: "red" }} />}
          label="Delete"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to delete (${p.row.firstName} ${p.row.lastName} ) from User Table ?`,
              confirmAction: () =>  DeleteUser(p.row.memberId),
              object: JSON.stringify(p.row)

            })
          }
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="success" />}
          label="Edit"
          onClick={() =>
            showConfirmDialog({
              text: `Do you want to Save Your Changes  to User Table ?`,
              confirmAction: () => saveChange(p),
              object: JSON.stringify(p.row)
            })
          }
        />,
      ],
    },
    { field: "imag", headerName: "Image", renderCell:(p)=><Avatar src={BASE_URL+ p.row.image}/>  },

    { field: "memberId", headerName: "ID", width: 70 },
    { field: "firstName",editable:true ,headerName: "First Name", width: 120 },
    { field: "lastName",editable:true , headerName: "Last Name", width: 120 },
    { field: "birthday",editable:true ,type:'dateTime', headerName: "Birthday", width: 150,valueFormatter:(p)=>{return p.value.slice(0, p.value.indexOf("T"))} },
    { field: "lastLogin" ,type:'dateTime', headerName: "Last Login", width: 250,
    valueFormatter: (p) => {
      return (
        p.value.slice(0, p.value.indexOf("T")) +
        " at " +
        p.value.slice(p.value.indexOf("T") + 1, p.value.length - 7)
      );
    }, },

    { field: "age",editable:true ,type:'number', headerName: "Age", width: 70 },
    { field: "email",editable:true , headerName: "Email", width: 190 },
    { field: "password",editable:true, headerName: "Password", width: 120 },
    { field: "emailConfirmed",type:'boolean', headerName: "Confirmed", width: 90 },
    { field: "phoneNumber",editable:true , headerName: "Phone", width: 120 },
    { field: "image",editable:true , headerName: "Image Url", width: 450,valueGetter:(p)=>{return p.row.image}},
    { field: "address",editable:true , headerName: "Address", width: 190 },
    { field: "classification",editable: true,
    type:'singleSelect',
    valueOptions:['boss','admin','quest'], headerName: "Classification", width: 90 },
    { field: "gender",editable: true,
    type:'singleSelect',
    valueOptions:['male','female','other'], headerName: "Gender", width:80 },
    

  ];
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <ConfirmDialogSlide />
      <Stack direction="row" spacing={2}>
        {/* <Button
          size="small"
          variant="countained"
          onClick={() => showAddDialog(true)}
          startIcon={<PersonAddAltRoundedIcon />}
        >
          Add User
        </Button> */}
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
      components={{ Toolbar: GridToolbar }}

       experimentalFeatures={{ newEditingApi: true }} 
        getRowId={(r) => r.memberId}
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[5, 9, 18,100]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
