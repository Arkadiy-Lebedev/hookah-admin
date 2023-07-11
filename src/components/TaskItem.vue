<script setup lang="ts">
import { ref } from 'vue';
import { ITables } from "../types/ITables"
import { useTablesList } from '../stores/tablesStore'

interface Props{
    tableItems?: Array<ITables[]>
    tableItemsWork?: ITables[]
    
} 

const tablesList = useTablesList();

const nowDate = ref(new Date().toLocaleDateString('ru-RU'));

const activeBooking = (id: number, tableId: number) => { 
    const item = tablesList.tables.find((el) => el.table_id == tableId && el.status == "active")
    console.log(item)
    if (item) {
        console.log("уже в работе")  
    } else {
        tablesList.activeBooking(id)
    }
 }
     




defineProps<Props>()

</script>

<template>
    
 <template v-if="tableItems" v-for="(tableItem, index) in tableItems" :key="index">  

  <span  class="block text-600 font-medium mb-3">{{tableItem[0].timeStart.split(' ')[0] == nowDate ? "Сегодня" : "Завтра" }}</span>        
        <ul v-for="item in tableItem" :key="item.id" class="p-0 mx-0 mt-0 mb-4 list-none">
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-dollar text-xl text-blue-500"></i>
                </div>
                <span class="text-900 line-height-3">{{item.name}} время: <span class="text-blue-500">{{ item.timeStart.split(' ')[0] }} {{ item.timeStart.split(' ')[1] }}</span>
                    <span class="text-700"> описание </span>  
                </span>
                <div>
                    <Button label="Подтвердить" @click="activeBooking(item.id, item.table_id)" class="mr-2 mb-2" size="small" />
                    <Button label="Снять" class="p-button-danger mr-2 mb-2" size="small"/>
                </div>
            </li>                
        </ul> 

   </template> 
    

  <span v-if="tableItemsWork"  class="block text-600 font-medium mb-3">Сейчас</span> 
        <TransitionGroup name="list" tag="ul">
        <ul  v-for="(tableItem) in tableItemsWork" :key="tableItem.id" class="p-0 mx-0 mt-0 mb-4 list-none">
          
                 <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-dollar text-xl text-blue-500"></i>
                </div>
                <span class="text-900 line-height-3">{{tableItem.name}} 
                    <span class="text-700">пояснение<span class="text-blue-500">цена</span></span>
                </span>
            </li>     
        </ul> 
 </TransitionGroup>

  
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

