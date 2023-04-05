window.onload=joinRoom();
async function joinRoom(){
    input.focus();

    const response=await fetch(`/api/room/join?host=${roomID}`)
    const data=await response.json();
    const dd=data.data[0];

    const videoDetailBack=document.querySelector('.video-detail-background');
    videoDetailBack.style.display='block';
    
    const creator=document.querySelector('.video-creator');
    creator.textContent=dd.MASTER;
    
    const sqlvideoHeader=document.querySelector('.video-head');
    sqlvideoHeader.style.display='block';
    sqlvideoHeader.textContent=dd.HEAD;

    const videoDate=document.querySelector('.video-date');
    videoDate.textContent=dd.DATE;

    hlsClientPLAYer(dd.STREAMKEY);

    // view count
    await fetch(`/api/room/join`, {
        method:'PUT',
        body:JSON.stringify({
            host:roomID
        }),
        headers: new Headers({"Content-type":"application/json"})
    });

};

function hlsClientPLAYer(streamkey){
    let videoSrc = `https://jokersaysjoke.online/hls/${streamkey}.m3u8`;
    // let videoSrc = `https://d195ib12pdjsv8.cloudfront.net/${streamkey}.m3u8`;
    console.log(videoSrc);

    if (Hls.isSupported()) {
        const video = document.querySelector(".video");
        let hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        }else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
        }
};
