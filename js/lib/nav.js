(function (){
    //得到ul
     var ul = document.getElementById('nav');
     console.log(ul)
     //得到li
     var lis = ul.getElementsByTagName("li");
     //计算li的总宽度
     var length = lis.length * 60;
     console.log(length);

     //得到屏幕的宽度
     var windowWidth = document.documentElement.clientWidth;

     // 最小的translateX值
     var min = length - (windowWidth - 80 - 60);

     //起始位置
     var deltaX;

     //信号量
     var nowX = 0;
     //移动的数组
     var moveArr = [];

    //事件监听
    ul.addEventListener("touchstart",function(event){
        //阻止默认事件
        event.preventDefault();

        //去掉过渡
        ul.style.transition = "none";
        //记录误差
        deltaX = event.touches[0].clientX - nowX;
    },false)


    ul.addEventListener("touchmove",function(event){
        //阻止默认事件
        event.preventDefault();
        //touchmove事件并不是说，你滑动了多少像素就触发几次。而是有一个固有的时间周期。
        //你滑动的慢，clientX间距很小。你滑动的快，clientX间距很大。
        nowX = event.touches[0].clientX - deltaX;
        ul.style.left = nowX + "px";
        moveArr.push(event.touches[0].clientX);
        // console.log(moveArr);
    },false)


    //触摸结束 
    ul.addEventListener("touchend",function(event){
        //阻止默认事件
        event.preventDefault();
        //计算moveArr最后两个点的距离
        var s = moveArr[moveArr.length - 1] - moveArr[moveArr.length - 2];
        //s的大小决定了速度，计算一个新发有惯性的值targetX
        var targetX = nowX + s * 3;
        if(targetX < -min){
            targetX = -min;
            //贝塞尔曲线有折返
            ul.style.transition = "all 0.4s cubic-bezier(0.15, 0.85, 0.15, 2.08) 0s";
        }else if(targetX > 0){
            targetX = 0;
            ul.style.transition = "all 0.4s cubic-bezier(0.15, 0.85, 0.15, 2.08) 0s";
        }else{
            ul.style.transition = "all 0.4s cubic-bezier(0.18, 0.68, 0.65, 0.88) 0s";
        }

        //用过渡来实现
        ul.style.transform = "translateX(" + targetX + "px)";
        //信号量的值就是目标x的值
        nowX = targetX;
    },false)
})()