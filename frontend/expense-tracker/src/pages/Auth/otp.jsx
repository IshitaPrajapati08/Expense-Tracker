// src/pages/OtpVerify.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid } from "@mui/material";
import { httpAction } from "../../util/httpAction";
import { apis } from "../../util/apis";

export const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const initialState = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
  };

  const validationSchema = Yup.object({
    digit1: Yup.string().required("Required"),
    digit2: Yup.string().required("Required"),
    digit3: Yup.string().required("Required"),
    digit4: Yup.string().required("Required"),
    digit5: Yup.string().required("Required"),
    digit6: Yup.string().required("Required"),
  });

  const submitHandler = async (values) => {
    const otp = Object.values(values).join("");

    try {
      const response = await httpAction({
        url: apis().verifyOtp, // Should resolve to /user/verify-otp
        method: "POST",
        body: { email, otp },
      });

      alert(response.message || "OTP Verified");
      navigate("/UpdatePassword", { state: { email } });
    } catch (error) {
      console.error(error);
      alert(error.message || "Invalid OTP. Try again.");
    }
  };

  return (
    <div className="auth-card">
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <h3>Enter the OTP sent to {email}</h3>
            <Grid container spacing={2} justifyContent="center">
              {Object.keys(initialState).map((key, index) => (
                <Grid item xs={2} key={index}>
                  <TextField
                    name={key}
                    value={values[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                    error={touched[key] && Boolean(errors[key])}
                    helperText={touched[key] && errors[key]}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Verify OTP
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
