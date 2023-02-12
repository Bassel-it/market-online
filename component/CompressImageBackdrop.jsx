import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { useStateContext } from '../hooks/useStateContext';
import AdvanceCirculer from './AdvanceCirculer';
import { Typography } from '@mui/material';

export default function CompressImageBackdrop() {
  const {processImage,setProcessImage,processState}=useStateContext();
  return (
    <div>
      <Backdrop
        sx={{display:'flex',flexDirection:'column', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={processImage}
        onClick={()=> processState.isFinish&&setProcessImage(false)}
      >
        <AdvanceCirculer/>
        <Typography>{processState.text}</Typography>
      </Backdrop>
    </div>
  );
}