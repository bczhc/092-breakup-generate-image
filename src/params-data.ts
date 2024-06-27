import {ref} from "vue";

export let appParams = ref({
    '092breakup': {
        text: '',
    },
    'demo': {
        text: '',
    },
    'eink-screen': {
        lines: [
            '用电剩余：123.45 kW·h',
            '归零时间：09 Jun 12:34:12',
            '当前天气：中雨 23~26°C',
            '₿/$：12345.6765434',
            '更新于：09 Jun 12:38:22',
        ]
    }
})
