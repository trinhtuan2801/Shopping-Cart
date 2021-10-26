let sign = document.querySelectorAll(".input_sign");
let btnSign = document.querySelector(".signupbtn");
let demo = document.querySelectorAll(".demo");
let request = document.querySelectorAll(".request");
let name,phone,user,psw,re_psw,checkbox;

let login_user = document.getElementById("login_user");
let login_psw = document.getElementById("login_psw");
let TB = document.getElementById("TB");
let login_check = false;

const handleResponse = (response) => {

    console.log(response);

    //----------------------------------đăng nhập-------------------------

    document.querySelector(".btn_login").addEventListener("click",function(e){
        for(let i=0;i<=response.length-1;i++){
            if(login_user.value == response[i].User && login_psw.value == response[i].Password){
                login_check = true;
                break;
            }
        }
        if(login_check == true){
            TB.innerText = "";
            alert("đăng nhập thành công");
        }
        else if(login_user.value.trim()!="" && login_psw.value.trim()!=""){
            TB.innerText = "tài khoản hoặc mật khẩu không chính xác";
            e.preventDefault();

        }
        login_check= false;
    })

    //---------------------------đăng xuất---------------------------------

    function check_erro(phone,user,psw,re_psw){
        for(let i = 0; i < response.length;i++){
            let re_phone = '0'+response[i].Phone;
            if(phone == re_phone){
                demo[1].innerText="Số điện thoại đã được sử dụng";
                request[1].innerText=""

            }
            else{
                demo[1].innerText="";
                request[1].innerText="Số điện thoại chỉ chứa 10 kí tự và 2 kí tự đầu là 09|03|07|08|05 ";
            }
            if( user == response[i].User){
                demo[2].innerText="Tên tài khoản đã được sử dụng";
                request[2].innerText=""
            }
            else{
                demo[2].innerText="";
                request[2].innerText="Tài khoản phải lớn hơn hoặc bằng 6 kì tự và không chứa khoảng trắng"
            }    
        }
        if(re_psw.length>0&&re_psw != psw){
            demo[4].innerText = "Mật khẩu không trùng khớp";
        }
        else {
            demo[4].innerText = "";
        }

    }
//
    //

    btnSign.addEventListener("click",btnSignClick);
    function btnSignClick(e) {
        name = sign[0].value.trim();
        phone = sign[1].value.trim();
        user = sign[2].value.trim();   
        psw = sign[3].value;
        re_psw = sign[4].value;
        check_erro(phone,user,psw,re_psw);
        if(demo[1].innerText !="" || demo[2].innerText !="" || demo[4].innerText !=""  ){
            e.preventDefault();
        }
        else if(name !="" && phone.length>=10 && user.length>=6 && psw.length >=6 && sign[5].checked == true ){

            fetch('https://sheetdb.io/api/v1/lictkn7y1w1ep', {
                method: 'POST',
                body: JSON.stringify({
                    Name: name,
                    Phone: phone,
                    User: user,
                    Password: psw
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then((response) => response.json())
            e.preventDefault();
            alert("Sign Up Success");
            document.querySelector(".sign-modal-content").submit();   

        }
    }

}

fetch('https://sheetdb.io/api/v1/lictkn7y1w1ep')
    .then(response => response.json())
    .then(handleResponse)

