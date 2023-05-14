const socket = io();
const message=document.querySelector('.messages')
const form = document.getElementById('form');
const input = document.getElementById('input');
const url = window.location.href.split("/");
const roomID = url.pop();
const creatroImg=document.querySelector('.video-creator-img');
const utname=document.querySelector('.user-type-name');
const avatarbk=document.querySelector('.avatar-background');
// join room
async function ioJoinRoom(){
  await fetch(`/api/room/join`, {
    method:'PUT',
    body:JSON.stringify({
        host:roomID
    }),
    headers: new Headers({"Content-type":"application/json"})
  });
  socket.emit('join-room', roomID)

}

async function getAuth(){
  const response=await fetch(`/api/user/auth`);
  const data=await response.json();
  if(data){
    const dd=data.data;
    utname.textContent=dd.name;

    const img=avatarbk.querySelector('img');
    img.src=`https://d3i2vvc6rykmk0.cloudfront.net/${dd.address}`

  }
}

ioJoinRoom();
getAuth();

// listen room count
socket.on('roomCount', (count)=>{
  const videoConcrrent=document.querySelector('.video-concurrent');
  videoConcrrent.innerText=`${count} 人正在觀看`;

})

// listen view total count
socket.on('viewCount', (count)=>{
  const videoCount=document.querySelector('.video-count');
  videoCount.innerText=`觀看次數：${count}次`;
})

// listen receive-message
socket.on('receive-message', message => {
  displayMessage(message);
})

// send message to server
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const reponse=await fetch(`/api/user/auth`);
  const data=await reponse.json();
  const dd=data.data;
  const name=dd.name;
  const address=dd.address;
  const msg=input.value;
  
  if(msg.length>0){
    displayMessage({username:name, message:msg, img:address});
    socket.emit('chat message', {username:name, message:msg, img:address}, roomID);
    input.value = '';
  }else{
    return
  }
});

// make message
function displayMessage(data){
  const li = document.createElement('li');
  li.classList.add('user-type-background');
  
  const avatarBackground = document.createElement('div');
  avatarBackground.classList.add('avatar-background');
  
  const img = document.createElement('img');
  img.src = `https://d3i2vvc6rykmk0.cloudfront.net/${data.img}`;
  img.classList.add('avatar');
  
  avatarBackground.appendChild(img);
  li.appendChild(avatarBackground);
  
  const userType = document.createElement('div');
  userType.classList.add('user-type');
  
  const chatTime = document.createElement('span');
  chatTime.classList.add('chat-time');
  const t=new Date();
  chatTime.textContent=`${t.getHours()}:${t.getMinutes()}`;
  userType.appendChild(chatTime);
  
  const chatUser = document.createElement('span');
  chatUser.classList.add('chat-user');
  chatUser.textContent=data.username;
  userType.appendChild(chatUser);
  
  const chatMessages = document.createElement('span');
  chatMessages.classList.add('chatmessages');
  chatMessages.textContent=data.message;
  userType.appendChild(chatMessages);
  
  li.appendChild(userType);

  message.appendChild(li);
  message.scrollTop = message.scrollHeight;

  window.scrollTo(0, document.body.scrollHeight);
};