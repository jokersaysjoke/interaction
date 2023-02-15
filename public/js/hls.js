let videoSrc = `https://jokersaysjoke.online/hls/chunyi.m3u8`;
if (Hls.isSupported()) {
    const video = document.querySelector(".video");
    // const streamKey=document.querySelector('.streamKey').value
    let hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    }else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
    }

