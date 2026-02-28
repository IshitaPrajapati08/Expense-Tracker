import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { GrUpdate } from "react-icons/gr";
import { useGeneral } from "../../hooks/useGeneral"

export const UpdatePassword = () => {
   const{navigate}=useGeneral() 
  const initialState = {
    password: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"),
  });

  const submitHandler = (values) => {
    console.log(values);
  };

  return (
    <div className="auth-card">
      <Formik
        onSubmit={submitHandler}
        initialValues={initialState}
        validationSchema={validationSchema}
      >
        {({ handleBlur, handleChange, values, touched, errors }) => (
          <Form>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-12 auth-header">
                  <GrUpdate />
                  <p>Update your password</p>
                  <span>Create your new password</span>
                </div>

                <div className="col-12">
                  <TextField
                    type="text"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    size="small"
                    label="New Password"
                  />
                </div>

                <div className="col-12">
                  <Button type="submit" variant="contained" fullWidth>
                    Update Password
                  </Button>
                </div>

                <div className="col-12">
                  <Button onClick={()=>navigate("/Login")} variant="outlined" endIcon={<ArrowBackIcon />} fullWidth>
                    Back to login
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
