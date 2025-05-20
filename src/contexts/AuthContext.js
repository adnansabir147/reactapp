// import React, { createContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// import PropTypes from "prop-types";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setAuthLoading(false);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   return <AuthContext.Provider value={{ user, authLoading }}>{children}</AuthContext.Provider>;
// };

// // Define prop types for AuthProvider
// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };


// ----


// import React, { createContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import PropTypes from "prop-types";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   const logout = () => {
//     signOut(auth)
//       .then(() => {
//         console.log("User signed out");
//       })
//       .catch((error) => {
//         console.error("Sign out error", error);
//       });
//   };

//   return (
//     <AuthContext.Provider value={{ user, authLoading, logout }}>{children}</AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };


// export function useAuth() {
//   return useContext(AuthContext);
// }



// ---


import React, { createContext, useState, useEffect, useContext } from "react"; // ✅ Added useContext
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    return signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
