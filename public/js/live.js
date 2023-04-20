const createStreamBtn=document.querySelector('.create-btn');
createStreamBtn.className='item1';
createStreamBtn.textContent='END Stream';

const logo=document.querySelector('.header-left');
logo.addEventListener('click', closeRoom);

const videoHeader=document.querySelector('.setting-detail-type');
videoHeader.focus();
const closeLive=document.querySelector('.close-live');
closeLive.addEventListener('click', closeRoom);
createVideoDate();


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
    item1.textContent='QUIT';
    item1.addEventListener('click', async ()=>{
        await upload2S3();

    });

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

    location.href=`/home`
};

// 上傳 s3
async function upload2S3(){
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

    const response=await fetch(`/api/s3`, {
            method:'POST',
            body:JSON.stringify({
                streamkey:streamKey.textContent,
                head:videoHeader.value
            }),
            headers: new Headers({"Content-type":"application/json"})

        })
    const data=await response.json();
    if(data.data){location.href=`/home`}

};


// 發布串流
async function createStreamingRoom(streamkey){
    const user=await fetch(`/api/user`);
    const result=await user.json();
    const master=result.data.name;
    const videoDate=document.querySelector('.video-date');

    const response=await fetch(`/api/room`, {
            method:'PUT',
            body:JSON.stringify({
                master:master,
                status:'LIVE',
                streamkey:streamkey,
                head:videoHeader.value,
                date:videoDate.textContent
            }),
            headers: new Headers({"Content-type":"application/json"})
        });
    const data=await response.json();
    if(data.ok){

        const creator=document.querySelector('.video-creator');
        creator.textContent=master;
        
        const sqlvideoHeader=document.querySelector('.video-head');
        sqlvideoHeader.textContent=videoHeader.value;
        sqlvideoHeader.style.display='block';

        const vdb=document.querySelector('.video-detail-background');
        vdb.style.display='block';

        window.onbeforeunload= async (event)=>{
            return '';
        }
    }
    
};

// get own streamkey
async function getOwnStreamkey(){
    const response=await fetch('/api/user');
    const data=await response.json();
    streamKey.textContent=data.data.streamkey
};

// copy streamURL、streamKEY
const streamURL=document.querySelector('.streamURL');
function copyStreamURL(){
    navigator.clipboard.writeText(streamURL.innerText);
};

function copyStremKEY(){
    navigator.clipboard.writeText(streamKey.innerText);
};

// create video date
function createVideoDate(){
    const videoDate=document.querySelector('.video-date');
    const t=new Date();
    videoDate.textContent=`${t.getFullYear()}/${t.getMonth()+1}/${t.getDate()}`
};