function increaseNumberNotification(className,number){
    let currentValue = +($(`.${className}`).text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
    currentValue += number;
    if(currentValue===0)
    {
      $(`.${className}`).css("display","none").html('');  
    }
    else {
        $(`.${className}`).css("display","block").html(currentValue);
    };
};
function decreaseNumberNotification(className,number){
    let currentValue = +($(`.${className}`).text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
     currentValue -= number;
    if(currentValue===0)
    {
      $(`.${className}`).css("display","none").html('');  
    }
    else {
        $(`.${className}`).css("display","block").html(currentValue);
    };
};