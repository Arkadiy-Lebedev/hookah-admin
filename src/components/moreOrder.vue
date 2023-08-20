<script setup lang="ts">
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';
import { ref, computed } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"


interface Props {
  id: number,
  date:string
}
const props = defineProps<Props>()

const orders = ref()
const isLoading = ref<boolean>(false)

const getOrder = async () => {
const { data } = await axios.post(`${apiMain}api/master/analitic/orders`, {
    id:props.id    
  })
  orders.value = data
  isLoading.value=true
}
console.log(props)
getOrder()

const totalPrice = computed((): number => {
  const array = orders.value?.data.reduce((acc, num) => acc + num.price * num.count, 0)
  return array
})

const totalPriceSale = computed(() => {
  const array = totalPrice.value - (totalPrice.value * (orders.value?.data[0]?.sales / 100))
  return array
})

</script>

<template>
    <Toast />
  <div class="p-fluid">


  <div v-if="isLoading" class="invoice">
    <div class="about">
        <div class="name">
               <Avatar icon="pi pi-user" class="mr-2" shape="circle" /> {{ orders?.client[0]?.name }}
               <p>{{ orders?.client[0]?.phone }}</p>
          </div>
        <div class="date">
              <p>Дата: {{ date }}</p>
          </div>
    </div>
   
          <div class="header">
              <h1> № {{ id }}</h1>
          </div>
          <template v-if="orders?.data.length > 0">
<div  v-for="(product,i) of orders?.data" :key="product.id + i" class="product">
              <div>
                  <p>{{ product.name }}</p>
                  <p>{{ product.price }} x {{ product.count }}</p>
               
              </div>
              <p>{{ product.price * product.count }}</p>
          </div>
          </template>
          
           <div v-else lass="product">
   
                <p>Товары отсутствуют</p>
            </div>
        
          <div v-if="orders?.data.length > 0" class="total">
              <p>Общая сумма: {{ totalPrice }}</p>
              <p>Скидка: {{ orders?.data[0]?.sales }}%</p>
              <p>Итого: {{ totalPriceSale }}</p>
          </div>
      </div>
      <div v-else class="div">
  <ProgressSpinner />
      </div>
  
  </div>
</template>

<style scoped>

     .invoice {
            width: 300px;
            margin: 0 auto;
        }

        .about{
          display: flex;
          justify-content: space-between;
            align-items:flex-end;
            padding-bottom: 5px;
            padding-top: 20px;
        }

           .date {
            text-align: right;
           
          
        }

        .header {
            text-align: center;
            background-color: #333;
            color: #fff;
            padding: 10px;
        }

        .header h1{
           
            color: #fff;
           
        }

        .product {
            border-bottom: 1px solid #ddd;
            padding: 5px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .product p{
            margin-bottom: 0;
        }

        .product:last-child {
            border-bottom: none;
        }

        .total {
            margin-top: 10px;
            padding: 10px;
            background-color: #f4f4f4;
            border-top: 1px solid #ddd;
        }

        .total p {
            margin: 0;
            font-weight: bold;
        }

</style>


