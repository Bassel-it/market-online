import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import axios from "axios";
import { FilledInput, Tooltip, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BASE_URL } from "../../api";
import TextField from "@mui/material/TextField";
import { useStateContext } from "../../hooks/useStateContext";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { createAPIEndpoint } from "../../api";
import profileMale from "../../image/profileMale.png";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect } from "react";
import { Box } from "@mui/system";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return  (<Box sx={{width:'100%',display:'flex',justifyContent:'center'}}>
            <IconButton sx={{m:"1% 44%"}}  {...other} /></Box>);
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Profile() {
  // Initially, no file is selected
  const {
    user,
    setUser,
    showNotify,
    showNotifyError,
    setConnecting,
   compressedImage,
    CompressImageFun,setCompressedImage
  } = useStateContext();
  const [selectedImage, setImage] = useState("");
  const [displayImage, setDisplayimage] = useState(
    user.image == null ? profileMale : BASE_URL + user.image
  );
  const [readOnly, setReadOnly] = useState(true);
  const [showPassword, setShowpassword] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    category: "",
    count: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image" && e.target.files[0] != null) {
      CompressImageFun(e.target.files[0],0.4);
      setUserInfo({
        ...userInfo,
        [name]: "wwwroot/Uploads/Users/" + user.email + "/image.png",
      });
      // console.log(e.target.files[0],processImage);
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  //save image to server
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", selectedImage, user.email);

    // Details of the uploaded file
    // console.log(selectedImage);

    // Request made to the backend api
    // Send formData object
    axios
      .post(BASE_URL + "api/Member/UploadImage", formData)
      .catch((err) => console.log(err));
  };

  //save userInfo
  const saveProfile = () => {
    // if (validate()) {
    setConnecting(true);
    selectedImage != "" && onFileUpload();
    createAPIEndpoint("Member")
      .put(user.memberId, userInfo)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        showNotify("Profile update succesfully");
        setConnecting(false);
      })
      .catch((err) => showNotifyError(err.message));
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(()=>{if(compressedImage!=null){
    setImage(compressedImage);
  setDisplayimage(URL.createObjectURL(compressedImage))}
  },[compressedImage])

  useEffect(()=>setCompressedImage(null),[selectedImage])
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          width: 355,
          mt: "66px",
          fontWeight: "600",
          fontSize: "2rem",
          letterSpacing: "0.0938em",
        }}
      >
        <CardHeader
          avatar={
            <Tooltip title="save Profile">
              <IconButton aria-label="save Profile" onClick={saveProfile}>
                <SaveOutlinedIcon sx={{ fontSize: 33 }} />
              </IconButton>
            </Tooltip>
          }
          action={
            <Tooltip title="Edit">
              <IconButton onClick={() => setReadOnly(false)} aria-label="Edit">
                <EditOutlinedIcon sx={{ fontSize: 25 }} />
              </IconButton>
            </Tooltip>
          }
          title={userInfo.firstName + " " + userInfo.lastName}
          subheader={userInfo.email}
        />
        <Tooltip placement="right" arrow title="change profile Image">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{ margin: "1% 9%" }}
          >
            <Avatar
              sx={{ width: 277, height: 277 }}
              alt="Remy Sharp"
              src={displayImage}
            />
            <input
              hidden
              onChange={handleChange}
              name="image"
              type="file"
              // accept="image/*"
              // capture="environment"
            />
          </IconButton>
        </Tooltip>

        <CardContent>
          <TextField
            fullWidth
            id="standard-read-only-firstName"
            label="First Name"
            name="firstName"
            defaultValue={userInfo.firstName}
            onChange={handleChange}
            InputProps={{
              readOnly: readOnly,
            }}
            variant="filled"
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardContent>
          <TextField
            fullWidth
            id="standard-read-only-lastName"
            label="Last Name"
            name="lastName"
            defaultValue={userInfo.lastName}
            onChange={handleChange}
            InputProps={{
              readOnly: readOnly,
            }}
            variant="filled"
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardContent>
          <TextField
            fullWidth
            id="standard-read-only-email"
            label="Email"
            name="email"
            defaultValue={userInfo.email}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardContent>
          <TextField
            fullWidth
            id="standard-read-only-phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            defaultValue={userInfo.phoneNumber}
            onChange={handleChange}
            // InputLabelProps={{
            //     shrink: true,
            //   }}
            InputProps={{
              readOnly: readOnly,
            }}
            type="tel"
            variant="filled"
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardContent>
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              disabled
              id="filled-adornment-password"
              type={showPassword ? "text" : "password"}
              value={userInfo.password}
              // inputProps={{
              //   readOnly: readOnly,
              // }}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowpassword(!showPassword)}
                    //   onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </CardContent>

        <CardContent>
          <TextField
            fullWidth
            id="standard-read-only-input"
            label="Age"
            name="age"
            defaultValue={userInfo.age}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: readOnly,
            }}
            type="number"
            variant="filled"
          />

          {errors.name != "" && (
            <span style={{ color: "red" }}>({errors.name})</span>
          )}
        </CardContent>

        <CardActions sx={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center'}} disableSpacing>
          {/* <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{fontSize:33}} />
          </ExpandMore>
         <Typography> More</Typography>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={4}
              name="address"
              value={userInfo.address == null ? "" : userInfo.address}
              onChange={handleChange}
              InputProps={{
                readOnly: readOnly,
              }}
            />
          </CardContent>

          <CardContent>
            <TextField
              fullWidth
              label="Birthday"
              focused
              name="birthday"
              value={userInfo.birthday != null ? userInfo.birthday : ""}
              onChange={handleChange}
              type="date"
              variant="filled"
              InputProps={{
                readOnly: readOnly,
              }}
            />
          </CardContent>

          <CardContent>
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={userInfo.gender == null ? "" : userInfo.gender}
              variant="filled"
              InputProps={{
                readOnly: readOnly,
              }}
              select
              onChange={handleChange}

              //   helperText="Please select your currency"
            >
              <MenuItem value={"male"}>
                <MaleIcon sx={{ color: "blue" }} /> male
              </MenuItem>
              <MenuItem value={"female"}>
                <FemaleIcon sx={{ color: "pink" }} /> female
              </MenuItem>
              <MenuItem value={"other"}>
                <TransgenderIcon /> other
              </MenuItem>
            </TextField>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
