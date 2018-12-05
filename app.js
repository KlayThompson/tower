//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        var infoStr = '{errMsg:' + res.errMsg + ',code:' + res.code + '}';
        var loginSession = wx.getStorageSync('loginSession')
        if (!loginSession) {
          wx.request({
            url: 'https://dwxapi.anyocharging.com:11443/v1/wxapi/wxLogin',
            data: {
              code: res.code,
              info: infoStr
            },
            header: {
              "Content-Type": "application/json"
            },
            method: 'POST',
            success: function (e) {
              console.log(e)
              wx.setStorageSync('loginSession', e.data.loginSession)
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              var loginSession = wx.getStorageSync('loginSession')
              if (loginSession) {
                var avatar = res.userInfo.avatarUrl + ''
                var nickName = res.userInfo.nickName + ''
                
                wx.request({
                  url: 'https://dwxapi.anyocharging.com:11443/v1/wxapi/user',
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
                  success: function(e) {
                    console.log(e)
                 }
              })
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    BaseUrl: 'https://dwxapi.anyocharging.com:11443',
    API: 'https://dwxapi.anyocharging.com:11443/v1/wxapi/',
  }
})