const item4=document.querySelector('.item4')
const streamKey=document.querySelector('.streamKey');
streamKey.focus();
item4.addEventListener('submit', function(e){
    e.preventDefault();
    hlsPLAYer(streamKey.value);
    streamKey.value='';
});

function hlsPLAYer(streamkey){
    let videoSrc = `https://jokersaysjoke.online/hls/${streamkey}.m3u8`;
    if (Hls.isSupported()) {
        const video = document.querySelector(".video");
        let hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.FRAG_LOADED, function(event, data) {
            // disappear streamkey input
            item4.style.display='none'
            // disappear stream URL
            const item5=document.querySelector('.item5');
            item5.style.display='none';
            // appear publish btn
            const item3=document.querySelector('.item3');
            item3.style.display='block';
            const toLiveStream=document.querySelector('#toLiveStream');
            // toLiveStream.addEventListener('click', createStreamingRoom);
            toLiveStream.addEventListener('click', ()=>{
                createStreamingRoom(streamkey)
            });
            // appear end stream btn
            closeLive.removeEventListener('click', closeRoom);
            closeLive.addEventListener('click', closeStreaming);
            closeLive.textContent='END Stream'
            // appear chat
            const chat=document.querySelector('.chat-background');
            chat.style.display='block';

            
        });
        }else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
        }
};



