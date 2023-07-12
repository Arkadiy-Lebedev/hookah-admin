<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Главная',
        items: [
            { label: 'Главная', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Заказы', icon: 'pi pi-fw pi-home', to: '/booking' },
            { label: 'Бронь', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout', },]
    },
    
    {
        label: 'Дополнительно',
        items: [    
            {
                label: 'Акции', icon: 'pi pi-fw pi-check-square',               
                to: ''

            },      
            {
                label: 'Меню', icon: 'pi pi-fw pi-check-square',
                 items: [
                    {
                        label: 'Продукты',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/products'
                    },
                    {
                        label: 'Категории',
                        icon: 'pi pi-fw pi-bookmark',
                        to: ''
                    }
                ]

            },
              {
                label: 'Пользователи', icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Администраторы',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/users/admins'
                    },
                    {
                        label: 'Клиенты',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/users'
                    }
                ]

            },
            {
                label: 'PUSH сообщения', icon: 'pi pi-fw pi-check-square',
                to: '/push'

            },
            {
                label: 'Столы', icon: 'pi pi-fw pi-check-square',
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
