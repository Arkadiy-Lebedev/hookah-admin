import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: () => import('@/views/MainScreen.vue')
                },
                {
                    path: '/booking',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/products',
                    name: 'products',
                    component: () => import('@/views/products.vue')
                },
                {
                    path: '/users/admins',
                    name: 'admins',
                    component: () => import('@/views/Admins.vue')
                },
                {
                    path: '/push',
                    name: 'push',
                    component: () => import('@/views/Push.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/Users.vue')
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/Categories.vue')
                },
                {
                    path: '/table',
                    name: 'table',
                    component: () => import('@/views/Table.vue')
                },
                {
                    path: '/sale',
                    name: 'sale',
                    component: () => import('@/views/Sale.vue')
                },
                 {
                    path: '/revenue',
                    name: 'revenue',
                    component: () => import('@/views/Revenue.vue')
                },
                 {
                    path: '/revenue-period',
                    name: 'revenueperiod',
                    component: () => import('@/views/RevenuePeriod.vue')
                }
            ]
        },
        {
            path: '/main',
            name: 'adminpanel',
            component: () => import('@/views/MainScreen.vue'),
        },
         {
             path: '/auth',
             name: 'auth',
            component: () => import('@/views/Auth.vue'),
        },
         {
             path: '/:pathMatch(.*)*',  
            component: () => import('@/views/Error.vue'),
        }
        
    ]
});

export default router;