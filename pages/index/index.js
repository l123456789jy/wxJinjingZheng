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
      url: "https://enterbj.zhongchebaolian.com/enterbj/platform/enterbj/curtime_03",
      method: 'GET',
      header: {
        'Host': 'enterbj.zhongchebaolian.com',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; MI 5 Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://enterbj.zhongchebaolian.com/enterbj/platform/enterbj/toVehicleType',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,en-US;q=0.8',
        'Cookie': 'JSESSIONID=5F9CAA1A713B817DCD8C03D730C1405E; UM_distinctid=15ec7ad338672-0758eb2f67658a-12797d23-38400-15ec7ad338716a; CNZZDATA1260761932=1788518962-1499394672-https%253A%252F%252Fenterbj.zhongchebaolian.com%252F%7C1507934398',
        'X-Requested-With': 'com.zcbl.bjjj_driving',
      },
      success: function (res) {
        wx.hideLoading()
        _that.setData({
          //设置进京证状态
          message3: JSON.stringify(res.data).includes("排队人数过多") ?"不能办理":'可以办理',
        })
        console.log(JSON.stringify(res))
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

  openPhoto: function () {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: ['https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFU8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyQTJkN01zQ2ZlNjAxMDAwMGcwN0MAAgTJTx9aAwQAAAAA'] // 需要预览的图片http链接列表
    })
  }


})

