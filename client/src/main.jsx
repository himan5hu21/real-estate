import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.js";

// Components & Pages
import PrivateRoute from "./components/PrivateRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Properties from "./pages/Properties.jsx";
import MyProperty from "./pages/MyProperty.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import FavoriteProperties from "./pages/FavoriteProperties.jsx";
import PropertyForm from "./pages/AddProperties.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
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
          path: "/sign-in",
          element: <SignIn />,
        },
        {
          path: "/sign-up",
          element: <SignUp />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/properties",
          element: <Properties />,
        },
        {
          path: "/property/:id",
          element: <PropertyDetails />,
        },
        // --- Protected Routes ---
        {
          path: "/profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "/addProperty",
          element: (
            <PrivateRoute>
              <PropertyForm />
            </PrivateRoute>
          ),
        },
        {
          path: "/editProperty/:id", // Matches the navigate URL from MyProperty.jsx
          element: (
            <PrivateRoute>
              <PropertyForm />
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
          path: "/favoriteProperties",
          element: (
            <PrivateRoute>
              <FavoriteProperties />
            </PrivateRoute>
          ),
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
      </PersistGate>
    </Provider>
  </StrictMode>
);