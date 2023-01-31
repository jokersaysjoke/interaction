const runTest=document.querySelector('.run-test');
runTest.addEventListener('click', testOpenRegister)

function testOpenRegister(){
    runTest.style.color='red'
    registerWindow.style.display='block';
    registerWindowBackground.style.display='block';
    registerWindowBackground.addEventListener('click', closeRegister);
    const id=document.querySelector('#user-login-id');
    const password=document.querySelector('#user-login-pw');
    id.value="ElonMa";
    password.value='tsla';
    const btn=document.querySelector('.btn');
    autoInput(id);
    autoInput(password)
    btn.addEventListener('click', signIn());
    const room=document.querySelectorAll('.video-preview')
    room[5].addEventListener('click', joinChatRoom())

};
let charIndex = 0;
function autoInput(inputString){
    if (charIndex < inputString.length) {
        inputField.value += inputString[charIndex];
        charIndex++;
        setTimeout(autoInput, 1000); 
    }
}