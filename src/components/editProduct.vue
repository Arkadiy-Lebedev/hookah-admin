<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import { useModalStore } from '../stores/modalStore'
import { useProductsList } from '../stores/productsStore'

const emit = defineEmits<{
    (e: 'toast', status: string): void
 
}>()

const ModalStore = useModalStore();
const productsList = useProductsList();
productsList.getCategories()

const progress = ref()
const textBtnFile = ref("изменить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref(productsList.product.image_product);
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const productItem = reactive({
  id: productsList.product.id,
  file: "",
  name: productsList.product.name,
  price: productsList.product.price,
  categories: productsList.product.categories_id,
  description: productsList.product.discription_product
});

const uploadImg = (e) => {
  const arrType = ["jpg", "jpeg"];
  let file = e.target.files[0];

  if (
    !arrType.includes(file.name.split(".").pop()) ||
    file.size > 1024 * 1024 * 2
  ) {
    isErrorTypeFile.value = true;

  } else {

    isErrorTypeFile.value = false;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    let that = e;
    reader.onload = function (e) {
      productItem.file = that.target.files[0];
      filesForAvatar.value =
        "data:image/png;base64," +
        e.target.result.substring(e.target.result.indexOf(",") + 1);
    };
    textBtnFile.value = "Изменить";
  }
};

const submitForm = () => {
  if (isErrorTypeFile.value) {
    return
  }
  loading.value = true;
  onProgress.value = true;
  let formData = new FormData();
  for (let key in productItem) {
    formData.append(key, productItem[key]);
  }

  axios
    .put(`${apiMain}api/products`, formData, {
      onUploadProgress: (e) => {
        progress.value = Math.min(
          Math.round((e.loaded * 100) / e.total),
          99
        );
      },
    })
    .then((data) => {
      console.log(456)
      if (data.status) {
        // ModalStore.modalEditProduct = false
         productsList.getProducts()
         emit("toast", "success")
      }


    }).catch((error) => {
      console.log(error);
      // toast.add({
      //   severity: "error",
      //   summary: "Что-то пошло не так",
      //   detail: `Ошибка: ${error.message}`,
      //   life: 3000,
      // });
    })
    .finally(() => {
      loading.value = false;
      loading.value = false;
      onProgress.value = false;
      progress.value = 100;

    });
}

</script>

<template>
  <div class="p-fluid">

  <form @submit.prevent="submitForm">
    <div class="img__group">
         <div class="filegroup " >
            <p >Изображение:</p>
        <label for="file" class="selectfile"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>
          
        <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg"
          @change="uploadImg($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error">Допустимый формат: только ".jpg, .jpeg". <br />
          Максимальный размер файла: 2мб</InlineMessage>
  
      </div>
      <div class="col-5">
         <Image v-if="filesForAvatar" :src="filesForAvatar" alt="Image" width="250"  />
      </div> 
      </div> 

  <div class="formgrid grid">
        <div class="field form__input col">
        <label for="productName">Название:</label>
        <InputText require v-model.trim="productItem.name" id="productName" type="product" aria-describedby="productHelp" />
      </div>
      <div class="field form__input col">
          <label >Категория:</label>
      <Dropdown v-model="productItem.categories" :options="productsList.categories" optionValue="id" optionLabel="type"
        placeholder="выбрать..." />
        </div>
     </div>
    <div class="field form__input">
      <label for="productPrice">Цена:</label>
      <InputNumber suffix=" руб." v-model.trim="productItem.price" id="productPrice" type="product" aria-describedby="productHelp" />
    </div>
    <div class="field form__input">
      <Textarea v-model.trim="productItem.description" rows="4" cols="35" placeholder="Описание товара" />
    </div>
    <div class="progressbar">
      <ProgressBar :value="progress" v-if="onProgress" />
    </div>
    <Button type="submit" label="Сохранить" :loading="loading" class="p-button-raised" />
  </form>
  </div>
</template>

<style scoped>
.img__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1%;
}

.selectfile:hover {
  cursor: pointer;
  color: blue;
}
</style>


