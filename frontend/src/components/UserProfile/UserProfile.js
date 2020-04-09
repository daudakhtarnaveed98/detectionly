// Import modules.
import React from "react";
import Navigation from "../Navigation";
import styles from "../../styles/UserProfile.module.css";
import axios from "axios";
import { getUserInformation } from "../../utils/utils";

// Component definition.
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      organizationName: "",
      roleInOrganization: "",
      response: "",
    };
  }

  render() {
    return (
      <React.Fragment>
        <Navigation pageTitle={"User Profile"} />
        <section className={styles.userProfile}>
          <h3 className={styles.sectionHeadings}>Update User Information</h3>
          <form>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={this.state.firstName}
              onChange={this.handleFirstNameChange}
            />
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={this.state.lastName}
              onChange={this.handleLastNameChange}
            />
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={this.state.phoneNumber}
              onChange={this.handlePhoneNumberChange}
            />
            <label htmlFor="organizationName">Organization Name:</label>
            <input
              type="text"
              name="organizationName"
              id="organizationName"
              value={this.state.organizationName}
              onChange={this.handleOrganizationNameChange}
            />
            <label htmlFor="roleInOrganization">Role In Organization:</label>
            <input
              type="text"
              name="roleInOrganization"
              id="roleInOrganization"
              value={this.state.roleInOrganization}
              onChange={this.handleRoleInOrganizationChange}
            />
            <button
              name="update-user-info-button"
              id="update-user-info-button"
              onClick={this.handleUserInformationUpdate}
            >
              Update Information
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

    // Else proceed.
    else {
      const getUserInformationResponse = await getUserInformation(token);
      const {
        firstName,
        lastName,
        phoneNumber,
        organizationName,
        roleInOrganization,
      } = getUserInformationResponse.data.data.getUserInformation;
      this.setState({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        organizationName: organizationName,
        roleInOrganization: roleInOrganization,
      });

    }
  };

  // Handler methods.
  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value, response: "" });
  };

  handleLastNameChange = (e) => {
    this.setState({ lastName: e.target.value, response: "" });
  };

  handlePhoneNumberChange = (e) => {
    this.setState({ phoneNumber: e.target.value, response: "" });
  };

  handleOrganizationNameChange = (e) => {
    this.setState({ organizationName: e.target.value, response: "" });
  };

  handleRoleInOrganizationChange = (e) => {
    this.setState({ roleInOrganization: e.target.value, response: "" });
  };

  handleUserInformationUpdate = async (e) => {
    // Prevent default behavior.
    e.preventDefault();

    // Get current password and new password.
    const {
      firstName,
      lastName,
      phoneNumber,
      organizationName,
      roleInOrganization,
    } = this.state;

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
      // Create user information update mutation.
      const userInformationUpdateMutation = `
          mutation {
            updateUserInformation(updatedInformation:{
              firstName:"${firstName}",
              lastName:"${lastName}",
              phoneNumber:"${phoneNumber}",
              organizationName:"${organizationName}",
              roleInOrganization:"${roleInOrganization}"
            }) {
              statusCode
              statusMessage
              responseMessage
            }
          }
        `;

      // Construct request object.
      const updatePasswordRequest = {
        url: "http://39.40.116.9:65000/api/v1/registry/",
        method: "POST",
        data: {
          query: userInformationUpdateMutation,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Make API call.
        let response = await axios(updatePasswordRequest);
        if (response.status === 200 || response.status === 201) {
          this.setState({ response: "Information Updated Successfully" });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
}

// Export.
export default UserProfile;
