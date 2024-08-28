const userList = document.getElementsByClassName('user-list')[0];
const messagesList = document.getElementsByClassName('messages')[0];
const messageInput = document.getElementsByClassName('message')[0];
const sendButton = document.getElementsByClassName('send')[0];
const implementUser = document.getElementsByClassName('currentUser')[0];
const logoutButton = document.getElementsByClassName('logout')[0];
const searchInput = document.getElementsByClassName('search')[0];
const createGroupBtn = document.querySelector('.create-group-btn');
const popupOverlay = document.querySelector('.popup-overlay');
const groupMembers = document.querySelector('.group-members');
const groupMembersAdded = document.getElementById('group-members-have-added');
const searchUsersToInsertInGroup = document.getElementById('search-users-group');
const cancelBtn = document.querySelector('.cancel');
const createBtn = document.querySelector('.create');
let currentUser = ' ';
let ChatWith = ' ';


function FetchMessages(username) {
    messagesList.innerHTML = '';
    fetch('/api/posts/posts')
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                if (post.fromUser === currentUser && post.author === username) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message sent';
                    messageElement.innerHTML = post.content;
                    messagesList.appendChild(messageElement);
                }
                if (post.author === currentUser && post.fromUser === username) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message received';
                    messageElement.innerHTML = post.content;
                    messagesList.appendChild(messageElement);
                }
            });
        })
        .catch(error => console.error('Error fetching messages:', error));
}

function FetchMessagesFromGroup(groupname){
    messagesList.innerHtml=' ';
    fetch('/api/groupChat/groupChat')
        .then(response => response.json())
        .then(data => {
            data.forEach(gMessage => {
                if(gMessage.MessageFrom == currentUser && gMessage.nameGroup == groupname){
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message sent';
                    messageElement.innerHTML = gMessage.MessageContent;
                    messagesList.appendChild(messageElement);
                }
                else if (gMessage.nameGroup == groupname) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message received';
                    messageElement.innerHTML = gMessage.MessageFrom + ": " + gMessage.MessageContent;
                    messagesList.appendChild(messageElement);
                }
            });
        })
        .catch(error => console.error('Error fetching messages:', error));

}

function implementUserToChat() {
    const users = document.getElementsByClassName('user');
    for (let i = 0; i < users.length; i++) {
        users[i].addEventListener('click', function () {
            implementUser.textContent = "chat with " + this.textContent;
            ChatWith = this.textContent;
            FetchMessages(this.textContent);
            FetchMessagesFromGroup(this.textContent);
        });
    }
}

function FetchCurrentUserNameLoggedIn() {
    return fetch('/api/users/user')
        .then(response => response.json())
        .then(data => {
            console.log(data.user);
            currentUser = data.user;
        })
        .catch(error => console.error('Error:', error));
}

async function FetchUsersAndGroups() {
    await FetchCurrentUserNameLoggedIn(); 

    fetch('/api/users/all-users')
        .then(response => response.json())
        .then(data => { 
            data.forEach(user => {
                if(user.username != currentUser){ 
                    const userElement = document.createElement('div');
                    userElement.className = 'user';
                    userElement.innerHTML = user.username;
                    userElement.id = user._id;
                    userList.appendChild(userElement);
                }
            });
            implementUserToChat(); 
        })
        .catch(error => console.error('Error fetching users:', error));

    fetch('/api/groupList/GetgroupsList')
        .then(response => response.json())
        .then(data => {
            data.forEach(group => {
                if(group.Members.includes(currentUser)){ 
                    const groupElement = document.createElement('div');
                    groupElement.className = 'user';
                    groupElement.innerHTML = group.nameGroup;
                    userList.appendChild(groupElement);
                }
            });
            implementUserToChat(); 
        })
        .catch(error => console.error('Error fetching groups:', error));
}

function SendMessage() {
    const title = ' ';
    const message = messageInput.value;
    const author = ChatWith;
    const fromUser = currentUser;
    if (message === '') {
        return;
    }
    fetch('/api/posts/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title , content: message, author, fromUser }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            FetchMessages(author);
        })
        .catch(error => console.error('Error sending message:', error));
    messageInput.value = '';
}

async function Logout() {
    try {
        const res = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            window.location.href = '/'; 
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (err) {
        console.error('An error occurred during logout:', err);
        alert('An error occurred. Please try again later.');
    }
}

function FilterUsersBySearch() {
    const searchValue = searchInput.value.toLowerCase();
    const users = document.getElementsByClassName('user');
    for (let i = 0; i < users.length; i++) {
        const username = users[i].textContent.toLowerCase();
        if (username.includes(searchValue)) {
            users[i].style.display = 'block';
        } else {
            users[i].style.display = 'none';
        }
    }
}

function PressEnterToSendMessage() {
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            SendMessage();
        }
    });
}

function EnterAllUsersToSelcectOptions(){
    fetch('/api/users/all-users')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                if(user.username != currentUser){
                const userElement = document.createElement('option');
                userElement.innerHTML = user.username;
                groupMembers.appendChild(userElement);
                }
            });
            AddUsersBydoubleClick();
        })
        .catch(error => console.error('Error fetching users:', error));
}

function FilterUsersToInsertInGroup(){
    const searchValue = searchUsersToInsertInGroup.value.toLowerCase();
    const users = document.querySelectorAll('.group-members option');
    for (let i = 0; i < users.length; i++) {
        const username = users[i].textContent.toLowerCase();
        if (username.includes(searchValue)) {
            users[i].style.display = 'block';
        } else {
            users[i].style.display = 'none';
        }
    }
}

function AddUsersBydoubleClick(){
    const users = document.querySelectorAll('.group-members option');
    users.forEach(user => {
        user.addEventListener('dblclick', function() {
            console.log(user.textContent);
            const userElement = document.createElement('option');
            userElement.innerHTML = user.textContent;
            groupMembersAdded.appendChild(userElement);
            user.remove(); 
        });
    });
}

function CancelCreateGroup(){
    const users = document.querySelectorAll('option');
    users.forEach(user => {
        user.remove();
    });
    EnterAllUsersToSelcectOptions();
    popupOverlay.style.display = 'none';
}

function createGroup(){
    const groupMembers = document.querySelectorAll('#group-members-have-added option');
    const groupName = document.getElementById('group-name').value;
    if(groupName === ''){
        return;
    }
    const members = [];
    members.push(currentUser);  
    groupMembers.forEach(member => {
        members.push(member.textContent);
    });
    console.log(members);
    fetch('/api/groupList/groupsList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameGroup: groupName, Members: members}),
    })
        .then(response => response.json())
        .then(data => {
            
            CancelCreateGroup();
        })
        .catch(error => console.error('Error creating group:', error));
        const users = document.querySelectorAll('.user');
    users.forEach(user => {
        user.remove();
    });
    FetchUsersAndGroups();
}

function RunningChat() {
    window.onload = () => {
        FetchUsersAndGroups();
        sendButton.addEventListener('click', SendMessage);
        logoutButton.addEventListener('click', Logout);
        searchInput.addEventListener('input', FilterUsersBySearch);
        messageInput.addEventListener('keydown', PressEnterToSendMessage);
        searchUsersToInsertInGroup.addEventListener('input', FilterUsersToInsertInGroup);
        createGroupBtn.addEventListener('click', () => { popupOverlay.style.display = 'flex'; });
        cancelBtn.addEventListener('click', CancelCreateGroup);
        createBtn.addEventListener('click', createGroup);
        EnterAllUsersToSelcectOptions();
    };
}





RunningChat();

