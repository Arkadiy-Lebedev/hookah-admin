<script setup lang="ts">
import { useRouter } from "vue-router"
import axios from 'axios';
import { apiMain } from "./api/api"

const router = useRouter()

const localToken = localStorage.getItem('token')

console.log(localToken)
if (localToken) {
    const auth = async () => {
        axios
            .post(`${apiMain}api/auth/token`, {token: localToken }, {
                onUploadProgress: (e) => {
                    console.log(e)
                },
            })
            .then((data) => {
                console.log(data.data)  
                if (data.data.role == "MASTER") {
                    router.push({ name: 'main' })
                }     

            }).catch((error) => {
                router.push({ name: 'auth' })

            })
            .finally(() => {
                // loading.value = false;

            });
    }

    auth()
} else {
    router.push({ name: 'auth' })
}


</script>

<template>
    <router-view />
</template>

<style scoped></style>
