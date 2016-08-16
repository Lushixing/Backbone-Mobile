//图片的模型模块
define(function (require){
    //计算容器的宽度
    // 屏幕宽度是由两张图片和三个边距构成，每个边距是6像素
    // 得到一张图片的宽度
    var listWidth = parseInt(($(window).width() - 6 * 3) / 2); 
    var ImgModel = Backbone.Model.extend({
        initialize : function (){
            this.on('add' , function (model){
                //根据容器宽度算出每个模型的实际宽度
                //model.get('height') 获取的高度
                var h = model.get('height') * listWidth / model.get('width');
                //为模型添加计算后的高度和宽度
                model.set({
                    showHeight : h,
                    showWidth : listWidth
                })
                // console.log(model);
            })
        }
    })

    return ImgModel;
})