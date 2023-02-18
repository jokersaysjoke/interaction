const closeLive=document.querySelector('.close-live');
closeLive.addEventListener('click', closeRoom);
// 結束串流
async function closeStreaming(){
    hlsPLAYer(streamKey.value);
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
    closeLive.textContent='CLOSE Room';
    closeLive.addEventListener('click', closeRoom);
    closeLive.textContent='QUIT';

    const item3=document.querySelector('.item3');
    item3.style.display='none';
    item4.style.display='flex';
    streamKey.focus();
    
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
    console.log(streamkey);
    const header=document.querySelector('.header');
    header.style.display='none';
    const item3=document.querySelector('.item3');
    const toLiveStream=document.querySelector('#toLiveStream');
    item3.style.backgroundColor='#121212';
    toLiveStream.style.backgroundColor='#121212';
    toLiveStream.style.cursor='default'
    toLiveStream.textContent='※LIVE Streaming'

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
    // location.reload();
};

const streamURL=document.querySelector('.streamURL');
streamURL.addEventListener('click', ()=>{
    navigator.clipboard.writeText(streamURL.innerText);
});
const copy=document.querySelector('.copyURL');
copy.addEventListener('click', ()=>{
    navigator.clipboard.writeText(streamURL.innerText);
});