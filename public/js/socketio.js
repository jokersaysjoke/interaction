const socket = io();
const message=document.querySelector('.messages')
const form = document.getElementById('form');
const input = document.getElementById('input');
const url = window.location.href.split("/");
const roomID = url.pop();

// join room
function joinRoom(){
  socket.emit('join-room', roomID)
}
joinRoom();

// listen room count
socket.on('roomCount', (count)=>{
  const videoConcrrent=document.querySelector('.video-concurrent');
  videoConcrrent.innerText=`${count} 人正在觀看`;

})

// view total count
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
  
  const reponse=await fetch(`/api/user`);
  const data=await reponse.json();
  const dd=data.data;
  const name=dd.name;
  const msg=input.value;

  displayMessage({username:name, message:msg});
  socket.emit('chat message', {username:name, message:msg}, roomID);
  input.value = '';

});

// make message
function displayMessage(data){
    const li=document.createElement('li');
    
    const username=document.createElement('span');
    username.textContent=`${data.username}：`
    
    const content=document.createElement('span');
    content.classList.add('chat-content');
    content.textContent=data.message;
    
    li.append(username, content);
    message.appendChild(li);

    message.scrollTop = message.scrollHeight;

    window.scrollTo(0, document.body.scrollHeight);
};