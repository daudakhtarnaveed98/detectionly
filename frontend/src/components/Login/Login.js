// Import modules.
import React from "react";
import axios from "axios";
import "./style.css";
import Placeholder from "./placeholder.png";
import {Link} from "react-router-dom";

// Registration component.
const login = () => {
    return (
        <div className="sign-in-card">
            <img src={Placeholder} alt="Logo"/>
            <h2>Sign In to Start Using Detectionly</h2>

            <div className="sign-in-form">
                <form onSubmit={handleLogin}>
                    <label htmlFor="emailAddress">Enter Your Registered Email Address:</label><br/>
                    <input type="email" name="emailAddress" id="emailAddress"/><br/>

                    <label htmlFor="password">Enter Password For Your Account:</label><br/>
                    <input type="password" name="password" id="password"/><br/>

                    <button name="sign-in-button" id="sign-in-button">Sign In</button>

                    <p>Forgot Password? <a href="#">Click Here</a></p>
                </form>
                <p>Not Registered? <Link to="/sign-up">Create An Account</Link></p>
            </div>
            <style jsx>{
                    `
                    body {
                        background-color: #0E8FD8;
                    }
                    `
            }
            </style>
        </div>
    );
};

// Registration handler.
const handleLogin = async (event) => {
    // Prevent default behavior.
    event.preventDefault();

    // Get form data.
    const formData = new FormData(event.target);

    // Get form values.
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");

    // Construct graphql mutation for registration.
    const loginQuery = `
    query {
      loginUser(userLoginData:{
        emailAddress:"${emailAddress}",
        password:"${password}"
      }) {
        token,
        tokenExpirationTime,
        response {
          statusCode,
          statusMessage,
          responseMessage
        }
      }
    }`;

    // Construct request object.
    const loginUserRequest = {
        url: "http://localhost:65000/api/v1/registry/",
        method: "POST",
        data: {
            query: loginQuery
        }
    };

    // Make API call.
    let response;
    try {
        response = await axios(loginUserRequest);
        console.log(response.data.data.loginUser);
    } catch (error) {
        console.error(error)
    }
};

// Export.
export default login;