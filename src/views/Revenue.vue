<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'


const ordersMaster = ref()
const ordersMasterGroup = ref({})
const date = ref()

const expandedRows = ref([])

const getOrders = async (id) => {
  date.value = id

}


watch(date, async () => { 
  const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
      // const nowDay = new Date()
    const dates = date.value.toLocaleDateString('ru-RU', options)
   const  dateNow = dates.split('.').reverse().join('-') 

      const { data } = await axios.post(`${apiMain}api/master/analitic/orders`, {
    id:dateNow
  })
  ordersMaster.value = data

  const dataGodeGroup = data.data.reduce((acc, c) => (c.label in acc ? acc[c.label].push(c) : acc[c.label] = [c], acc), {});
  console.log(dataGodeGroup)
  ordersMasterGroup.value = dataGodeGroup
})

getOrders(new Date())


</script>
<template>

  <div class="grid">

    <div class="ье- col-12 lg:col-12 xl:col-12">
      <div class="card mb-0">
        <h5 class="mb-5">Аналитика:: </h5>
        <Calendar v-model="date" dateFormat="dd.mm.yy" showIcon touchUI /> 
 
        <div class="card__items">
<p>Чеки: {{ ordersMaster?.data?.length }}</p> 
<p>Общая сумма: {{  ordersMaster?.total}}</p> 
<p>Средний чек: {{  ordersMaster?.total / ordersMaster?.data?.length}}</p> 
<!-- {{ ordersMaster }} -->


        </div>


        <!-- <div class="card">
        <DataTable v-model:expandedRows="expandedRows" :value="ordersMaster?.data" dataKey="key"
                 tableStyle="min-width: 60rem">
            <template #header>

            </template>
            <Column expander style="width: 5rem" />
            <Column  field="label" header="label"></Column>
        
            
          
       
            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Orders for </h5>
                    <DataTable :value="slotProps.data.children" >
                      <Column style="width: 5rem" />
                        <Column field="name" header="status" ></Column>
                       
                     
                
                  
                    </DataTable>
                </div>
            </template>
        </DataTable>
  
    </div> -->
        
    <!-- {{Object.values(ordersMasterGroup) }} -->

    <div class="mt-5" v-for="el of Object.values(ordersMasterGroup)" :key="el[0].key">
    стол№ {{ el[0].label }}  прибыль: {{el.reduce((acc, num) => acc + num.summ, 0) }}
    <div v-for="el2 of el" :key="el2.key">

      <p>заказ -
    {{ el2.booking }}    время
    {{ el2.time }}  цена: {{ el2.summ   }}</p>   
Статус {{el2.children[0].status == "succes" ? "Закрыт" : "В работе"}}

    </div>
    </div>

    
  

       
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
