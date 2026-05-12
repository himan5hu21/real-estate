import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.js";

import { lazy, Suspense } from "react";
// Components & Pages
import PrivateRoute from "./components/PrivateRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Error from "./pages/Error.jsx";

const Home = lazy(() => import("./pages/Home"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Properties = lazy(() => import("./pages/Properties.jsx"));
const MyProperty = lazy(() => import("./pages/MyProperty.jsx"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails.jsx"));
const FavoriteProperties = lazy(() => import("./pages/FavoriteProperties.jsx"));
const PropertyForm = lazy(() => import("./pages/AddProperties.jsx"));

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

// Professional Loader Component
const CompilingLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-sky-500/10 rounded-full animate-pulse"></div>
      </div>
    </div>
    <p className="mt-4 text-slate-600 font-bold tracking-widest uppercase text-xs animate-pulse">
      Compiling Assets...
    </p>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<CompilingLoader />}>
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
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);