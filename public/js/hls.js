const streamKey=document.querySelector('.streamkey');

getOwnStreamkey();

const toLiveStream=document.querySelector('#toLiveStream');
toLiveStream.addEventListener('click', ()=>{
    if(videoHeader.value==='' || videoHeader.value.length>99){
        const dontnull=document.querySelector('.dontnull');
        dontnull.style.color='red';
        dontnull.textContent='(*必填且字串99字以內)'
        videoHeader.focus();
    }else{
        hlsPLAYer(streamKey.textContent);
        // fakehlsPLAYer(streamKey.textContent);

    }
});

function hlsPLAYer(streamkey){
    let videoSrc = `https://dsvbvdlaubjve.cloudfront.net/${streamkey}.m3u8`;

    if (Hls.isSupported()) {
        const video = document.querySelector(".video");
        let hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.FRAG_LOADED, function(event, data) {
            // disappear 
            const mainignore=document.querySelectorAll('.main-ignore');
            mainignore.forEach((elment)=>{
                elment.style.display='none';
            })
            // appear end stream btn
            const item1=document.querySelector('.item1');
            item1.addEventListener('click', closeStreaming);
            item1.style.display='flex'
            // appear chat
            const chat=document.querySelector('.chat-background');
            chat.style.display='block';
            // appear detail about video

            
            const sqlvideoHeader=document.querySelector('.video-head');
            sqlvideoHeader.textContent=videoHeader.value;
            sqlvideoHeader.style.display='block';
    
            const vdb=document.querySelector('.video-detail-background');
            vdb.style.display='block';

            input.focus();
            createStreamingRoom(streamKey.textContent);
        });
    }else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
    }
};

function fakehlsPLAYer(){

    
    const sqlvideoHeader=document.querySelector('.video-head');
    sqlvideoHeader.textContent=videoHeader.value;
    sqlvideoHeader.style.display='block';

    const vdb=document.querySelector('.video-detail-background');
    vdb.style.display='block';
    
    // disappear 
    const mainignore=document.querySelectorAll('.main-ignore');
    for(let i=0; i<mainignore.length; i++){
        mainignore[i].style.display='none';
    }
    // appear end stream btn
    const item1=document.querySelector('.item1');
    item1.addEventListener('click', closeStreaming);
    item1.style.display='flex'
    // appear chat
    const chat=document.querySelector('.chat-background');
    chat.style.display='block';


    input.focus();
};