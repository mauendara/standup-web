import Vue from 'vue'
import VueRouter from 'vue-router'
import RegisterPage from '../pages/Register'
import ConfirmationPage from '../pages/Confirmation'
import LoginPage from '../pages/Login'
import DashboardPage from '../pages/Dashboard'
import { store } from '../store'
import { constants } from '../config/constants'

Vue.use(VueRouter);

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardPage,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage
        },
        {
            path: '/confirmation',
            name: 'confirmation',
            component: ConfirmationPage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardPage,
            meta: {
                requiresAuth: true
            }
        }
    ]
});


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem(constants.LOCALSTORAGE_TOKEN_KEY) == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
});