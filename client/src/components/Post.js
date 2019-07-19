import React from "react";

const Post = props => {
  let { post } = props;
  return (
    <div className="post">
      <div>
        <div className="circle">
          <div
            className="inner-circle"
            style={{ backgroundColor: `#${post.user.color || "000"}` }}
          />
        </div>
        <h5>{post.user.alias || post.user.email}</h5>
      </div>
      <p>{post.content}</p>
    </div>
  );
};

export default Post;
