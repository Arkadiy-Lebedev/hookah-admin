import { ref } from 'vue'
import { defineStore } from 'pinia'




export const useDateStore = defineStore('dateStore', () => {
  const dateInBooking = ref<string>('') 
 
 
  const entryDate = (dateMy: Date) => {   
    console.log(dateMy)
    console.log(new Date())
     const optionsWithoutWeekday = { year: 'numeric', month: '2-digit', day: 'numeric' } as const;
      // const nowDay = new Date()
      
    const date = dateMy.toLocaleDateString('ru-RU', optionsWithoutWeekday);
      const dateNow = date.split('.').reverse().join('-') 
    dateInBooking.value = dateNow  
  }


  return { dateInBooking, entryDate }
})
