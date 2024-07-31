
import "./style.css";
import React, {useEffect, useState} from 'react';
import { auth } from '../../firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg";

function Header() {

  const [user , loading ] = useAuthState(auth);
  const navigate = useNavigate();

useEffect (()=> {
  if(user){
    navigate("/dashboard")
  }
}, [user, loading]);

    function logoutfunc() {
       try{
        signOut(auth)
        .then(() => {
          toast.success("Logged out Succesfully");
          navigate("/");
        })
       }catch(errror){
   toast.error(errror.Message);
       }

       
    }
    
  return (
    <div className="navbar">
        <p className='logo'>Pocketly</p>
        {user && 
         <div style={{ display: "flex" , alignItems:"center" , gap: "0rem"}}>
            
            <img
              src={user.photoURL ? user.photoURL : userImg}
          
              style={{ borderRadius: "50%" , height:"2rem" ,  width: "2rem"}}
            />
       <p  className="logo link" onClick={logoutfunc}>

         Logout</p>
          </div>
        }
    </div>
  )
}

export default Header;
