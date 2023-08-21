<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'
import editTable from '../components/editTable.vue'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

interface ITable {
  name: string
  description: string
  image: string
  id: number
}

const tables = ref<ITable[]>()
const isModal = ref<boolean>(false)
const table = ref<ITable>()


const getTables = async () => {
  try {
    const { data } = await axios.get(`${apiMain}api/master/tables`)
    tables.value = data.data
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
getTables()

const editTableId = (id:number) => {
    console.log(id)
    table.value = tables.value?.find(el => el.id == id)
    console.log(table.value )
    isModal.value=true
   
}

const closeModal = (status:string) => {
    isModal.value=false
    getTables()
    if(status == "success"){
      toast.add({ severity: 'success', summary: 'Успешно', detail: 'Изменения внесены', life: 3000 });
    }
    
}
</script>
<template>
  <Toast />
  <div class="grid">

    <div class="ье- col-12 lg:col-12 xl:col-12">
      <div class="card mb-0">
        <!-- <h5 class="mb-5">Столы:</h5> -->
        <div class="card__items">
             <Card v-for="table in tables" :key="table.id" style="width: 25em">
            <template #header>
        <img  :src="table.image" />
    </template>
    <template #title> {{ table.name }} </template>

    <template #content>
        <p>
           {{table.description}}
        </p>
    </template>
    <template #footer>
        <Button @click="editTableId(table.id)" icon="pi pi-check" label="Редактировать" />
        
    </template>
        </Card>
        </div>
       
      </div>
    </div>
  </div>
  <Dialog  header="Редактировать:" v-model:visible="isModal" :breakpoints="{ '1420px': '60vw', '960px': '80vw', '700px': '90vw', '640px': '99vw' }" :style="{ width: '40vw' }" :modal="true">
                  <editTable :table="table" @closeModal="closeModal"></editTable>
            </Dialog>
</template>

<style scoped>
img {
    width: 100%;
}

.card__items{
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: center;
}
</style>
