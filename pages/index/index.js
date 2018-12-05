//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    notifyCount: 2,
    reminderSummary: [{reminderId: "1234", happenTime: "2018-09-18", title: "G20会议" }, { reminderId: "1235", happenTime: "2018-09-18", title: "G20会议" }, { reminderId: "1236", happenTime: "2018-09-18", title: "G20会议" }]
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    // wx.checkSession({
    //   success(res) {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log(res)
    //   },
    //   fail() {
    //     // session_key 已经失效，需要重新执行登录流程
    //     wx.login() //重新登录
    //   }
    // })
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showAddNotify: function() {
    wx.navigateTo({
      url: '../add/addMeeting'
    })
    var loginSession = wx.getStorageSync('loginSession')

    // wx.request({
    //   url: 'https://dwxapi.anyocharging.com:11443/v1/wxapi/reminder/summary',
    //   method: 'GET',
    //   header: {
    //     "Content-Type": "application/json",
    //     'loginSession': loginSession
    //   },
    //   success: function(e) {
    //     console.log(e)
    //   }
    // })
  },
  gotoDetail: function(item) {
    var reminderId = item.currentTarget.dataset.reminderid
    console.log(item.currentTarget.dataset.reminderid)
    wx.navigateTo({
      url: '../reminderDetail/reminderDetail' + '?reminderId=' + reminderId
    })
  }
})
