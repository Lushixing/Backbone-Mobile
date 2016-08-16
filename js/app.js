define(function (require) {

    //把图片集合模块引入进来
    var ImgCollection = require('modules/collection/img');
    //引入列表视图
    var List = require('modules/list/list');
    //引入大图类
	var Layer = require('modules/layer/layer');

    var imgCollection = new ImgCollection();

    //创建大图页视图
    var layerView = new Layer({
        collection : imgCollection,
        el : $("#layer")
    })

    //创建列表页
    var listView = new List({
        collection : imgCollection,
        el : $("#list")
    })

    //创建路由
    var Router = Backbone.Router.extend({
        routes : {
            //大图类路由
            'layer/:num' : 'showLayer',
            '*other' : 'showList'
        },
        showLayer : function (id){
            
            layerView.render(id);
            // console.log(id)
            //打开大图页是时候，将列表页隐藏，大图页显示 
            $('#list').hide();
            $('#layer').show();
        },
        showList : function (){
            
            // view.render();
            // console.log('show list')
            
            //打开列表页是时候，将大图页隐藏，列表页显示 
            $('#layer').hide();
            $('#list').show();
        }
    })

    //初始化路由
    return function (){
        var router = new Router();
        Backbone.history.start();
    }
})