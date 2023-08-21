<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import { useConfirm } from "primevue/useconfirm";


const confirm = useConfirm();

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'closeModal', status: string): void

}>()


interface Props {
  categoria: {
    id: number
    type: string
    image: string | ArrayBuffer
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

interface CategoriesItem {
  id: number,
  file: string,
  type: any
}

const categoriesItem = reactive<CategoriesItem>({
  id: props.categoria.id,
  file: "",
  type: props.categoria.type
});

const uploadImg = (e:any) => {

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
      if (e.target) {
         const result = e.target.result;
        if (result !== null) {
          categoriesItem.file = that.target.files[0];
          filesForAvatar.value = result;
        }
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
  for (let key in categoriesItem) {
      const typedKey = key as keyof CategoriesItem; // Приведение типа к keyof CategoriesItem
    formData.append(typedKey, categoriesItem[typedKey]);
  }

  axios
    .put(`${apiMain}api/master/categories`, formData, {
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


const delCategoria = async (event: any, id: number) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Удалить категорию?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {

      try {
        const { data } = await axios.delete(`${apiMain}api/master/categories`,
          {
            data: { id: id }
          })
        emit('closeModal', 'delete')

      } catch (e) {
        console.log(e)
      }

    },
    reject: () => {
      console.log("отмена")
    },
    acceptLabel: "Да",
    rejectLabel: "Нет",


  });



}

</script>

<template>
  <div class="p-fluid">
    <Toast />
    <form @submit.prevent="submitForm">
      <div class="img__group">
        <div class="filegroup ">
          <p>Изображение категории:</p>
          <label for="file" class="selectfile"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>

          <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg,image/png,.svg"
            @change="uploadImg($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error">Максимальный размер файла: 1мб</InlineMessage>

        </div>
        <div class="mt-3  products__items">
          <img v-if="filesForAvatar" :src="filesForAvatar" alt="Image" imageClass="image" />
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
      <div class="btn__group-modal mt-5">
        <Button type="submit" label="Сохранить" :loading="loading" class="p-button-raised" />
        <Button label="Удалить" :loading="loading" severity="danger" @click="delCategoria($event, categoriesItem.id)" />
        <ConfirmPopup></ConfirmPopup>
      </div>

    </form>
  </div>
</template>

<style scoped>
.btn__group-modal {
  display: flex;
  gap: 20px;
}

.selectfile {
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


