<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import TableMainWork from './TableMainWork.vue'


const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'closeModal', status: string): void
 
}>()


interface Props {
    table: {
  name: string
  description: string
  image: string | ArrayBuffer
  id: number
} | undefined
}
console.log(props)

const progress = ref()
const textBtnFile = ref("изменить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref(props.table ? props.table.image : null);
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)


interface ITableItem {
  id: number,
  file: string,
  name: string,
  description: string
}

const tableItem = reactive({
  id: props.table ? props.table.id : 0 ,
  file: "",
  name: props.table ? props.table.name : "",
  description: props.table ? props.table.description : ""
});

const uploadImg = (e:any) => {
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
      if (e.target && typeof e.target.result === 'string') {
        tableItem.file = that.target.files[0];
        filesForAvatar.value =
          e.target.result;
      }
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
  for (let key in tableItem) {
    
     const typedKey = key as keyof ITableItem; // Приведение типа к keyof CategoriesItem
    const value = tableItem[typedKey]
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  }

  axios
    .put(`${apiMain}api/master/tables`, formData, {
      onUploadProgress: (e) => {
        if (e.total !== undefined && e.loaded !== undefined) {
          progress.value = Math.min(
            Math.round((e.loaded * 100) / e.total),
            99
          );
        }
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
    <Toast />
  <div class="p-fluid">

  <form @submit.prevent="submitForm">
    <div class="img__group">
         <div class="filegroup " >
            <p >Изображение стола:</p>
        <label for="file" class="selectfile"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>
          
        <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg"
          @change="uploadImg($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error">Допустимый формат: только ".jpg, .jpeg". <br />
          Максимальный размер файла: 2мб</InlineMessage>
  
      </div>
      <div class="col-5 image__wrapper">
         <Image v-if="filesForAvatar" :src="filesForAvatar" alt="Image"  imageClass="image"/>
      </div> 
      </div> 

  <div class="formgrid grid">
        <div class="field form__input col">
        <label for="productName">Название:</label>
        <InputText require v-model.trim="tableItem.name" id="productName" type="product" aria-describedby="productHelp" />
      </div>
 
     </div>

    <div class="field form__input">
      <Textarea v-model.trim="tableItem.description" rows="4" cols="35" placeholder="Описание стола" />
    </div>
    <div class="progressbar">
      <ProgressBar :value="progress" v-if="onProgress" />
    </div>
    <Button type="submit" label="Сохранить" :loading="loading" class="p-button-raised" />
  </form>
  </div>
</template>

<style >
.selectfile{
  cursor: pointer;
}

.img__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1%;
}

.image{
  
  width: 70% !important;
}

.image__wrapper{
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0;
  margin-top: 20px;
}

.image__wrapper .p-image {
  width: 100% !important;
  text-align: center;
}


</style>


