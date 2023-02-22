window.onload=joinRoom();
async function joinRoom(){
    input.focus();

    const response=await fetch(`/api/room/join?host=${roomID}`)
    const data=await response.json();
    const dd=data.data;

    // hlsClientPLAYer(dd);
};

function hlsClientPLAYer(streamkey){
    let videoSrc = `https://d2qjacbys0mkpo.cloudfront.net/${streamkey}.m3u8`;
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