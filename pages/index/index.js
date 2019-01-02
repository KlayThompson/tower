//index.js
//获取应用实例
const app = getApp()
var reminderId
var tapCount = 0

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    notifyCount: 0,
    reminderSummary: [],
    arrow_icon_url: '/resources/arrow-right.png'
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.loadReminderList()
    }
    tapCount = 0
  },
  onHide: function () {
    tapCount = 0
  },
  onLoad: function(options) {
    reminderId = options.reminderId

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.loadReminderList()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.loadReminderList()
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
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
      return;
    }
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var that = this
    that.userLogin()

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
          if (reminderId) {
            wx.navigateTo({
              url: '../reminderDetail/reminderDetail' + '?reminderId=' + reminderId
            })
          }
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
    var reminder_id = item.currentTarget.dataset.reminderitem.reminderid
    wx.navigateTo({
      url: '../reminderDetail/reminderDetail' + '?reminderId=' + reminder_id
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
        success: function(e) {
          if (e.statusCode == 401) {
            that.userLogin()
          } else {
            that.setData({
              reminderSummary: e.data,
              notifyCount: e.data.length
            })
          }
        }
      })
    } else {

    }
  },
  userLogin: function() {

    wx.login({
      success: res => {
        var infoStr = '{errMsg:' + res.errMsg + ',code:' + res.code + '}';
        var that = this
        wx.request({
          url: app.globalData.API + '/wxLogin',
          data: {
            code: res.code,
            info: infoStr
          },
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          success: function(e) {
            console.log(e)
            wx.setStorageSync('loginSession', e.data.loginSession)
            //重新调取提醒列表
            that.loadReminderList()
            that.updateUser()
          }
        })
      }
    })
  },
  //跳转到切换url界面
  goChangeUrl: function() {
    if (tapCount == 10) {
    wx.navigateTo({
      url: '../changeUrl/changeUrl',
    })
    tapCount = 0;
    }
    tapCount++
  },
//更新用户信息
  updateUser: function () {
    var that = this
    //更新用户信息
    var loginSession = wx.getStorageSync('loginSession')
    if (loginSession) {
      var avatar = app.globalData.userInfo.avatarUrl + ''
      var nickName = app.globalData.userInfo.nickName + ''

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
          console.log('更新用户信息成功' + e)
        }
      })
    }
  }
})