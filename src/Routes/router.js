import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./Layout";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Problemset from "./Problemset";
import SoloProblemPage from "./SoloProblemPage";

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

const problemsetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/problemset",
  component: Problemset,
});

const soloProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/problemset/question/$id/$title",
  component: SoloProblemPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  problemsetRoute,
  soloProblemRoute,
]);

export const router = createRouter({ routeTree });
