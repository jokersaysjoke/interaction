//載入頁面
window.onload=fetchVideo();

async function fetchVideo() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const recordingId = urlParams.get('v');
    
    const res = await fetch(`/api/watch?v=${recordingId}`);
    const data = await res.json();
    const dd = data.data

    const video = document.querySelector('video');
    const source = video.querySelector('source');
    source.setAttribute('src', `https://d3b7qlfvgcw4yw.cloudfront.net/${recordingId}`);
    video.load();
    document.addEventListener('click', video.play())

    const videoHead = document.querySelector('.video-head');
    videoHead.textContent = dd.title;

    const avatar = document.querySelector('.video-creator-img');
    avatar.setAttribute('src', `https://dmhk9lgz90alf.cloudfront.net/${dd.ADDRESS}`);

    const videoCreator = document.querySelector('.video-creator');
    videoCreator.textContent = dd.NAME;

    const videoDate = document.querySelector('.video-date');
    const createdAt = new Date(dd.CREATED_AT);
    const formattedDate = createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }).split(' ')[0];
    videoDate.textContent = formattedDate;

    const views = document.querySelector('.views');
    views.textContent = dd.VIEWS;

}