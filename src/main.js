import {createApp} from "vue";
import {createRouter, createWebHashHistory} from "vue-router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";
import './plugins/bootstrap-vue'
import App from "@/App.vue";
import {createPinia} from "pinia";
import {routesNames} from '@/config'
import piniaPersist from 'pinia-plugin-persist'
import Room from "@/views/Room.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    name: routesNames.home,
    path: "/",
    component: Home,
  }, {
    name: routesNames.room,
    path: "/room/:id",
    component: Room,
  },
  {path: "/:pathMatch(.*)*", redirect: "/"},
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

createApp(App)
  .use(createPinia().use(piniaPersist))
  .use(router).mount("#app");
