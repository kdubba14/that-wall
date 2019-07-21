import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Post from "../components/Post";
import { Redirect } from "react-router-dom";
import { UserContext } from "../containers/UserContext";
import "./App.css";

const App = props => {
  // CONTEXT API
  const UserData = useContext(UserContext);

  // FOR User info and Token from localStorage
  // Can put user info into Context API instead
  let LocalUser = localStorage.getItem("that_wall_user");
  let token = localStorage.getItem("that_wall_auth");
  if (LocalUser) {
    LocalUser = JSON.parse(LocalUser);
  }

  // REACT HOOKS STATE
  // COULD CONVERT TO STATEFUL COMPONENT
  let [postsState, setPosts] = useState([]);
  let [newPost, setNewPost] = useState("");
  // addedPosts is controlling posts effect below
  let [addedPosts, addingPost] = useState(0);
  let [loggingOut, logOut] = useState(false);

  // REACT HOOKS EFFECT TO LOAD/UPDATE POSTS
  useEffect(() => {
    axios
      .get("/api/posts")
      .then(posts => {
        setPosts(posts.data);
        let scrollView = document.querySelector(".posts");
        scrollView.scrollTop = scrollView.scrollHeight;
      })
      .catch(err => console.log(err));
  }, [addedPosts]);

  // To show posts or "Loading..."
  //Duplicate of function on PUBLIC page
  // Create "functions" folder?"
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

  // Finding username
  // Should make this more clear
  const username = () => {
    if (LocalUser) {
      return LocalUser.alias || LocalUser.email;
    } else if (UserData) {
      return UserData.userInfo.alias || UserData.userInfo.email;
    } else {
      return "Guest";
    }
  };

  // To Redirect to PUBLIC page on logout below
  const toLogOut = () => {
    if (loggingOut) {
      return <Redirect to="/login" />;
    } else {
      return <div />;
    }
  };

  // To start logout
  const _logoutHandler = () => {
    logOut(true);
    localStorage.removeItem("that_wall_user");
    localStorage.removeItem("that_wall_auth");
  };

  const _enterPostHandler = e => {
    if (e.key === "Enter" && newPost.length > 0) {
      axios
        .post(
          "/api/posts",
          { content: newPost },
          {
            headers: {
              that_wall_auth: token
            }
          }
        )
        .then(post => {
          addingPost(addedPosts + 1);

          document.querySelector("#post-adder").value = "";
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container for-header">
          <div className="user">
            <h4>{username()}</h4>
          </div>
          <button className="btn" onClick={_logoutHandler}>
            Logout
          </button>
        </div>
      </header>
      {loadedPosts()}
      <div className="type-box">
        <div className="container for-textbox">
          {toLogOut()}
          <input
            autoFocus
            id="post-adder"
            onChange={e => setNewPost(e.target.value)}
            onKeyPress={e => _enterPostHandler(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
