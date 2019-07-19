import React, { createContext, useState } from "react";

export const UserContext = createContext();

// I CAN MAKE THE STATE MANAGEMENT WAY MORE EFFICIENT and ORGANIZED
export const UserProvider = props => {
  const [userInfo, setUserInfo] = useState({});

  let localInfo = localStorage.getItem("that-wall-user");

  let data = {
    localInfo,
    userInfo,
    setUserInfo
  };

  return (
    <UserContext.Provider value={data}>{props.children}</UserContext.Provider>
  );
};
