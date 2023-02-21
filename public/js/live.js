const videoHeader=document.querySelector('.setting-detail-type');
videoHeader.focus();
const closeLive=document.querySelector('.close-live');
closeLive.addEventListener('click', closeRoom);
// 結束串流
async function closeStreaming(){
    hlsPLAYer('');
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    await fetch(`/api/room`, {
        method:'PUT',
        body:JSON.stringify({
            master:master,
            status:`Upcoming`,
            streamkey:streamKey.value
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    const item1=document.querySelector('.item1');
    item1.addEventListener('click', closeRoom);
    item1.textContent='QUIT';

};
// 關掉房間
async function closeRoom(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    await fetch(`/api/room`, {
        method:'DELETE',
        body:JSON.stringify({
            master:master
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    location.href=`/`
};

// 發布串流
async function createStreamingRoom(streamkey){

    // const header=document.querySelector('.header');
    // header.style.display='none';

    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    await fetch(`/api/room`, {
        method:'PUT',
        body:JSON.stringify({
            master:master,
            status:'LIVE',
            streamkey:`${streamkey}`
        }),
        headers: new Headers({"Content-type":"application/json"})
    })
};

// copy streamURL、streamKEY
const streamURL=document.querySelector('.streamURL');
function copyStreamUEL(){
    navigator.clipboard.writeText(streamURL.innerText);
};

function copyStremKEY(){
    navigator.clipboard.writeText(streamKey.innerText);
};