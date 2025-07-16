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

const rootRoute = createRootRoute({ component: Layout });

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/problemset",
    component: Problemset,
  }),
]);

export const router = createRouter({ routeTree, context: undefined });
