import React from "react";
import { Link } from "react-router-dom";
import logo from '../../../assets/Logo-white 2.png';
import background from '../../../assets/Photo_bg.png';
import hook from '../../../assets/Hook _poster.png';
import formimg from '../../../assets/Photobg.png';
export default function Login() {
  return (
    <div className=" h-screen w-full " style={{backgroundImage:`url(${background})`, backgroundSize: "cover", backgroundPosition: "center"}}>
      <main className="h-full w-full  flex  items-center justify-center  gap-44" style={{background: "linear-gradient(90deg,rgba(33, 80, 37, 1) 0%, rgba(196, 230, 201, 0.75) 100%)"}}>
        <nav>
            <img src={logo} alt="GreenCycle Logo" className="w-56 h-auto mx-auto" />
            <div className=" mt-4 shadow-md overflow-hidden" style={ {borderRadius: "40px", backgroundImage:`url(${formimg})`}}>
                <form action="" className="w-96 py-14 px-12 " style={{backgroundColor: "rgba(255, 255, 255, 0.75)"}}>
                    
                    <h1 style={{color:"#336D38"}} className="text-center text-3xl font-nexa font-bold">Log In</h1><br />
                    <div className="mb-4">
                        <input type="email" placeholder="Email" id="email" className="bg-white font-nexa w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900" />
                    </div>
                    <div className="mb-1">
                        <input type="password" placeholder="Password" id="password" className=" bg-white font-nexa w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900" />
                    </div>
                    <Link to="/forgot-password" className="block font-nexa text-gray-950 hover:text-lime-900 mb-12"><small>Forgot Password?</small></Link>
                    <div className="items-center justify-center flex flex-col">
                        <button type="submit" style={{backgroundColor:"#598E5C"}} className="w-48 font-nexa text-white font-bold mb-1 py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 ">Login</button>
                        <Link to="/register"style={{backgroundColor:"#598E5C"}} className="block font-nexa text-center w-48  text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 mt-2" >
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </nav>
        <nav className="flex items-center justify-center bg-white   mt-4 shadow-slate-500 shadow-md" style={{ width: "auto",height: "600px", borderRadius: "40px" ,overflow: "hidden"}}>
            <img src={hook} alt="Hook Poster" className="w-full h-full object-cover" />
        </nav>
      </main>
    </div>
  );
}