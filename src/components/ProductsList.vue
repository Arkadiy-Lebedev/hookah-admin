<script setup lang="ts">
import { ref } from 'vue';
import { useTablesList } from '../stores/tablesStore'
import { useProductsList } from '../stores/productsStore'
import { FilterMatchMode } from 'primevue/api';


const tablesList = useTablesList();
const productsList = useProductsList();
productsList.getProducts()
productsList.getCategories()

interface Props {
    idBooking: number   
}

const emit = defineEmits<{
    (e: 'closeModal'): void   
}>()

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const addOrder = (idBooking: number, idProduct: number, count: number) => {
    tablesList.addOrderForBooking(idBooking, idProduct, count)
     emit('closeModal')    
}



    

defineProps<Props>()

</script>

<template>
    <div class="categories__btn-group">
<Button v-for="cateries in productsList.categories" :key="cateries.id" @click=" productsList.getProductsInCategores(cateries.id)" :label="cateries.type" severity="warning"  size="large" outlined  />
    </div>  
  
 
         <DataTable scrollable scrollHeight="60vh"  filterDisplay="row" v-model:filters="filters" :value="productsList.products" dataKey="id"
        :globalFilterFields="['name', 'type']" tableStyle="min-width: 30rem"  class="p-datatable-sm">
        <template #header>
            <div class="flex justify-content-end">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Поиск" />
                </span>
            </div>
        </template>
        <template #empty> Не найдено. </template>
        <template #loading> Загрузка... </template>
        <Column sortable  header="Название" style="min-width: 8rem">
            <template #body="{ data }">
                <p class="product__name">{{ data.name }} </p>   
            </template>
        </Column>
        <Column sortable header="Категория" style="min-width: 8rem">
            <template #body="{ data }">
                <p>{{ data.type }} </p>   
            </template>
        </Column>
        <Column  style="min-width: 5rem">
                <template #body="{ data }">
                     <img :src=data.image_product class="w-6rem shadow-2 border-round" />
                </template>
            </Column>
        <Column header="Цена" style="min-width: 6rem">
            <template #body="{ data }">
                {{ data.price }} руб.
            </template>
        </Column>
        <Column header="Кол-во" style="min-width: 6rem">
            <template #body="{ data }">

                <InputNumber v-model="data.count" showButtons inputId="minmax" :min="1" :max="100" inputClass="input__number" />


            </template>
        </Column>
        <Column header="" style="min-width: 6rem" >
            <template #body="{ data }">
                <Button @click="addOrder(idBooking, data.id, data.count)" label="Добавить" size="small" />
                <!-- <p @click="addOrder(idBooking, data.id, data.count)">Добавить</p> -->
            </template>

        </Column>

    </DataTable>

</template>

<style >
.categories__btn-group{
    display:flex;
    gap:10px;
    padding: 10px;
}
.input__number {
    width: 45px !important;
};
.ww{
    width: 300px !important;
    
}
</style>

