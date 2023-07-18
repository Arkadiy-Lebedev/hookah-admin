<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Главная',
        items: [
            { label: 'Главная', icon: 'pi pi-fw pi-home', to: '/' },
        ]
    },
    
    {
        label: 'Дополнительно',
        items: [    
            {
                label: 'Акции', icon: 'pi pi-fw pi-ticket',               
                to: '/sale'

            },      
            {
                label: 'Меню', icon: 'pi pi-fw pi-book',
                 items: [
                    {
                        label: 'Продукты',
                        icon: 'pi pi-fw pi-tag',
                        to: '/products'
                    },
                    {
                        label: 'Категории',
                        icon: 'pi pi-fw pi-qrcode',
                        to: '/categories'
                    }
                ]

            },
              {
                label: 'Пользователи', icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Администраторы',
                        icon: 'pi pi-fw pi-server',
                        to: '/users/admins'
                    },
                    {
                        label: 'Клиенты',
                        icon: 'pi pi-fw pi-user',
                        to: '/users'
                    }
                ]

            },
            {
                label: 'PUSH сообщения', icon: 'pi pi-fw pi-comment',
                to: '/push'

            },
            {
                label: 'Столы', icon: 'pi pi-fw pi-table',
                to: '/table'

            }
        ]
    }   
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
