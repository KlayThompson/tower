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
    reminderSummary: [{reminderId: "1234", happenTime: "2018-09-18", title: "G20会议" }, { reminderId: "1235", happenTime: "2018-09-18", title: "G20会议" }, { reminderId: "1236", happenTime: "2018-09-18", title: "G20会议" }],
    arrow_icon_url: '/resources/arrow-right.png'
  },

  onShow: function () {
    this.loadReminderList()
  },
  onLoad: function () {
    this.loadReminderList()

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
  var that = this
    //更新用户信息
    var loginSession = wx.getStorageSync('loginSession')
    if (loginSession) {
      var avatar = e.detail.userInfo.avatarUrl + ''
      var nickName = e.detail.userInfo.nickName + ''

      wx.request({
        url: app.globalData.API + '/user',
        method: 'PUT',
        data: {
          nickName: nickName,
          avatarUrl: avatar,
          phoneNumber: '',
          purePhoneNumber: '',
          countryCode: ''
        },
        header: {
          'loginSession': loginSession
        },
        success: function (e) {
          that.loadReminderList()
        }
      })
    }
  },
  showAddNotify: function() {
    wx.navigateTo({
      url: '../add/addMeeting'
    })
  },
  gotoDetail: function(item) {
    var reminderId = item.currentTarget.dataset.reminderitem.reminderid
    console.log(item.currentTarget.dataset.reminderid)
    wx.navigateTo({
      url: '../reminderDetail/reminderDetail' + '?reminderId=' + reminderId
    })
  },

  loadReminderList: function() {
    var that = this
    var loginSession = wx.getStorageSync('loginSession')
    if (loginSession) {
      wx.request({
        url: app.globalData.API + '/reminder/summary',
        header: {
          'loginSession': loginSession
        },
        method: 'GET',
        success: function (e) {
          that.setData({
            reminderSummary: e.data
          })
        }
      })
    }
  }
})
