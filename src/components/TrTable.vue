<script setup lang="ts">
import { ref } from 'vue';
import TrTableOrder from '../components/TrTableOrder.vue'


interface Props {
    arrays: any
}

const props = defineProps<Props>()

const trDate = ref<boolean>(false)

const showDate = () => {
    trDate.value = !trDate.value
}

</script>

<template>
    <tr>
        <td class="table-number" @click="showDate">стол {{ arrays.table }} <i v-if="!trDate" class="pi pi-angle-down" style="font-size: 0.8rem"></i> <i v-else class="pi pi-angle-up" style="font-size: 0.8rem"></i> </td>
        <td></td>
        <td>{{ arrays.check }} </td>
        <td>{{ arrays.total }} </td>
        <td>{{ arrays.total / arrays.check }} </td>
        <td>{{ arrays.dohod - arrays.total }} </td>
    </tr>
  
      
  <TrTableOrder v-if="trDate" v-for="(el) of arrays.array" :key="el.date" :obj="el" />

      
      
    
        
  
</template>

<style scoped>
tr, td {
    vertical-align: middle;
    text-align: center;
       background-color: rgba(217, 226, 244, 1);
     border: 1px solid rgba(206, 206, 206, 1); 
    border-spacing:0 !important;
      padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;

        color: #3F3F3F;

font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
}

.table-number{
     white-space: nowrap;
       cursor: pointer;
}


.table-number:hover{
    background:rgb(228, 228, 228);
}
</style>

