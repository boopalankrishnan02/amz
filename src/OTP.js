import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import { auth } from "./firebase.js";

function OTP() {
  const history = useHistory();
  const [otp, setOtp] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    window.confirmationResult.confirm(otp).then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user)
        // ...
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
      
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login_logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
        />
      </Link>

      <div className="login_container">
        <h1>Enter Otp</h1>
        <form>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button type="submit" onClick={signIn} className="login_signInButton">
            Verify
          </button>
        </form>

        <p>
          By signing-in you agree to the AMAZON FAKE Conditions of Use & Sqale.
          Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice
        </p>
      </div>
    </div>
  );
}

export default OTP;
