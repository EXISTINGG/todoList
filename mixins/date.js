export default {
	methods: {
		// 获取当前日期
		getNewData() {
			const date = new Date()

			const y = date.getFullYear()
			const m = this.padZero(date.getMonth())
			const d = this.padZero(date.getDate())

			const hh = this.padZero(date.getHours());
			const mm = this.padZero(date.getMinutes());
			const ss = this.padZero(date.getSeconds());
			return `${y}-${m}-${d}   ${hh}:${mm}:${ss}`
		},
		//补零的方法
		padZero(n) {
			return n > 9 ? n : '0' + n;
		}
	}
}
