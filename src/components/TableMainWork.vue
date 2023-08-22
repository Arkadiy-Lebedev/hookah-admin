<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import axios from 'axios'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref, watch } from 'vue'
import { apiMain } from '../api/api'
// @ts-ignore
import { socket } from '../socket'
import { useDateStore } from '../stores/dateStore'
import { useTablesList } from '../stores/tablesStore'
import type { ITables, ITablesInfo } from '../types/ITables'
import ProductsList from './ProductsList.vue'

import { usePrinterStore } from '../stores/printer'


const confirm = useConfirm()
const dateStore = useDateStore()
const tablesList = useTablesList()

const printerStore = usePrinterStore()

const isModalProducts = ref<boolean>(false)
const isConnect = ref<boolean>(false)
const idBooking = ref<number>(0)
const time = ref<Date>(new Date())
const phoneUser = ref<string>()
const phoneName = ref<string>()
const sale = ref<number>(0)

const errors = ref<any>({
  timebusy: {
    error: false,
    text: ''
  },
  activebusy: {
    error: false,
    text: ''
  },
  activework: {
    error: false,
    text: ''
  }
})

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'closeModal', status?: string): void,
  (e: 'saleEdit', total: number, sale: number): void
}>()

interface Props {
  tableSingle: {
    tables: ITables[]
    status: string
  } | undefined
  tableInfoSingle: ITablesInfo[] | []
  dateCalendar: Date | undefined
}

const totalPrice = computed((): number => {
  const array = tablesList.ordersInBooking.reduce((acc:number, num:any) => acc + num.price * num.count, 0)
  return array
})

watch(totalPrice, () => {
  emit('saleEdit', totalPrice.value, sale.value)
})
emit('saleEdit', totalPrice.value, 0)


const totalPriceSale = computed(() => {
  const array = totalPrice.value - (totalPrice.value * (sale.value / 100))
  return array
})

const order = async () => {
  console.log(props)
  if (props.tableSingle) {
   const number = props.tableSingle.tables.find((el) => el.status == 'active')?.id
   if(number){
      idBooking.value = number
   }
   
   console.log(idBooking.value)
  tablesList.getOrderInBooking(idBooking.value)
} 


}
order()

const closeModal = () => {
  isModalProducts.value = false
}

const activeBooking = async (id: number, tableId: number) => {
  const item = tablesList.tables.find((el) => el.table_id == tableId && el.status == 'active')
  console.log(item)
  if (item) {
    console.log('уже в работе')
    errors.value.activework.error = true
    errors.value.activework.text = 'Стол уже в работе!'
  } else {
    const resp = await tablesList.activeBooking(id)

    socket.emit('create', { name: '' }, () => {
    
    })
    emit('closeModal', "create")
  }
}

const closeTable = async (id: number) => {
  console.log(id)

  const { data } = await axios.put(`${apiMain}api/work/booking/succes`, {
    id: id,
    sale: sale.value,
    totalPrice: totalPrice.value,
    totalPriceSale: totalPriceSale.value
  })

  socket.emit('create', { name: '' }, () => {

  })
  emit('closeModal', "cancel")

}

const isStatusActive = computed(() => {
  if (!props.tableSingle) {
    return false; 
  }
  return props.tableSingle.tables.find((el) => el.status == 'active')


})

const activeTableForAdmin = async (tableId: number) => {
  if (!props.tableSingle) {
    return false; 
  }
  let date = new Date()
  let dateBusy = new Date(
    props.tableSingle.tables.filter((el) => el.status == 'busy')[0]?.timeStart
  )
  if (date.getTime() > dateBusy.getTime()) {
    errors.value.activebusy.error = true
    errors.value.activebusy.text = 'Имеется бронь на это время, снимите бронь!'
    console.log('Имеется бронь на это время, снимите бронь!', dateBusy)
    return
  }

  console.log(tableId)
  const { data } = await axios.post(`${apiMain}api/work/booking/admin`, {
    tableId: tableId,
    timeStart: new Date(),
    timeFinish: null,
    clientId: null,
    orderClient: '',
    status: 'active'
  })

  emit('closeModal', 'create')

  socket.emit('create', { name: '' }, () => {
    
  })

  console.log(data)
}

