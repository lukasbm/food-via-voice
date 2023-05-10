import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

// import prefetch loaded components
import ProcessStarter from "./views/ProcessStarter.vue";

// define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    redirect: "/",
  },
  {
    path: "/",
    name: "ProcessStarter",
    component: ProcessStarter,
  },
  {
    path: "/settings",
    component: () => import("./views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
