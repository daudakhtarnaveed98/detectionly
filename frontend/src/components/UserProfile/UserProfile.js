// Import modules.
import React from "react";
import Navigation from "../Navigation";
import styles from "../../styles/UserProfile.module.css";

// Component definition.
class UserProfile extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navigation pageTitle={"User Profile"} />
        <section className={styles.userProfile}>
          <h3 className={styles.sectionHeadings}>Update User Information</h3>
          <form>
            <label htmlFor="firstName">First Name:</label>
            <input type="text" name="firstName" id="firstName" />
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" name="lastName" id="lastName" />
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" />
            <label htmlFor="organizationName">Organization Name:</label>
            <input type="text" name="organizationName" id="organizationName" />
            <label htmlFor="roleInOrganization">Role In Organization:</label>
            <input
              type="text"
              name="roleInOrganization"
              id="roleInOrganization"
            />
            <button name="update-user-info-button" id="update-user-info-button">
              Update Information
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }
}

// Export.
export default UserProfile;
