<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'

import TrTable from '../components/TrTable.vue'



const ordersMaster = ref()

const ordersMasterGroup = ref({})
// const ordersMasterGroupTable = ref({})
const ordersMasterGroupTable = ref<Object >({})

const date = ref<[any]>([null])
const allTotal = ref<number>(0)
const allCheck = ref<number>(0)

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



const getOrders = async (arr:any) => {
  date.value = arr

}

const numberRussion = (num:number) => {
  return num.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

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

allTotal.value = data.data.reduce((acc:number, num:any) => acc + num.total_price, 0)
    allCheck.value = data.data.length

  ordersMaster.value = data
  ordersMasterGroup.value = data.data.reduce((acc: any, c:any) => (c.dateStart in acc ? acc[c.dateStart].push(c) : acc[c.dateStart] = [c], acc), {} as any);

  } else {
    return
  }


  
  interface Order {
  bookingId: number;
  number: number;
  timeStart: string;
  dateStart: string;
  status: string;
  sales: any;
  total: any;
  total_price: number | null;
}



const totalPrices: number[] = Object.values(ordersMasterGroup.value).map((group: any[any]) => {
  return group.reduce((acc: number, num: any) => acc + (num.total_price || 0), 0);
});
  
  chartData.value = {
    labels: Object.keys(ordersMasterGroup.value),
    datasets: [
        {
            label: 'Доход',
            data: totalPrices,
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
            borderWidth: 1
        }
    ]
}
// Object.values(ordersMasterGroup.value).map(el => el.reduce((acc:number, num:any) => acc +num.total_price, 0)),

//группировка по столам
const groupedArray = ordersMaster.value.data.reduce((acc:any, obj:any) => {
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
  return acc as any;
}, {});

ordersMasterGroupTable.value = groupedArray




//группировка по дням
Object.values(ordersMasterGroupTable.value).forEach((el: any) => {
 
  const groupedArrayDate =   el.array.reduce((acc:any, obj:any) => {
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
}, {} as any);


el.array = Object.values(groupedArrayDate)
})



})

getOrders([new Date(), new Date()])


interface TableArray {
  table: number,
  array: [any],
  total: number,
  dohod: number,
  check: number

}

</script>
<template>


  <div class="grid">

    <div class="ье- col-12 lg:col-12 xl:col-12">
      <div class="card mb-0">
        <h5 class="mb-5">Аналитика:: </h5>
        <Calendar v-model="date" dateFormat="dd.mm.yy" showIcon touchUI  selectionMode="range" :manualInput="false"/> 


 <br>






        <!-- {{ Object.values(ordersMasterGroupTable) }}    -->

<br>

<div class="items">
  <div class="item">
    <div class="item__text">
      <p class="item__text-title ">Выручка</p>
       <p class="item__text-subtitle ">{{ numberRussion(allTotal) }} руб.</p>
    </div>    
  </div>

  <div class="item">
    <div class="item__text">
      <p class="item__text-title ">Средний чек</p>
       <p class="item__text-subtitle ">{{ numberRussion(allTotal / allCheck) }} руб.</p>
    </div>    
  </div>
   <div class="item">
    <div class="item__text">
      <p class="item__text-title ">Чеки</p>
       <p class="item__text-subtitle ">{{ allCheck }}</p>
    </div>    
  </div>

</div>
<br>

  <!-- <div v-for="(elem, i) of Object.values(ordersMasterGroupTable)" :key="elem.table">
<br>
    стол {{elem.table}}  доход  {{elem.total}} без скидки {{ elem.dohod }} чеков: {{ elem.check }} 
    
  <div v-for="(el, i) of elem.array" :key="el.date">

    дата {{el.date}} заработано {{el.total}} без скидки {{el.dohod}} чеков: {{ el.check }} 

      <div v-for="(element, i) of el.array" :key="element.bookingId">
    номер заказа <p @click="openOrder(element.bookingId, el.date)"> {{ element.bookingId }} </p> доход {{ element.total_price }} без скидки {{ element.total }}
      </div>

      </div>
  </div> -->



  <table>
            <tr>
                <th></th>
                <th>Дата продажи</th>
                <th>Количество чеков</th>
                <th>Сумма продажи</th>
                <th>Средний чек</th>
                <th>Итоговая скидка</th>
            </tr>
            
           <TrTable v-for="(elem) of Object.values(ordersMasterGroupTable)" :key="(elem.table)" :arrays="elem"/>
           

            <!-- Добавьте другие строки таблицы по аналогии -->
        </table> 
        <div class="card__items">

<Chart type="bar" :data="chartData" :options="chartOptions" />


</div>      
      </div>      
    </div>     
  </div>

</template>

<style scoped>
.card__items{
  margin-top: 4rem;
}
table {
    width: 100%;
    border-collapse: collapse;
}

tr, th {
    vertical-align: middle;
    text-align: center;
    background-color: rgba(238, 242, 255, 1);
   border: 1px solid rgba(206, 206, 206, 1); 
    border-spacing:0 !important;
      padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
  
    color: #3F3F3F;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;

}

.items{
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.item{
  border-radius: 5px;
background: #E9F0F6;

}

.item__text{
  padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 5rem;
    padding-right: 5rem;
}

.item__text p{
margin: 0;
}

.item__text-title {color: #3F3F3F;
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
text-align:center
}

.item__text-subtitle {
  color: #37A2FE;
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
text-align:center;
margin-top:5px !important;
}
</style>
