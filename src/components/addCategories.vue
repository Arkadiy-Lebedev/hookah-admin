<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"





const emit = defineEmits<{
    (e: 'closeModal', status: string): void
 
}>()


interface Props {
    categoria: {
      id: number
  type: string
  image: string
  sort: number
}
}


const progress = ref()
const textBtnFile = ref("загрузить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref(null);
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const categoriesItem = reactive({
  file: "",
  type: ""
});

const uploadImg = (e) => {  
  let file = e.target.files[0];
  if (

    file.size > 1024 * 1024 * 1
  ) {
    isErrorTypeFile.value = true;

  } else {

    isErrorTypeFile.value = false;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    let that = e;
    reader.onload = function (e) {
      categoriesItem.file = that.target.files[0];
      filesForAvatar.value =
        e.target.result;
    };
    textBtnFile.value = "Изменить";
  }
};

const submitForm = () => {
  if (isErrorTypeFile.value || categoriesItem.file == '') {
    console.log('ошибка нет изображения')
    return
  }
  if (categoriesItem.type == '') {
    console.log('заполните тип')
    return
  }
  loading.value = true;
  onProgress.value = true;
  let formData = new FormData();
  for (let key in categoriesItem) {
    formData.append(key, categoriesItem[key]);
  }

  axios
    .post(`${apiMain}api/master/categories`, formData, {
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
        emit('closeModal', 'successadd')
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
    <Toast />
  <form @submit.prevent="submitForm">
    <div class="img__group">
         <div class="filegroup mb-3" >
            <p >Изображение категории:</p>
        <label for="file" class="selectfile"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>
          
        <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg,image/png,.svg"
          @change="uploadImg($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error"> Максимальный размер файла: 1мб</InlineMessage>
  
      </div>
      <div v-if="filesForAvatar" class="products__items">
         <img  :src="filesForAvatar" alt="Image"  imageClass="image"/>
      </div> 
      </div> 

  <div class="formgrid grid">
        <div class="field form__input col">          
        <label for="productName">Название:</label>
        <InputText require v-model.trim="categoriesItem.type" id="type" type="product" aria-describedby="productHelp" />
      </div> 
     </div>
    
    <div class="progressbar">
      <ProgressBar :value="progress" v-if="onProgress" />
    </div>
    <Button type="submit" label="Добавить" :loading="loading" class="p-button-raised" />
  </form>
  </div>
</template>

<style scoped>
.selectfile{
  cursor: pointer;
}

.img__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1%;
}

.products__items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #262626;
  padding: 28px;
  transition: all 0.3s ease;
  width: 180px;
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

}




</style>


