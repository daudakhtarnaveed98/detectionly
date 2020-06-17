// Import modules.
import React from "react";
import styles from "../../styles/AccountActivation.module.css";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils";
import axios from "axios";

// Component definition.
class AccountActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: "",
      response: "Didn't receive activation email? Enter your email address below to resend.",
      status: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <section className={styles.mainWrapper}>
          <section className={styles.signInForm}>
            <h1 className={styles.logo}>Detectionly</h1>
            <h3>Activate Your Account By Clicking Link In Email</h3>
            <h3 className={this.state.status ? styles.success : styles.error}>
              {this.state.response}
            </h3>

            <form>
              <label htmlFor={"emailAddress"}>Enter Your Email Address</label>
              <input
                type={"email"}
                name={"emailAddress"}
                id={"emailAddress"}
                value={this.state.emailAddress}
                onChange={this.handleEmailChange}
              />
              <button onClick={this.handleEmailSending}>Resend Email</button>
              <p className={styles.paragraph}>
                Already Have An Account?{" "}
                <Link to="/sign-in" className={styles.link} href="#">
                  Sign In
                </Link>
              </p>
              <p className={styles.paragraph}>
                Not Registered?{" "}
                <Link to="/sign-up" className={styles.link} href="#">
                  Create Account Now
                </Link>
              </p>
            </form>
          </section>
        </section>
      </React.Fragment>
    );
  }

  // Handler methods.
  // Handler for email input change.
  handleEmailChange = (e) => {
    this.setState({ emailAddress: e.target.value.toLowerCase() });
    this.setState({ response: "", status: false });
  };

  // Handler for sign in button.
  handleEmailSending = async (e) => {
    // Prevent default behavior.
    e.preventDefault();

    // Clear current state.
    this.setState({
      response: ""
    })

    // If email is not valid show error.
    if (!validateEmail(this.state.emailAddress)) {
      this.setState({
        response: "Error: Please provide a valid email address",
        status: false,
      });
    }

    // Else proceed.
    else {
      // Get email from state.
      const { emailAddress } = this.state;

      // Construct request object.
      const activationEmailSendRequest = {
        url: "http://localhost:65000/account-activation/" + emailAddress,
        method: "GET",
      };

      try {
        // Make API call.
        let emailSendingResponse = await axios(activationEmailSendRequest);
        if (emailSendingResponse.status === 200 || emailSendingResponse.status === 201) {
          // Update state with response.
          this.setState({
            response: "Email sent successfully."
          })
        }
      } catch (error) {
        this.setState({
          response: "Invalid email, please register."
        })
      }
    }
  };
}

// Export.
export default AccountActivation;
