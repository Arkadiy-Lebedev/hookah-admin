import { io } from 'socket.io-client'
import { reactive } from 'vue'
import { useDateStore } from './stores/dateStore'
import { useTablesList } from './stores/tablesStore'
const dateStore = useDateStore()

const tablesList = useTablesList()

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
})

const upLoad = async () => {
  await tablesList.getTablesInDate(dateStore.dateInBooking)
}

// "undefined" means the URL will be computed from the `window.location` object
// const URL = "http://localhost:8000";
const URL = 'https://myhookah.ru'

export const socket = io(URL)

socket.on('update', () => {
  upLoad()
})

socket.on('connect', (socket) => {
  console.log('connect', socket)
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('foo', (...args) => {
  state.fooEvents.push(args)
})

socket.on('bar', (...args) => {
  state.barEvents.push(args)
})
