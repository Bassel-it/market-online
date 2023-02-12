import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from './Card';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';


const style={fontSize:175 }

export const adminList=[
  {header:"Category",icon:<CategoryOutlinedIcon color='primary' sx={style} />},
  {header:"Product",icon:<LocalMallOutlinedIcon color='primary' sx={style}/>},
  {header:"Favorite",icon:<FavoriteBorderOutlinedIcon color='secondary' sx={style}/>},
  {header:"Message",icon:<MailOutlineOutlinedIcon color='primary' sx={style}/>},
  {header:"Notification",icon:<NotificationsActiveOutlinedIcon color='primary' sx={style}/>},
  {header:"User",icon:<PersonOutlineIcon color='primary' sx={style}/>},
  
]


function Main() {
  return (
    <Box sx={{ flexGrow: 1, p:{md:12,xs:3} }}>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12 }}>
      {adminList.map((item, index) => (
        <Grid xs={2} sm={4} md={4} key={index}>
         
              <Card
              header={item.header}
              icon={item.icon}
              
              />
              
        </Grid>
      ))}
    </Grid>
  </Box>
  )
}

export default Main