const bookingTable = async (tableId: number) => {

  let date = new Date(time.value)

  let date3:any
  if (dateStore.dateInBooking) {
     date3 = new Date(dateStore.dateInBooking)
  }

  date3.setHours(date.getHours(), date.getMinutes(), date.getSeconds())

  let dateBase = `${dateStore.dateInBooking
    } ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    if (!props.tableSingle) {
    return false; 
  }

  let date2 = new Date(props.tableSingle.tables.filter((el) => el.status == 'busy')[0]?.timeStart)
  console.log(dateBase)

  if (date3.getTime() > date2.getTime()) {
    errors.value.timebusy.error = true
    errors.value.timebusy.text = 'Это время занято, выберите другое время!'
    console.log(' в это время занято, выберите другое время', date2)
    return
  }

  const { data } = await axios.post(`${apiMain}api/work/booking`, {
    tableId: tableId,
    timeStart: dateBase,
    timeFinish: null,
    clientId: null,
    orderClient: '',
    status: 'busy',
    phone: phoneUser.value,
    userName: phoneName.value
  })

  socket.emit('create', { name: '' }, () => {
    

  })
  emit('closeModal', 'busy')

  console.log(data)
}

const deleteBooking = async (id: number) => {
  const { data } = await axios.delete(`${apiMain}api/work/booking`, {
    data: { id: id }
  })
  emit('closeModal', 'delete')

  socket.emit('create', { name: '' }, () => {
   
  })

  console.log(data)
}

const confirm2 = (event:any, id:number) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы желаете закрыть стол?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      closeTable(id)
    },
    reject: () => {
      console.log('отмена')
    },
    acceptLabel: 'Да',
    rejectLabel: 'Нет'
  })
}


let characteristic:any
const print = async () => {



  if (!printerStore.isConnect) {
    try {
      await printerStore.getCharacteristic()
      characteristic = printerStore.characteristic
    }
    catch {
      console.log("нет подключения к принтеру")
    }
  } else {
    characteristic = printerStore.characteristic
  }

  try {

    let line:Uint8Array
    let line2:Uint8Array
    let totalLine:Uint8Array
    async function printRussianText() {
      const setWindows1251Command = new Uint8Array([0x1B, 0x74, 17]);
      const resetFontSizeCommand = new Uint8Array([0x1D, 0x21, 0x00]);
      const leftalignmentCommand = new Uint8Array([0x1B, 0x61, 0x00]); // Выравнивание по левой стороне
      const rightAlignmentCommand = new Uint8Array([0x1B, 0x61, 0x02]);// Выравнивание по правой стороне
      const dotsLineCommand = new Uint8Array([0x1B, 0x2D, 0x01]);  // Команда для простановки точек на всю ширину
      const resetdotsLineCommand = new Uint8Array([0x1B, 0x2D, 0x00]);
      const fontSizeCommand = new Uint8Array([0x1D, 0x21, 1]); // Размер шрифта: 0 - обычный, 1 - двойной вертикальный, 2 - двойной горизонтальный, 3 - двойной по обоим направлениям


      await characteristic.writeValue(setWindows1251Command);
      await characteristic.writeValue(resetFontSizeCommand);
      await characteristic.writeValue(resetdotsLineCommand);
      // await characteristic.writeValue(leftalignmentCommand);

      await characteristic.writeValue(fontSizeCommand);
      await characteristic.writeValue(utf8_to_866(`Hookah Bar`));
      await characteristic.writeValue(resetFontSizeCommand);
      await characteristic.writeValue(utf8_to_866(`\nДата: 21.08.2023\n`));

      await characteristic.writeValue(dotsLineCommand);
      await characteristic.writeValue(utf8_to_866(`        \n`));
      await characteristic.writeValue(resetdotsLineCommand);

   
      for (const product of tablesList.ordersInBooking) {

        line = utf8_to_866(`${product.name}\n`);
        await characteristic.writeValue(leftalignmentCommand);
        await characteristic.writeValue(line);
        line = utf8_to_866(`${product.count} * ${product.price}\n`);
        await characteristic.writeValue(line);

        line2 = utf8_to_866(`${product.count * product.price}\n`);
        await characteristic.writeValue(rightAlignmentCommand);
        await characteristic.writeValue(line2);

      }


      await characteristic.writeValue(dotsLineCommand);
      await characteristic.writeValue(utf8_to_866(`        \n`));
      await characteristic.writeValue(resetdotsLineCommand);




      totalLine = utf8_to_866(`\n К оплате ${totalPrice.value}\n\n`);
      await characteristic.writeValue(leftalignmentCommand);
      await characteristic.writeValue(fontSizeCommand);
      await characteristic.writeValue(totalLine);

      if (sale.value > 0) {
        totalLine = utf8_to_866(`\n Скидка ${sale.value}%\n`);
        await characteristic.writeValue(totalLine);
        totalLine = utf8_to_866(`Со скидкой ${totalPriceSale.value}\n`);
        await characteristic.writeValue(totalLine);
      }

      await characteristic.writeValue(resetFontSizeCommand);

      await characteristic.writeValue(dotsLineCommand);
      await characteristic.writeValue(utf8_to_866(`        \n`));
      await characteristic.writeValue(resetdotsLineCommand);

      await characteristic.writeValue(utf8_to_866(`\nВознаграждение официанта приветствуется, но всегда остается на Ваше усматрение\n\n\n\n\n`));

      try {



        console.log('Текст успешно отправлен на печать.');
      } catch (error) {
        console.error('Ошибка при отправке текста на печать:', error);
      }
    }


    function utf8_to_866(aa:any) {
      let c = 0;
      let ab = new Uint8Array(aa.length);

      for (let i = 0; i < aa.length; i++) {
        c = aa.charCodeAt(i);
        if (c >= 1040 && c <= 1087) {
          ab[i] = c - 912;
        } else if (c >= 1088 && c <= 1105) {
          ab[i] = c - 864;
        } else {
          ab[i] = aa.charCodeAt(i);
        }
      }
      return ab;
    }



    printRussianText();




  } catch (error) {
    console.error('Ошибка:', error);
  }
}

const saleEdit = (num: number) => {
  sale.value = num
  emit('saleEdit', totalPrice.value, num)
}


</script>
<template>
  <!-- {{ tableSingle }}
{{ isStatusActive }} -->
{{ tableInfoSingle }}
  <Dialog header="Товары" v-model:visible="isModalProducts"
    :breakpoints="{ '1420px': '60vw', '960px': '80vw', '700px': '90vw', '640px': '99vw' }"
    :style="{ width: '60vw', height: '90vh' }" :modal="true">
    <ProductsList :id-booking="idBooking" @closeModal="closeModal"></ProductsList>
  </Dialog>

  <div >
        <div v-if="tableSingle && tableSingle.tables.filter((el) => el.status == 'busy').length" class="orders">
          <span class="block text-600 font-medium mb-1">Ожидает:</span>
          <div class="error-message">
            <InlineMessage v-if="errors.activework.error" severity="error">{{ errors.activework.text }}
            </InlineMessage>
          </div>
          <ul v-for="(item, index) in tableSingle.tables.filter((el) => el.status == 'busy')" :key="item.id"
            class="p-0 mx-0 mt-0 mb-4 list-none">
            <li class="list__item flex align-items-center py-2 border-bottom-1 surface-border">
              <!-- <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                        <i class="pi pi-dollar text-xl text-blue-500"></i>
                    </div> -->
              <span class="text__booking text-900 line-height-3"><span class="text-blue-500">{{ item.timeStart.split(' ')[1]
              }}</span>
                {{ item.phone }} {{ item.client_name }} {{ item.order_client }}
                <!-- <span class="text-700"> описание </span>   -->
              </span>

              <div class="btn__group">
                <Button @click="activeBooking(item.id, item.table_id)" v-if="index == 0" icon="pi pi-check"
                  severity="warning" rounded aria-label="Bookmark" size="small" />
                <Button @click="deleteBooking(item.id)" icon="pi pi-times" severity="danger" rounded aria-label="Bookmark"
                  size="small" />
              </div>
            </li>
          </ul>
        </div>

        <InlineMessage class="orders" v-else-if="!isStatusActive" severity="info">Бронь отсутствует</InlineMessage>
      </div>


  <div class="booking__btn-group">
    <Button :disabled="new Date().toLocaleDateString() !== new Date(dateCalendar ? dateCalendar : new Date()).toLocaleDateString()"
      v-if="!isStatusActive" @click="activeTableForAdmin(tableInfoSingle[0].id)" label="Посадка" severity="success"
      icon="pi pi-check-square" />
    <Button v-styleclass="{ selector: '.datapicker__group', toggleClass: 'hidden' }" class="btn__booking"
      v-if="!isStatusActive" type="button" severity="warning" icon="pi pi-calendar-times" label="Забронировать" />
  </div>
  <div class="error-message">
    <InlineMessage v-if="errors.activebusy.error" severity="error">{{
      errors.activebusy.text
    }}</InlineMessage>
  </div>
  <div class="datapicker__group hidden">
    <div class="booking__input-group">
      <span class="p-float-label">
        <InputText id="username" v-model="phoneName" />
        <label for="username">Имя</label>
      </span>
      <span class="p-float-label">
        <InputMask id="phone" v-model="phoneUser" mask="+7999-999-99-99" placeholder="+7999-999-99-99" />
        <label for="phone">Телефон</label>
      </span>
    </div>

    <Calendar class="datapicker" id="calendar-timeonly" v-model="time" timeOnly touchUI :stepMinute="10" />
    <Button label="ОК" @click="bookingTable(tableInfoSingle[0].id)" severity="warning" />
    <div class="error-message">
      <InlineMessage v-if="errors.timebusy.error" severity="error">{{
        errors.timebusy.text
      }}</InlineMessage>
    </div>
  </div>
  <TabView>
    <TabPanel header="Заказ" v-if="isStatusActive">
      <div class="order__header">
        <p>Посадка: {{ isStatusActive?.timeStart.split(' ')[1] }}</p>
        <div class="total">
          <p class="order__totel-text">Сумма заказа: {{ totalPrice }} руб.</p>
          <!-- <div class="sale-box" v-if="sale>0">
            <p>скидка: {{ sale }}%</p>
            <p class="order__totel-text">Со скидкой: {{ totalPriceSale  }} руб.</p>
          </div> -->

        </div>

      </div>

      <div class="order__btn-group">
        <Button label="Добавить" @click="isModalProducts = true" />
        <Button label="Рассчитать" @click="print" severity="success" />
        <Button label="Закрыть стол" @click="confirm2($event, isStatusActive.id)" severity="danger" />
        <Button label="10%" @click="saleEdit(10)" severity="help" />
        <Button label="15%" @click="saleEdit(15)" severity="help" />
        <ConfirmPopup></ConfirmPopup>
      </div>
      <!-- @click="closeTable(isStatusActive.id)" -->
      <div class="orders">

        <DataTable :value="tablesList.ordersInBooking" class="p-datatable-sm" :loading="tablesList.isLoadingOrders">
          <!-- <Column field="id" header="id"></Column> -->
          <Column field="name" header="Название"></Column>
          <Column field="price" header="Цена"></Column>
          <Column field="count" header="Кол-во"></Column>
          <Column header="сумма">
            <template #body="slotProps">
              {{ slotProps.data.count * slotProps.data.price }} руб.
            </template>
          </Column>
        </DataTable>



      </div>
    </TabPanel>

    <!-- <TabPanel header="Бронь">
      <div v-if="tableSingle.tables.filter((el) => el.status == 'busy').length" class="orders">
        <span class="block text-600 font-medium mb-1">Ожидает:</span>
        <div class="error-message">
          <InlineMessage v-if="errors.activework.error" severity="error">{{ errors.activework.text }}
          </InlineMessage>
        </div>
        <ul v-for="(item, index) in tableSingle.tables.filter((el) => el.status == 'busy')" :key="item.id"
          class="p-0 mx-0 mt-0 mb-4 list-none">
          <li class="list__item flex align-items-center py-2 border-bottom-1 surface-border">
           
            <span class="text__booking text-900 line-height-3"><span class="text-blue-500">{{ item.timeStart.split(' ')[1]
            }}</span>
              {{ item.phone }} {{ item.client_name }} {{ item.order_client }}
         
            </span>

            <div class="btn__group">
              <Button @click="activeBooking(item.id, item.table_id)" v-if="index == 0" icon="pi pi-check"
                severity="warning" rounded aria-label="Bookmark" size="small" />
              <Button @click="deleteBooking(item.id)" icon="pi pi-times" severity="danger" rounded aria-label="Bookmark"
                size="small" />
            </div>
          </li>
        </ul>
      </div>

      <InlineMessage class="orders" v-else-if="!isStatusActive" severity="info">Бронь отсутствует</InlineMessage>
    </TabPanel> -->
  </TabView>
</template>

<style scoped>
.list__item {
  display: flex;
  justify-content: space-between;
}

.booking__input-group {
  display: flex;
  gap: 1vh;
}

.booking__btn-group {
  margin-bottom: 2vh;
  display: flex;
  gap: 1vh;
}

.order__btn-group {
  display: flex;
  gap: 2vh;
  margin-bottom: 3vh;
  margin-top: 3vh;
}

.order__totel-text {
  padding: 10px;
  background: #e9e9ff;
  border: solid #696cff;
  border-width: 0px;
  color: #696cff;
  border-radius: 6px;
}

.order__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.datapicker__group {
  margin-top: 25px;
}

.error-message {
  margin-top: 10px;
}

.btn__group {
  margin-left: 10px;
  display: flex;
  gap: 5px;
}

.btn__booking {
  margin-left: 5px;
}

.orders {
  margin-top: 1vh;
}

.datapicker {
  margin-top: 10px;
  margin-right: 5px;
}
</style>
