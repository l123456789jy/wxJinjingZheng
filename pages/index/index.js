//index.js
//获取应用实例
var util = require('../../utils/util.js');  
var app = getApp()
Page({
  data: {
    motto: 'Hello World Lazy',
    message: '',
    message2: '',
    message3: '',
    message4: util.formatTime(new Date())
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _that = this;
    
    console.log('页面加载')
      wx.showLoading({
        title: '正在的定位。',
      }),
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.hideLoading()
        wx.showToast({
          title: '定位成功',
        })
        _that.changeItemInObject(res.altitude,res.longitude);
        _that = null;
      },
      fail:function(){
        wx.hideLoading()
        wx.showLoading({
          title: '失败',
        })
      },
    })

  },
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.stopPullDownRefresh()
  },
  onShow: function (options) {
    console.log('程序可见')
  },
  onHide: function () {
    console.log('隐藏')
  },
  //获取进京证的办理状态
  getJinJingState: function () {
    var _that = this;
    wx.request({
      url: "https://api.jinjingzheng.zhongchebaolian.com/enterbj/platform/enterbj/entercarlist",
      data: {
        appkey: 'kkk',
        userid: "1DD36174392C4DBB95941CEBFA60ADC6",
        acc: 'E34036F213B04754811689FD52ADF069',
        deviceid: 'ddd',
        token: '290EA66D9ECC4096D959C0BB4838B819',
        timestamp: '1511956923615000'
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Referere': 'https://api.jinjingzheng.zhongchebaolian.com/enterbj/jsp/enterbj/index.jsp'
      },
      success: function (res) {
        wx.hideLoading()
        _that.setData({
          //设置进京证状态
          message3: "状态码" + res.statusCode,
        })
        console.log(res.data)
      },
      fail: function () {
        wx.hideLoading()
      },
    }),
      console.log('点击我了')
  },
  changeItemInObject: function (altitude,longitude) {
    //在异步方法中必须标记this才能调用外部方法
    var _that = this;
    wx.showLoading({
      title: '加载中',
    }),
    //获取限行信息
    wx.request({
      url: "https://bjjj.zhongchebaolian.com/app_web/mobile/standard/weather",
      data: {
        location: '1101',
        latx: altitude,
        lngy: longitude,
        acc: 'E34036F213B04754811689FD52ADF069',
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log(JSON.stringify(res.data))
        wx.showToast({
          title: '请求成功',
        })
        _that.setData({
          //设置显示的尾号信息
          message: res.data.date + " " + res.data.week + " " + "今日限行" + res.data.astrictno,
          message2: "明日限行尾号：" + res.data.astrictmt,
        })
        //获取进京状态 
        _that.getJinJingState();
        console.log(res.data.date)
      },
      fail:function(){
        wx.hideLoading()
      },
    }),
    console.log('点击我了')
  },



})

