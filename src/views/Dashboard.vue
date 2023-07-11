<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch } from 'vue';
import { useTablesList } from '../stores/tablesStore'
import TaskItem from '../components/TaskItem.vue'

import { socket } from "../socket";



const tablesList = useTablesList();


const load = async () => {
    await tablesList.getAllTables()

}

const socketA = () => {
    console.log(888)
   socket.emit("create", {name: "стас"}, () => {
        console.log(5465)
      });

}
load()




</script>

<template>
    <div class="grid">

        <div class="col-12 xl:col-7">

            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5 @click="socketA">В работе</h5>

                </div>
                <TaskItem :tableItemsWork=tablesList.activeTables />

            </div>

        </div>
        <div class="col-12 xl:col-5">

            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Бронь</h5>

                </div>

                <TaskItem :tableItems=tablesList.busyTables />


            </div>

        </div>
    </div>
</template>
