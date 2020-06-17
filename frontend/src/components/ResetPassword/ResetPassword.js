// Import modules.
import React from "react";
import md5 from "md5";
import Navigation from "../Navigation";
import styles from "../../styles/AccountSettings.module.css";
import { validatePassword } from "../../utils";
import axios from "axios";

// Component definition.
class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordResetToken: "",
      passwordResetTokenHash: "",
      newPassword: "",
      newPassword1: "",
      response: "",
      status: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <section className={styles.accountSettings}>
          <h3 className={this.state.status ? styles.success : styles.error}>
            {this.state.response}
          </h3>
          <h3 className={styles.sectionHeadings}>Reset Password</h3>
          <form>
            <label htmlFor="currentPassword">Enter New Password:</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={this.state.newPassword1}
              onChange={this.handleNewPassword1Change}
            />
            <label htmlFor="newPassword">Repeat New Password:</label>
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
        </section>
      </React.Fragment>
    );
  }

  componentDidMount = () => {
    // Get password reset token and its hash from path parameters.
    this.state.passwordResetToken = this.props.match.params.passwordResetToken;
    this.state.passwordResetTokenHash = this.props.match.params.passwordResetTokenHash;

    // Compare them to see if they are valid.
    const comparison = md5(this.state.passwordResetToken) === this.state.passwordResetTokenHash;

    // If invalid, redirect to forgot password page.
    if (!comparison) {
      this.props.history.push("/forgot-password");
    }
  }

  // Handler functions.
  // Handler for new password input change.
  handleNewPasswordChange = (e) => {
    this.setState({ newPassword: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for new password 1 input change.
  handleNewPassword1Change = (e) => {
    this.setState({ newPassword1: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for password change button.
  handlePasswordChange = async (e) => {
    // Prevent default behavior.
    e.preventDefault();

    // If current password is not equal to repeated password, display error.
    if (this.state.newPassword !== this.state.newPassword1) {
      this.setState({
        response: "Error: Both passwords must match.",
        status: false,
      });
    }

    // If current password is not provided, display error.
    else if (this.state.newPassword === "") {
      this.setState({
        response: "Error: Please provide new password.",
        status: false,
      });
    }

    // Else if new password is not provided, show error.
    else if (this.state.newPassword1 === "") {
      this.setState({
        response: "Error: Please repeat new password.",
        status: false,
      });
    }

    // Else if new password1 does not meet the criteria, show error.
    else if (!validatePassword(this.state.newPassword1)) {
      this.setState({
        response:
          "Error: Password must be of 8 characters, should contain at least one letter, one number and one special character.",
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
      const {newPassword} = this.state;

      // Create password update request.
      const passwordUpdateRequest = {
        url: "http://localhost:65000/reset-password/" + this.state.passwordResetToken,
        method: "POST",
        headers: {},
        data: {
          newPassword: newPassword,
        }
      }

      try {
        // Make API call.
        let passwordUpdateResponse = await axios(passwordUpdateRequest);
        if (passwordUpdateResponse.status === 200 || passwordUpdateResponse.status === 201) {
          this.props.history.push("/sign-in");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

// Export.
export default ResetPassword;
