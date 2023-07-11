
import type {statusTable} from "./statusTable"

export interface ITables {
    id: number,
    timeStart: string,
    table_id: number,
    time_finish: null | string,
    client_id: number,
    order_client: string,
    status: statusTable,
  name: string,
  number: number,
  client_name: string,
  phone: string,

}

export interface ITablesInfo {
  id: number,
  name: string,
  number: 6,
  description: string

}