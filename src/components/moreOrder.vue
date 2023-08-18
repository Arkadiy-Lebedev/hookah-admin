<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"


interface Props {
    id: number
}
const props = defineProps<Props>()

const orders = ref()

const getOrder = async () => {
const { data } = await axios.post(`${apiMain}api/master/analitic/orders`, {
    id:props.id    
  })
  orders.value = data
}
console.log(props)
getOrder()

</script>

<template>
    <Toast />
  <div class="p-fluid">
    sdfgsfdgfd {{ id }}
    <br>
    {{ orders }}
  
  </div>
</template>

<style >



</style>


