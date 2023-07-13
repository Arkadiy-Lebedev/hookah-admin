<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"



const props = defineProps<Props>()

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
console.log(props)

const progress = ref()
const textBtnFile = ref("изменить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref(props.categoria.image);
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const categoriesItem = reactive({
  id: props.categoria.id,
  file: "",
  type: props.categoria.type
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
      categoriesItem.file = that.target.files[0];
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
  for (let key in categoriesItem) {
    formData.append(key, categoriesItem[key]);
  }

  axios
    .put(`${apiMain}api/master/categories`, formData, {
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
        emit('closeModal', 'success')
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
         <div class="filegroup " >
            <p >Изображение категории:</p>
        <label for="file" class="selectfile"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>
          
        <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg"
          @change="uploadImg($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error">Допустимый формат: только ".jpg, .jpeg". <br />
          Максимальный размер файла: 2мб</InlineMessage>
  
      </div>
      <div class="mt-3  products__items">
         <img v-if="filesForAvatar" :src="filesForAvatar" alt="Image"  imageClass="image"/>
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
    <Button type="submit" label="Сохранить" :loading="loading" class="p-button-raised" />
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


