import React, { createContext, useContext, useReducer } from "react";

export { UserProvider, useUser };

const UserStateContext = createContext();
const UserDispatchContext = createContext();

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    id: localStorage.getItem("userID") || genUUIDv4(),
  });

  localStorage.setItem("userID", state.id);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// https://stackoverflow.com/a/2117523/6693073
function genUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function useUser() {
  return [useUserState(), useUserDispatch()];
}

function reducer(state, action) {
  switch (action.type) {
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
