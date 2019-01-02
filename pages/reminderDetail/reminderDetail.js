// pages/reminderDetail/reminderDetail.js
//获取应用实例
const app = getApp()
var reminderId
var formId
var userLat, userLng;
var timeSwitchState = true
var locationSwitchState = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    owner: false,
    title: '',
    detail: '',
    happenTime: '',
    meetingTime: '', //会议时间
    id: '',
    location: '',
    needPush: false,
    needSms: false,
    reminderTime1: '',
    reminderTime2: '',
    beforeTime: '立刻',
    array: ['立刻', '5分钟', '10分钟', '30分钟', '1小时', '2小时'],
    joinSuccess: false,
    joined: false,
    arrow_icon_url: '/resources/arrow-right.png',
    notifyInfo: [],
    userNum: '',
    ownerUserid: '',
    fired: false, //是否过期  
    enableEdit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    reminderId = options.reminderId

    if (!app.globalData.userInfo) {
      wx.reLaunch({
        url: '../index/index' + '?reminderId=' + reminderId,
      })
      return;
    }

    console.log(reminderId + '1212121212121212121s')
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
        var str = e.data.happenTime + ''
        var date = str.substring(0, 10)
        var time = str.substring(11, 16)
        var happenDate = new Date(e.data.happenTime.replace(/-/g, "/")).getTime()
        var reminderDate = new Date(e.data.reminderTime1.replace(/-/g, "/")).getTime()
        var min = (happenDate - reminderDate) / 1000 / 60
        var before = min + '分钟'
        if (min >= 60) {
          min = min / 60
          before = min + '小时'
        } else if (min == 0) {
          before = '立刻'
        }
        //能否编辑
        if (e.data.owner && !e.data.fired) {
          that.setData({
            enableEdit: true
          })
        } else {
          that.setData({
            enableEdit: false
          })
        }
        that.setData({
          title: e.data.title,
          detail: e.data.detail,
          happenTime: date,
          meetingTime: time,
          id: e.data.id,
          location: e.data.location,
          needPush: e.data.needPush,
          needSms: e.data.needSms,
          reminderTime1: e.data.reminderTime1,
          reminderTime2: e.data.reminderTime2,
          owner: e.data.owner,
          joined: e.data.joined,
          beforeTime: before,
          notifyUserInfo: e.data.notifyUserInfo,
          userNum: e.data.notifyUserInfo.length + 1 + '人',
          ownerUserid: e.data.ownerUserid,
          joinSuccess: e.data.fired
        })
      }
    })
  },

  seeNotifyUser: function() {

    var array = this.data.notifyUserInfo
    wx.navigateTo({
      url: '../userList/userList' + '?notifyUserInfo=' + JSON.stringify(array) + '&ownerId=' + this.data.ownerUserid,
    })
  },

  //输入标题
  inputTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //选择日期
  selectDate: function(e) {
    console.log(e)
    this.setData({
      happenTime: e.detail.value
    })
  },
  //选择具体时间
  selectTime: function(e) {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var that = this
    var shareObj = {
      title: that.data.title,
      imageUrl: '',
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('转发成功')
        }
      },
      fail: function() {
        // 转发失败之后的回调
        　　　　　　
        if (res.errMsg == 'shareAppMessage:fail cancel') {　　　　　　　　 // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {　　　　　　　　 // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
    return shareObj
  },
  // 返回首页
  backHomePage: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  // 提醒时间开关事件
  timeSwitchChange: function(res) {
    timeSwitchState = res.detail.value
    console.log(timeSwitchState)
    this.setData({
      needPush: res.detail.value
    })
  },
  // 输入日程地点
  //日程地点输入
  inputLocation: function(e) {
    this.setData({
      location: e.detail.value
    })
  },
  //描述输入
  inputDesc: function(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  // 加入日程
  orderSign: function(e) {
    var loginSession = wx.getStorageSync('loginSession')
    var that = this
    if (!that.data.owner) { //加入
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
          that.setData({
            joinSuccess: true
          })
          wx.showToast({
            title: '加入成功',
            success: function() {
              wx.reLaunch({
                url: '../index/index',
              })
            },
          })
        }
      })
    } else { //保存
      //先判断字段是否完整
      if (that.data.title == '') {
        that.showModelMsg('请输入日程标题')
        return
      } else if (that.data.happenTime == '') {
        that.showModelMsg('请选择日程日期')
        return
      } else if (that.data.meetingTime == '') {
        that.showModelMsg('请选择日程时间')
        return
      }
      var time = this.data.happenTime + ' ' + this.data.meetingTime + ':00'
      var date = new Date(time.replace(/-/g, "/")).getTime()
      if (that.data.beforeTime != "立刻") {
        var timeInt = parseInt(that.data.beforeTime)
        if (timeInt == 1 || timeInt == 2) {
          timeInt = timeInt * 60
        }
        date = date - timeInt * 60 * 1000
      }
      var reminderTime1 = that.changeToDate(date)
      //获取提醒时间距离现在多久
      var timestamp = Date.parse(new Date())
      timestamp = timestamp + 7 * 24 * 60 * 60 * 1000
      if (timestamp < date) {
        console.log('超出了时间限制')
        wx.showModal({
          title: '提示',
          content: '由于微信限制，目前提醒时间最长不超过七天，是否继续保存',
          cancelText: '留下修改',
          confirmText: '继续保存',
          success: function(res) {
            if (res.confirm) {
              //先删除，在添加
              wx.request({
                url: app.globalData.API + '/reminder/' + reminderId,
                method: 'DELETE',
                header: {
                  loginSession: loginSession
                },
                success: function(res) {
                  if (res.statusCode >= 200 && res.statusCode < 300) {
                    that.addReminder(e)
                  }
                }
              })
            }
          }
        })
      }
    }
  },
  // 删除日程
  deleteReminder: function() {
    var loginSession = wx.getStorageSync('loginSession')
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此日程吗？',
      success: function(e) {
        if (e.confirm) {
          //删除
          wx.request({
            url: app.globalData.API + '/reminder/' + reminderId,
            method: 'DELETE',
            header: {
              loginSession: loginSession
            },
            success: function(e) {
              if (e.statusCode >= 200 && e.statusCode < 300) {
                wx.showModal({
                  title: '提示',
                  content: '删除成功！',
                  confirmText: '确定',
                  showCancel: false,
                  success: function() {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '删除失败！',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  // 退出日程
  quitReminder: function() {
    var loginSession = wx.getStorageSync('loginSession')
    var that = this
    wx.request({
      url: app.globalData.API + '/reminder/' + reminderId + '/notifyuser',
      method: 'DELETE',
      header: {
        loginSession: loginSession
      },
      success: function(e) {
        if (e.statusCode >= 200 && e.statusCode < 300) {
          wx.showModal({
            title: '提示',
            content: '退出成功！',
            confirmText: '确定',
            showCancel: false,
            success: function() {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          })
        } else {
          wx.showToast({
            title: '退出失败！',
            icon: 'none'
          })
        }
      }
    })
  },
  addReminder: function(e) {
    var that = this
    var loginSession = wx.getStorageSync('loginSession')
    var time = this.data.happenTime + ' ' + this.data.meetingTime + ':00'
    var date = new Date(time.replace(/-/g, "/")).getTime()
    if (that.data.beforeTime != "立刻") {
      var timeInt = parseInt(that.data.beforeTime)
      if (timeInt == 1 || timeInt == 2) {
        timeInt = timeInt * 60
      }
      date = date - timeInt * 60 * 1000
    }
    var reminderTime1 = that.changeToDate(date)
    wx.request({
      url: app.globalData.BaseUrl + '/v1/wxapi/reminder',
      method: 'POST',
      header: {
        loginSession: loginSession
      },
      data: {
        title: that.data.title,
        location: that.data.location,
        needPush: timeSwitchState,
        needSms: false,
        ownerFormId: e.detail.formId,
        happenTime: time,
        reminderTime1: reminderTime1,
        detail: that.data.detail
      },
      success: function(res) {
        console.log(res)
        wx.reLaunch({
          url: '../index/index',
        })
      }
    })
  },
  /*
   * 时间戳转换为yyyy-MM-dd hh:mm:ss 格式  formatDate()
   * inputTime   时间戳
   */
  changeToDate: function(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  // 提示信息
  showModelMsg: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      confirmText: '确定',
      showCancel: false,
      success: function() {}
    })
  }
})