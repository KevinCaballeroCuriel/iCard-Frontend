import { AdminLayout } from "../layouts";
import {
  HomeAdmin,
  UsersAdmin,
  CategoriesAdmin,
  ProductsAdmin,
  TablesAdmin,
  OrdersAdmin,
  TableDetailsAdmin,
  PaymentsHistory,
} from "../pages/Admin";

const routesAdmin = [
  {
    path: "/admin",
    layout: AdminLayout,
    component: HomeAdmin,
  },
  {
    path: "/home",
    layout: AdminLayout,
    component: HomeAdmin,
  },
  {
    path: "/admin/users",
    layout: AdminLayout,
    component: UsersAdmin,
  },
  {
    path: "/admin/categories",
    layout: AdminLayout,
    component: CategoriesAdmin,
  },
  {
    path: "/admin/products",
    layout: AdminLayout,
    component: ProductsAdmin,
  },
  {
    path: "/admin/tables",
    layout: AdminLayout,
    component: TablesAdmin,
  },
  {
    path: "/admin/orders",
    layout: AdminLayout,
    component: OrdersAdmin,
  },
  {
    path: "/admin/table/:id",
    layout: AdminLayout,
    component: TableDetailsAdmin,
  },
  {
    path: "/admin/payments-history",
    layout: AdminLayout,
    component: PaymentsHistory,
  },
];

export default routesAdmin;
