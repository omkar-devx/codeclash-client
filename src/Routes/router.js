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
import AboutUs from "./AboutUs";
import SolutionPage from "./SolutionPage";

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  beforeLoad: () => {
    document.title = "Home | CodeClash";
  },
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const loginRoute = createRoute({
  beforeLoad: () => {
    document.title = "Login | CodeClash";
  },
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  beforeLoad: () => {
    document.title = "Register | CodeClash";
  },
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const problemsetRoute = createRoute({
  beforeLoad: () => {
    document.title = "Problemset | CodeClash";
  },
  getParentRoute: () => rootRoute,
  path: "/problemset",
  component: Problemset,
});

const soloProblemRoute = createRoute({
  beforeLoad: ({ params }) => {
    document.title = `${params.id}. ${params.title} | CodeClash`;
  },
  getParentRoute: () => rootRoute,
  path: "/problemset/question/$id/$title",
  component: SoloProblemPage,
});

const collaborateRoom = createRoute({
  beforeLoad: ({ params }) => {
    document.title = `Room: ${params.roomId} | CodeClash`;
  },
  getParentRoute: () => rootRoute,
  path: "/problemset/room/$roomId",
  component: CollaborateRoom,
});

const userProfile = createRoute({
  beforeLoad: ({ params }) => {
    document.title = `Profile : ${params.username} | CodeClash`;
  },
  getParentRoute: () => rootRoute,
  path: "/user/$username",
  component: UserProfile,
});

const aboutUs = createRoute({
  beforeLoad: () => {
    document.title = "About Us | CodeClash";
  },
  getParentRoute: () => rootRoute,
  path: "/aboutus",
  component: AboutUs,
});

const questionSolution = createRoute({
  beforeLoad: ({ params }) => {
    document.title = `Problem : ${params.id} Solution | CodeClash`;
  },
  getParentRoute: () => rootRoute,
  path: "/solution/$id",
  component: SolutionPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  problemsetRoute,
  collaborateRoom,
  soloProblemRoute,
  userProfile,
  aboutUs,
  questionSolution,
]);

export const router = createRouter({ routeTree });
