// Import modules.
import Login from "../Login";
import React, {Component} from "react";
import Registration from "../Registration";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import AccountSettings from "../AccountSettings";


// Authentication class definition.
class Authentication extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/sign-in" component={Login} />
                        <Route path="/sign-up" component={Registration} />
                        <Route path="/account-settings" component={AccountSettings} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

// Export.
export default Authentication;