import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import {Navigate, Route, Routes} from "react-router-dom";
import ProfileEdit from "../pages/client/profile/ProfileEdit";
import OrderList from "../pages/client/orders/OrderList";

export default function ClientRoutes(){
    const {isAuthenticated, loading} = useContext(AuthContext);
    
    if (loading){
        return <div className="min-h-screen p-8 font-nexa text-green-dark">Loading...</div>;
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>;
    }

    return (
        <Routes>
            <Route index element={<Navigate to="Profile" replace />} />
            <Route path="/Profile" element={<ProfileEdit/>}/>
            <Route path="/orders" element={<OrderList/>}/>
            <Route path="*" element={<Navigate to="Profile" replace />} />
        </Routes>
    );
    
} 
