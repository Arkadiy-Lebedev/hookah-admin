<script setup lang="ts">
import { ref } from 'vue';


interface Props {
    arrays: any
}

const props = defineProps<Props>()

console.log(props.arrays)

const trDate = ref<boolean>(false)

const showDate = () => {
    trDate.value=true
}

</script>

<template>
    <!-- <template v-for="(elem) of array" :key="elem.table">
        <tr>
            <td @click="showDate">стол {{ elem.table }} </td>
            <td></td>
            <td>{{ elem.check }} </td>
            <td>{{ elem.total }} </td>
            <td>{{ elem.dohod }} </td>
        </tr> -->

         <template >
            <tr>
                <td @click="showDate">стол {{ arrays.table }} </td>
                <td>dg</td>
                <td> dfg</td>
                <td>dfg</td>
                <td> dfg</td>
            </tr>

        <!-- <template v-for="(el) of elem.array" :key="el.date">
            <tr v-if="trDate">
                <td></td>
                <td>{{ el.date }} </td>
                <td>{{ el.check }} </td>
                <td>{{ el.total }} </td>
                <td>{{ el.dohod }} </td>
            </tr>  


        <template v-for="(element) of el.array" :key="element.bookingId">
            <tr>
                <td></td>
                <td>{{ element.bookingId }} </td>
                <td> </td>
                <td>{{ element.total_price }} </td>
                <td>{{ element.total }} </td>
            </tr>


        </template>

   </template> -->

    </template>
</template>

<style scoped></style>

