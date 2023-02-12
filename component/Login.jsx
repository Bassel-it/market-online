import React, { useState, useLayoutEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../api";
import { useStateContext } from "../hooks/useStateContext";
import { Alert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import "./LoginStyle.css";

function Login() {
  const { user, setUser, setConnecting, setLoggedin, showNotify } =
    useStateContext();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [errorlogin, setErrorlogin] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(user.email) ? "" : "Email is not valid.";
    //eslint-disable-next-line
    temp.password = user.password.length >= 8 ? "" : "password too short";
    // console.log(user.password.length);
    setErrors(temp);
    return Object.values(temp).every((x) => x == "");
  };

  // useLayoutEffect(() => {
  //   // console.log(JSON.parse(localStorage.getItem("user")), "user", user);
  //   localStorage.getItem("user") != null &&
  //     setUser(JSON.parse(localStorage.getItem("user")));
  // }, []);

  const login = (e) => {
    setConnecting(true);
    setErrorlogin('');
    e.preventDefault();
    if (validate())
      createAPIEndpoint("Member/Login")
        .post(user)
        .then((res) => {
          // console.log("sending", user);
          // console.log("reseiving", res);
          if (res.data == "") {
            setErrorlogin("wrong Password or Email");
            setConnecting(false);
          } 
          else {
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            setLoggedin(true);
            showNotify(`welcome ${res.data.firstName}`);
            setConnecting(false);
            navigate("/");
          }
        })
        .catch((err) => {
          setErrorlogin(err.message);
          setConnecting(false);
          console.log(err);
        });else
        setConnecting(false);

  };

  return (
    <div className="loginbody all">
      <div className="box">
        <form noValidate autoComplete="on" onSubmit={login}>
          <h2>Sign in</h2>
          <div className="inputBox">
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required="required"
            />
            <span>Email</span>
            <i></i>
          </div>
          {errors.email != "" && <Alert severity="error">{errors.email}</Alert>}
          <div className="inputBox">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              required="required"
            />
            <span>Password</span>
            <i></i>
          </div>
          {errors.password != "" && (
            <Alert severity="error">{errors.password}</Alert>
          )}
          <div className="links">
            <NavLink to="/recovery">Forgot Password ?</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </div>
          <input type="submit" value="Login" />
          {errorlogin != "" && (
            <Stack sx={{ mt: 5 }}>
              <Alert severity="error">
                <AlertTitle>{errorlogin}</AlertTitle>
                <strong>check it out!</strong>
              </Alert>
            </Stack>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
