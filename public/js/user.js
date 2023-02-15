//click open register window
const accountStatus=document.querySelector(".account-status");
const registerWindow=document.querySelector('.register-window');
const registerWindowBackground=document.querySelector('.register-window-background');
const create=document.querySelector('.create');

function openRegister(){
    registerWindow.style.display='block';
    registerWindowBackground.style.display='block';
    registerWindowBackground.addEventListener('click', closeRegister);
    userLoginID.focus();
};
function closeRegister(){
    registerWindow.style.display='none';
    registerWindowBackground.style.display='none';
    window.location.reload();
};

//toggle login/register
let isLogin = true;
const clickStatus=document.querySelector('.click-status');
clickStatus.addEventListener('click', toggleStatus);
function toggleStatus(){
    const register=document.querySelector('.register');
    const userLogin=document.querySelector('.user-login');
    const haveAccount=document.querySelector('.have-account');
    const flashAlert=document.querySelector(".flash-alert");
    if(isLogin){
        register.style.display='block';
        userLogin.style.display='none';
        haveAccount.textContent='已經有帳戶?';
        clickStatus.textContent='點此登入';
        flashAlert.style.display='none';
        userRegisterUsername.focus();

    }else{
        register.style.display='none';
        userLogin.style.display='block';
        haveAccount.textContent='還沒有帳戶?';
        clickStatus.textContent='點此註冊';
        flashAlert.style.display='none';
    }
    isLogin = !isLogin;
};

//登入狀態
window.onload=memberStatus();
async function memberStatus(){
    const welcome=document.querySelector('.welcome');
    accountStatus.textContent="登入/註冊";
    const response=await fetch(`/api/user`);
    const data=await response.json();
    console.log(data)
    if(data.data!==null){
        welcome.textContent=`你好，${data.data.name}`;
        welcome.addEventListener('click', ()=>{
            location.href=`/`;
        });
        accountStatus.textContent='登出';
        accountStatus.addEventListener('click', logOut);
        if(data.data.record===0){
            create.classList.add('createDispay');
            create.addEventListener('click', registerLiveRoom)
        }else{
            create.textContent='回直播'
            create.classList.add('createDispay');
            create.addEventListener('click', ()=>{
                location.href=`/live/${data.data.name}`
            })
        }
        
        
    }else if(data.data===null){
        accountStatus.textContent="登入/註冊";
        accountStatus.addEventListener('click', openRegister)

    }
};

//會員登入
async function signIn(){
    const flashAlert=document.querySelector(".flash-alert");
    if(userLoginID.value===''||userLoginPW.value===''){
        flashAlert.style.display='block';
        flashAlert.style.color="red";
        flashAlert.textContent='Incorrect username or password';
    }else{
    const response=await fetch(`/api/user`, {
                method:"PUT",
                body:JSON.stringify({
                email:userLoginID.value,
                password:userLoginPW.value
            }),
            headers: new Headers({"Content-type":"application/json"})
        })
    const data=await response.json();
    
        if(data.ok){
            accountStatus.textContent="登出";
            accountStatus.addEventListener('click', logOut);
            setTimeout("location.reload()", 500);
        }
        else if(data.error){
            flashAlert.style.color="#fff";
            flashAlert.style.backgroundColor="red";
            flashAlert.style.display='block';
            flashAlert.textContent="Incorrect username or password";
        }
        else{
            flashAlert.style.color="#fff";
            flashAlert.style.backgroundColor="red";
            flashAlert.style.display='block';
            flashAlert.textContent="連線錯誤";
        }
    }
};

//會員登出
async function logOut(){
    const response=await fetch(`/api/user`, {
        method:"DELETE"
    })
    const data=await response.json();
    if(data.ok){
        accountStatus.textContent=`登入/註冊`
        create.style.display='none';
        setTimeout("location.reload()", 500)
    }else{
        console.log(data)
    }
};

//會員註冊
const registerBtn=document.querySelector('#register-btn');
async function signUp(){
    const flashAlert=document.querySelector(".flash-alert");

    if(userRegisterUsername.value===''||userRegisterEmail.value===''||userRegisterPassword.value===''){
        flashAlert.style.color="red";
        flashAlert.style.display='block';
        flashAlert.textContent='Value can not be empty';
    }else{
            const response=await fetch(`/api/user`, {
                method:"POST",
                body:JSON.stringify({
                    name:userRegisterUsername.value,
                    email:userRegisterEmail.value,
                    password:userRegisterPassword.value
            }),
            headers: new Headers({"Content-type":"application/json"})
        })
        const data=await response.json();
        if(data.ok){
            setTimeout("location.reload()", 500)
        }
        else if(data.error){
            flashAlert.style.color="#fff";
            flashAlert.style.backgroundColor="red";
            flashAlert.style.display='block';
            flashAlert.textContent="Email has been registered";
        }
        else{
            flashAlert.style.color="#fff";
            flashAlert.style.backgroundColor="red";
            flashAlert.style.display='block';
            flashAlert.textContent="連線錯誤";
        }
    }
};

// keydown login
const userLoginID=document.querySelector('#user-login-id');
const userLoginPW=document.querySelector('#user-login-pw');
userLoginID.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        signIn();
    }
});
userLoginPW.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        signIn(); 
    }
});

// keydown register
const userRegisterUsername=document.querySelector('#user-register-username');
const userRegisterEmail=document.querySelector('#user-register-email');
const userRegisterPassword=document.querySelector('#user-register-password');
userRegisterEmail.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        signUp();
    }
});
userRegisterPassword.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        signUp();
    }
});