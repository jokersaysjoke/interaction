//載入頁面
window.onload=fetchLiveRoom();


// fetch live-room
async function fetchLiveRoom(){
    const response=await fetch(`/api/room`);
    const data=await response.json();
    const dd=data.data;
    dd.forEach(d => {
        createLiveRoom(d)
    })
    
};

//create live-room
function createLiveRoom(data){

    // 建立 div 元素
    const div = document.createElement('div');

    // 建立 video-preview 元素
    const videoPreview = document.createElement('div');
    videoPreview.classList.add('video-preview');
    videoPreview.innerText = data.NAME;
    videoPreview.addEventListener('click', ()=>{
        location.href=`/room/${data.ID}`
    });
    div.appendChild(videoPreview);

    // 建立 video-detail 元素
    const videoDetail = document.createElement('div');
    videoDetail.classList.add('video-detail');
    div.appendChild(videoDetail);

    // 建立 video-account-pic-background 元素
    const videoAccountPicBackground = document.createElement('div');
    videoAccountPicBackground.classList.add('video-account-pic-background');
    videoDetail.appendChild(videoAccountPicBackground);

    // 建立 video-account-pic 元素
    const videoAccountPic = document.createElement('div');
    videoAccountPic.classList.add('video-account-pic');
    videoAccountPicBackground.appendChild(videoAccountPic);
    
    // 建立 img 元素
    const videoAccountImg = document.createElement('img');
    videoAccountImg.classList.add('video-account-img');
    videoAccountImg.src=`https://dmhk9lgz90alf.cloudfront.net/${data.ADDRESS}`
    videoAccountPic.appendChild(videoAccountImg);

    // 建立 video-title 元素
    const videoTitle = document.createElement('div');
    videoTitle.classList.add('video-title');
    videoDetail.appendChild(videoTitle);

    // 建立 video-title-head 元素
    const videoTitleHead = document.createElement('div');
    videoTitleHead.classList.add('video-title-head');
    videoTitleHead.innerText = data.TITLE;
    videoTitleHead.addEventListener('click', ()=>{
        location.href=`/room/${data.NAME}`
    });
    videoTitle.appendChild(videoTitleHead);

    // 建立 video-creator 元素
    const videoCreator = document.createElement('div');
    videoCreator.classList.add('video-creator');
    videoCreator.innerText = data.NAME;
    videoTitle.appendChild(videoCreator);

    // 建立 video-view-count 元素
    const videoViewCount = document.createElement('div');
    videoViewCount.classList.add('video-view-count');
    videoViewCount.innerText = `觀看次數：${data.VIEWS}次`;
    videoTitle.appendChild(videoViewCount);


    // 建立 video-status-live-rate 元素
    const videoStatusLiveRate = document.createElement('div');
    videoStatusLiveRate.classList.add('video-status', 'video-status-live-rate');
    videoTitle.appendChild(videoStatusLiveRate);
    
    // 如果 LIVE
    if(data.STATUS==='LIVE'){
        videoTitle.removeChild(videoViewCount);
        // 在 video-status-live-rate 元素後面添加文字節點
        videoStatusLiveRate.appendChild(document.createTextNode(`${data.CONCURRENT}人正在觀看`));

        // 建立 video-status-live-background 元素
        const videoStatusLiveBackground = document.createElement('div');
        videoStatusLiveBackground.classList.add('video-status', 'video-status-live-background');
        videoTitle.appendChild(videoStatusLiveBackground);

        // 建立 video-status-live 元素
        const videoStatusLive = document.createElement('span');
            
        videoStatusLive.innerText = '※正在直播';
        videoStatusLiveBackground.appendChild(videoStatusLive);
        videoStatusLive.classList.add('video-status-live');
    }
    const videoPreviewBackground=document.querySelector('.video-preview-background');
    videoPreviewBackground.appendChild(div);

};
