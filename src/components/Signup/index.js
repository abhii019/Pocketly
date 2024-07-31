import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import './style.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword} from 'firebase/auth';
import { auth, db } from '../../firebase';
import {doc , getDoc, setDoc} from "firebase/firestore"
import { useNavigate } from 'react-router-dom';
import {  signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loginForm, setLoginForm] = useState(false)
  const [loading , setLoading]= useState(false);
   const navigate =useNavigate();
  function signupWithEmail(event) {
     setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("Confirm", confirm);

    if (name !== "" && email !== "" && password !== "" && confirm !== "") {
      if(password==confirm){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User>>>", user);
          toast.success("User created");
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirm("");
          createDoc(user);
         navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
       setLoading(false);
    }
  }
  else{
        toast.error("Password and confirm Password dont match !")
      }
  }
  async function createDoc(user) {
    setLoading(true);
  
    try {
      if (!user) return;
  
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);
  
      if (!userData.exists()) {
        await setDoc(userRef, {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("User document created successfully");
      } else {
        toast.error("User document already exists");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  function loginiusingEmail(){
    console.log("Email", email);
    console.log("Password", password);
    setLoading(true);

    if ( email !== "" && password !== "" ) {
      signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user; 
    toast.success("User logged In");
    console.log("User logged in ", user);
    setLoading(false);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);

  });
    }
    else{
      toast.error("All fields are mandatory");
    }



   
  }

  async function signupWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success("User signed in with Google");
      console.log("User signed in with Google: ", user);
      await createDoc(user); // Create user document after successful Google sign-in
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  }
  return (
<>
{loginForm ?( <div className="signup-wrapper">
      <h2 className='title'>
        Login on <span style={{ color: "var(--theme)" }}>Pocketly.</span>
      </h2>
      <form onSubmit={signupWithEmail}>
        <Input label="Email" state={email} setState={setEmail} placeholder="abhiyergude2002@gmail.com" type="email" />
        <Input label="Password" state={password} setState={setPassword} placeholder="Example@123" type="password" />
          
        <Button disable={loading} text={loading ? "loading..." : "Login Using Email and Password"} onClick={loginiusingEmail} />
        <p style={{ textAlign: "center", margin: 0 }}> or </p>
        <Button text={loading ? "loading..." :"Login Using Google"} blue={true} onClick={signupWithGoogle} />
        <p style={{ textAlign: "center", margin: 0 ,cursor:"pointer"}} onClick={() =>setLoginForm(!loginForm)}> Or Dont have an account ? Click here </p>

      </form>
    </div> 
    ):
    

  (
    <div className="signup-wrapper">
      <h2 className='title'>
        Sign Up on <span style={{ color: "var(--theme)", fontStyle:"italic" }}>Pocketly</span>
      </h2>
      <form onSubmit={signupWithEmail}>
        <Input label="Full Name" state={name} setState={setName} placeholder="Abhishek Yergude" />
        <Input label="Email" state={email} setState={setEmail} placeholder="abhiyergude2002@gmail.com" type="email" />
        <Input label="Password" state={password} setState={setPassword} placeholder="Example@123" type="password" />
        <Input label="Confirm Password" state={confirm} setState={setConfirm} placeholder="Example@123" type="password" />
          
        <Button disable={loading} text={loading ? "loading..." : "Signup Using Email and Password"} onClick={signupWithEmail} />
        <p style={{ textAlign: "center", margin: 0 }}> or </p>
        <Button text={loading ? "loading..." :"Signup Using Google"} blue={true} onClick={signupWithGoogle} />
        <p style={{ textAlign: "center", margin: 0 ,cursor:"pointer"}} onClick={() =>setLoginForm(!loginForm)}> Already have an account ?  Click here </p>

      </form>
    </div>
  )}
  </>
  );
  
}


export default Signup ;
