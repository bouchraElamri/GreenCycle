import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import {Navigate, Route, Routes} from "react-router-dom";
import ProfileEdit from "../pages/client/profile/ProfileEdit"

export default function ClientRoutes(){
    const {isAuthenticated, role, loading} = useContext(AuthContext);
    
    if (loading){
        return <div className="min-h-screen p-8 font-nexa text-green-dark">Loading...</div>;
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>;
    }

    return (
        <Routes>
            <Route path="edit-profile" index element={<ProfileEdit/>}/>
        </Routes>
    );
    
} 