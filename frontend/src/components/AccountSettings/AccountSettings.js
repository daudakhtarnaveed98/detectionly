// Import modules.
import React from "react";
import Navigation from "../Navigation";
import styles from "../../styles/AccountSettings.module.css";
import { validatePassword } from "../../utils";
import axios from "axios";

// Component definition.
class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      password: "",
      response: "",
      status: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Navigation pageTitle={"Account Settings"} />
        <section className={styles.accountSettings}>
          <h3 className={this.state.status ? styles.success : styles.error}>
            {this.state.response}
          </h3>
          <h3 className={styles.sectionHeadings}>Reset Password</h3>
          <form>
            <label htmlFor="currentPassword">Enter Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={this.state.currentPassword}
              onChange={this.handleCurrentPasswordChange}
            />
            <label htmlFor="newPassword">Enter New Password:</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={this.state.newPassword}
              onChange={this.handleNewPasswordChange}
            />
            <button
              name="reset-password-button"
              id="reset-password-button"
              onClick={this.handlePasswordChange}
            >
              Reset Password
            </button>
          </form>
          <h3 className={styles.sectionHeadings}>Delete Account</h3>
          <form>
            <label htmlFor="password">Enter Your Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.handlePasswordChangeInput}
            />
            <button
              name="deleteAccountButton"
              id="deleteAccountButton"
              className={styles.deleteAccountButton}
              onClick={this.handleAccountDeletion}
            >
              Delete Account
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }

  // Handler functions.
  handleCurrentPasswordChange = (e) => {
    this.setState({ currentPassword: e.target.value });
    this.setState({ response: "", status: false });
  };

  handleNewPasswordChange = (e) => {
    this.setState({ newPassword: e.target.value });
    this.setState({ response: "", status: false });
  };

  handlePasswordChangeInput = (e) => {
    this.setState({ password: e.target.value });
    this.setState({ response: "", status: false });
  };

  handlePasswordChange = async (e) => {
    e.preventDefault();
    if (this.state.currentPassword === "") {
      this.setState({
        response: "Error: Please provide current password.",
        status: false,
      });
    } else if (this.state.newPassword === "") {
      this.setState({
        response: "Error: Please provide new password.",
        status: false,
      });
    } else if (!validatePassword(this.state.newPassword)) {
      this.setState({
        response:
          "Error: Password must be of 8 characters, should contain at least one letter, one number and one special character.",
        status: false,
      });
    } else {
      const { currentPassword, newPassword } = this.state;

      // Get token.
      const token = localStorage.getItem("token");

      if (!token) {
        this.props.history.push("/sign-in");
      } else {
          const passwordUpdateMutation = `
          mutation {
          updateUserPassword(
            userUpdatePasswordData:{
              currentPassword:"${currentPassword}",
              newPassword:"${newPassword}"
            }) {
            statusCode,
            statusMessage,
            responseMessage
          }
        }
        `;

        // Construct request object.
        const updatePasswordRequest = {
          url: "http://localhost:65000/api/v1/registry/",
          method: "POST",
          data: {
            query: passwordUpdateMutation,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          // Make API call.
          let response = await axios(updatePasswordRequest);
          if (response.status === 200 || response.status === 201) {
            // Get data from response.
            const { statusCode, responseMessage } = response.data.data.updateUserPassword;
            if (statusCode === 401 && responseMessage === "Invalid Password") {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }
            else if (statusCode === 404) {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }
            else {
              this.setState({
                response: "Success: Password Changed Successfully",
                status: true,
              });
            }
          } else if (response.status === 401) {
            this.props.history.push("/sign-in");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  handleAccountDeletion = (e) => {
    e.preventDefault();
  };
}

// Export.
export default AccountSettings;
