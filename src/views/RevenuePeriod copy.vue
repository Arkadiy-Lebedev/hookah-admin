<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'


const ordersMaster = ref()
const ordersMasterGroup = ref({})
const ordersMasterGroupBooking = ref({})
const ordersMasterGroupTable = ref({})
const ordersMasterGroupDay = ref({})

const totalPay = ref()

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


// const arrayTotal = computed(() => {  
//   const array = Object.values(ordersMasterGroup.value).map(el => el.reduce((acc, num) => acc + num.price * num.count, 0))  
    
//   return array
// })


const getOrders = async (arr) => {
  date.value = arr

}


watch(date, async () => { 
  const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
      // const nowDay = new Date()
    const  dates = date.value.map(el => el.toLocaleDateString('ru-RU', options).split('.').reverse().join('-') )


      const { data } = await axios.post(`${apiMain}api/master/analitic/orders/period`, {
    dateOne:dates[0],
    dateTwo:dates[1],
  })
  ordersMaster.value = data
  ordersMasterGroup.value = data.data.reduce((acc, c) => (c.dateStart in acc ? acc[c.dateStart].push(c) : acc[c.dateStart] = [c], acc), {});


  chartData.value = {
    labels: Object.keys(ordersMasterGroup.value),
    datasets: [
        {
            label: 'Доход',
            data: Object.values(ordersMasterGroup.value).map(el => el.reduce((acc, num) => acc + (num.price * num.count) - (num.price * num.count * (num.sales/100)), 0)),
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
            borderWidth: 1
        }
    ]
}


// сортировка по столам изначально 
// let allbuyGroupTable = []
// Object.values(ordersMaster.value).map(el => {   

//   allbuyGroupTable.push(el.reduce((acc, c) => (c.number in acc ? acc[c.number].push(c) : acc[c.number] = [c], acc), {}))
//   })
  
//   console.log(ordersMasterGroup.value)
//   ordersMasterGroupTable.value = allbuyGroupTable


  let allbuyGroupTable = []
Object.values(ordersMaster.value).map(el => {   

  allbuyGroupTable.push(el.reduce((acc, c) => {

   if(c.number in acc){
    acc[c.number].push(c)
   } else {
    acc[c.number] = [c]
   }   
   
    return acc
  }, {


  }))
  })
  
  console.log(ordersMasterGroup.value)
  ordersMasterGroupTable.value = allbuyGroupTable






// сортировка по группы столов по дням 
  
// let allbuyGroupDay = []
// ordersMasterGroupTable.value.forEach(el => {
//   for (let key in el) {  
//   allbuyGroupDay.push({[key]: el[key].reduce((acc, c) => (c.dateStart in acc ? acc[c.dateStart].push(c) : acc[c.dateStart] = [c], acc), {})})
// }
// console.log()
// });


let allbuyGroupDay = []
ordersMasterGroupTable.value.forEach(el => {
  for (let key in el) {  
    let def =  el[key].reduce(function(acc, c) {
    
    let rr = (c.dateStart in acc ? acc[c.dateStart].push(c) : acc[c.dateStart] = [c], acc)
  
    return rr
  }, {})
  console.log(def)

  let defArr = []
  for (let key in def) {  
console.log(key)
defArr.push({[key]: def[key].reduce((acc, c) => (c.booking in acc ? acc[c.booking].push(c) : acc[c.booking] = [c], acc), {})})
  }

  allbuyGroupDay.push({[key]: defArr})



}
});



// сортировка по группы дней по закзам 
let allbuyGroupGode = []
for (let key in ordersMasterGroup.value) {  
  allbuyGroupGode.push({[key]: ordersMasterGroup.value[key].reduce((acc, c) => (c.booking in acc ? acc[c.booking].push(c) : acc[c.booking] = [c], acc), {})})
  



//     allbuyGroupGode.push(key)


// }

  // allbuyGroupGode.push({[key]: ordersMasterGroup.value[key]})


// Object.values(ordersMasterGroup.value).map(el => {   
//     allbuyGroupGode.push(el.reduce((acc, c) => (c.booking in acc ? acc[c.booking].push(c) : acc[c.booking] = [c], acc), {}))

//   })

}
  // let cc = allbuyGroupGode.reduce((acc, c) => (c.booking in acc ? acc[c.booking].push(c) : acc[c.booking] = [c], acc), {})

  console.log(ordersMasterGroup.value)
ordersMasterGroupBooking.value = allbuyGroupGode

ordersMasterGroupDay.value = allbuyGroupDay






})

getOrders([new Date(), new Date()])


</script>
<template>


  <div class="grid">

    <div class="ье- col-12 lg:col-12 xl:col-12">
      <div class="card mb-0">
        <h5 class="mb-5">Аналитика:: </h5>
        <Calendar v-model="date" dateFormat="dd.mm.yy" showIcon touchUI  selectionMode="range" :manualInput="false"/> 
 
<!-- {{ date }}
{{ ordersMaster }} -->
<br>


<br><br>
{{ ordersMasterGroupTable }}

<div v-for="(el,i) of ordersMasterGroupDay" :key="i">
  <p>
<!-- стол: {{ el }} -->
стол № {{ Object.keys(el) }}

<br>

{{ ordersMasterGroupTable.map(elem => elem) }}
<!-- {{ el[Object.keys(el)].map(elem => Object.values(elem).map(element => Object.values(element))) }} -->
<br>
<!-- элементы -->
<!-- {{ el[Object.keys(el)] }} -->

<div v-for="(elem,i) of el[Object.keys(el)]" :key="i+9999">
дата № {{ Object.keys(elem) }}
<br>
<!-- {{ elem[Object.keys(elem)] }} -->

<div v-for="(element,i) of elem[Object.keys(elem)] " :key="i+99999">
заказ № {{ i }}

</div>
</div>

  </p>
  
</div>




        <div class="card__items">

          <Chart type="bar" :data="chartData" :options="chartOptions" />




        </div>





    
  

       
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
