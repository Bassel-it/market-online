import React, {  useState } from 'react';
import { createAPIEndpoint } from '../api'; 
import { useStateContext } from "../hooks/useStateContext";
import User from './tables/User' 



function EHLA() {
const {showNotifyError}=useStateContext();
const [admin,setAdmin]=useState({email:"",password:""});
const [text,setText]=useState({plainText:"",encryptText:""});
const [key,setKey]=useState('');


const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  const changeText = (e) => {
    const { name, value } = e.target;
    setText({
      ...text,
      [name]: value,
    });
  };

  const access = (e) => {
   
    e.preventDefault();
      createAPIEndpoint("Member/EHLA")
        .post(admin)
        .then((res) => {
          setKey(res.data.password)
        })
        .catch((err) => {
         
         showNotifyError("Access Denied")
         console.log(err);
        });

  };

  const encrypt = (e) => {
   
    e.preventDefault();
    text.plainText!==''&&
      createAPIEndpoint("Member/EHLA/Encrypt")
        .post({password:text.plainText,email:"admin"})
        .then((res) => {
          setText({...text,encryptText:res.data})
        })
        .catch((err) => {
          console.log(err);
        });

  };

  const UnEncrypt = (e) => {
   
    e.preventDefault();
    text.encryptText!==''&&
      createAPIEndpoint("Member/EHLA/UnEncrypt")
        .post({password:text.encryptText,email:"admin"})
        .then((res) => {
          setText({...text,plainText:res.data})
        })
        .catch((err) => {
          console.log(err);
        });

  };


  return (
    <div style={{textAlign:'center', display:"flex",flexDirection:"column",backgroundColor:"rgb(5, 30, 52)",color:"rgb(102, 157, 246)"}}>
        <div >

         <div >
            <span>Email</span>
            <input
              type="text"
              name="email"
              value={admin.email}
              onChange={handleInputChange}
              required="required"
            />
            <i></i>
          </div>
          <div >
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={admin.password}
              onChange={handleInputChange}
              required="required"
            />
            <i></i>
          </div>
          <input type="submit" value="Access" onClick={access} />
          </div>

        {key!=''&&
        <div >

          <div >
            <input
              type="text"
              name="key"
              defaultValue={key} 
            />
            <span>Key</span>
            <i></i>
          </div>
          <div >
            <input
              type="text"
              name="plainText"
              value={text.plainText} 
              onChange={changeText}
            />
            <span>plain Text</span>
            <i></i>
          </div>
          <div >
          <span>encrypt Text</span>
            <input
              type="text" 
              name="encryptText"
              value={text.encryptText}
              onChange={changeText}
             style={{width:"-moz-available"}}
            />
            
          </div>
          <input type="submit" value="Encrypt" onClick={encrypt} />
          <input type="submit" value="UnEncrypt" onClick={UnEncrypt} />
<User/>
          </div>}
    </div>
  )
}

export default EHLA