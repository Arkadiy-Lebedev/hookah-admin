<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { apiMain } from "../api/api"
import { useConfirm } from "primevue/useconfirm";
import delButton from "../components/delButton.vue"
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();



const confirm = useConfirm();

interface IAdmin {
    phone: string
    password: string
    dublePasswors: string
}

const admin = reactive<IAdmin>({ //затипизтировать   
    phone: "",
    password: '',
    dublePasswors: ''
});
const isErrors = ref()
const errorText = ref()
const allAdmins = ref([])
const loading = ref<boolean>(false)

const submitForm = () => {
 isErrors.value = false

    if (admin.password !== admin.dublePasswors) {
        console.log(456)
           errorText.value = 'Пароли не совпадают'
        isErrors.value = true
        return
    }
  if (admin.phone == "" || admin.password == "" || admin.dublePasswors == "") {
        console.log(456)
           errorText.value = 'Все поля должны быть заполнены'
        isErrors.value = true
        return
    }
    
    loading.value = true;
 

    axios
        .post(`${apiMain}api/master/admin`, admin, {
            onUploadProgress: (e) => {
               console.log(e)
            },
        })
        .then((data) => {
            console.log(data)
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Администратор добавлен', life: 3000 });
            getAdmins()
           
            // if (data.status) {
            //     ModalStore.modalAddProduct = false
            //     productsList.getProducts()
            // }


        }).catch((error) => {
            console.log(error);
             if (error.response.status == 400) {
                 console.log("Такой администратор существует")
                 errorText.value = 'Такое имя занято.'
                isErrors.value = true
            }
            // toast.add({
            //   severity: "error",
            //   summary: "Что-то пошло не так",
            //   detail: `Ошибка: ${error.message}`,
            //   life: 3000,
            // });
        })
        .finally(() => {
            loading.value = false;

      
        });
    
}

const getAdmins = async () => {
     try {       
        const { data } = await axios.get(`${apiMain}api/master/admin`)
        allAdmins.value = data.data
      console.log(data)
    } catch (e) {
        console.log(e)
    }
}
getAdmins()

const delAdmins = async (event:any, id: number) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Удалить администратора?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            
     try {       
    const { data } = await axios.delete(`${apiMain}api/master/admin`,
        {
            data: { id: id }
        })
        getAdmins()
        toast.add({ severity: 'warn', summary: 'Администратор удален', detail: '', life: 3000 });
        
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

    <div class="grid">
          <Toast />
        <div class="col-12 lg:col-6 xl:col-5">
            <div class="card mb-0">
                <h5>Администраторы: </h5>
    <DataTable :value="allAdmins" >
               <template #empty> Администарторы отсутствуют </template>
                <Column field="name" header="Имя"> 
                     <template #body="slotProps">
                        <div class="admin__item">
                              <p>{{ slotProps.data.phone }}</p>
                              <delButton  @click="delAdmins($event, slotProps.data.id)"/>
                    <!-- <Button @click="delAdmins($event, slotProps.data.id)" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" /> -->
                           <ConfirmPopup></ConfirmPopup> 
                </div>
                      
                    </template>
                </Column>
             
         
            </DataTable>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-5">
            <div class="card ">

                <h5>Добавить: </h5>
                <div class="p-fluid">
                    <form @submit.prevent="submitForm">
                        <div class="formgrid">
                            <div class="form__input col">
                                <label class="lable__input">Имя:</label>
                                <InputText v-model.trim="admin.phone" require aria-describedby="productHelp" />
                            </div>
                            <div class="form__input col">
                                <label class="lable__input">Пароль:</label>
                                <InputText  v-model.trim="admin.password" require aria-describedby="productHelp" />
                            </div>
                            <div class="form__input col ">
                                <label class="lable__input">Повторный пароль:</label>
                                <InputText  v-model.trim="admin.dublePasswors" require aria-describedby="productHelp" />
                            </div>
                            <Button type="submit" label="Добавить" :loading="loading" class="p-button-raised mt-3 mb-3" />
                            <InlineMessage v-if="isErrors" severity="error">{{ errorText }}</InlineMessage>
                        </div>
                    </form>
                </div>



            </div>
        </div>
    </div>
</template>

<style >

.admin__item{
    display:flex;
    justify-content:space-between;
    align-items:center;
}
</style>