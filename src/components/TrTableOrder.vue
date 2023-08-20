<script setup lang="ts">
import { ref } from 'vue';
import TrTableOrderElem from '../components/TrTableOrderElem.vue'

interface Props {
    obj: any,
}

const props = defineProps<Props>()

const isOrder = ref<boolean>(false)

const visible = () => {
    isOrder.value = !isOrder.value
}

</script>

<template>
    <tr>
        <td></td>
        <td class="table-date" @click="visible">{{ obj.date }} <i v-if="!isOrder" class="pi pi-angle-down" style="font-size: 0.8rem"></i> <i v-else class="pi pi-angle-up" style="font-size: 0.8rem"></i> </td>
        <td>{{ obj.check }} </td>
        <td>{{ obj.total }} </td>
        <td>{{ obj.total / obj.check }} </td>
        <td>{{ obj.dohod - obj.total }} </td>
    </tr>
    <template v-if="isOrder">
        <TrTableOrderElem v-for="(element) of obj.array" :key="element.bookingId" :obj="element" :date="obj.date" />
    </template>
</template>

<style scoped>
tr, td {
    vertical-align: middle;
    text-align: center;
       background-color: rgba(246, 247, 250, 1);
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

.table-date{
     white-space: nowrap;
       cursor: pointer;
}

.table-date:hover{
    background:rgb(228, 228, 228);
}
</style>

