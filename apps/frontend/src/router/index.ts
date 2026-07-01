import { defineRouter } from "#q-app";
import { routes, handleHotUpdate } from "vue-router/auto-routes";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";
import { useAuthStore } from "@/stores/authStore";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  });

  // Navigation guard to check authentication
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const publicRoutes = ["/auth/login", "/auth/register"];

    // Load user from storage on app initialization
    authStore.loadUserFromStorage();

    const isAuthenticated = authStore.isLogin;
    const isPublicRoute = publicRoutes.includes(to.path);

    // If trying to access protected route without authentication
    if (!isAuthenticated && !isPublicRoute) {
      next("/auth/login");
    } else {
      next();
    }
  });

  // enable HMR for it
  if (import.meta.hot) {
    handleHotUpdate(Router);
  }

  return Router;
});
