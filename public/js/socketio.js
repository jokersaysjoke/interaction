const socket = io();
const message=document.querySelector('.messages')
const form = document.getElementById('form');
const input = document.getElementById('input');
const url = window.location.href.split("/");
const roomID = url.pop();

socket.on('receive-message', message => {
  displayMessage(message);
})

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

function joinRoom(){
  socket.emit('join-room', roomID)
}
joinRoom();

function displayMessage(data){
    const li=document.createElement('li');
    
    const username=document.createElement('span');
    username.textContent=`${data.username}：`
    
    const content=document.createElement('span');
    content.textContent=data.message;
    
    li.append(username, content);
    message.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
};