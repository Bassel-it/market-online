import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import BasicSpeedDial from "./BasicSpeedDial";
import { useNavigate } from "react-router-dom";
import { createAPIEndpoint } from "../api";
import { useStateContext } from "../hooks/useStateContext";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";
import { Alert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import { Tooltip } from "@mui/material";
import Stack from "@mui/material/Stack";
import company from "../image/company.jpg";

function srcset(image, width, height, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function Category() {
  const navigate = useNavigate();
  const {
    loading,
    setLoading,
    category,
    setCategory,
    loggedin,
    user,
    showNotify,
    showNotifyError,
    setHeaderImage,
    headerImage
  } = useStateContext();
  const [error, setError] = React.useState("");
  const [fav, setfav] = React.useState([]);

  const UpdateFavorite = (e) => {
    let rec = {
      itemType: "category",
      itemId: e.id,
      userId: user.memberId,
    };
    fav.some((x) => x.itemId == e.id)?
     createAPIEndpoint("Favorite")
          .deleteByContent(rec)
          .then((res) => {showNotify("Removed successfully");setfav(prev=>prev.filter(x=>x.itemId!=e.Id))})
          .catch((err) => {
            console.log(err);
            showNotifyError(err.message);
          })
      : createAPIEndpoint("Favorite")
          .post(rec)
          .then((res) => {
            showNotify("Added successfully");
            setfav([...fav, rec]);
          })
          .catch((err) => {
            showNotifyError(err.response.data);
          });
    navigate("/");
  };

  

  React.useLayoutEffect(() => {
    setHeaderImage(company);
    createAPIEndpoint("Category")
      .fetch()
      .then((res) => {
        setCategory( res.data);
        localStorage.setItem("category", JSON.stringify(res.data));
        !loggedin&&
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err);
      });
      if(loggedin){
        // console.log(cat);
        
      createAPIEndpoint("Favorite/category")
        .fetchById(user.memberId)
        .then((res) => setfav(res.data))
        .catch((err) => console.log(err));}
  }, []);

  React.useLayoutEffect(()=>{
  if(loggedin){
    let catfav=[];  
    fav.map((x)=>catfav=[...catfav,category.find(c=>c.id==x.itemId)]);
    catfav.length==0?
    catfav=category:
    category.map((c)=>{if(!catfav.includes(c))catfav=[...catfav,c]})

    setCategory(catfav)
    localStorage.setItem("category", JSON.stringify(catfav));
    setLoading(false);

  }}
  ,[fav])

  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={headerImage}
                  style={{
                    width: "95%",
                    borderRadius: "12px",
                    marginTop: "11px",
                  }}
                  loading='lazy'
                />
              </Box>
      {loggedin && <BasicSpeedDial />}
      <ImageList
        sx={{
          width: "100%",
          height: "100%",
          // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
          transform: "translateZ(0)",
          cursor: "pointer",
        }}
        rowHeight="auto"
        gap={7}
      >
        {error != "" && (
          <Stack sx={{ mt: 5 }}>
            <Alert severity="error">
              <AlertTitle>{error}</AlertTitle>
              <strong>check it out!</strong>
            </Alert>
          </Stack>
        )}

        {category.length != 0 &&
          category.map((item) => {
            const inFav=fav.some((x) => x.itemId == item.id);
            const cols = inFav ? 2 : 1;
            const rows = inFav ? 1 : 1;

            return (
              <React.Fragment key={item.image}>
                {!loading ? (
                  <ImageListItem cols={cols} rows={3}>
                    <img
                      style={{ borderRadius: "12px" }}
                      onClick={() => {
                        navigate(`/product/${item.name}`);
                      }}
                      {...srcset(item.image, 250, 250, rows, cols)}
                      alt={item.name}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      sx={{
                        borderRadius: "12px",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      title={item.name}
                      position="bottom"
                      actionIcon={
                        loggedin && (
                          <Tooltip
                            title={
                              inFav
                                ? "Remove from Favorite"
                                : "Add to Favorite"
                            }
                            arrow
                          >
                            <IconButton
                              sx={{ color: "white" }}
                              aria-label={`star ${item.name}`}
                              onClick={() => UpdateFavorite(item)}
                            >
                              {inFav ? (
                                <StarIcon sx={{ color: "#45f3ff" }} />
                              ) : (
                                <StarBorderIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        )
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ) : (
                  <Box>
                    <Skeleton
                      sx={{ height: 450, m: 2, backgroundColor: "#b38d8d45" }}
                      animation="wave"
                      variant="rectangular"
                    />
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6, backgroundColor: "#b38d8d45" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6, backgroundColor: "#b38d8d45" }}
                    />
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6, backgroundColor: "#b38d8d45" }}
                    />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
      </ImageList>
    </>
  );
}
