window.onload=joinRoom();
async function joinRoom(){
    const response=await fetch(`/api/room/join?host=${roomID}`)
    const data=await response.json();
    const dd=data.data;
    hlsPLAYer(dd);
}