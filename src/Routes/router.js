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
import CollaborateRoom from "./CollaborateRoom";
import UserProfile from "./UserProfile";

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

const collaborateRoom = createRoute({
  getParentRoute: () => rootRoute,
  path: "/problemset/room/$roomId",
  component: CollaborateRoom,
});

const userProfile = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/$username",
  component: UserProfile,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  problemsetRoute,
  collaborateRoom,
  soloProblemRoute,
  userProfile,
]);

export const router = createRouter({ routeTree });
