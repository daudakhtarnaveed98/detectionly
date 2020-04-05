// Import modules.
import React from "react";
import styles from "../../styles/SignIn.module.css";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils";
import axios from "axios";

// Component definition.
class SignIn extends React.Component {
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
          <section className={styles.signInForm}>
            <h1 className={styles.logo}>Detectionly</h1>
            <h3>Sign In To Start Using Detectionly</h3>
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
                Enter Password For Your Account
              </label>
              <input
                type={"password"}
                name={"password"}
                id={"password"}
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <button onClick={this.handleSignIn}>Sign In</button>
            </form>
            <p className={styles.paragraph}>
              Forgot Password?{" "}
              <a className={styles.link} href="#">
                Click Here
              </a>
            </p>
            <p className={styles.paragraph}>
              Not Registered?{" "}
              <Link to="/sign-up" className={styles.link} href="#">
                Create Account Now
              </Link>
            </p>
          </section>
        </section>
      </React.Fragment>
    );
  }

  // Handler methods.
  handleEmailChange = (e) => {
    this.setState({ emailAddress: e.target.value.toLowerCase() });
    this.setState({ response: "", status: false });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
    this.setState({ response: "", status: false });
  };

  handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateEmail(this.state.emailAddress)) {
      this.setState({
        response: "Error: Please provide a valid email address",
        status: false,
      });
    } else if (this.state.password === "") {
      this.setState({
        response: "Error: Please provide a password.",
        status: false,
      });
    } else {
      const { emailAddress, password } = this.state;
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
          query: loginQuery,
        },
      };

      // Make API call.
      let response;
      try {
        response = await axios(loginUserRequest);
        if (response.status === 200 || response.status === 201) {
          // Get data from response.
          const { statusCode } = response.data.data.loginUser.response;

          // In case of conflict, show error.
          if (statusCode === 401 || statusCode === 404) {
            this.setState({
              response: "Error: Email address or password is invalid",
              status: false,
            });
          } else {
              const {token} = response.data.data.loginUser;
              localStorage.setItem('token', token);
            this.setState({
              response: "Success: Logged in successfully",
              status: true,
            });

            setTimeout(() => {
              this.props.history.push("/change-detector");
            }, 1000);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
}

// Export.
export default SignIn;
