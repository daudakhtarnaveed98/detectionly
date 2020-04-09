// Import modules.
import React from "react";
import styles from "../../styles/SignUp.module.css";
import { validateEmail, validatePassword } from "../../utils";
import axios from "axios";
import { Link } from "react-router-dom";

// Component definition.
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: "",
      password: "",
      response: "",
      status: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <section className={styles.mainWrapper}>
          <section className={styles.signUpForm}>
            <h1 className={styles.logo}>Detectionly</h1>
            <h3>Let's Create Your Account</h3>
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
              <label htmlFor={"password"}>
                Enter A Strong<sup>*</sup> Password For Your Account
              </label>
              <input
                type={"password"}
                name={"password"}
                id={"password"}
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <button type="submit" onClick={this.handleSignUp}>
                Sign Up
              </button>
            </form>

            <p className={styles.paragraph}>
              Already have an account?{" "}
              <Link to="/sign-in" className={styles.link}>
                Sign In
              </Link>
            </p>
            <p className={styles.strongPasswordTip}>
              <sup>*</sup>A strong password is a mixture of lowercase and
              uppercase letters, numbers, and special symbols.
            </p>
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

  // Handler for password input change.
  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
    this.setState({ response: "", status: false });
  };

  // Handler for sign up button click.
  handleSignUp = async (e) => {
    // Prevent default behavior.
    e.preventDefault();

    // If email is not valid, display error.
    if (!validateEmail(this.state.emailAddress)) {
      this.setState({
        response: "Error: Please provide a valid email address",
        status: false,
      });
    }

    // If password does not meet criteria, display error.
    else if (!validatePassword(this.state.password)) {
      this.setState({
        response:
          "Error: Password must be of 8 characters, should contain at least one letter, one number and one special character.",
        status: false,
      });
    }

    // Else proceed.
    else {
      // Get email and password from state.
      const { emailAddress, password } = this.state;

      // Create mutation for registration.
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
        url: "http://39.40.116.9:65000/api/v1/registry/",
        method: "POST",
        data: {
          query: registerMutation,
        },
      };

      // Try to make an API call.
      try {
        let response = await axios(registerUserRequest);
        if (response.status === 200 || response.status === 201) {
          // Get data from response.
          const { statusCode } = response.data.data.registerUser;

          // In case of conflict, show error.
          if (statusCode === 409) {
            this.setState({
              response: "Error: User already exists",
              status: false,
            });
          }

          // In case of bad request, show error.
          else if (statusCode === 400) {
            this.setState({
              response: "Error: Bad request, sign up failed",
              status: false,
            });
          }

          // In case of bad / invalid input, show error.
          else if (statusCode === 406) {
            this.setState({
              response: "Error: Not acceptable, please provide correct input",
              status: false,
            });
          }

          // Show success message.
          else {
            this.setState({
              response: "Success: Account Created Successfully",
              status: true,
            });

            // Show redirecting message.
            this.setState({
              response: "Redirecting To Sign In Page...",
            });

            // Redirect to sign in page after 1 second.
            this.props.history.push("/sign-in");
          }
        }

        // Else, show error.
        else {
          this.setState({
            response: "Error: Registration failed, internal server error.",
            status: false,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
}

// Export.
export default SignUp;
