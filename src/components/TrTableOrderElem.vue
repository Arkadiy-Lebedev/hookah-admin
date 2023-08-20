<script setup lang="ts">
import { ref } from 'vue';
import MoreOrder from '../components/moreOrder.vue'

interface Props {
    obj: any,
    date: string
}

const props = defineProps<Props>()
const orderId = ref<number>(0)
const dateBooking = ref<string>('')
const isModalOrder = ref<boolean>(false)

const openOrder = (id: number, date: string) => {

    orderId.value = id
    dateBooking.value = date
    isModalOrder.value = true
    console.log(id)
    console.log(date)
}

</script>

<template>
    <Dialog header="Заказ" v-model:visible="isModalOrder" :modal="true">
        <MoreOrder :id="orderId" :date="dateBooking" @closeModal="closeModal"></MoreOrder>
    </Dialog>
    <tr>
        <td class="table-order"  colspan="3" @click="openOrder(obj.bookingId, props.date)" >Чек {{ obj.bookingId }} - 
            <span class="succes" v-if="obj.status == 'succes'">закрыт</span>
        <span class="busy" v-if="obj.status == 'busy'">бронь на {{ obj.timeStart }}</span>
        <span class="active" v-if="obj.status == 'active'">в работе</span>
        </td>
        <td>{{ obj.total_price }} </td>
        <td></td>
        <td>{{ obj.total - obj.total_price }} </td>
    </tr>
</template>

<style scoped>
tr, td {
    vertical-align: middle;
    text-align: center;
       background-color: rgba(255, 255, 255, 1);
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

.table-order{
    cursor: pointer;
    color: #161EED;
}

.table-order:hover{
    background:rgb(228, 228, 228);
}

.succes{
    color:rgb(64, 2, 196)
}
.busy{
    color:rgb(190, 146, 0)
}

.active{
    color:rgb(0, 151, 40)
}

</style>

