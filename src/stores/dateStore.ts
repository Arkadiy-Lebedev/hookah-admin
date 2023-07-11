import { ref } from 'vue'
import { defineStore } from 'pinia'




export const useDateStore = defineStore('dateStore', () => {
  const dateInBooking = ref<string>() 
 
 
  const entryDate = (dateMy: string) => {   
    console.log(dateMy)
    console.log(new Date())
      const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
      // const nowDay = new Date()
    const date = dateMy.toLocaleDateString('ru-RU', options)
      const dateNow = date.split('.').reverse().join('-') 
    dateInBooking.value = dateNow  
  }


  return { dateInBooking, entryDate }
})
