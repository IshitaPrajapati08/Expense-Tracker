import React, { useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import './auth.css';
import { TextField, Button, InputAdornment, IconButton, Divider } from '@mui/material';
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ArrowBack, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { useGeneral } from "../../hooks/useGeneral";
//import { httpAction } from "../../util/httpAction";
//import { apis } from "../../util/apis";

export const Login = () => {
  const [visible, setVisible] = useState(false);
  const { navigate } = useGeneral();
// const [isGoogleLoading] = useState(false);

   const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5050/auth/google';
};
 
  const initialState={
     email:'',
     password:''
  }
  const validationSchema = Yup.object({
     email: Yup.string().email('Invalid email').required('Email is required'),
     password: Yup.string().required('Password is required')
  });


const Submithandler = async (values, { setSubmitting }) => {
  try {
    const res = await fetch("http://localhost:5050/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // allow cookie/session
      body: JSON.stringify(values)
    });

    const data = await res.json();
   if (data.status) {
  localStorage.setItem("user", JSON.stringify(data.user));
  navigate("/Dashboard");
} else {
  alert(data.message || "Login failed");
}

  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong");
  } finally {
    setSubmitting(false);
  }
};



const toggleVisibility = () => {
setVisible(!visible);
};

  return (
  <div className="auth-card">
  <Formik initialValues={initialState} validationSchema={validationSchema} onSubmit={Submithandler}>
  {({ handleBlur, handleChange, touched, errors, isSubmitting }) => (
   <Form>
   <div className="container-fluid">
   <div className="row g-3">
     <div className="col-12 auth-header">
         <p>Welcome back</p>
         <span>Sign in to manage your expenses</span>
     </div>
      <div className="col-12">
       <TextField
        name='email'
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
        label="Your Email"
        fullWidth
        size="small"
         />
      </div>
      <div className="col-12">
         <TextField
          InputProps={{
          endAdornment: (
          <InputAdornment>
          <IconButton onClick={toggleVisibility} edge='end'>
          {visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
          </InputAdornment>
          )
           }}
          type={visible ? "text" : "password"}
          name='password'
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          label="Your password"
          fullWidth
          size="small"
           />
         </div>
         <div className="col-12">
           <Button
           variant="contained"
           startIcon={<IoIosLogIn />}
           fullWidth
           type="submit"
           disabled={isSubmitting}
          >Sign in
            </Button> 
         </div>
         <div className="col-12">
         <Divider>OR</Divider>
         </div>
         <div className="col-12">
          <Button 
         onClick={loginWithGoogle} 
           variant="outlined" 
           fullWidth 
            endIcon={<Google />}
           >Login with Google
          </Button>
        </div>
        <div className="col-12">
        <Button onClick={() => navigate("/SignUp")}
        startIcon={<ArrowBack />} variant="outlined" fullWidth>
        Create new account
        </Button>
        </div>
       <div className="col-12">
        <Button
         onClick={() => navigate("/forgetpassword")}
         fullWidth
         variant="text"
         color="error">
         Forget Password?
        </Button>
       </div>
      </div>
     </div>
      </Form>
     )}
    </Formik>
    </div>
  );
};
