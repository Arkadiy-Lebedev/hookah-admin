<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"





interface IUsers {
    phone: string
    name: string
    date: string
    timestamp: string
}

const users = ref<IUsers[]>();


const getUsers = async () => {
     try {       
        const { data } = await axios.get(`${apiMain}api/master/admin/users`)
        users.value = data.data
      console.log(data)
    } catch (e) {
        console.log(e)
    }
}
getUsers()

</script>
<template>

    <div class="grid">
        <div class="ье- col-12 lg:col-6 xl:col-7">
            
            <div class="card mb-0">
                <h5 class="mb-5">Зарегистрированные пользователи: </h5>
    <DataTable :value="users" >
               <template #empty> Клиенты отсутствуют отсутствуют </template>
                <Column field="name" header="Имя"></Column>
             <Column field="phone" header="Телефон"></Column>
          <Column field="timestamp" header="Дата"></Column>
          
            </DataTable>
            </div>
        </div>
      
    </div>
</template>

<style >
.admin__item{
    display:flex;
    justify-content:space-between;
    align-items:center;
}
</style>