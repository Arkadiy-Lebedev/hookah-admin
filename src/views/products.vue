<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import addProduct from '../components/addProduct.vue'
import editProduct from '../components/editProduct.vue'
import { useModalStore } from '../stores/modalStore'
import { useProductsList } from '../stores/productsStore'

import axios from 'axios'
import { apiMain } from '../api/api'
import delButton from '../components/delButton.vue'

const toast = useToast()

const ModalStore = useModalStore()
const productsList = useProductsList()
productsList.getProducts()

const loading1 = ref(null)
const deleteProductDialog = ref(false)
const productForDel = ref(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const showModal = () => {
  ModalStore.modalAddProduct = true
}

const showModalEdit = (id: number) => {
  productsList.productInId(id)
  ModalStore.modalEditProduct = true
}

const toastAction = (status) => {
  console.log(status)
  console.log(6666)
  if (status == 'success') {
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Изменения внесены', life: 3000 })
  }
  if (status == 'add') {
    toast.add({ severity: 'success', summary: 'Товар добавлен', detail: '', life: 3000 })
  }
  productsList.getProducts()
  ModalStore.modalEditProduct = false
  ModalStore.modalAddProduct = false
}

const delcofirm = (data) => {
  deleteProductDialog.value = true
  productForDel.value = data
}

const delProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${apiMain}api/products`, {
      data: { id: id }
    })
    deleteProductDialog.value = false
    productsList.getProducts()
    toast.add({ severity: 'warn', summary: 'Товар удален', detail: '', life: 3000 })
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div class="card">
    <Toast />
    <h5>Продукты</h5>
    <Button label="Добавить" @click="showModal()" class="mr-2 mb-2" size="small" />

    <div class="mt-3">
      <DataTable
        v-model:filters="filters"
        :value="productsList.products"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading1"
        :globalFilterFields="['name', 'type']"
      >
        <template #header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Поиск" />
            </span>
          </div>
        </template>
        <template #empty> Не найдено. </template>
        <template #loading> Загрузка... </template>
        <Column sortable field="name" header="Название" style="min-width: 12rem">
          <template #body="{ data }">
            <p class="product__name" @click="showModalEdit(data.id)">{{ data.name }}</p>
          </template>
        </Column>
        <Column header=" ">
          <template #body="{ data }">
            <img :src="data.image_product" class="w-6rem shadow-2 border-round" />
          </template>
        </Column>
        <Column sortable field="type" header="Категория" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.type }}
          </template>
        </Column>
        <Column field="type" header="Описание" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.discription_product }}
          </template>
        </Column>
        <Column field="type" header="Цена" style="min-width: 12rem">
          <template #body="{ data }"> {{ data.price }} руб. </template>
        </Column>
        <Column field="type" header="Цена" style="min-width: 3rem">
          <template #body="{ data }">
            <delButton @click="delcofirm(data)" />
            <!-- <ConfirmPopup></ConfirmPopup>  -->
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <Dialog
    header="Добавить:"
    v-model:visible="ModalStore.modalAddProduct"
    :breakpoints="{ '1420px': '60vw', '960px': '80vw', '700px': '90vw', '640px': '99vw' }"
    :style="{ width: '40vw' }"
    :modal="true"
  >
    <addProduct @toast="toastAction"></addProduct>
  </Dialog>
  <Dialog
    header="Редактировать:"
    v-model:visible="ModalStore.modalEditProduct"
    :breakpoints="{ '1420px': '60vw', '960px': '80vw', '700px': '90vw', '640px': '99vw' }"
    :style="{ width: '40vw' }"
    :modal="true"
  >
    <editProduct @toast="toastAction"></editProduct>
  </Dialog>

  <Dialog
    v-model:visible="deleteProductDialog"
    :style="{ width: '450px' }"
    header="Удаление"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="productForDel"
        >Вы действительно хотите удалить товар: <b>{{ productForDel.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="Нет" icon="pi pi-times" text @click="deleteProductDialog = false" />
      <Button
        severity="danger"
        label="Да"
        icon="pi pi-check"
        text
        @click="delProduct(productForDel.id)"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.product__name:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
