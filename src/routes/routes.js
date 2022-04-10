import routesAdmin from "./routes.admin";
import routesClient from "./routes.client";
import { Error404 } from "../pages";
import { LoginAdmin } from "../pages/Admin";
import { BasicLayout } from "../layouts";

const routes = [
  ...routesAdmin,
  ...routesClient,
  {
    path: "*",
    layout: BasicLayout,
    component: Error404,
  },
  {
    path: "/login",
    layout: BasicLayout,
    component: LoginAdmin,
  },
];

export default routes;
