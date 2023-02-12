import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useStateContext } from '../hooks/useStateContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialogSlide() {
const {confirmDialog,showConfirmDialog}=useStateContext();
  

  const handleClose = () => {
    showConfirmDialog({text:'',confirmAction:null})
  };

  return (
     
      <Dialog
      maxWidth="true"
      
        open={confirmDialog.text==''?false:true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{confirmDialog.text}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          </DialogContentText>
          Detail : {confirmDialog.object}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={()=> {confirmDialog.confirmAction(); handleClose()}}>Yes</Button>
        </DialogActions>
      </Dialog>
  );
}