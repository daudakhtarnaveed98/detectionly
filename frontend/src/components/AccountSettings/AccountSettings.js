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

  componentDidMount = async () => {
    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }
  };

  // Handler functions.
  // Handler for current password input change.
  handleCurrentPasswordChange = (e) => {
    this.setState({ currentPassword: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for new password input change.
  handleNewPasswordChange = (e) => {
    this.setState({ newPassword: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for password input change.
  handlePasswordChangeInput = (e) => {
    this.setState({ password: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for password change button.
  handlePasswordChange = async (e) => {
    // Prevent default behavior.
    e.preventDefault();

    // If current password is not provided, display error.
    if (this.state.currentPassword === "") {
      this.setState({
        response: "Error: Please provide current password.",
        status: false,
      });
    }

    // Else if new password is not provided, show error.
    else if (this.state.newPassword === "") {
      this.setState({
        response: "Error: Please provide new password.",
        status: false,
      });
    }

    // Else if new password does not meet the criteria, show error.
    else if (!validatePassword(this.state.newPassword)) {
      this.setState({
        response:
          "Error: Password must be of 8 characters, should contain at least one letter, one number and one special character.",
        status: false,
      });
    }

    // Else proceed.
    else {
      // Get current password and new password.
      const { currentPassword, newPassword } = this.state;

      // Get token.
      const token = localStorage.getItem("token");

      // If token is not provided, show error and redirect to sign in page.
      if (!token || token === "" || token === null) {
        this.setState({
          response: "Token Expired: Please login again",
          status: false,
        });
        this.props.history.push("/sign-in");
      }

      // Else proceed.
      else {
        // Create password update mutation.
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
            const {
              statusCode,
              responseMessage,
            } = response.data.data.updateUserPassword;

            // If current password provided by user is invalid, show error.
            if (statusCode === 401 && responseMessage === "Invalid Password") {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }

            // If user is not found, show error, most likely it will not happen.
            else if (statusCode === 404) {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }

            // If response is un acceptable, show error.
            else if (statusCode === 406) {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }

            // Else if token is expired, show error.
            else if (
              response.status === 401 &&
              responseMessage === "Invalid / Expired Token"
            ) {
              // Show failure message.
              this.setState({
                response: "Token Expired: Please login again",
                status: false,
              });

              // Redirect to sign in page.
              this.props.history.push("/sign-in");
            }

            // Show success message.
            else {
              this.setState({
                response: "Success: Password Changed Successfully",
                status: true,
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  // Handler for delete account button.
  handleAccountDeletion = async (e) => {
    e.preventDefault();

    // If current password is not provided, display error.
    if (this.state.password === "") {
      this.setState({
        response: "Error: Please provide current password.",
        status: false,
      });
    }

    // Else proceed.
    else {
      // Get current password and new password.
      const { password } = this.state;

      // Get token.
      const token = localStorage.getItem("token");

      // If token is not provided, show error and redirect to sign in page.
      if (!token || token === "" || token === null) {
        this.setState({
          response: "Token Expired: Please login again",
          status: false,
        });
        this.props.history.push("/sign-in");
      }

      // Else proceed.
      else {
        // Create password update mutation.
        const accountDeletionMutation = `
          mutation {
            deleteUserAccount(password:"${password}") {
              statusCode,
              statusMessage,
              responseMessage
            }
          }
        `;

        // Construct request object.
        const deleteAccountRequest = {
          url: "http://localhost:65000/api/v1/registry/",
          method: "POST",
          data: {
            query: accountDeletionMutation,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          // Make API call.
          let response = await axios(deleteAccountRequest);
          if (response.status === 200 || response.status === 201) {
            // Get data from response.
            const {
              statusCode,
              responseMessage,
            } = response.data.data.deleteUserAccount;

            // If current password provided by user is invalid, show error.
            if (statusCode === 401 && responseMessage === "Invalid Password") {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }

            // If user is not found, show error, most likely it will not happen.
            else if (statusCode === 404) {
              this.setState({
                response: "Error: Invalid password",
                status: false,
              });
            }

            // Else if token is expired, show error.
            else if (
              response.status === 401 &&
              responseMessage === "Invalid / Expired Token"
            ) {
              // Show failure message.
              this.setState({
                response: "Token Expired: Please login again",
                status: false,
              });

              // Redirect to sign in page.
              this.props.history.push("/sign-in");
            }

            // Show success message.
            else {
              this.setState({
                response: "Success: Account Deleted Successfully",
                status: true,
              });

              // Remove token.
              localStorage.removeItem("token");

              // Redirect to sign in page.
              this.props.history.push("/sign-up");
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
}

// Export.
export default AccountSettings;
