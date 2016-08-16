//该模块是图片的集合容器
define(function (require){
    //要获取图片模型的类
    var ImgModel = require('modules/model/images');

    //创建一个集合类
    var ImgCollection = Backbone.Collection.extend({
        model : ImgModel,
        imageId : 0,
        //用来拉取服务端的数据，添加到集合中
        fetchData : function (success){
            //备份this
            var self = this;
            //发送ajax请求
            $.get('data/imageList.json' , function (res){
                if(res.errno == 0){
                    res.data.sort(function (){
                        return Math.random() * .5 ? 1 : -1;
                    })
                    //返回的res.data是一个数组
                    res.data.map(function (item){
                        item.id = self.imageId++;
                    })
                    //将返回的数据添加到集合中
                    self.add(res.data)
                    //将数据添加到集合中后调用回调函数
                    success && success();
                }
            })
        }
    })

    // var list = new ImgCollection();
    //测试
    // list.add({
    //     "title": "精彩建筑摄影作品",
    //     "url": "img/01.jpg",
    //     "width": 640,
    //     "height": 400
    // })
    
    return ImgCollection;
})