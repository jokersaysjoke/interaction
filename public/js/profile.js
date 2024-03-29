const imgBackground = document.querySelector('.member-img');
const editImg = imgBackground.querySelector('img');
const fileUploader = document.querySelector('#file-uploader');
const upload = document.querySelector("#upload");
const imgEdit = document.querySelector('.img-edit');
const email = document.querySelector('.member-email');
const username = document.querySelector('.username');
const previous = document.querySelector('.previous');
// previous.focus();
const newP = document.querySelector('.new');
const confirmP = document.querySelector('.confirm');
const cancelBtn = document.querySelector('#cancelBtn');
const saveBtn = document.querySelector('#saveBtn');

window.onload = fetchEmail();

async function fetchEmail() {
    const response = await fetch('/api/user');
    const data = await response.json();
    const dd = data.data
    email.textContent = dd.email;
    username.placeholder = dd.name;
    
    fetchImgtoEdit();
    getUserRecord();
}

async function fetchImgtoEdit() {
    const response = await fetch('/api/image');
    const data = await response.json();
    const dd = data.data
    if (dd !== null) {
        editImg.setAttribute('src', `https://dmhk9lgz90alf.cloudfront.net/${dd.address}`)
    }

}

upload.addEventListener('click', async () => {
    const user = await fetch(`/api/user`);
    const result = await user.json();
    const userID = result.data.userId;
    const formData = new FormData();
    formData.append('image', fileUploader.files[0]);
    formData.append('userID', userID);

    const response = await fetch('/api/image', {
        method: 'PUT',
        body: formData
    })
    const data = await response.json();
    if (data.ok) {
        window.location.reload();
    } else {
        console.log(data);
    }

})

imgBackground.addEventListener('click', async () => {
    fileUploader.click();
})

imgEdit.addEventListener('click', async () => {
    upload.click();
})

fileUploader.addEventListener('change', () => {
    if (fileUploader.files && fileUploader.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            editImg.src = e.target.result;
        };
        reader.readAsDataURL(fileUploader.files[0])
    }
})

username.addEventListener('input', () => {
    const edit = document.querySelector('.username-edit')
    const value = username.value;
    if (/\s/.test(value)) {
        edit.style.cursor = 'auto'
        edit.textContent = '不能使用空白';
        username.value = value.replace(/\s/g, '');
    } else {
        edit.textContent = 'edit';
        edit.style.cursor = 'pointer'
    }
})

previous.addEventListener('input', () => {
    const edit = document.querySelector('.password-edit')
    const value = previous.value;
    if (/\s/.test(value)) {
        edit.style.cursor = 'auto'
        edit.textContent = '不能使用空白';
        previous.value = value.replace(/\s/g, '');
    } else {
        edit.textContent = 'edit';
    }
})

newP.addEventListener('input', () => {
    const edit = document.querySelector('.password-edit')
    const value = newP.value;
    if (/\s/.test(value)) {
        edit.style.cursor = 'auto'
        edit.textContent = '不能使用空白';
        newP.value = value.replace(/\s/g, '');
    } else {
        edit.textContent = 'edit';
    }
})

async function newName() {
    if (username.value !== '') {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            body: JSON.stringify({
                email: email.textContent,
                new: username.value
            }),
            headers: new Headers({ "Content-type": "application/json" })
        });
        const data = await response.json();
        if (data.ok) {
            const edit = document.querySelector('.username-edit');
            edit.textContent = 'OK!';
            edit.style.color = 'green';
            setTimeout('location.reload()', 1000)
        }
    }
}

async function newPassword() {
    const edit = document.querySelector('.password-edit');
    if (previous.value !== '' && newP.value !== '' && newP.value === confirmP.value) {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            body: JSON.stringify({
                email: email.textContent,
                pw: previous.value,
                newPw: newP.value
            }),
            headers: new Headers({ "Content-type": "application/json" })
        })
        const data = await response.json();
        if (data.ok) {
            edit.textContent = 'OK!'
            edit.style.color = 'green';
            setTimeout('location.reload()', 1000)
        } else if (data.error) {
            edit.textContent = "Wrong Password!"
        }
    }
}

async function getUserRecord() {
    const res = await fetch('/api/user/recording')
    const data = await res.json();
    const dd = data.data
    if (dd.length > 0) { genRecordingBody(dd) };

}

function genRecordingBody(recordings) {

    const recordingBody = document.querySelector('#recording-detail-body');

    recordings.forEach(recording => {
        const li = document.createElement('li');
        li.classList.add('flex', 'video-ct-rw');

        const videoDiv = document.createElement('div');
        videoDiv.classList.add('pf-video', 'flex-no');

        const video = document.createElement('video');
        const source = document.createElement('source');
        source.src = `https://d3b7qlfvgcw4yw.cloudfront.net/${recording.RECORDING_ID}`;
        video.appendChild(source);

        const videoTitle = document.createElement('div');
        videoTitle.id = 'video-title';
        videoTitle.textContent = recording.TITLE;

        videoDiv.appendChild(video);
        videoDiv.appendChild(videoTitle);

        const visibilityDiv = document.createElement('div');
        visibilityDiv.classList.add('pf-visibility', 'pf-colums');
        visibilityDiv.textContent = recording.VISIBILITY;

        const downArrow = document.createElement('img');
        downArrow.classList.add('downArrow');
        downArrow.setAttribute('src', `https://dmhk9lgz90alf.cloudfront.net/down-filled-triangular-arrow.png`)
        visibilityDiv.appendChild(downArrow);
        
        visibilityDiv.addEventListener('click', () => {
            visibilityWindow(recording.RECORDING_ID);
        });

        const viewsDiv = document.createElement('div');
        viewsDiv.classList.add('pf-views', 'pf-colums');
        viewsDiv.textContent = recording.VIEWS;

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('pf-date', 'pf-colums');
        const date = new Date(recording.CREATED_AT);
        const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '');

        dateDiv.textContent = formattedDate;

        li.appendChild(videoDiv);
        li.appendChild(visibilityDiv);
        li.appendChild(viewsDiv);
        li.appendChild(dateDiv);

        recordingBody.appendChild(li);
        recordingBody.style.display = 'block';

        li.addEventListener('mouseover', () => {
            downArrow.style.display = 'block';
        });

        li.addEventListener('mouseout', () => {
            downArrow.style.display = 'none';
        });
    });

};

function visibilityWindow(recordingId) {
    const visibilityBg = document.querySelector('#visibility-bg');
    const fullBg = document.querySelector('#full-bg');

    fullBg.style.display = 'block';
    visibilityBg.style.display = 'block';
    document.body.style.overflow = 'hidden'
    
    saveBtn.addEventListener('click', async () => {
        const visibility = document.querySelector('input[name="item"]:checked').value
        if (visibility === 'delete' ) {
            await fetch('/api/recording', {
                method: 'DELETE',
                body:JSON.stringify({
                    recordingId: recordingId
                }),
                headers: new Headers({"Content-type":"application/json"})
            })
            window.location.reload();
            
        } else {
            await fetch('/api/recording', {
                method: 'PUT',
                body:JSON.stringify({
                    recordingId: recordingId,
                    visibility: visibility
                }),
                headers: new Headers({"Content-type":"application/json"})
            })
            window.location.reload();
        }
    })

    cancelBtn.addEventListener('click', () => {
        window.location.reload();
    });

    fullBg.addEventListener('click', () => {
        window.location.reload();
    });
};