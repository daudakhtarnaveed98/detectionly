// Import modules.
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../styles/Navigation.module.css";

// Component definition.
class Navigation extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header className={styles.header}>
          <h1 className={styles.logoText}>Detectionly</h1>
          <nav className={styles.navBar}>
            <ul className={styles.navList}>
              <li className={styles.navListItem}>
                <NavLink
                  className={styles.navLink}
                  to="/change-detector"
                  activeClassName={styles.currentPage}
                >
                  Change Detector
                </NavLink>
              </li>
              <li className={styles.navListItem}>
                <NavLink
                  className={styles.navLink}
                  to="/user-profile"
                  activeClassName={styles.currentPage}
                >
                  User Profile
                </NavLink>
              </li>
              <li className={styles.navListItem}>
                <NavLink
                  className={styles.navLink}
                  to="/account-settings"
                  activeClassName={styles.currentPage}
                >
                  Account Settings
                </NavLink>
              </li>
              <li className={styles.navListItem}>
                <NavLink
                  exact
                  to="/sign-in"
                  className={styles.navLink}
                  activeClassName={styles.currentPage}
                  onClick={this.signOutHandler}
                >
                  Sign Out
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className={styles.pageTitle}>
            <h2>{this.props.pageTitle}</h2>
          </div>
        </header>
      </React.Fragment>
    );
  }

  // Handler functions.
  signOutHandler = (e) => {
    localStorage.removeItem('token');
  };
}

// Export.
export default Navigation;
