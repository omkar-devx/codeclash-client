import "./App.css";
import Home from "./Routes/Home";
import Layout from "./Routes/Layout";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import Problemset from "./Routes/Problemset";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const ProblemsetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/problemset",
  component: Problemset,
});
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  ProblemsetRoute,
]);

const router = createRouter({ routeTree });

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} position="bottom-right" />
    </>
  );
}

export default App;
