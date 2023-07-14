<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import { useRouter } from "vue-router"

const router = useRouter()

const isErrors = ref({
    error: false,
    textError: ""
})
const loading = ref(false)

const user = reactive({
    phone: '',
    password: ""
 
})

const auth = async () => {
    isErrors.value.error = false
    loading.value = true
    axios
        .post(`${apiMain}api/auth`, user, {
            onUploadProgress: (e) => {
                console.log(e)
            },
        })
        .then((data) => {
            console.log(data.data)
            if (data.data.role == "ADMIN") {                
                router.push({ name: 'adminpanel' })
            }

            if (data.data.role == "MASTER") {   
                    localStorage.setItem('token', data.data.token)             
                router.push({ name: 'main' })
            }


        }).catch((error) => {
            console.log(error);
            isErrors.value.error = true
            isErrors.value.textError = error.response?.data?.message
      
        })
        .finally(() => {
            loading.value = false


        });
}

</script>
<template>
 <form @submit.prevent="auth">
<div class="auth__wrapper">
   
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div class="text-center mb-5">
           
            <div class="text-900 text-3xl font-medium mb-3">Кольянная № 1</div>
         
        </div>

        <div>
            <label for="phone" class="block text-900 font-medium mb-2">Логин:</label>
            <InputText v-model.trim="user.phone"  id="phone" type="text" class="w-full mb-3" />
            <label for="password1" class="block text-900 font-medium mb-2">Пароль:</label>
            <InputText v-model.trim="user.password"  id="password1" type="password" class="w-full mb-3" />
            <Button  :loading="loading" type="submit" label="Войти" icon="pi pi-user" class="w-full mt-4"></Button>

            <InlineMessage v-if="isErrors.error" severity="error"  class="w-full mt-4">{{  isErrors.textError }}</InlineMessage>
        </div>
    </div>
    
</div>
  </form>
    

</template>

<style >
.auth__wrapper{
    display: flex;
    justify-content: center;
    align-items:center;
    height: 100vh;
}
</style>