function increaseNumberNotifiContact(className){
    let currentValue = +($(`.${className}`).find("em").text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
    currentValue += 1;
    if(currentValue===0)
    {
      $(`.${className}`).html('');  
    }
    else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};
function decreaseNumberNotifiContact(className){
    let currentValue = +($(`.${className}`).find("em").text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
    currentValue -= 1;
    if(currentValue===0)
    {
      $(`.${className}`).html('');  
    }
    else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};