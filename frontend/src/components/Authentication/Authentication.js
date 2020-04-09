// Import modules.
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignUp from "../SignUp";
import AccountSettings from "../AccountSettings";
import UserProfile from "../UserProfile";
import DataRepository from "../DataRepository";
import SignIn from "../SignIn";

// Authentication class definition.
class Authentication extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route exact path="/" component={SignUp} />
            <Route path="/account-settings" component={AccountSettings} />
            <Route path="/user-profile" component={UserProfile} />
            <Route path="/change-detector" component={DataRepository} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

// Export.
export default Authentication;
