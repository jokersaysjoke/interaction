const closeLive=document.querySelector('.close-live');
closeLive.addEventListener('click', closeStreaming);
const toLiveStream=document.querySelector('#toLiveStream');
toLiveStream.addEventListener('click', createStreamingRoom);
// 結束串流
async function closeStreaming(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    await fetch(`/api/room`, {
        method:'PUT',
        body:JSON.stringify({
            master:master,
            status:`Upcomming`
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    closeLive.textContent='CLOSE Room';
    closeLive.addEventListener('click', closeRoom);
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

// 開始串流
async function createStreamingRoom(){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    await fetch(`/api/room`, {
        method:'PUT',
        body:JSON.stringify({
            master:master,
            status:'LIVE'
        }),
        headers: new Headers({"Content-type":"application/json"})
    })
    location.reload();
};