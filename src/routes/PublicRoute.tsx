import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const PublicRoute = () => {
    const token = localStorage.getItem("token");
    if(token){
        return <Navigate to="/dashboard" />
    }
    return <Outlet />
}

export default PublicRoute