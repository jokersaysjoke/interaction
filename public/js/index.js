//register live room
async function registerLiveRoom(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const name=result.data.name;
    const response=await fetch(`/api/room`, {
        method:'POST',
        body:JSON.stringify({
            name:name
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    const data=await response.json();
    if(data.ok){
        location.href=`/live/${name}`
    }else(
        console.log(data)
    )
};

//fetch live-room
async function fetchLiveRoom(){
    const response=await fetch(`/api/room`);
    const data=await response.json();
    if(data.data){
        const d=data.data;
        for(let i=0; i<d.length; i++){
            createLiveRoom(d[i].MASTER);
        }
    }else{
        console.log(data);
    };
};
//載入頁面
window.onload=fetchLiveRoom();

//create live-room
function createLiveRoom(master){
    const videoPreviewBackground=document.querySelector('.video-preview-background');
    const div=document.createElement('div');
    div.classList.add('video-preview');
    div.textContent=master;
    div.addEventListener('click', ()=>{
        location.href=`/room/${master}`
    });
    // div.addEventListener('click', joinChatRoom);
    videoPreviewBackground.appendChild(div);
};

//join caht room
async function joinChatRoom(){
    const welcome=document.querySelector('.welcome');
    const user=welcome.textContent.split('你好，')[1];
    const response=await fetch(`/api/room`, {
        method:'PUT',
        body:JSON.stringify({
            user:user

        })
    });
    const data=await response.json();
    console.log(data);
};