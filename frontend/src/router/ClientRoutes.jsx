import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import {Navigate, Route, Routes} from "react-router-dom";
import ProfileEdit from "../pages/client/profile/ProfileEdit"
import CartPage from "../pages/client/cart/CartPage";
import PuchasePage from "../pages/client/cart/PuchasePage";

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
            <Route index element={<Navigate to="edit-profile" replace />} />
            <Route path="edit-profile" element={<ProfileEdit/>}/>
            <Route path="orders" element={<ProfileEdit/>}/>
            <Route path="cart" element={<CartPage/>}/>
            <Route path="purchase" element={<PuchasePage/>}/>
            <Route path="*" element={<Navigate to="edit-profile" replace />} />
        </Routes>
    );
    
} 
