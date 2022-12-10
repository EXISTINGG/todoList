import App from './App'

// #ifndef VUE3
import Vue from 'vue'


// 1. 导入 store 的实例对象
import store from 'store/data.js'

// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败', icon = 'error', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon
	})
}


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	// 2. 将 store 挂载到 Vue 实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
