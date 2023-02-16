const socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
const url = window.location.href.split("/");
const roomID = url.pop();

form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (input.value) {
    socket.emit('chat message', input.value, roomID);
    input.value = '';
  }
});
function joinRoom(){
  socket.emit('join-room', roomID)
}
joinRoom();

const message=document.querySelector('.messages')
socket.on('chat message', (data) => {
  const li=document.createElement('li');

  const username=document.createElement('span');
  username.textContent=`${data.username}：`
  const content=document.createElement('span');
  content.textContent=data.message;

  li.append(username, content);
  message.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});