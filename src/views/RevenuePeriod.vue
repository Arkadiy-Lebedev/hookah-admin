<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'
import MoreOrder from '../components/moreOrder.vue'

const isModalOrder = ref<boolean>(false)

const ordersMaster = ref()
const orderId = ref<number>(0)
const ordersMasterGroup = ref({})
const ordersMasterGroupTable = ref({})
const date = ref([])

const chartData = ref({
    labels: Object.keys(ordersMasterGroup.value),
    datasets: [
        {
            label: 'Sales',
            data: [540],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
            borderWidth: 1
        }
    ]
});
const chartOptions = ref({
    scales: {
        y: {
            beginAtZero: true
        }
    }
});



const getOrders = async (arr) => {
  date.value = arr

}


watch(date, async () => { 
console.log(date.value)
 const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
      // const nowDay = new Date()
  

  if(!date.value.includes(null)){
      const  dates = date.value.map(el => el.toLocaleDateString('ru-RU', options).split('.').reverse().join('-') )
      const { data } = await axios.post(`${apiMain}api/master/analitic/orders/period`, {
    dateOne:dates[0],
    dateTwo:dates[1],
  })

  ordersMaster.value = data
  ordersMasterGroup.value = data.data.reduce((acc, c) => (c.dateStart in acc ? acc[c.dateStart].push(c) : acc[c.dateStart] = [c], acc), {});

  } else {
    return
  }


  
  chartData.value = {
    labels: Object.keys(ordersMasterGroup.value),
    datasets: [
        {
            label: 'Доход',
            data: Object.values(ordersMasterGroup.value).map(el => el.reduce((acc, num) => acc +num.total_price, 0)),
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
            borderWidth: 1
        }
    ]
}


//группировка по столам
const groupedArray = ordersMaster.value.data.reduce((acc, obj) => {
  const date = obj.number;
  if (!acc[date]) {
    acc[date] = {
      table: date,
      array: [],
      total: 0,
      dohod:0,
      check:0
    };
  }
  acc[date].array.push(obj);
  acc[date].total += obj.total_price;
  acc[date].dohod += obj.total;
  acc[date].check =  acc[date].check + 1;
  return acc;
}, {});

ordersMasterGroupTable.value = groupedArray




//группировка по дням
Object.values(ordersMasterGroupTable.value).forEach(el => {
 
  const groupedArrayDate =   el.array.reduce((acc, obj) => {
  const date = obj.dateStart;
  if (!acc[date]) {
    acc[date] = {
      date: date,
      array: [],
      total: 0,
      dohod:0,
      check:0
    };
  }
  acc[date].array.push(obj);
  acc[date].total += obj.total_price;
  acc[date].dohod += obj.total;
   acc[date].check =  acc[date].check + 1;
  
  return acc;
}, {});


el.array = Object.values(groupedArrayDate)
})



})

getOrders([new Date(), new Date()])

const openOrder =(id:number)=> {
  orderId.value = id
  isModalOrder.value= true
}

const closeModal = () => {
  isModalOrder.value = false
}


</script>
<template>
    <Dialog
    header="Товары"
    v-model:visible="isModalOrder"
    :breakpoints="{ '1420px': '60vw', '960px': '80vw', '700px': '90vw', '640px': '99vw' }"
    :style="{ width: '60vw' }"
    :modal="true"
  >
    <MoreOrder :id="orderId" @closeModal="closeModal"></MoreOrder>
  </Dialog>

  <div class="grid">

    <div class="ье- col-12 lg:col-12 xl:col-12">
      <div class="card mb-0">
        <h5 class="mb-5">Аналитика:: </h5>
        <Calendar v-model="date" dateFormat="dd.mm.yy" showIcon touchUI  selectionMode="range" :manualInput="false"/> 
 

<br>


        <div class="card__items">

          <Chart type="bar" :data="chartData" :options="chartOptions" />


        </div>

        {{ Object.values(ordersMasterGroupTable) }}   

<br>
<br>

  <div v-for="(elem, i) of Object.values(ordersMasterGroupTable)" :key="elem.table">
<br>
    стол {{elem.table}}  доход  {{elem.total}} без скидки {{ elem.dohod }} чеков: {{ elem.check }} 
    
  <div v-for="(el, i) of elem.array" :key="el.date">

    дата {{el.date}} заработано {{el.total}} без скидки {{el.dohod}} чеков: {{ el.check }} 

      <div v-for="(element, i) of el.array" :key="element.bookingId">
    номер заказа <p @click="openOrder(element.bookingId)"> {{ element.bookingId }} </p> доход {{ element.total_price }} без скидки {{ element.total }}
      </div>

      </div>
  </div>

       
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
