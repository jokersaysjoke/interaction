window.onload=joinRoom();
async function joinRoom(){
    input.focus();

    const response=await fetch(`/api/room/join?host=${roomID}`)
    const data=await response.json();
    const dd=data.data[0];
    
    creatroImg.src=`https://dmhk9lgz90alf.cloudfront.net/${dd.ADDRESS}`
    
    const videoDetailBack=document.querySelector('.video-detail-background');
    videoDetailBack.style.display='block';
    
    const creator=document.querySelector('.video-creator');
    creator.textContent=dd.HOST;
    
    const sqlvideoHeader=document.querySelector('.video-head');
    sqlvideoHeader.style.display='block';
    sqlvideoHeader.textContent=dd.HEAD;

    const videoDate=document.querySelector('.video-date');
    videoDate.textContent=dd.DATE;

    hlsClientPLAYer(dd.STREAMKEY);



};

function hlsClientPLAYer(streamkey){

    let videoSrc = `https://dsvbvdlaubjve.cloudfront.net/${streamkey}.m3u8`;

    if (Hls.isSupported()) {
        const video = document.querySelector(".video");
        let hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        }else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
        }
};
