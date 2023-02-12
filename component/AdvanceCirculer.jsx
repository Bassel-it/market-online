import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { blue, green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedIcon from '@mui/icons-material/Verified';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useStateContext } from '../hooks/useStateContext';


export default function AdvanceCirculer() {
    const {processState}=useStateContext();
    

  const buttonSx = {
    ...(processState.isFinish && {
      bgcolor: blue[500],
      '&:hover': {
        bgcolor: blue[700],
      },
    }),
  };

 

 

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab
          aria-label="save"
          color="primary"
          sx={buttonSx}
        >
          {processState.isFinish ? <VerifiedIcon sx={{ fontSize: 55 }} /> : <InsertPhotoOutlinedIcon />}
        </Fab>
        {!processState.isFinish && (
          <CircularProgress
            size={68}
            sx={{
              color: green[500],
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
     
    </Box>
  );
}