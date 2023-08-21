<script setup lang="ts">
import axios from 'axios'
import { reactive, ref } from 'vue'
import { apiMain } from '../api/api'
import { useModalStore } from '../stores/modalStore'
import { useProductsList } from '../stores/productsStore'
import { useField, useForm, ErrorMessage } from 'vee-validate';


const { handleSubmit, resetForm } = useForm();
const { value, errorMessage, errors } = useField('name', validateField);

function validateField() {
 
  if (!productItem.name) {
    console.log(666)
    return 'Обязательно к заполнению';
  }
   if (!productItem.categories) {
    return 'Обязательно к заполнению';
  }
  if (productItem.price <= 0) {
    return 'Обязательно к заполнению';
  }
  if (isErrorTypeFile.value || !productItem.file) {
    return 'Обязательно к заполнению';
  }


  return true;
}

const emit = defineEmits<{
  (e: 'toast', status: string): void
}>()

const ModalStore = useModalStore()
const productsList = useProductsList()
productsList.getCategories()

const progress = ref()

const textBtnFile = ref('загрузить')
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref('')
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const productItem = reactive({
  //затипизтировать
  file: '', //поставить по умолчанию фотот заглушку
  name: '',
  price: 0,
  categories: '',
  description: ''
})

const uploadImg = (e:any) => {
  const arrType = ['jpg', 'jpeg']
  let file = e.target.files[0]

  if (!arrType.includes(file.name.split('.').pop()) || file.size > 1024 * 1024 * 2) {
    isErrorTypeFile.value = true
    filesForAvatar.value = '../img/avatar.svg' // вставить изображение заглушку
  } else {
    isErrorTypeFile.value = false
    var reader = new FileReader()
    reader.readAsDataURL(file)
    let that = e
    reader.onload = function (e) {
      if (e.target && typeof e.target.result === 'string') {
      productItem.file = that.target.files[0]
      filesForAvatar.value =
        'data:image/png;base64,' + e.target.result.substring(e.target.result.indexOf(',') + 1)
      }
    }
    textBtnFile.value = 'Изменить'
  }
}

// нужна валидация на пустые инпуты и наличие изображения
const submitForm = handleSubmit((values) => {
  console.log(values)

  if (isErrorTypeFile.value || productItem.file == '') {
    console.log('ошибка нет изображения')
  
    return
  }

  if (values.value && values.value.length > 0) {
    console.log(values.value);
    
  }
  // loading.value = true
  // onProgress.value = true
  // let formData = new FormData()
  // for (let key in productItem) {
  //   formData.append(key, productItem[key])
  // }

  // axios
  //   .post(`${apiMain}api/products`, formData, {
  //     onUploadProgress: (e) => {
  //       progress.value = Math.min(Math.round((e.loaded * 100) / e.total), 99)
  //     }
  //   })
  //   .then((data) => {
  //     console.log(456)
  //     if (data.status) {
  //       // ModalStore.modalAddProduct = false
  //       productsList.getProducts()
  //       emit('toast', 'add')
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //     // toast.add({
  //     //   severity: "error",
  //     //   summary: "Что-то пошло не так",
  //     //   detail: `Ошибка: ${error.message}`,
  //     //   life: 3000,
  //     // });
  //   })
  //   .finally(() => {
  //     loading.value = false

  //     onProgress.value = false
  //     progress.value = 100
  //   })
}
)
</script>

<template>
  <div class="p-fluid">    
    <form @submit.prevent="submitForm">
      <div class="img__group">
        <div class="filegroup">
          <p>Изображение:</p>
          <label for="file" class="selectfile"
            ><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label
          >

          <input
            hidden
            id="file"
            class="select"
            ref="imgInput"
            type="file"
            accept="image/jpeg,image/jpg"
            @change="uploadImg($event)"
          />
          
          <InlineMessage v-if="isErrorTypeFile" severity="error"
            >Допустимый формат: только ".jpg, .jpeg". <br />
            Максимальный размер файла: 2мб</InlineMessage
          >
        </div>
        <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
        <div class="col-5">
          <Image v-if="filesForAvatar" :src="filesForAvatar" alt="Image" width="250" preview />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field form__input col">
          <label for="productName">Название:</label>
          <InputText
            require
            name="name"
            v-model.trim="productItem.name"
            id="productName"
            type="product"
            aria-describedby="productHelp"
            :class="{ 'p-invalid': errorMessage }"
          />
          <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
        </div>
        <div class="field form__input col">
          <label>Категория:</label>
          <Dropdown
          name="cat"
            v-model="productItem.categories"
            :options="productsList.categories"
            optionValue="id"
            optionLabel="type"
            placeholder="выбрать..."
             :class="{ 'p-invalid': errorMessage }"
          />
           <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
        </div>
      </div>
      <div class="field form__input">
        <label for="productPrice">Цена:</label>
        <InputNumber
          suffix=" руб."
          v-model.trim="productItem.price"
          id="productPrice"
          type="product"
          aria-describedby="productHelp"
           :class="{ 'p-invalid': errorMessage }"
        />
        <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
      </div>
      <div class="field form__input">
        <Textarea
          v-model.trim="productItem.description"
          rows="4"
          cols="35"
          placeholder="Описание товара"
        />
      </div>
      <div class="progressbar">
        <ProgressBar :value="progress" v-if="onProgress" />
      </div>
      <Button type="submit" label="Добавить" :loading="loading" class="p-button-raised" />
    </form>
  </div>
</template>

<style scoped>
.img__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1%;
}
.selectfile {
  cursor: pointer;
}
</style>
