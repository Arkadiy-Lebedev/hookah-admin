<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import { useRouter } from "vue-router"

const router = useRouter()

const user = reactive({
    phone: '',
    password: ""
 
})

const auth = async () => {
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

            // if (data.status) {
            //     ModalStore.modalAddProduct = false
            //     productsList.getProducts()
            // }


        }).catch((error) => {
            console.log(error);
            // if (error.response.status == 400) {
            //     console.log("Такой администратор существует")
            //     errorText.value = 'Такое имя занято.'
            //     isErrors.value = true
            // }
      
        })
        .finally(() => {
            // loading.value = false;


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

            <Button type="submit" label="Войти" icon="pi pi-user" class="w-full mt-4"></Button>
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