import { Box, Button, CardMedia, Stack } from "@mui/material";
import React from "react";
import m404 from "../image/m404.png";
import d404 from "../image/d404.png";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  return (
   <Stack direction='column'>
      <CardMedia
      component='img'
      // width='100%'
      // height='100%'
      image={d404}
      sx={{display:{md:"block",xs:'none'}}}
      loading="lazy"
      /> 
      <CardMedia
      component='img'
      // width='100%'
      height='100%'
      image={m404}
      sx={{display:{xs:"block",md:'none'}}}
      loading="lazy"
      />
      <Button
        size="medium"
        onClick={() => navigate("/")}
        variant="contained"
        sx={{m:'2% 30%'}}
      >
        Homepage
      </Button>
      </Stack>  );
}

export default PageNotFound;
