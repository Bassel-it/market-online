import * as React from "react";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import { useStateContext } from "../hooks/useStateContext";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  createTheme,
  CssBaseline,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import iconic from "../image/iconic.png";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

export default function SideBar() {
  const { sideBar, setSidebar, category, mode } = useStateContext();
  const navigate = useNavigate();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: mode,
          // primary: { main: "rgb(102, 157, 246)" },
          background: {
            paper:mode=='dark'? "rgb(5, 30, 52)":"rgb(120, 102, 246)",
            
          },
          text: { primary:mode=='dark'? "rgb(102, 157, 246)":"rgb(5, 30, 52)"},
        },
        typography: {
          fontFamily: '"Roboto"',
        },
      })}
    >
      <CssBaseline />
      <Slide in={sideBar} direction="right">
        
        <div
          style={{
            position: 'absolute',
            width: "100%",
            backgroundColor: mode=='dark'? "rgb(5, 30, 52, 0.9)":"rgb(102, 157, 246, 0.9)",
            display: "flex",
            flexDirection: "column",
            zIndex: "9999",
          }}
        >
          <Slide
            in={sideBar}
            direction="up"
            style={{ transformOrigin: "0 0 0" }}
            {...(sideBar ? { timeout: 1000 } : {})}
          >
            <IconButton onClick={() => setSidebar(false)}>
              <img
                style={{ width: 59, height: 59 }}
                alt="iconic"
                src={iconic}
              />
            </IconButton>
          </Slide>
          <Box sx={{ flexGrow: 1, p: { md: 12, xs: 3 } }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              // columns={{ xs: 12, sm: 8, md: 12 }}
            >
              {category.map((item) => (
                <Grid item xs={4} sm={4} md={4} key={item.name}>
                  <Card
                    onClick={() => {navigate(`/Product/${item.name}`);setSidebar(false)}}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "15px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height:173
                    }}
                  >
                    <CardHeader
                      title={
                        <Typography
                          sx={{ textAlign: "center" }}
                          variant="h6"
                          gutterBottom
                        >
                          {item.name}
                        </Typography>
                      }
                    />
                    <CardContent
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar 
              sx={{ width: 69, height: 69 }}
                      variant="square"
                      src={item.icon} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* Conditionally applies the timeout prop to change the entry speed. */}
        </div>
        
      </Slide>
    </ThemeProvider>

    
  );
}
