// Import modules.
import React from "react";
import axios from "axios";
import Placeholder from "./placeholder.png";
import "./style.css";
import {Link} from "react-router-dom";

// Registration component.
const registration = () => {
    return (
        <div className="sign-up-card">
            <img src={Placeholder} alt="Logo"/>
            <h2>Let’s Create Your Account</h2>

            <div className="sign-up-form" onSubmit={handleRegistration}>
                <form >
                    <label htmlFor="emailAddress">Enter Your Personal Email Address:</label><br/>
                    <input type="email" name="emailAddress" id="emailAddress"/><br/>

                    <label htmlFor="password">Enter A Strong<sup>*</sup> Password For Your Account:</label><br/>
                    <input type="password" name="password" id="password"/><br/>

                    <button name="sign-up-button" id="sign-up-button">Sign Up</button>
                    <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
                </form>
            </div>
            <p><sup>*</sup>A strong password is a mixture of lowercase and uppercase letters, numbers, and special symbols.</p>

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
const handleRegistration = async (event) => {
    // Prevent default behavior.
    event.preventDefault();

    // Get form data.
    const formData = new FormData(event.target);

    // Get form values.
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");

    // Construct graphql mutation for registration.
    const registerMutation = `
    mutation {
      registerUser(userRegistrationData:{
        emailAddress:"${emailAddress}",
        password:"${password}"
      }) {
        statusCode,
        statusMessage,
        responseMessage
      }
    }`;

    // Construct request object.
    const registerUserRequest = {
        url: "http://localhost:65000/api/v1/registry/",
        method: "POST",
        data: {
            query: registerMutation
        }
    };

    // Make API call.
    let response;
    try {
        response = await axios(registerUserRequest);
        console.log(response.data.data.registerUser);
    } catch (error) {
        console.error(error)
    }
};

// Export.
export default registration;