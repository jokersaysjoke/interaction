const chatroom=document.querySelector('.live-chatroom');

const create=document.querySelector('.create');
create.textContent='Close room';
create.addEventListener('click', closeRoom);
//
async function closeRoom(){
    const welcome=document.querySelector('.welcome');
    const master=welcome.textContent.split('你好，')[1];
    const response=await fetch(`${urls}/api/room`, {
        method:'DELETE',
        body:JSON.stringify({
            master:master
        }),
        headers: new Headers({"Content-type":"application/json"})
    });
    const data=await response.json();
    console.log(data);
    // location.reload();
};