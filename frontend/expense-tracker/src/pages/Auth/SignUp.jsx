import {TextField,Button, InputAdornment, IconButton, Divider} from '@mui/material';
import * as Yup from "yup";
import{Form,Formik} from "formik";
import { IoIosPersonAdd } from "react-icons/io";
import { useState } from 'react';
import{ ArrowBack, Google,Visibility,VisibilityOff} from '@mui/icons-material'
import { useGeneral } from '../../hooks/useGeneral';
import { httpAction } from '../../util/httpAction';
import { apis } from '../../util/apis';

export const SignUp=()=>{
    
    const[visible,setvisible]=useState(false)
    const visibleHandler=()=>{
        setvisible(!visible)
    }
     const initialState={
    name:'',
    email:'',
    password:''
  }
  const validationSchema=Yup.object({
    name:Yup.string().required('name is required'),
    email:Yup.string().email('must be a valid email').required('email is required'),
    password:Yup.string().required('password is required')
  });

  const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5050/auth/google';
};

  const {navigate}=useGeneral()
   
  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await httpAction({
        url: apis().registerUser,
        method: 'POST',
        body: values,
      });

      alert(res.message || 'Registration successful!');

      if (res?.user || res?.status === 'success') {
        // ✅ Save the user info to localStorage
        localStorage.setItem(
          'user',
          JSON.stringify({
            _id: res.user._id, 
            name: res.user.name,
            email:res.user.email,
          })
        );

        navigate('/Dashboard');
      }

      resetForm();
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };
 return(
    <div className="auth-card">
     <Formik onSubmit={submitHandler} validationSchema={validationSchema} initialValues={initialState}>
        {({handleBlur,handleChange,values,touched,errors,isSubmitting})=>(
            <Form>
            <div className="container-fluid">
            <div className="row g-3">
            <div className="col-12 auth-header">
             <IoIosPersonAdd />
            <p>Create Account</p>
             <span>Sign Up to start tracking your expenses</span>
            </div>
            <div className="col-12">
            <TextField 
            name='name'
            value={values.name}
            label='Your name'
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name &&  Boolean(errors.name)}
            helperText={touched.name && errors.name}
             fullWidth size='small'
            />
            </div>
             <div className="col-12">
              <TextField 
                type='email'
                 name='email'
                 onChange={handleChange} 
                 onBlur={handleBlur}
                 error={touched.email &&  Boolean(errors.email)}
                 helperText={touched.email && errors.email}
                  label="Create new Email" 
                   fullWidth size="small" />
                 </div>
                 <div className="col-12">
                 <TextField 
                     InputProps={{
                     endAdornment:(
                     <InputAdornment>
                     <IconButton onClick={visibleHandler} edge='end'>
                         {visible? <Visibility />:<VisibilityOff/>}
                         </IconButton>
                         </InputAdornment>
                         )
                     }}
                    type={visible? "text":"password"}
                    name='password'
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    error={touched.password &&  Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    label="Create new password" 
                     fullWidth size="small" 
                     />
                     </div>
                      <div className="col-12">
                     <Button
  variant="contained"
  fullWidth
  type="submit"
  disabled={isSubmitting} 
>
  Sign Up
</Button>

                     </div>
                    <div className="col-12">
                     <Divider>OR</Divider>
                      </div>
                    <div className="col-12">
               <Button onClick={loginWithGoogle} variant="outlined" fullWidth endIcon={<Google />}>
  Sign up with Google
</Button>

                    </div> 
                    <div className="col-12">
                        <Button 
                        onClick={()=>navigate("/Login")}
                        startIcon={<ArrowBack />} variant='outlined' fullWidth>back to Sign in  </Button>
                        </div>                 
    </div>
  </div>
 </Form>
            )}
</Formik>

</div>
  )
}