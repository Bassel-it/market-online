import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon, Paper, Tooltip } from '@mui/material';
import {  useNavigate } from 'react-router-dom';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function DisplayCard({header,icon}) {
 const navigate=useNavigate()

  return (
    <Card onClick={()=> navigate(`/${header}Table`)}
    sx={{cursor:"pointer",borderRadius:'15px', display:"flex",flexDirection:"column",justifyContent:"center"}}
    >
      <CardHeader
      
       
        title={<Typography sx={{textAlign:"center"}} variant="h3" gutterBottom>
        {header}
      </Typography>}
       
      />
      {/* <IconButton> */}
      <CardContent sx={{width:"100%",display:"flex",justifyContent:"center"}} >
        
        {icon}
        
        </CardContent >
      {/* </IconButton> */}
      
     
    </Card>
  );
}