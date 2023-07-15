// click open register window
const accountStatus=document.querySelector(".account-status");
const accountImg=accountStatus.querySelector('img');
const registerWindow=document.querySelector('.register-window');
const registerWindowBackground=document.querySelector('.register-window-background');
const createStreamBtn=document.querySelectorAll('.create-btn');
const account=document.querySelector('.account');
const accountContent=document.querySelector('.account-status-content');

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
function register(){
    registerWindow.style.display='block';
    registerWindowBackground.style.display='block';
    registerWindowBackground.addEventListener('click', closeRegister);
    toggleStatus();
    userLoginID.focus();
};

// toggle login/register
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

// 登入狀態
async function memberStatus(){
    createStreamBtn.forEach((item, index)=>{
        item.textContent='開始直播';
    })
    const welcome=document.querySelector('.welcome');
    const response=await fetch(`/api/user`);
    const data=await response.json();
    if(data.data!==null){
        if(data.data.history!==null){
            host(data.data.history);

        }

        await fetchImg();
        welcome.addEventListener('click', ()=>{
            location.href=`/home`;
        });
        accountStatus.style.display='flex';
        accountStatus.classList.add('account-status-in')
        accountStatus.addEventListener('click', ()=>{
            window.location='/profile'
        });
        accountContent.textContent='Sign out';
        accountContent.addEventListener('click', logOut)

        if(data.data.room===0){
            createStreamBtn.forEach((item, index)=>{
                item.addEventListener('click', registerLiveRoom)
            })
            
        }else{
            createStreamBtn.forEach((item, index)=>{
                item.addEventListener('click', ()=>{
                    location.href=`/live/${data.data.name}`
                })
            })
        }
        
    }else{
        accountStatus.textContent='Sign in';
        accountStatus.addEventListener('click', openRegister);
        createStreamBtn.forEach((item, index)=>{
            item.addEventListener('click', openRegister)
        });
    }
    accountImg.style.display='block'
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
            const t=new Date;
            let td=`${t.getFullYear()}/${t.getMonth()+1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
            const res=await fetch(`/api/user/post`, {
                method: "POST",
                body: JSON.stringify({
                    email: userLoginID.value,
                    time: td
                }),
                headers: new Headers({"Content-type":"application/json"})
            });

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
        setTimeout("location.reload()", 500)
    }
};

//會員註冊
const registerBtn=document.querySelector('#register-btn');
async function signUp(){
    const flashAlert=document.querySelector(".flash-alert");
    
    randomStreamkey();
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
                    password:userRegisterPassword.value,
                    streamkey:randomkey
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
userLoginID.value='test@test.com'
const userLoginPW=document.querySelector('#user-login-pw');
userLoginPW.value='test'
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

// random stream key
const aZ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ns="0123456789";
let randomkey='';

function randomStreamkey(){
    for(let i=0; i<3; i++){
        let randomIndex=Math.floor(Math.random()*aZ.length);
        randomkey+=aZ[randomIndex];
    };
    for(let i=0; i<3; i++){
        let randomIndex=Math.floor(Math.random()*ns.length);
        randomkey+=ns[randomIndex];
    };
    for(let i=0; i<3; i++){
        let randomIndex=Math.floor(Math.random()*randomkey.length);
        randomkey+=randomkey[randomIndex];
    }
};

// 載入頁面
window.onload=memberStatus();

// register live room
async function registerLiveRoom(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const name=result.data.name, email=result.data.email;
    const response=await fetch(`/api/room`, {
        method:'POST',
        body:JSON.stringify({
            name: name,
            email: email
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    const data=await response.json();
    if(data.ok){
        location.href=`/live/${name}`
    }
};

// profile img
async function fetchImg(){
    const response=await fetch('/api/image');
    const data=await response.json();
    const dd=data.data
    if(dd!==null){
        accountImg.setAttribute('src', `https://d3i2vvc6rykmk0.cloudfront.net/${dd.address}`)
    }
    return
}

function host(ddh){
    if (ddh) {
        const mainbk=document.querySelector('.main-background');
        mainbk.style.display='block';
        const contain=document.querySelector('.contain');
        contain.innerHTML='';
        const main=document.querySelectorAll('.main');
        main[1].innerHTML='';
        for(let i=0; i<ddh.length; i++){
            console.log('id', ddh[i].ID);

            const li=document.createElement('li');
            li.textContent=`ID:${ddh[i].ID}, user:${ddh[i].USER_ID}, loginAt:${ddh[i].LOGIN_TIME}`;
            contain.appendChild(li);
        }
        return
    } else {
        return
    }

}