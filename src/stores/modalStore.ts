import { ref } from 'vue'
import { defineStore } from 'pinia'




export const useModalStore = defineStore('modalStore', () => {
  const modalAddProduct = ref<boolean>(false) 
  const modalEditProduct = ref<boolean>(false) 
 
 


  return { modalAddProduct, modalEditProduct }
})
