import React from 'react';
import Header from '../components/Header';
import Signup from "../components/Signup";
import signupImage from '../assets/69.jpg';
import './SignupSignin.css'; // Import the CSS file for styling

function SignupSignin() {
  return (
    <div>
      <Header />
      <div className="signup-signin-container">
        <div className="signup-image-container">
          <img src={signupImage} alt="Signup" className="signup-image" />
        </div>
        <div className="signup-form-container">
          <div className='wrapper'>
            <Signup />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupSignin;
