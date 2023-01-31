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

socket.on('chat message', function(msg) {
  const li=document.createElement('li');
  const welcome=document.querySelector('.welcome')
  const name=welcome.textContent.split('你好，')[1];
  const username=document.createElement('span');
  // username.textContent=`${name}：`;
  username.textContent='username：'

  const content=document.createElement('span');
  content.textContent=msg;


  li.append(username, content);
  message.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});
// socket.on('chat message', function(data) {
//   var item = document.createElement('li');
//   item.textContent = data.username + ": " + data.message;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
//   });