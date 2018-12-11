// pages/reminderDetail/reminderDetail.js
//获取应用实例
const app = getApp()
var reminderId
var formId
var userLat, userLng;
var timeSwitchState = true
var locationSwitchState = false
var desc = ''
var rTitle = ''
var rLocation = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    owner: false,
    title: '',
    detail: '',
    happenTime: '',
    id: '',
    location: '',
    needPush: false,
    needSms: false,
    reminderTime1: '',
    reminderTime2: '',
    beforeTime: '立刻',
    array: ['立刻', '5分钟', '10分钟', '30分钟', '1小时', '2小时'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    reminderId = options.reminderId
    console.log(reminderId)
    var loginSession = wx.getStorageSync('loginSession')
    var that = this
    wx.request({
      url: app.globalData.API + '/reminder/' + reminderId,
      method: 'GET',
      header: {
        loginSession: loginSession
      },
      success: function(e) {
        console.log(e)
        formId = e.data.ownerFormId
        that.setData({
          title: e.data.title,
          detail: e.data.detail,
          happenTime: e.data.happenTime,
          id: e.data.id,
          location: e.data.location,
          needPush: e.data.needPush,
          needSms: e.data.needSms,
          reminderTime1: e.data.reminderTime1,
          reminderTime2: e.data.reminderTime2,
          owner: e.data.owner,
        })
      }
    })
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
  timeSwitchChange: function(res) {
    timeSwitchState = res.detail.value
    console.log(timeSwitchState)
    this.setData({
      needPush: res.detail.value
    })
  },
  // 输入日程地点
  //日程地点输入
  inputLocation: function (e) {
    rLocation = e.detail.value
    console.log(rLocation)
  },
// 加入日程
  orderSign: function (e) {
    var loginSession = wx.getStorageSync('loginSession')
    var that = this
    wx.request({
      url: app.globalData.API + '/reminder/' + reminderId + '/notifyuser',
      method: 'POST',
      header: {
        loginSession: loginSession
      },
      data: {
        formid: e.detail.formId
      },
      success: function(e) {
        console.log(e)
        wx.showToast({
          title: '加入成功',
          success: function () {
            wx.navigateBack({
              
            })
          },
        })
      }
    })
  }
})