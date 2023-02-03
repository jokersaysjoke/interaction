var socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

const message=document.querySelector('.messages')

socket.on('chat message', function(data) {
  const li=document.createElement('li');

  const username=document.createElement('span');
  username.textContent=`${data.username}：`
  console.log(data)
  const content=document.createElement('span');
  content.textContent=data.message;


  li.append(username, content);
  message.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});
// socket.on('chat message', function(data) {
//   item.textContent = data.username + ": " + data.message;
//   messages.appendChild(item);
//   });