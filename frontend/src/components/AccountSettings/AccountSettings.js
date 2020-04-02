// Import modules.
import React, { Component } from "react";
import "./style.css";
import Navigation from "../Navigation";

// Component definition.
class AccountSettings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Navigation pageTitle={"Account Settings"} />
        <div className="account-settings-card">
          <h3>Reset Password</h3>
          <div className="reset-password-form">
            <form>
              <label htmlFor="currentPassword">Enter Current Password:</label>
              <br />
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
              />
              <br />

              <label htmlFor="newPassword">Enter New Password:</label>
              <br />
              <input type="password" name="newPassword" id="newPassword" />
              <br />

              <button name="reset-password-button" id="reset-password-button">
                Reset Password
              </button>
            </form>
          </div>

          <h3>Delete Account</h3>
          <div className="delete-account-form">
            <form>
              <label htmlFor="emailAddress">Enter Your Email Address:</label>
              <br />
              <input type="email" name="emailAddress" id="emailAddress" />
              <br />

              <label htmlFor="password">Enter Your Password:</label>
              <br />
              <input type="password" name="password" id="password" />
              <br />

              <button name="delete-account-button" id="delete-account-button">
                Delete Account
              </button>
            </form>
          </div>
        </div>
        <style jsx>
          {" "}
          {`
            body {
              background-color: white;
            }
          `}
        </style>
      </div>
    );
  }
}

// Export.
export default AccountSettings;
