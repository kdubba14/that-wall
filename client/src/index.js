import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./index.css";
import jwtDecode from "jwt-decode";
import PrivateApp from "./containers/PrivateApp";
import PublicApp from "./containers/PublicApp";
import { UserProvider } from "./containers/UserContext";
import * as serviceWorker from "./serviceWorker";

//Check in case already logged in for App page
const PrivateAppRedirect = () => {
  let user = localStorage.getItem("that_wall_user");
  let token = localStorage.getItem("that_wall_auth");
  if (token) {
    let decode = jwtDecode(token);
    let today = String(Date.now()).slice(0, 10);
    if (user && decode.exp > Number(today)) {
      return <PrivateApp />;
    } else {
      return <Redirect to="/login" />;
    }
  } else {
    return <Redirect to="/login" />;
  }
};

//Check in case already logged in for Login page
const PublicAppRedirect = () => {
  let user = localStorage.getItem("that_wall_user");
  let token = localStorage.getItem("that_wall_auth");
  if (token) {
    let decode = jwtDecode(token);
    let today = String(Date.now()).slice(0, 10);
    if (user && decode.exp > Number(today)) {
      return <Redirect to="/" />;
    } else {
      return <PublicApp />;
    }
  } else {
    return <PublicApp />;
  }
};

ReactDOM.render(
  <Router>
    <UserProvider>
      <Route path="/" exact render={PrivateAppRedirect} />
      <Route path="/login" exact render={PublicAppRedirect} />
    </UserProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
