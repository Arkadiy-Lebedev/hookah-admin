<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'
import editCategories from '../components/editCategories.vue'
import addCategories from '../components/addCategories.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface ICategories {
  id: number
  type: string
  image: string
  sort: number
}

const categories = ref<ICategories[]>()
const isModal = ref<boolean>(false)
const isModalAdd = ref<boolean>(false)
const categoria = ref<ICategories>()

const getCategories = async () => {
  try {
    const { data } = await axios.get(`${apiMain}api/products/categories`)
    categories.value = data.data
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
getCategories()

const closeModal = (status:string) => {
  isModal.value = false
  isModalAdd.value = false
  getCategories()
  if (status == 'success') {
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Изменения внесены', life: 3000 })
  }
  if (status == 'successadd') {
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Категория добавлена', life: 3000 })
  }
    if (status == 'delete') {
    toast.add({ severity: 'info', summary: 'Категория удалена', detail: '', life: 3000 })
  }
}

const selectCategoria = (id:number) => {
  const categor = categories.value?.find((el) => el.id == id)
  if(categor){
    categoria.value = categor
  }
  
  isModal.value = true

}

const showModal = () => {
  isModalAdd.value = true
}
</script>
<template>
  <div class="grid">
    <div class="ье- col-12 lg:col-10 xl:col-7">
      <div class="card mb-0">
        <h5>Категории меню:</h5>
        <Button @click="showModal()" label="Добавить" class="mr-2 mb-5" size="small" />
        <div class="products">
          <div         
            v-for="categoria in categories"
            :key="categoria.id"
            class="products__items"
            @click="selectCategoria(categoria.id)"
          >
            <img :src="categoria.image" alt="кальян" />
            <p>{{ categoria.type }}</p>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      header="Редактировать:"
      v-model:visible="isModal"
      :breakpoints="{ '640px': '80vw' }"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <editCategories :categoria="categoria" @closeModal="closeModal"></editCategories>
    </Dialog>
    <Dialog
      header="Добавить категорию"
      v-model:visible="isModalAdd"
      :breakpoints="{ '640px': '80vw' }"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <addCategories @closeModal="closeModal"></addCategories>
    </Dialog>
    <Toast />
  </div>
</template>

<style scoped>
.products__items:hover {
  cursor: pointer;
  background: #3b3636;
}

.main__picture img {
  max-width: 100%;
}
.main__picture {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  margin-top: 1vh;
}
.products {
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
}
.products__items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #262626;
  padding: 28px;
  transition: all 0.3s ease;
}
.products__items p {
  color: #898989;
  font-size: 20px;
  font-family: Roboto;
}
.products__items img {
  max-width: 100%;
  margin-bottom: 20px;
}

@media (max-width: 460px) {
  .products__items p {
    font-size: 16px;
  }
}
@media (max-width: 420px) {
  .products__items {
    padding: 15px;
  }
  .products__items img {
    max-width: 80%;
    margin-bottom: 15px;
  }
  .inscription__hall {
    font-size: 16px;
  }
  .inscription__wrapper img {
    width: 17px;
  }
}
@media (max-width: 340px) {
  .products__items {
    padding: 10px;
  }
  .products__items img {
    max-width: 70%;
    margin-bottom: 10px;
  }
  .products__items p {
    font-size: 14px;
  }
  .inscription__hall {
    font-size: 14px;
  }
  .inscription__wrapper img {
    width: 15px;
  }
}
</style>
