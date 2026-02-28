import { useNavigate } from "react-router-dom"

export const useGeneral=()=>{
    const navigate=useNavigate()
return{
    navigate
}
}
