import { ref } from 'vue'
import { defineStore } from 'pinia'




export const usePrinterStore = defineStore('printerStore', () => {
  const characteristic = ref() 
  const isConnect = ref(false) 

  let device
  let server
  let service
 
  const getCharacteristic = async () => {

    const serviceUuid = '000018f0-0000-1000-8000-00805f9b34fb'; // UUID для SPP (Serial Port Profile)

    if (!isConnect.value) {
       try {
 
        //@ts-ignore
        device = await navigator.bluetooth.requestDevice({
          filters: [{ services: [serviceUuid] }],
          optionalServices: [serviceUuid] // Добавьте UUID сервиса в список optionalServices
        });
        console.log(device)
        // Подключаемся к выбранному устройству
        server = await device.gatt.connect();
        console.log(server)
        // Получаем основную службу с UUID SPP
        service = await server.getPrimaryService(serviceUuid);
        console.log(server)
        const characteristicUuid = '00002af1-0000-1000-8000-00805f9b34fb'; // UUID для характеристики SPP (Serial Port Profile)
        characteristic.value = await service.getCharacteristic(characteristicUuid);
         isConnect.value = true
      
      }
      catch {
        console.log(45)
        isConnect.value = false
      }
    }

     



  }
 


  return { characteristic, getCharacteristic, isConnect }
})
