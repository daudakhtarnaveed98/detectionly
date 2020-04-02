// Import modules.
import React, { Component } from "react";
import "./style.css";

// Component definition.
class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <nav className="nav-bar">
          <ul className="nav-bar-ul">
            <li>
              <a href="#">Change Detector</a>
            </li>
            <li>
              <a href="#">Data Repository</a>
            </li>
            <li>
              <a href="#">User Profile</a>
            </li>
            <li>
              <a href="#">Account Settings</a>
            </li>
            <li>
              <a href="#">Sign Out</a>
            </li>
          </ul>
        </nav>
        <div className="title-bar">
          <h2> {this.props.pageTitle} </h2>
        </div>
      </div>
    );
  }
}

// Export.
export default Navigation;
