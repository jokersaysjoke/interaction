//載入頁面
window.onload=memberStatus();
window.onload=fetchLiveRoom();


// register live room
async function registerLiveRoom(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const name=result.data.name;
    const email=result.data.email;
    let response=await fetch(`/api/room`, {
        method:'POST',
        body:JSON.stringify({
            name:name
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    let data=await response.json();
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

//create live-room
function createLiveRoom(master){
    const videoPreviewBackground=document.querySelector('.video-preview-background');
    const div=document.createElement('div');
    div.classList.add('video-preview');
    div.textContent=master;
    div.addEventListener('click', ()=>{
        location.href=`/room/${master}`
    });
    videoPreviewBackground.appendChild(div);
};
