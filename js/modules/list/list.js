// 创建列表视图
define(function (require) {
    require('modules/list/list.css')
    var Throttle = require('tools/throttle')
	// 创建列表视图类
	var ListView = Backbone.View.extend({
        //图片的视图模板
        tpl : _.template('<a href="#layer/<%=id%>"><img style="<%=style%>" src="<%=url%>" alt="" /></a>'),
        leftHeight : 0,
        rightHeight : 0,
        //添加搜索交互
        events : {
            'tap .search-btn' : 'showSearchView',
            'tap .nav li' : 'chooseImageType',
            //返回顶部点击事件
            'tap .go_top' : 'goTop',
            'tap .back' : 'showAllImg'
        },
        initialize : function (){
            //备份this
            var self = this;
            //第一步获取页面图片的数据
            this.getData();
            //第二步获取图片容器元素
            this.initDom();
            //监听集合添加数据
            this.listenTo(this.collection , 'add' , function (model){
                this.render(model);
            })

            //绑定window scroll 来监听页面滚到底部加载图片
            // $(window).on('scroll' , function (){
            //     //滚到底部还剩200的时候加载图片 
            //     //body高度要 = window高度+ window.scrollTop高度+ 200
            //     var h = $('body').height() - $(window).height() - $(window).scrollTop() - 200;
            //     if(h){
            //         self.getData();
            //     }
            // })
            
            // 绑定window scroll , 函数节流 , 这个是对上面的window.scroll的优化
            $(window).on('scroll' , function(){
                Throttle(self.loadMoreData , {
                    context : self
                })
            })

        },
        loadMoreData : function(){
            var h = $('body').height() - $(window).height() - $(window).scrollTop() - 200;
            if(h){
                this.getData();
            }

            this.dealGoTop();
        },
        //处理返回顶部按钮
        dealGoTop : function (){
            if($(window).scrollTop() >= 200){
                this.$('.go_top').show()
            }else{
                this.$('.go_top').hide()
            }
        },
        //获取集合数据
        getData : function (){
            this.collection.fetchData();
        },
        //获取图片容器元素
        initDom : function (){
            //左边容器
            this.leftContainer = this.$('.left-list')
            //右边容器
            this.rightContainer = this.$('.right-list')
        },
		render: function (model) {
			//获取json数据
            var data = {
                id : model.get('id'),
                style : 'width:' + model.get('showWidth') + 'px; height:' + model.get('showHeight') + 'px;' ,
                url : model.get('url')
            };

            //格式化模板
            var tpl = this.tpl(data);
            //判断两个容器的高度，哪个高度矮就在哪个容器内添加图片，此前要保存左右的高度
            if(this.leftHeight > this.rightHeight){
                //右边添加
                this.renderRight(tpl , model.get('showHeight'))
            }else{
                //左边添加
                this.renderLeft(tpl , model.get('showHeight'))
            }
		},
        renderLeft : function (tpl , height){
            this.leftHeight += height + 6;
            //将tpl转化为zepto对象，并插入到左边的容器
            this.leftContainer.append($(tpl));
            
        },
        renderRight : function (tpl , height){
            this.rightHeight += height + 6;
            //将tpl转化为zepto对象，并插入到右边的容器
            this.rightContainer.append($(tpl));
        },
        //获取搜索框里面的内容
        getSearchInputValue : function (){
            var val = this.$('.search-input').val();
            //判断val非空
            if(/^\s*$/.test(val)){
                alert('请输入搜索内容');
                return;
            }
            //去掉空白符
            val = val.replace(/^\s+|\s+$/g , '');
            // console.log(val)
            //将val返回
            return val;
        },
        //在集合中搜索数据
        searchDataFromCollection : function (val , key){
            var searchKey = key || 'title';
            var col = this.collection.filter(function (model){
                //精确匹配，判断val是不是模型title的里面
                return model.get(searchKey).indexOf(val) >= 0;
            })
            //返回col
            return col;
        },
        //重置搜索的视图
        resetView : function (result){
            //备份this
            var self = this;
            //首先要清空图片视图
            this.clearView();
            //遍历result中的model
            result.forEach(function (model , index){
                self.render(model);
            })
        },
        //清空图片视图
        clearView : function (){
            // 右边
            this.rightContainer.html('');
            // 高度也要清除
            this.leftHeight = 0;
            // 左边
            this.leftContainer.html('');
            // 高度也要清除
            this.rightHeight = 0;
        },
        //显示搜索结果页
        showSearchView : function (){
            //第一步获取搜索的内容
            var val = this.getSearchInputValue();
            //第二步根据搜索内容获取数据
            if(val){
                var result = this.searchDataFromCollection(val , 'title');
                //第三步把这些数据渲染到页面中
                this.resetView(result);
                console.log(result);

                this.$('.nav li').removeClass('cur')
            }


            
        },
        getTypeBtnValue : function (dom){
            var id = $(dom).data('id');
            return id;
        },
        getModelsFromCollection : function (val , key){
            return this.collection.filter(function (model){
                return model.get(key) == val
            })
        },
        //单机图片类别按钮回调函数
        chooseImageType : function (e){
            // console.log(111111111)
            //第一步获取按钮上的数据
            var id = this.getTypeBtnValue(e.target);

            //第二步获取集合中的相关类型
            var result = this.getModelsFromCollection(id , "type");
            //第三步渲染页面
            this.resetView(result);
            // console.log(result)
            
            //给li添加样式
            this.$(e.target).addClass('cur').siblings().removeClass('cur');

            //清空搜索框
            this.$('.search-input').val('');
        },
        goTop : function (){
            window.scrollTo(0,0);
        },
        showAllImg : function (){
            var self = this;
            this.clearView();
            this.collection.forEach(function (model){
                self.render(model)
            })

            this.$('.nav li').removeClass('cur')
        }
        
	})

	return ListView;
})