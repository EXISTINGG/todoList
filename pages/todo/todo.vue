<template>
	<view>
		<!-- 日历 -->
		<view class="cal">
			<button type="default" @click="gotoCal">日历</button>
		</view>
		<!-- 添加事项 -->
		<view class="list-add">
			<!-- 输入框前缀 -->
			<view class="fore">任务</view>
			<!-- 输入框 -->
			<input type="text" placeholder="请输入待办事项" v-model.trim="todoName" @confirm="addTodo">
			<!-- 添加按钮 -->
			<button type="default" size="mini" @click="addTodo">添加</button>
		</view>
		<!-- 事项分类 -->
		<view class="list-group">
			<view class="content">
				<uni-badge :text="active === 0 ? countItemAll : 0 " type="primary" size="normal" absolute="rightTop"
					:offset="[5,5]" :maxNum="99">
					<button type="button" class="btn" :class="active === 0 ? 'all' : 'nofocus'"
						@click="onBtnClick(0)">全部</button>
				</uni-badge>
				<uni-badge :text="active === 1 ? countItemDone : 0" type="success" size="normal" absolute="rightTop"
					:offset="[5,5]" :maxNum="99">
					<button type="button" class="btn" :class="active === 1 ? 'done' : 'nofocus'"
						@click="onBtnClick(1)">已完成</button>
				</uni-badge>
				<uni-badge :text="active === 2 ? countItemDoing : 0" type="warning" size="normal" absolute="rightTop"
					:offset="[5,5]" :maxNum="99">
					<button type="button" class="btn" :class="active === 2 ? 'doing' : 'nofocus'"
						@click="onBtnClick(2)">未完成</button>
				</uni-badge>
			</view>
		</view>
		<!-- 事项列表 -->
		<scroll-view class="scroll" :style="{height: wh + 'px'}" scroll-y v-if="itemList.length !== 0">
			<uni-swipe-action>
				<block v-for="item in selectTodoList" :key="item.id">
					<uni-swipe-action-item :left-options="item.top ? options3 : options2" :right-options="options"
						@click="cTodoItem($event, item.id)">
						<view class="list-item" :class="[item.top ? 'top' : 'notop']">
							<text class="text"
								:class="[item.done ? 'delete' : '', (item.done && item.top ? 'text-all' : '') || (item.done || item.top ? 'text-one' : '')]">{{item.task}}</text>
							<view class="list-tag">
								<uni-tag text="完成" type="success" circle v-if="item.done" />
								<uni-tag text="置顶" type="warning" circle v-if="item.top" />
							</view>
						</view>
					</uni-swipe-action-item>
					<view class="empty"></view>
				</block>
			</uni-swipe-action>
		</scroll-view>
		<!-- 事项列表为空 -->
		<view class="none" v-else>
			<text>当前没有事项...</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'

	import newDate from '@/mixins/date.js'

	export default {

		mixins: [newDate],

		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			console.log(sysInfo);
			console.log(this.wh);
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight - 190
		},
		data() {
			return {
				//事项名称
				todoName: '',
				// 分类索引
				active: 0,
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				// 滚动条距离顶部的距离
				scrollTop: 0,
				// 更多选项(右侧)
				options: [{
						text: '详情',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '完成',
						style: {
							backgroundColor: '#42b983'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					},

				],
				// 更多选项(左侧)
				//置顶
				options2: [{
					text: '置顶',
					style: {
						backgroundColor: '#008080'
					}
				}],
				//取消置顶
				options3: [{
					text: '取消置顶',
					style: {
						backgroundColor: '#ff9f00'
					}
				}]
			};
		},
		computed: {
			//动态赋 id值
			...mapState('m_todolist', ['itemList', 'itemId']),
			...mapGetters('m_todolist', ['countItemAll', 'countItemDoing', 'countItemDone']),
			// 根据激活按钮的索引值，动态计算要展示的列表数据
			selectTodoList() {
				if (this.active === 0) {
					return this.itemList
				} else if (this.active === 1) {
					return this.itemList.filter(item => item.done)
				} else {
					return this.itemList.filter(item => !item.done)
				}
			}
		},
		methods: {
			...mapMutations('m_todolist', ['addTodoList', 'doneTodoList', 'delTodoList', 'topTodoList',
				'cancalTodoListTop'
			]),

			//去往日历页面
			gotoCal() {
				uni.navigateTo({
					url: '/subpkg/calendar/calendar'
				})
			},
			//添加事项
			addTodo() {
				//如果为空
				if (this.todoName === '') return uni.$showMsg('事项为空')

				//获取当前时间
				const date = this.getNewData()

				//添加到事项列表				
				const list = [{
					id: this.itemId,
					task: this.todoName,
					date,
					detail: '',
					doneDate: '未完成',
					top: false,
					done: false,
				}]
				//添加到store
				this.addTodoList(list)
				//清空输入框
				this.todoName = ''
			},

			// 切换索引
			onBtnClick(e) {
				// 判断是否等于当前索引
				if (this.active != e) {
					// 修改索引
					this.active = e;
				}
			},
			//点击详情，完成，删除按钮
			cTodoItem(e, id) {
				switch (e.content.text) {
					// 详情
					case '详情':
						uni.navigateTo({
							url: `/subpkg/todo_detail/todo_detail?id=${id}`
						})
						return
						// 完成
					case '完成':
						this.itemList.find(item => item.id === id).doneDate = this.getNewData()
						// 将item的done改为true
						return this.doneTodoList(id)
						// 删除
					case '删除':
						// 修改 this 指向
						const that = this
						//询问是否删除
						return uni.showModal({
							title: '提示',
							content: '确认删除该事项吗',
							confirmText: '删除',
							confirmColor: '#f33e34',
							success: function(res) {
								// 确认删除
								if (res.confirm) {
									// 将item删除
									return that.delTodoList(id)
								} else if (res.cancel) return
							}
						});
						// 置顶
					case '置顶':
						// 技术有限,h5没有bug,wx小程序置顶后,视图不更新，调用reLaunch刷新(会有闪烁)
						uni.reLaunch({
							url: '/pages/todo/todo'
						});
						return this.topTodoList(id)
					case '取消置顶':
						console.log(e.content.text, id);
						// 如果item是完成状态下，取消置顶，视图不更新，调用reLaunch刷新
						this.itemList.forEach(item => {
							if (item.id === id && item.done) {
								return uni.reLaunch({
									url: '/pages/todo/todo'
								});
							}
						})
						return this.cancalTodoListTop(id)
				}
			}
		}
	}
