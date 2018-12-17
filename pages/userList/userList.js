// pages/userList/userList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userIdArr = [options.ownerId]
    var array = JSON.parse(options.notifyUserInfo)
    for (var i = 0, len = array.length; i < len; i++) {
      var obj = array[i]
      userIdArr.push(obj.userid)
    }

    var arr = []
    for (var i = 0, len = userIdArr.length; i < len; i++) {
      var userId = userIdArr[i]
      var loginSession = wx.getStorageSync('loginSession')
      var that = this
      wx.request({
        url: app.globalData.API + '/user/' + userId,
        method: 'GET',
        header: {
          loginSession: loginSession
        },
        success: function (res) {
          arr.push(res)
          console.log(res)
          that.setData({
            userInfoArr: arr
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(this.data.userInfoArr)
  }
})