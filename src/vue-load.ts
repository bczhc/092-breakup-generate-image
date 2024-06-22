import {createApp} from "vue";
import Main from './Main.vue'
import naive from 'naive-ui'

let app = createApp(Main);
app.use(naive);
app.mount('#app')