</script>

<style lang="scss">
	.list-add {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin: 15px 15px 0;
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;

		.fore {
			width: 12%;
			background: #ccc;
			border: .5px solid #000;
			border-right: none;
			border-radius: 5px 0 0 5px;
			font-size: 24rpx;
		}

		input {
			flex: 2;
			padding-left: 15rpx;
			border: .5px solid #000;
			text-align: left;
			height: 79rpx;
			line-height: 79rpx;
			border-radius: 0 5px 5px 0;
		}

		button {
			background-color: #93ccf9;
			margin-left: 10rpx;
			line-height: 80rpx;
		}
	}

	.list-group {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		padding-top: 50rpx;

		.content {
			display: flex;
			width: 75%;
			justify-content: space-between;

			button {
				width: 160rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
			}


			.all {
				background: #93ccf9;
			}

			.done {
				background: #42b983;
			}

			.doing {
				background: #ff9c1a;
			}

			.nofocus {
				background: #ccc;
			}
		}


	}

	.scroll {
		// background-color: #42b983;
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		margin: 15px 15px 0;
		width: 90%;

		.empty {
			margin: 30rpx 0;
		}

		// .empty:first-child

		// view[class=list-item]:last-child {
		// 	padding: 5px 0;
		// }


		.list-item {
			position: relative;
			display: flex;
			align-items: center;
			// margin: 15rpx;
			// margin-right: 0;
			// background: #93ccf9;
			height: 100rpx;
			// border-radius: 10px 0 0 10px;
			// line-height: 100rpx;
			text-indent: 30rpx;
			font-size: 36rpx;

			.text {
				display: inline-block;
				// 文字可显示的宽度
				// width: 76%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}



			.list-tag {
				position: absolute;
				right: 10rpx;

				// justify-content: flex-end;
				// text-align: right;

			}


		}

		// 删除效果
		.delete {
			text-decoration: line-through;
		}

		.top {
			background: #1d9e8d;
		}

		.notop {
			background: #93ccf9;
		}

		// 标签都显示: 文字可显示的宽度
		.text-all {
			width: 75%;
		}

		// 一个标签显示: 文字可显示的宽度
		.text-one {
			width: 87%;
		}

		// 没有标签显示: 文字可显示的宽度
		// .text-none {
		// 	width: 100%;
		// }
	}

	// .scroll:last-child {
	// 	margin-bottom: 10px;
	// }

	.none {
		margin-top: 50%;
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #ccc;
	}
</style>
