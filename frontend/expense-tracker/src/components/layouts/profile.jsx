import { Avatar,Button } from "@mui/material"
import "./profile.css"
import { Logout } from "@mui/icons-material"
import { useGeneral } from "../../hooks/useGeneral"
export const Profile=()=>{
    const {navigate}=useGeneral()
    return(
        <div className="auth-card">
            <div className="profile_container">
             <span className="name">
                <Avatar sx={{backgroundColor:'orangered' ,textTransform:'capitalize'}}>A</Avatar></span>
                <span className="full-name">name</span>
                <span className="email">email@email.com</span>         
           </div>
           <div className="action">
            <Button onClick={()=>navigate("/Login")}endIcon={<Logout/>} variant='contained' fullWidth>logout</Button>
           </div>
        </div>
    )
}