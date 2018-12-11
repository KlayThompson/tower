// pages/add/addMeeting.js
//获取应用实例
const app = getApp()

var userLat, userLng;
var timeSwitchState = true
var locationSwitchState = false
var desc = ''
var rTitle = ''
var location = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrow_icon_url: '/resources/arrow-right.png',
    meetingDate: '',//会议日期
    meetingTime: '',//会议时间
    beforeTime: '立刻',
    array: ['立刻', '5分钟', '10分钟', '30分钟', '1小时', '2小时'],
    timeStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  orderSign: function (e) {
    console.log(e)
    var that = this
    var loginSession = wx.getStorageSync('loginSession')
    var time = this.data.meetingDate + ' ' + this.data.meetingTime + ':00'
    wx.request({
      url: app.globalData.BaseUrl + '/v1/wxapi/reminder',
      method: 'POST',
      header: {
        loginSession: loginSession
      },
      data: {
        title: rTitle,
        location: location,
        needPush: timeSwitchState,
        needSms: false,
        ownerFormId: e.detail.formId,
        happenTime: time,
        reminderTime1: time,
        detail: desc
      },
      success: function(res) {
        console.log(res)
        that.goToHomePage()
      }
    })
  },
  //输入标题
  inputTitle: function(e) {
    rTitle = e.detail.value
    console.log(rTitle)
  },
  //选择日期
  selectDate: function (e) {
    console.log(e)
    this.setData({
      meetingDate: e.detail.value
    })
  },
//选择具体时间
  selectTime: function (e) {
    console.log(e)
    this.setData({
      meetingTime: e.detail.value
    })
  },
//提前多久时间选择
  bindBeforeChange: function(e) {
    console.log(e)
    var time = this.data.array[e.detail.value]
    this.setData({
      beforeTime: time
    })
  },

  // 时间开关事件
  timeSwitchChange: function(res) {
    timeSwitchState = res.detail.value
    console.log(timeSwitchState)
    this.setData({
      timeStatus: res.detail.value
    })
  },
  // 位置开关事件
  locationSwitchChange: function (res) {
    locationSwitchState = res.detail.value
    console.log(locationSwitchState)
    if (locationSwitchState) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          userLat = res.latitude
          userLng = res.longitude
          console.log(userLat,userLng)
        }
      })
    }
  },
  //描述输入
  inputDesc: function (e) {
    desc = e.detail.value
    console.log(desc)
  },
  //日程地点输入
  inputLocation: function (e) {
    location = e.detail.value
    console.log(location)
  },

  goToHomePage: function () {

    wx.showModal({
      title: '提示',
      content: '保存成功！',
      confirmText: '确定',
      showCancel: false,
      success: function () {
        wx.navigateBack({

        })
      }
    })
  }
})