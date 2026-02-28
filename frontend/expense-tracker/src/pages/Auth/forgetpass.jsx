import React from "react";
import { TextField, Button } from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { GrPowerReset } from "react-icons/gr";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Don't forget to import axios

export const ForgetPassword = () => {
  const navigate = useNavigate();

  const initialState = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Must be a valid email").required("Email is required"),
  });

  const submitHandler = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:5050/api/auth/forgot-password", {
        email: values.email,
      });

      alert(response.data.message);

      // ✅ Navigate to OTP verify page with email in state
      navigate("/OtpVerify", { state: { email: values.email } });
    } catch (error) {
      console.error("Forgot password error:", error);
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <Formik
        onSubmit={submitHandler}
        initialValues={initialState}
        validationSchema={validationSchema}
      >
        {({ handleBlur, handleChange, touched, errors, isSubmitting }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth-header">
                  <GrPowerReset />
                  <p>Find your Account</p>
                  <span>Enter your registered email</span>
                </div>
                <div className="col-12">
                  <TextField
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    label="Registered Email"
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="col-12">
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    endIcon={<Send />}
                    disabled={isSubmitting}
                  >
                    Send OTP
                  </Button>
                </div>
                <div className="col-12">
                  <Button
                    onClick={() => navigate("/Login")}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    fullWidth
                  >
                    Back to Sign in
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
