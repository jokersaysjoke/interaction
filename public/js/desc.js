const mainImg=document.querySelectorAll('.main-img-detail-background');
const descImg=document.querySelectorAll('.main-img-detail');

for(let i=0; i<descImg.length; i++){
    const img=descImg[i].querySelector('img');

    descImg[i].addEventListener('mousemove', (e)=>{
        const x = e.offsetX / descImg[i].clientWidth;
        const y = e.offsetY / descImg[i].clientHeight;
        img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        img.style.transform='scale(2.2)';
    
    });
    descImg[i].addEventListener('mouseleave', ()=>{
        img.style.transformOrigin='center';
        img.style.transform='scale(1)';
    });
};
