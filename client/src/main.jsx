import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Error from "./pages/Error.jsx";
import { persistor, store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Properties from "./pages/Properties.jsx";
import AddProperty from "./pages/AddProperties.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MyProperty from "./pages/MyProperty.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <ScrollToTop /> {/* Add ScrollToTop component here */}
          <App />
        </>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/properties",
          element: <Properties />,
        },
        {
          path: "/addProperty",
          element: (
            <PrivateRoute>
              <AddProperty />
            </PrivateRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "/myProperties",
          element: (
            <PrivateRoute>
              <MyProperty />
            </PrivateRoute>
          ),
        },
        {
          path: "/sign-in",
          element: <SignIn />,
        },
        {
          path: "/sign-up",
          element: <SignUp />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
          }}
        />
        {/* <App /> */}
      </PersistGate>
    </Provider>
  </StrictMode>
);
