// Import modules.
import React from "react";
import AuthPage from "../../pages";
import {BrowserRouter, Route} from "react-router-dom";


// App component.
function App() {
    return (
        <BrowserRouter>
            <Route path="/auth" component={AuthPage}/>
            <Route path={"/register"} component={null}/>
        </BrowserRouter>
    );
}

// Export.
export default App;