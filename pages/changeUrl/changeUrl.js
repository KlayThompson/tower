// pages/changeUrl/changeUrl.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isProduct: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.BaseUrl == 'https://dwxapi.anyocharging.com:12443') {
      this.setData({
        isProduct: true
      })
    } else {
      this.setData ({
        isProduct: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 切换到测试环境
  changeToDevelope: function() {

    if (!this.data.isProduct) {
      wx.navigateBack({
        
      })
      return
    }

    wx.showModal({
      title: '确定切换吗？',
      content: '此功能为隐藏功能，请勿无故切换，可能会引发异常现象',
      confirmText: '确定',
      success: function(e) {
        if (e.confirm) {
          wx.clearStorageSync()
          app.globalData.userInfo = ''
          app.globalData.API = 'https://dwxapi.anyocharging.com:11443/v1/wxapi/'
          app.globalData.BaseUrl = 'https://dwxapi.anyocharging.com:11443'
          wx.setStorageSync('API_TOWER', 'https://dwxapi.anyocharging.com:11443/v1/wxapi/')
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  },
  // 切换到正式环境
  changeToProduction: function() {

    if (this.data.isProduct) {
      wx.navigateBack({
        
      })
      return
    }

    wx.showModal({
      title: '确定切换吗？',
      content: '此功能为隐藏功能，请勿无故切换，可能会引发异常现象',
      confirmText: '确定',
      success: function(e) {
        if (e.confirm) {
          wx.clearStorageSync()
          app.globalData.userInfo = ''
          app.globalData.API = 'https://dwxapi.anyocharging.com:12443/v1/wxapi/'
          app.globalData.BaseUrl = 'https://dwxapi.anyocharging.com:12443'
          wx.setStorageSync('API_TOWER', 'https://dwxapi.anyocharging.com:12443/v1/wxapi/')
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  }
})