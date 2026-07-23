import type { Project } from "@robusgauli/proto";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Dashboard from "./screens/Dashboard";

const auth: Project = {
  id: "auth",
  title: "Expense Tracker — Auth",
  screens: [
    {
      id: "login",
      title: "Login",
      story: "Existing user enters email + password → signs in → lands on the dashboard.",
      Component: Login,
    },
    {
      id: "register",
      title: "Register",
      story: "New user creates an account → confirms password → lands on the dashboard.",
      Component: Register,
    },
    {
      id: "dashboard",
      title: "Dashboard",
      story: "Authenticated placeholder — stands in for the real expense app.",
      Component: Dashboard,
    },
  ],
};

export default auth;
