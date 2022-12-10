export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// itemList: [],
		itemList: JSON.parse(uni.getStorageSync('itemList') || '[]'),
		// item的初始id值
		itemId: uni.getStorageSync('itemId') || 1,

	}),

	getters: {
		// 计算所有item的数量
		countItemAll(state) {
			let all = 0
			state.itemList.forEach(item => all += 1)
			return all
		},
		// 计算未完成的item数量
		countItemDoing(state) {
			let doing = 0
			state.itemList.filter(item => !item.done).forEach(item2 => doing += 1)
			return doing
		},
		// 计算已完成的item数量
		countItemDone(state) {
			let done = 0
			state.itemList.filter(item => item.done).forEach(item2 => done += 1)
			return done
		}
	},

	mutations: {
		//添加事项
		addTodoList(state, list) {
			//添加到itemList
			state.itemList = [...list, ...state.itemList]
			// 每添加一次,id+1
			state.itemId++
			// 调用item排序函数(添加后让它排序,显示在置顶的item下方)
			this.commit('m_todolist/sortTodoList')
			// 把当前id存储，以防被刷新
			this.commit('m_todolist/saveItemidStorage')
		},
		// 将数据存储在本地
		saveDataStorage(state) {
			uni.setStorageSync('itemList', JSON.stringify(state.itemList))
		},
		// 将 当前item的id存储在本地
		saveItemidStorage(state) {
			uni.setStorageSync('itemId', state.itemId)
		},
		// 完成item
		doneTodoList(state, id) {
			// 将item的done改为true
			state.itemList.find(item => item.id === id).done = true
			// 调用item排序函数
			this.commit('m_todolist/sortTodoList')
		},
		// 删除item
		delTodoList(state, id) {
			// 找出不是此id的item
			state.itemList = state.itemList.filter(item => item.id !== id)
			// 提示已删除
			uni.$showMsg('已删除', 'none')
			// 将数据存储在本地
			this.commit('m_todolist/saveDataStorage')
		},
		// 置顶item
		topTodoList(state, id) {
			// 1
			// 找出对应的item,改为true
			let setTopItem = state.itemList.filter(item => item.id === id).filter(item2 => item2.top = true)
			// 找出其他的item
			let noTopItem = state.itemList.filter(item => item.id !== id)
			// 将最新置顶的放到最上面
			state.itemList = [...setTopItem, ...noTopItem]
			// 调用item排序函数
			this.commit('m_todolist/sortTodoList')

			// 2
			// let setTopItem = {}
			// state.itemList.forEach((item, index) => {
			// 	if (item.id === id) {
			// 		setTopItem = item
			// 		setTopItem.top = true
			// 		state.itemList.splice(index, 1)
			// 	}
			// })
			// state.itemList.unshift(setTopItem)

			// 3
			// 直接使用此方法,不会有置顶后,视图不更新bug,但不会置顶在第一个
			// setTopItem.find(item => item.id === id).top = true
		},

		//取消置顶
		cancalTodoListTop(state, id) {
			// 找出对应的item,top改为false
			state.itemList.find(item => item.id === id).top = false

			// 调用item排序函数
			this.commit('m_todolist/sortTodoList')
		},

		// item排序函数
		sortTodoList(state) {
			// 找出置顶的未完成item
			let topNoDone = state.itemList.filter(item => item.top && !item.done)
			// 找出置顶的已完成item
			let topDone = state.itemList.filter(item => item.top && item.done)
			// 找出未置顶未完成的item
			let noTopND = state.itemList.filter(item => !item.top && !item.done)
			// 找出未置顶已完成的item
			let notopDe = state.itemList.filter(item => !item.top && item.done)
			// 自动移动到最上方(置顶未完成,置顶已完成,未置顶未完成,未置顶已完成)
			state.itemList = [...topNoDone, ...topDone, ...noTopND, ...notopDe]
			// 将数据存储在本地
			this.commit('m_todolist/saveDataStorage')
		},

		// 更新item详情
		updateTodolist(state, data) {
			//解构出信息
			let {
				id,
				name,
				detail
			} = data
			// 找出此项item
			state.itemList.find(item => item.id === id).task = name
			state.itemList.find(item => item.id === id).detail = detail
			// 将数据存储在本地
			this.commit('m_todolist/saveDataStorage')
		}
	}
}
