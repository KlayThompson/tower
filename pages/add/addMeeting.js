// pages/add/addMeeting.js
//获取应用实例
const app = getApp()

var userLat, userLng;
var timeSwitchState = true
var locationSwitchState = false
var desc = ''
var rTitle = ''
var location = ''
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrow_icon_url: '/resources/arrow-right.png',
    meetingDate: '', //会议日期
    meetingTime: '', //会议时间
    beforeTime: '立刻',
    array: ['立刻', '5分钟', '10分钟', '30分钟', '1小时', '2小时', '24小时'],
    timeStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  orderSign: function(e) {
    console.log(e)
    var that = this
    var loginSession = wx.getStorageSync('loginSession')
    var time = this.data.meetingDate + ' ' + this.data.meetingTime + ':00'
    var date = new Date(time.replace(/-/g, "/")).getTime()
    if (that.data.beforeTime != "立刻") {
      var timeInt = parseInt(that.data.beforeTime)
      if (timeInt == 1 || timeInt == 2 || timeInt== 24) {
        timeInt = timeInt * 60
      }
      date = date - timeInt * 60 * 1000
    }
    var reminderTime1 = that.changeToDate(date)
    if (rTitle == '') {
      that.showModelMsg('请输入日程标题')
      return
    } else if (that.data.meetingDate == '') {
      that.showModelMsg('请选择日程日期')
      return
    } else if (that.data.meetingTime == '') {
      that.showModelMsg('请选择日程时间')
      return
    }
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
            that.addReminderToServer(rTitle, location, timeSwitchState, false, e.detail.formId, time, reminderTime1, desc)
          }
        }
      })
    } else {
      that.addReminderToServer(rTitle, location, timeSwitchState, false, e.detail.formId, time, reminderTime1, desc)
    }
  },
// 最后网络请求
  addReminderToServer: function(title, location, needPush, needSms, formId, time, reminderTime, desc) {
    var that = this
    var loginSession = wx.getStorageSync('loginSession')
    wx.request({
      url: app.globalData.BaseUrl + '/v1/wxapi/reminder',
      method: 'POST',
      header: {
        loginSession: loginSession
      },
      data: {
        title: title,
        location: location,
        needPush: needPush,
        needSms: needSms,
        ownerFormId: formId,
        happenTime: time,
        reminderTime1: reminderTime,
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
  selectDate: function(e) {
    console.log(e)
    this.setData({
      meetingDate: e.detail.value
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

  // 时间开关事件
  timeSwitchChange: function(res) {
    timeSwitchState = res.detail.value
    console.log(timeSwitchState)
    this.setData({
      timeStatus: res.detail.value
    })
  },
  // 位置开关事件
  locationSwitchChange: function(res) {
    locationSwitchState = res.detail.value
    console.log(locationSwitchState)
    if (locationSwitchState) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          userLat = res.latitude
          userLng = res.longitude
          console.log(userLat, userLng)
        }
      })
    }
  },
  //描述输入
  inputDesc: function(e) {
    desc = e.detail.value
    console.log(desc)
  },
  //日程地点输入
  inputLocation: function(e) {
    location = e.detail.value
    console.log(location)
  },

  goToHomePage: function() {

    wx.showModal({
      title: '提示',
      content: '保存成功！',
      confirmText: '确定',
      showCancel: false,
      success: function() {
        wx.navigateBack({

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