import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";

const Navbar = () => {
    const [ws, setWs] = useState(null);
    const {id, username, setId, setUsername} = useContext(UserContext);
    
    const logout = () => {
        axios.post('/logout').then(() => {
            setWs(null);
            setId(null);
            setUsername(null);
        })
    }

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between flex-grow">
          <div className="text-xl font-semibold text-white">
            ChatApp
          </div>
          <button 
          className="flex items-center rounded-lg text-gray-400 hover:text-white focus:outline-none focus:text-white"
          onClick={logout} >
            <span className="text-gray-200 mr-1">Welcome, {username}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
