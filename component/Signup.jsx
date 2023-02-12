import React ,{useState,useEffect, useRef, useLayoutEffect}from 'react'
import {  NavLink, useNavigate } from 'react-router-dom'
import { createAPIEndpoint ,ENDPOINTS } from '../api'
import { useStateContext } from '../hooks/useStateContext';
import { Alert, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box } from '@mui/system';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CountrySelect from './Country';

function Signup() {

const [open,setOpen]=useState(false)
const {setUser,setLoggedin,showNotify,showNotifyError,setConnecting,code,setHeaderImage}=useStateContext();
const [errors, setErrors] = useState({email:'',password:'',repassword:'',firstName:'',lastName:'',age:'',phoneNumber:''});
const [errorsignup,setErrorsignup]=useState('')
const [member,setMember]=useState({email:'',password:'',firstName:'',lastName:'',age:'',phoneNumber:''})
const navigate=useNavigate();
const rePassRef=useRef();

const handleInputChange = e => {
  const {name,value } = e.target
  name=='phoneNumber'?
  code==''?showNotifyError("Choose a country"):
  setMember({
      ...member,
      [name]: value
  }):setMember({
    ...member,
    [name]: value
})
  // console.log(name,value,member,code);
}
const validate = () => {
  let temp = {}
  
  temp.phoneNumber=code==""?"Choose a country":
  member.phoneNumber==''&&'Phone Num Required';

  temp.email = (/\S+@\S+\.\S+/).test(member.email) ? "" : "Email is not valid."
 //eslint-disable-next-line
  temp.password = member.password.length >= 8 ? "" : "password to short"
  temp.repassword=rePassRef.current.value!==""?errors.repassword:"Required"
  temp.firstName=member.firstName!==""?"":"Required"
  temp.lastName=member.lastName!==""?"":"Required"
  temp.age=member.age!==""?"":"Required"
  
  
  // console.log(user.password.length);
  setErrors(temp)
  return Object.values(temp).every(x => x == "")
}

const DisplayAge=()=>{
  let k=[10]
  let i=11
  while (i<150) {
    k=[...k,i++]
  }
  // console.log(k);
  let agelist=k.map(a=>  
    <MenuItem  key={a} value={a}>{a}</MenuItem>
    )
    return agelist
}



const signup = e => {
  e.preventDefault();
  if (validate())
      createAPIEndpoint(ENDPOINTS.user)
          .post(member)
          .then(res => {
                setUser(res.data)
               localStorage.setItem('user',JSON.stringify(res.data));
                setLoggedin(true);
                setConnecting(false);
                showNotify(`Welcome ${member.firstName+" "+  member.lastName} `);
                navigate('/');
              

          })
          .catch(err => {setErrorsignup(err.response.data);console.log(err);setConnecting(false)});else setConnecting(false)
  

}

useEffect(()=>{setMember({
  ...member,
  phoneNumber:code
});
},[code])

 useLayoutEffect(()=>
setHeaderImage("")
,[])

  return (

  // <UploadImage/>
    <Box className='loginbody all'>
      <Box className="box"
       sx={{justifyContent:"center", mt : "6rem",width :{md: "866px"} , height :{md: "866px",xs:"1333px"}}}>

		<form noValidate autoComplete="on"  onSubmit={(e)=>{setConnecting(true); signup(e)}}
    >
      
			<h2>Sign up</h2>

      {/* field */}
			<Box  className="inputBox">
				<input type="text"
         name='email' 
         value={member.email}
         onChange={handleInputChange}
         required/>
				<span>Email</span>
				<i></i>
			</Box>
      {errors.email!=''&&
      <Alert severity="error">{errors.email}</Alert>}

<Box sx={{display : "flex", flexDirection:{xs:"column" ,md:'row'} , justifyContent:"space-between"}}>

  {/* field */}
<Box style={{display :"flex" ,flexDirection:"column"}}>
			<Box className="inputBox">
				<input type="password"
         name='password' 
         value={member.password}
         onChange={handleInputChange}
          required/>
				<span>Password</span>
				<i></i>
			</Box>
      {errors.password!=''&&
      <Alert severity="error">{errors.password}</Alert>}
			</Box>

  {/* field */}
  <Box style={{display :"flex" ,flexDirection:"column"}}>
  <Box className="inputBox">
				<input type="password"
         name='repassword'    
         ref={rePassRef}
        onChange={e=>{e.target.value.length==0?setErrors({...errors,repassword :"Required"}):e.target.value!=member.password?
          setErrors({...errors,repassword :"match error"}):setErrors({...errors,repassword :""})}}
         required
         />
				<span>Repeat Password</span>
				<i></i>
			</Box>
      {errors.repassword!=''&&
      <Alert severity="error">{errors.repassword}</Alert>}
      </Box>
</Box>
<Box sx={{display : "flex", flexDirection:{xs:"column" ,md:'row'} , justifyContent:"space-between"}}>

  {/* field */}
<Box style={{display :"flex" ,flexDirection:"column"}}>

  <Box className="inputBox">
				<input type="text"
         name='firstName' 
         required="required"

         value={member.firstName}
        onChange={handleInputChange}
         />
         <span>First Name  </span>
				<i></i>
			</Box>
      {errors.firstName!=''&&
      <Alert severity="error">{errors.firstName}</Alert>}
      </Box>

  {/* field */}
<Box style={{display :"flex" ,flexDirection:"column"}}>
  <Box className="inputBox">
				<input type="text"
         name='lastName' 
         value={member.lastName}
         required="required"
         onChange={handleInputChange}
        />
				<span>Last Name  </span>
				<i></i>
			</Box>
      {errors.lastName!=''&&
      <Alert severity="error">{errors.lastName}</Alert>}
</Box>
</Box>
<Box sx={{display : "flex", flexDirection:{xs:"column" ,md:'row'} , justifyContent:"space-between"}}>

  {/* field */}
<Box  style={{display :"flex" ,flexDirection:"column", marginTop:"33px"}}>
  <InputLabel  id="demo-simple-select-label" ><Typography color='cyan'>Age</Typography>  </InputLabel>
        <Select sx={{width :150 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={member.age}
          name='age'
          label='Age'
          onChange={handleInputChange}
          
         variant='filled'
         color='warning'
        >
          {DisplayAge()}
        </Select>

      {errors.age!=''&&
      <Alert severity="error">{errors.age}</Alert>}
      </Box>
  {/* field */}
<Box style={{display :"flex" ,flexDirection:"column"}}>
  <Box className="inputBox" >
  <CountrySelect/>
				<input type="text"
         name='phoneNumber' 
         value={member.phoneNumber}
         required="required"
         onChange={handleInputChange}
         
         />
				<span>Phone Number </span>
				<i></i>
			</Box>
      {errors.phoneNumber!=''&&
      <Alert severity="error">{errors.phoneNumber}</Alert>}
</Box>
</Box>
  {/* field */}
  
			<Box className="links" style={{ justifyContent : "right"}}>
				<NavLink to="/login">Sign in</NavLink>
			</Box>
			<input type="submit" value="Sign up"/>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={()=>setOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {errorsignup!=''&&
      <Stack sx={{mt:5}}>
      <Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  {errorsignup} <strong>check it out!</strong>
</Alert></Stack>}
		</form>
  

	</Box></Box>
)
}

export default Signup