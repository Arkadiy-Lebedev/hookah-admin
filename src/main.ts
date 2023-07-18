// import './assets/main.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";     

import "primevue/resources/primevue.min.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';

import BadgeDirective from 'primevue/badgedirective';

import Button from 'primevue/button';

import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Chart from 'primevue/chart';

import Column from 'primevue/column';

import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';

import DataTable from 'primevue/datatable';

import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';

import Fieldset from 'primevue/fieldset';

import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';

import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';

import OrderList from 'primevue/orderlist';

import Paginator from 'primevue/paginator';

import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import ProgressBar from 'primevue/progressbar';

import Ripple from 'primevue/ripple';
import Tag from 'primevue/tag';
import StyleClass from 'primevue/styleclass';

import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import Tooltip from 'primevue/tooltip';





import '@/assets/styles.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    ripple: true,
    locale: {
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        firstDayOfWeek: 1,
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort: ["Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб"],
        emptyFilterMessage: 'Не найдено',
    }
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.component('Dropdown', Dropdown);


app.component('Button', Button);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Chart', Chart);

app.component('Column', Column);

app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);

app.component('DataTable', DataTable);

app.component('Dialog', Dialog);
app.component('Tag', Tag);

app.component('Fieldset', Fieldset);


app.component('Image', Image);
app.component('InlineMessage', InlineMessage);

app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);

app.component('InputText', InputText);



app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);

app.component('OrderList', OrderList);

app.component('Paginator', Paginator);

app.component('Password', Password);
app.component('PickList', PickList);
app.component('ProgressBar', ProgressBar);








app.component('Textarea', Textarea);

app.component('Toast', Toast);




app.mount('#app')
