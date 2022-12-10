<template>
	<view class="detail-container" :style="{height: wh + 'px'}">
		<view class="container-item name-item">
			<view class="margin">
				<uni-section title="事项名称" type="line"></uni-section>
				<view class="name">
					<input type="text" v-model.trim="name">
				</view>
			</view>
		</view>
		<view class="container-item detail-item">
			<view class="margin">
				<uni-section class="" title="事项详情" type="line"></uni-section>
				<view class="detail">
					<textarea cols="30" rows="10" maxlength="-1" v-model.trim="detail"></textarea>
					<!-- <input type="text" v-model.trim="itemDetail.detail"> -->
				</view>
			</view>
		</view>
		<view class="container-item time-item">
			<view class="margin">
				<uni-section class="" title="事件相关" type="line"></uni-section>
				<uni-list class="list">
					<uni-list-item class="list-item" title="创建时间" :rightText="itemDetail.date" />
					<uni-list-item class="list-item" title="完成时间" :rightText="itemDetail.doneDate" />
				</uni-list>
			</view>
		</view>
		<view class="button-item">
			<button class="btn cancel" @click="cancel">取消</button>
			<button class="btn confirm" @click="confirm">保存</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {

		onLoad(options) {
			this.id = parseInt(options.id)
			//根据id找出该item
			const item = this.itemList.find(item => item.id === this.id)
			this.itemDetail = item
			this.name = item.task
			this.detail = item.detail

			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight
		},

		data() {
			return {
				// 该item的id
				id: 0,
				// 该item的信息
				itemDetail: {},
				// item的名称，
				name: '',
				// 详情
				detail: '',
				// 页面高度(根据设备自动适配)
				wh: 0
			};
		},
		computed: {
			//导入所有item
			...mapState('m_todolist', ['itemList']),
		},
		methods: {
			...mapMutations('m_todolist', ['updateTodolist']),

			//点击取消,返回页面
			cancel() {
				uni.navigateBack()
			},

			//点击保存,修改并保存数据
			confirm() {
				// 判断数据是否改变
				if (this.name !== this.itemDetail.task || this.detail !== this.itemDetail.detail) {
					let data = {
						id: this.id,
						name: this.name,
						detail: this.detail
					}
					// 更新数据
					this.updateTodolist(data)
					// 提示更新完成
					uni.$showMsg('已保存', 'none')
					// 返回页面
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)

				}
			}
		}

	}
</script>

<style lang="scss">
	.detail-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		width: 100vw;
		// height: 100vh;
		background-color: #f9f9f9;

		//公共样式
		.container-item {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			width: 90%;
			margin: 30rpx 20rpx 20rpx;
			border-radius: 10px;
			overflow: hidden;
			background: #fff;
		}

		//公共样式
		.margin {
			margin: 20rpx;
		}

		.name-item {
			height: 250rpx;

			input {
				margin-top: 15rpx;
				padding: 0 10rpx 0;
				height: 90rpx;
				font-size: 16px;
				background: #f5f5f5;
				// border: pink solid 1px;
			}
		}

		.detail-item {
			height: 430rpx;

			textarea {
				margin: 20rpx 0;
				// padding-left: 8rpx;
				width: 100%;
				height: 270rpx;
				// padding: 0 15rpx 0;
				font-size: 17px;
				// flex: 1;
				background: #f5f5f5;
				// background: pink;
			}
		}

		.time-item {
			height: 400rpx;

			.list {
				margin-top: 40rpx;
			}
		}

		.button-item {
			display: flex;
			justify-content: space-around;
			width: 90%;
			margin: 0 20rpx 20rpx 30rpx;

			button {
				width: 200rpx;
			}

			.cancel {
				background: #fff;
			}

			.confirm {
				background: #93ccf9;
			}
		}
	}
</style>
