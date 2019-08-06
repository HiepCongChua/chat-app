function increaseNumberNotification(className){
    let currentValue = +($(`.${className}`).text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
    currentValue += 1;
    if(currentValue===0)
    {
      $(`.${className}`).css("display","none").html('');  
    }
    else {
        $(`.${className}`).css("display","block").html(currentValue);
    }
};
function decreaseNumberNotification(className){
    let currentValue = +($(`.${className}`).text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
     currentValue -= 1;
    console.log("des",currentValue);
    if(currentValue===0)
    {
      $(`.${className}`).css("display","none").html('');  
    }
    else {
        $(`.${className}`).css("display","block").html(currentValue);
    }
}