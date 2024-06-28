import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const Login = () => import(/* webpackChunkName: "clients" */ '../views/Login.vue')
const ClientDoc = () => import(/* webpackChunkName: "clients" */ '../views/ClientDoc.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/clients/:id',
    name: 'client-doc',
    component: ClientDoc
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
