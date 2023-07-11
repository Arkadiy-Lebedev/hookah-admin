<script setup lang="ts">

import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"

const progress = ref()
const textBtnFile = ref("загрузить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatar = ref("");
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const pushItem = reactive({ //затипизтировать
    title: "",
    body: "",

});


const pushs = ref()

const getPushs = async () => {
    try {
        const { data } = await axios.get(`${apiMain}api/sendpush`)
        pushs.value = data.data
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}
getPushs()


const submitForm = () => {

    loading.value = true;
    onProgress.value = true;
    let formData = new FormData();
    for (let key in pushItem) {
        formData.append(key, pushItem[key]);
    }

    axios
        .post(`${apiMain}api/sendpush`, pushItem, {
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
                // ModalStore.modalAddProduct = false
                // productsList.getProducts()
                pushItem.title = ""
                pushItem.body = ""
                
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
            onProgress.value = false;
            progress.value = 100;
            getPushs()
        });
}


</script>
<template>
    <div class="grid">

        <div class="col-12 lg:col-6 xl:col-5">
            <div class="card">
                <h5>Отправить PUSH уведомление: </h5>


                <div class=" mt-3 ">
                    <form @submit.prevent="submitForm">

                        <div class="formgrid ">
                            <div class="field form__input col">
                                <label for="productName">Заголовок:</label>
                                <InputText require v-model.trim="pushItem.title" aria-describedby="productHelp" />
                            </div>

                            <div class="field form__input col">
                                <label for="productName">Текст:</label>
                                <Textarea v-model.trim="pushItem.body" autoResize rows="5" cols="30" />

                            </div>

                        </div>

                        <Button type="submit" label="Отправить" :loading="loading" class="p-button-raised" />
                    </form>
                </div>
            </div>

        </div>
        <div class="col-12 lg:col-6 xl:col-7">
            <div class="card">                
                <h5>История уведомлений: </h5>
                <div class=" mt-3 ">
                    
                    <DataTable paginator :rows="8" :value="pushs" tableStyle="width: 100%">
                         <template #empty> Уведомления отсутствуют </template>
                <Column field="title" header="Заголовок"></Column>
                <Column field="body" header="Текст"></Column>
                <Column field="timestamp" header="Дата отправки"></Column>
               
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