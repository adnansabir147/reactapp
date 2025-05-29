// src\App.js
import { useState, useEffect, useMemo } from "react";
import React, { useContext } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import Dashboard from "./layouts/dashboard";


import ProductList from "./layouts/products/ProductList";
import AddProduct from "./layouts/products/AddProduct";
import EditProduct from "./layouts/products/EditProduct";
import ProductCatalog from "./layouts/products/ProductCatalog";
import ProductDetail from "./layouts/products/ProductDetail";

// import CartPage from ".layouts/Cart/CartPage";
import CartPage from "layouts/Cart/CartPage";
import MyOrdersPage from "layouts/Orders/MyOrdersPage";



// import { AuthProvider, useAuth } from "./contexts/AuthContext";

// import Signin from "./layouts/authentication/sign-in";
// import Signup from "./layouts/authentication/sign-up";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";


// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // const getRoutes = (allRoutes) =>
  //   allRoutes.map((route) => {
  //     if (route.collapse) {
  //       return getRoutes(route.collapse);
  //     }

  //     if (route.route) {
  //       return <Route exact path={route.route} element={route.component} key={route.key} />;
  //     }

  //     return null;
  //   });

   
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    // You can render a loading spinner or placeholder here
    return <div>Loading...</div>;
  };

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Material Dashboard 2"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        {/* <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes> */}
        <Routes>
          {/* {getRoutes(routes)} */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />
          <Route
            path="/signin"
            element={!user ? <SignIn /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/dashboard" replace />}
          />
          
          <Route
            path="/dashboard/*"
            element={user ? <Dashboard /> : <Navigate to="/signin" replace />}
          />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />
          
          {/* ✅ Product CRUD Routes */}
          <Route
            path="/products"
            element={user ? <ProductList /> : <Navigate to="/signin" replace />}
          />
          <Route
            path="/products/add"
            element={user ? <AddProduct /> : <Navigate to="/signin" replace />}
          />
          <Route
            path="/products/edit/:id"
            element={user ? <EditProduct /> : <Navigate to="/signin" replace />}
          />

          {/* ✅ Cart Route */}
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/signin" replace />}
          />

          {/* ✅ My Orders Route */}
          <Route
            path="/orders"
            element={user ? <MyOrdersPage /> : <Navigate to="/signin" replace />}
          />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Material Dashboard 2"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {/* {getRoutes(routes)} */}

        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}

        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard /> : <Navigate to="/signin" replace />}
        />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />

        {/* ✅ Product CRUD Routes */}
        <Route
          path="/products"
          element={user ? <ProductList /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/products/add"
          element={user ? <AddProduct /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/products/edit/:id"
          element={user ? <EditProduct /> : <Navigate to="/signin" replace />}
        />
        <Route
            path="/shop"
            element={user ? <ProductCatalog /> : <Navigate to="/signin" replace />}
        />
        <Route
            path="/products/:id"
            element={user ? <ProductDetail /> : <Navigate to="/signin" replace />}
          />
         
          {/* ✅ Cart Route */}
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/signin" replace />}
          />

          {/* ✅ My Orders Route */}
          <Route
            path="/orders"
            element={user ? <MyOrdersPage /> : <Navigate to="/signin" replace />}
          />

      </Routes>
    </ThemeProvider>
  );
}
  