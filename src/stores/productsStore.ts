import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import type { IProduct, ICategories } from '../types/Iproduct'
import { apiMain } from "../api/api"

interface ICountProduct extends IProduct {
    count: number
}



export const useProductsList = defineStore('productsList', () => {
    const products = ref<ICountProduct[]>([])
    const product = ref<IProduct>()
    const categories = ref<ICategories[]>([])

    const getProducts = async () => {        
        try {
            const { data } = await axios.get(`${apiMain}api/products`)
            console.log(data.data)
            const newArray = data.data.map((el:any) => el = { ...el, count: 1 }) 
            products.value = newArray 
        } catch (e) {
            console.log(e)
        }
    }

    const getProductsInCategores = async (idCategories:number) => {
        try {
            
            const { data } = await axios.post(`${apiMain}api/products/categories`, { id: idCategories })
            console.log(data.data)
            const newArray = data.data.map((el:any) => el = { ...el, count: 1 })
            products.value = newArray
        } catch (e) {
            console.log(e)
        }
    }
    const getCategories = async () => {
        try {
           
            const { data } = await axios.get(`${apiMain}api/products/categories/`)
            categories.value = data.data
            console.log(categories)
        } catch (e) {
            console.log(e)
        }
    }

    const productInId = (id:number) => {    
        product.value = products.value.find(el => el.id == id)
        console.log(product)    
    }
   
    return { products, getProducts, getCategories, categories, productInId, product, getProductsInCategores }
})
