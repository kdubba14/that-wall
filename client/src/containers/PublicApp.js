import React, { useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";
import { UserContext } from "../containers/UserContext";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";
import MessageBox from "../components/MessageBox";
import "./App.css";

// "/login"
// PUBLIC
const App = props => {
  // CONTEXT API
  const UserData = useContext(UserContext);

  // TOKEN DECODED
  let token = localStorage.getItem("that_wall_auth");
  let decode;
  if (token) {
    decode = jwtDecode(token);
  }

  // REACT HOOKS STATE
  // CAN CONVERT TO STATEFUL COMPONENT
  const [postsState, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, logIn] = useState(false);
  const [validationError, showError] = useState(null);
  const [signedUp, signingUp] = useState(null);

  // REACT HOOKS EFFECT TO LOAD POSTS
  useEffect(() => {
    axios
      .get("/api/posts")
      .then(posts => {
        setPosts(posts.data);
        let scrollView = document.querySelector(".posts");
        scrollView.scrollTop = scrollView.scrollHeight;
      })
      .catch(err => console.log(err));
  }, []);

  // FOR Input in messageBoxView below
  const messageBox = () => {
    if (signedUp === false) {
      return {
        message: "Unable to Sign Up. Please try again later.",
        color: "error"
      };
    } else if (signedUp === true) {
      return {
        message: "Signed up successfully! You can now log in.",
        color: "success"
      };
    } else if (validationError) {
      return {
        message: validationError,
        color: "validation"
      };
    } else {
      return {
        message: "",
        color: "gone"
      };
    }
  };

  // FOR Validation, Errors, Successes, etc.
  // Input from messageBox returned objects above
  const messageBoxView = () => {
    let content = messageBox();

    return <MessageBox content={content} />;
  };

  // To show posts or "Loading..."
  const loadedPosts = () => {
    if (postsState.length > 0) {
      return (
        <div className="posts">
          <div className="posts-container">
            {postsState.map((post, i) => (
              <Post key={i} post={post} />
            ))}
          </div>
        </div>
      );
    } else {
      return <div className="posts">Loading...</div>;
    }
  };

  // IF valid token is not expired
  // Redirect to Private View
  const redirecting = () => {
    if (loggingIn === true) {
      if (
        decode.userID === UserData.userInfo.userID &&
        decode.exp < Date.now()
      ) {
        return <Redirect to="/" />;
      }
    } else {
      return <div />;
    }
  };

  // FOR Logging in
  const _loginHandler = () => {
    axios.post("/api/login", { email, password }).then(response => {
      if (response.data.success) {
        localStorage.setItem("that_wall_auth", response.data.token);

        UserData.setUserInfo(response.data.user);

        localStorage.setItem(
          "that_wall_user",
          JSON.stringify(response.data.user)
        );

        logIn(true);
      } else {
        console.log("boooo! ", response);
      }
    });
  };

  const _signupHandler = () => {
    axios
      .post("/api/signup", { email, password })
      .then(response => {
        if (response.data.userSuccess === false) {
          showError(response.data.message);
        } else {
          if (response.data.emailSuccess === false) {
            signingUp(false);
          } else {
            signingUp(true);
          }
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container for-header">
          <form className="forms">
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </form>
          <button className="btn" onClick={_loginHandler}>
            Login
          </button>
          <button className="btn" onClick={_signupHandler}>
            Signup
          </button>
        </div>
      </header>

      {messageBoxView()}

      {loadedPosts()}
      <div className="type-box">
        {redirecting()}
        <p>Log in to add to the wall</p>
      </div>
    </div>
  );
};

export default App;
