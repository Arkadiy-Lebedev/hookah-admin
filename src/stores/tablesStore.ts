import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

import { apiMain } from "../api/api"
import { ITables } from "../types/ITables"



export const useTablesList = defineStore('tablesList', () => {
  const tables = ref<ITables[]>([])
  const ordersInBooking = ref([])


  const getAllTables = async () => {
    try {
      console.log(5656)
      const { data } = await axios.get(`${apiMain}api/work/booking`)
      tables.value = data.data
      console.log(tables.value)
      console.log(56)
    } catch (e) {
      console.log(e)
    }
  }

  const getTablesInDate = async (dates: string) => {
    console.log(dates)
    try {
      console.log(dates)
      const { data } = await axios.post(`${apiMain}api/work/booking/booking-date`, { date: dates })
      tables.value = data.data
      console.log(tables.value)
    } catch (e) {
      console.log(e)
    }

  }

  const getOrderInBooking = async (id: number | undefined) => {
    console.log(56756756)
    console.log(id)
    if (id) {
      try {
        console.log(id)
        const { data } = await axios.post(`${apiMain}api/orders/booking`, { id: id })
        ordersInBooking.value = data.data
        console.log(data.data)
      } catch (e) {
        console.log(e)
      }
    } else {
      ordersInBooking.value = []
    }

  }

  const addOrderForBooking = async (idBooking: number, idProduct: number, count: number) => {
    try {
      const { data } = await axios.post(`${apiMain}api/orders/add`, {
        idBooking: idBooking,
        idProduct: idProduct,
        count: count
      })
      getOrderInBooking(idBooking)
      console.log(data.data)
    } catch (e) {
      console.log(e)
    }
  }



  const activeTables = computed((): ITables[] => {
    const newArray = tables.value.filter((el) => el.status == "active")
    return newArray
  })
  const busyTables = computed(() => {
    const newArray = tables.value.filter((el) => el.status == "busy")
    const dataGodeGroup = newArray.reduce((acc, c) => (c.timeStart.split(' ')[0] in acc ? acc[c.timeStart.split(' ')[0]].push(c) : acc[c.timeStart.split(' ')[0]] = [c], acc), {});
    console.log(dataGodeGroup)
    return dataGodeGroup
  })

  const activeBooking = async (id: number) => {
    const item = tables.value.find(el => el.id == id)
    item.status = "active"
    try {
      const { data } = await axios.post(`${apiMain}api/admin/action_table`, {
        id: id
      })

      if (data) {
        const item = tables.value.find(el => el.id == id)
        item.status = "active"
        return { status: true }
      }
    } catch (e) {
      console.log(e)
    }

  }


  const table1Info = computed(() => (n): { tables: ITables[], status: string } => {
    let status = "free"

    const newArray = tables.value.filter((el) => el.number == n)
    const active = newArray.find(el => el.status == "active")

    if (active) {
      status = "active"
    } else {
      if (newArray.find(el => el.status == "busy")) {
        status = "busy"
      }
    }

    return {
      "tables": newArray,
      "status": status
    }

  })


  return { tables, getAllTables, activeTables, busyTables, activeBooking, getTablesInDate, table1Info, getOrderInBooking, ordersInBooking, addOrderForBooking }
})
