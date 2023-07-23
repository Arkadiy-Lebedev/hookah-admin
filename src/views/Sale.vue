<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { apiMain } from '../api/api'

const progress = ref()
const textBtnFile = ref('загрузить')
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref(null)
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

interface ISale {
  id: number
  title: string
  description: string
  image: string
  state: string
}

const sales = ref<ISale[]>([])

const isErrors = ref({
    error: false,
    textError: ""
})



const getSale = async () => {
  try {
    const { data } = await axios.get(`${apiMain}api/master/sale`)
    sales.value = data.data
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
getSale()

const saleActive = computed((): ISale[] => {
  const newArray = sales.value.filter((el) => el.state == 'active')
  return newArray
})

const saleDisactive = computed((): ISale[] => {
  const newArray = sales.value.filter((el) => el.state == 'disactive')
  return newArray
})

const saleItem = reactive({
  file: '',
  title: '',
  description: ''
})

const uploadImg = (e) => {
  
  let file = e.target.files[0]

  if (file.size > 1024 * 1024 * 1) {
    isErrorTypeFile.value = true
  } else {
    isErrorTypeFile.value = false
    var reader = new FileReader()
    reader.readAsDataURL(file)
    let that = e
    reader.onload = function (e) {
      saleItem.file = that.target.files[0]
      filesForAvatar.value =
        e.target.result;
    }
    textBtnFile.value = 'Изменить'
  }
}

const submitForm = () => {
   isErrors.value.error = false
  if (isErrorTypeFile.value || saleItem.file == '') {
    isErrors.value.error = true
    isErrors.value.textError = 'Добавьте изображение'

    return
  }
  if (saleItem.title == '' || saleItem.description == '') {
    console.log('заполните все поля')
    isErrors.value.error = true
    isErrors.value.textError = 'Заполните все поля'
    return
  }
  loading.value = true
  onProgress.value = true
  let formData = new FormData()
  for (let key in saleItem) {
    formData.append(key, saleItem[key])
  }

  axios
    .post(`${apiMain}api/master/sale`, formData, {
      onUploadProgress: (e) => {
        progress.value = Math.min(Math.round((e.loaded * 100) / e.total), 99)
      }
    })
    .then((data) => {
      console.log(456)
      if (data.status) {
        getSale()
      }
    })
    .catch((error) => {
      isErrors.value.error = true
            isErrors.value.textError = error.response?.data?.message
    })
    .finally(() => {
      loading.value = false
  
      onProgress.value = false
      progress.value = 100
      filesForAvatar.value = ''
      saleItem.file = ''
      saleItem.title = ''
      saleItem.description = ''
    })
}

const disactiveSale = async (id) => {
  console.log(id)
  try {
    const { data } = await axios.post(`${apiMain}api/master/sale/status`, {
      id: id,
      state: 'disactive'
    })
    getSale()
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

const activeSale = async (id) => {
  console.log(id)
  try {
    const { data } = await axios.post(`${apiMain}api/master/sale/status`, {
      id: id,
      state: 'active'
    })
    getSale()
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div class="grid">
    <div class="col-12 lg:col-12 xl:col-8">
      <div class="card">
        <h5>Добавить акцию:</h5>
        <div class="mt-3">
          <form @submit.prevent="submitForm">
            <div class="img__group">
              <div class="filegroup mb-3">
                <p>Изображение категории:</p>
                <label for="file" class="selectfile"
                  ><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label
                >

                <input
                  hidden
                  id="file"
                  class="select"
                  ref="imgInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,.svg"
                  @change="uploadImg($event)"
                />
                <InlineMessage v-if="isErrorTypeFile" severity="error"
                  >
                  Максимальный размер файла: 1мб</InlineMessage
                >
              </div>
              <div v-if="filesForAvatar" class="products__items">
                <Image :src="filesForAvatar" alt="Image" imageClass="image" width="250" />
              </div>
            </div>

            <div class="formgrid grid">
              <div class="field form__input col">
                <label for="productName">Заголовок:</label>
                <InputText
                  require
                  v-model.trim="saleItem.title"
                  id="type"
                  type="product"
                  aria-describedby="productHelp"
                />
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field form__input col">
                <label for="productName">Описание:</label>

                <Textarea v-model.trim="saleItem.description" autoResize rows="5" cols="30" />
              </div>
            </div>

            <div class="progressbar">
              <ProgressBar :value="progress" v-if="onProgress" />
            </div>
            <Button  type="submit" label="Добавить" :loading="loading" class="p-button-raised" />
            <InlineMessage v-if="isErrors.error" severity="error"  class="w-full mt-4">{{  isErrors.textError }}</InlineMessage>
          </form>
        </div>
      </div>
      <div class="card">
        <h5>Действующие акции:</h5>
        <div class="mt-3">
          <DataTable paginator :rows="8" :value="saleActive" tableStyle="width: 100%">
            <template #empty> Акции отсутствуют </template>
            <Column header="">
              <template #body="{ data }">
                <img :src="data.image" class="w-6rem shadow-2 border-round" />
              </template>
            </Column>
            <Column field="title" header="Заголовок"></Column>
            <Column field="description" header="Текст"></Column>
            <Column header="" style="min-width: 10rem">
              <template #body="{ data }">
                <Button
                  @click="disactiveSale(data.id)"
                  label="Снять с публикации"
                  severity="secondary"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div class="card">
        <h5>Архивные:</h5>
        <div class="mt-3">
          <DataTable paginator :rows="8" :value="saleDisactive" tableStyle="width: 100%">
            <template #empty> Акции отсутствуют </template>
            <Column header="">
              <template #body="{ data }">
                <img :src="data.image" class="w-6rem shadow-2 border-round" />
              </template>
            </Column>
            <Column field="title" header="Заголовок"></Column>
            <Column field="description" header="Текст"></Column>
            <Column header="" style="min-width: 10rem">
              <template #body="{ data }">
                <Button @click="activeSale(data.id)" label="Активировать" severity="success" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form__input {
  display: flex;
  flex-direction: column;
}
</style>
