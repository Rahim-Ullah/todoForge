import { Navigate, useLocation } from "react-router-dom"



export default function ProtectedRoute({children}:any){
    const Token_Key = localStorage.getItem("token")
    const token = Token_Key;
    const location = useLocation();

    // useEffect(() => {
    //     if (!token) {
    //       // If the user is not authenticated, redirect to the login page
    //       <Navigate to="/login" state={{ from: location }} replace />
    //     }   
    // }, [token, location]);

    if(!token){
        return <Navigate to="/login" />
    }
    console.log(location.pathname)
    return children
}