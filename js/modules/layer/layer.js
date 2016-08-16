// 创建大图页视图类模块
define(function (require) {
    require('modules/layer/layer.css');
    var height = $(window).height();

	// 创建大图页视图类
	var LayerView = Backbone.View.extend({
        tpl : _.template($('#layer_tpl').html()),
        modelId : 0,
        events : {
            'swipeLeft .img_container img' : 'showNextImage',
            'swipeRight .img_container img' : 'showPreImage',
            'tap .img_container img' : 'toggleNav'
        },
        //点击图片显示nav
        toggleNav : function (){
            this.$('.navbar').toggleClass('hide');
        },
        //向左滑动显示下一张
        showNextImage : function (){
            //获取数据model
            var model = this.collection.get(++this.modelId);
            //如果在集合中可以获取到model，执行渲染逻辑
            if(model){
                this.changeImage(model)
            }else{
                alert('已经是最后一张了');
                this.modelId--;
            }
        },
        //向右滑动显示上一张
        showPreImage : function (){
            //获取数据model
            var model = this.collection.get(--this.modelId);
            //如果在集合中可以获取到model，执行渲染逻辑
            if(model){
                this.changeImage(model);
            }else{
                alert('已经是第一张了');
                this.modelId++;
            }
        },
        // 根据model改变当前视图中的图片
        changeImage : function (model){
            this.$('.img_container img').attr('src' , model.get('url'));
            this.$('.title').html(model.get('title'))
        },

        getModelById : function (id){
            this.modelId = id;
            var model = this.collection.get(id);
            return model;
        },
        //渲染大图页
		render: function (id) {
			//根据id获取集合中的模型
            var model = this.getModelById(id);
            if(!model){
                //将该页面跳转到list
                location.hash = '#';
                return;
            }
            //获取json数据
            var data = model.pick('url' , 'title');
            data.styles = 'line-height:' + height + 'px';
            // 渲染模板
            var tpl = this.tpl(data);
            //插入到页面中
            this.$el.html(tpl);
            //将大图显示出来
            this.$el.show();
		}
	})
	return LayerView;
})