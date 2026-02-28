
import {
  BrowserRouter as Router,
  Routes,
  Route,

}from "react-router-dom"
import { Login } from "./pages/Auth/Login"
import { SignUp } from "./pages/Auth/SignUp";
import { ForgetPassword } from "./pages/Auth/forgetpass";
import { OtpVerify } from "./pages/Auth/otp";
import { UpdatePassword } from "./pages/Auth/updatepassword";
import { Profile } from "./components/layouts/profile";
import { Dashboard } from "./pages/Dashboard/Home";
import { Transaction } from "./pages/Dashboard/transaction";
import { Categories } from "./pages/Dashboard/category";
import { Reports } from "./pages/Dashboard/report";
import { Income } from "./components/layouts/income";

const App=()=> {
  return (
    <>
    <Router>
      <Routes>
         <Route path="/Login" exact element={<Login />} /> 
          <Route path="/SignUp" exact element={<SignUp />} /> 
          <Route path="/ForgetPassword" exact element={<ForgetPassword />} /> 
           <Route path="/OtpVerify" exact element={<OtpVerify />} />  
            <Route path="/UpdatePassword" exact element={<UpdatePassword />} />    
            <Route path="/profile" exact element={<Profile />} />  
            <Route path="/dashboard" exact element={<Dashboard />} /> 
            <Route path="/transaction" exact element={<Transaction />} />
             <Route path="/categories" exact element={<Categories />} />
            <Route path="/reports" exact element={<Reports />} />
            <Route path="/income" exact element={<Income />} />
           
      </Routes>
      </Router>
    </>
  )
}

export default App;
