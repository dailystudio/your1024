import { registerPlugins } from './plugins'
import { createWebHistory, createRouter } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createApp } from 'vue'

import App from './App.vue'
import Main from './components/Main.vue'

import './assets/common.scss';
import './assets/app.scss';

const routes = [
    { path: '/', redirect: '/app' },
    { path: '/app', component: Main },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

const messages = {
    en: {
        message: {
            mainPageTitle: "Your 1024",
            mainInputHint: "Current value: ",

            commonLabelSubmit: "Submit",
            commonFooterCopyright: "Daily Studio. Copyright",
        }
    },
    zh: {
        message: {
            mainPageTitle: "你的1024",
            mainInputHint: "当前结果： ",

            commonLabelSubmit: "提交",
            commonFooterCopyright: "Daily Studio. 版权所有"
        }
    }
}

const i18n = createI18n({
    legacy: false,
    locale: navigator.language, // set locale
    messages: messages,
})


const app = createApp(App)
    .use(router)
    .use(i18n)

registerPlugins(app)
app.mount('#app')
