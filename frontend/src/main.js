import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Home from "@/components/Home";
import QuizHome from "@/components/QuizHome";
import Profile from "@/components/Profile";
import Admin from "@/components/Admin";

Vue.use(VueRouter);

Vue.config.productionTip = false

const routes = [
  { path: '/', component: QuizHome },
  { path: '/home', component: Home },
  { path: '/register', component: Signup },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile },
  { path: '/admin', component: Admin },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
