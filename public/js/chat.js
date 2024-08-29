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
let currentUser = '';
let ChatWith = '';

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

async function FetchMessagesFromGroup(groupname){
    messagesList.innerHTML= '';
    await fetch('/api/groupChat/groupChat')
        .then(response => response.json())
        .then(data => {
            data.forEach(gMessage => {
                if(gMessage.nameGroup === groupname){
                    if(gMessage.MessageFrom === currentUser){
                        const messageElement = document.createElement('div');
                        messageElement.className = 'message sent';
                        messageElement.innerHTML = gMessage.MessageContent;
                        messagesList.appendChild(messageElement);
                    }
                    else {
                        const messageElement = document.createElement('div');
                        messageElement.className = 'message received';
                        messageElement.innerHTML = gMessage.MessageFrom + ": " + gMessage.MessageContent;
                        messagesList.appendChild(messageElement);
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching messages:', error));

}

async function checkIfUserOrGroup(chatWith) {
    try {
        const usersResponse = await fetch('/api/users/all-users');
        const usersData = await usersResponse.json();

        const isUser = usersData.some(user => user.username === chatWith);
        if (isUser) {
            FetchMessages(chatWith);
            sendButton.onclick = SendMessage;
            return;
        }

        const groupsResponse = await fetch('/api/groupList/GetgroupsList');
        const groupsData = await groupsResponse.json();

        const isGroup = groupsData.some(group => group.nameGroup === chatWith);
        if (isGroup) {
            FetchMessagesFromGroup(chatWith);
            sendButton.onclick = SendMessageToGroup;
        }
    } catch (error) {
        console.error('Error checking if user or group:', error);
    }
}

function implementUserToChat() {
    const users = document.getElementsByClassName('user');
    for (let i = 0; i < users.length; i++) {
        users[i].addEventListener('click', function () {
            implementUser.textContent = "Chat with " + this.textContent;
            ChatWith = this.textContent;
            checkIfUserOrGroup(ChatWith);
        });
    }
}

async function FetchCurrentUserNameLoggedIn() {
    try {
        const response = await fetch('/api/users/user');
        const data = await response.json();
        currentUser = data.user;
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
}

async function FetchUsersAndGroups() {
    const dynamicElements = userList.querySelectorAll('.user');
    dynamicElements.forEach(element => element.remove());

    await FetchCurrentUserNameLoggedIn();

    try {
        const usersResponse = await fetch('/api/users/all-users');
        const usersData = await usersResponse.json();

        usersData.forEach(user => {
            if (user.username !== currentUser) {
                const userElement = document.createElement('div');
                userElement.className = 'user';
                userElement.innerHTML = user.username;
                userList.appendChild(userElement);
            }
        });

        const groupsResponse = await fetch('/api/groupList/GetgroupsList');
        const groupsData = await groupsResponse.json();

        groupsData.forEach(group => {
            if (group.Members.includes(currentUser)) {
                const groupElement = document.createElement('div');
                groupElement.className = 'user';
                groupElement.innerHTML = group.nameGroup;
                userList.appendChild(groupElement);
            }
        });

        implementUserToChat();
    } catch (error) {
        console.error('Error fetching users and groups:', error);
    }
}

async function SendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    const payload = { title: '', content: message, author: ChatWith, fromUser: currentUser };
    try {
        await fetch('/api/posts/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        FetchMessages(ChatWith);
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        messageInput.value = '';
    }
}

async function SendMessageToGroup() {
    const message = messageInput.value.trim();
    if (message === '') return;

    const payload = { nameGroup: ChatWith, MessageContent: message, MessageFrom: currentUser };
    try {
        await fetch('/api/groupChat/groupChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        FetchMessagesFromGroup(ChatWith);
    } catch (error) {
        console.error('Error sending message to group:', error);
    } finally {
        messageInput.value = '';
    }
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
        users[i].style.display = username.includes(searchValue) ? 'block' : 'none';
    }
}

function PressEnterToSendMessage() {
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendButton.onclick();
        }
    });
}

function EnterAllUsersToSelcectOptions(){
    
    fetch('/api/users/all-users')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                if(user.username !== currentUser){
                    const userElement = document.createElement('option');
                    userElement.innerHTML = user.username;
                    groupMembers.appendChild(userElement);
                }
            });
            AddUsersBydoubleClick();
            removerUserByDoubleClick();
        })
        .catch(error => console.error('Error fetching users:', error));
}

function FilterUsersToInsertInGroup(){
    const searchValue = searchUsersToInsertInGroup.value.toLowerCase();
    const users = document.querySelectorAll('.group-members option');
    for (let i = 0; i < users.length; i++) {
        const username = users[i].textContent.toLowerCase();
        users[i].style.display = username.includes(searchValue) ? 'block' : 'none';
    }
}

function AddUsersBydoubleClick() {
    const users = document.querySelectorAll('.group-members option');
    users.forEach(user => {
        user.removeEventListener('dblclick', handleUserDoubleClick);
        user.addEventListener('dblclick', handleUserDoubleClick);
    });
}

function handleUserDoubleClick(event) {
    const user = event.target;
    const userElement = document.createElement('option');
    userElement.innerHTML = user.textContent;
    groupMembersAdded.appendChild(userElement);
    user.remove(); 
    console.log(user.textContent);
    removerUserByDoubleClick();
}

function removerUserByDoubleClick(){
    const users = document.querySelectorAll('#group-members-have-added option');
    users.forEach(user => {
        user.removeEventListener('dblclick', handleUserRemoverDoubleClick);
        user.addEventListener('dblclick', handleUserRemoverDoubleClick);
    });
}

function handleUserRemoverDoubleClick(event){
    const user = event.target;
    const userElement = document.createElement('option');
    userElement.innerHTML = user.textContent;
    groupMembers.appendChild(userElement);
    user.remove();
    AddUsersBydoubleClick();
}

function CancelCreateGroup(){
    const users = document.querySelectorAll('option');
    users.forEach(user => user.remove());
    EnterAllUsersToSelcectOptions();
    popupOverlay.style.display = 'none';
}

function createGroup(){
    const groupName = document.getElementById('group-name').value;
    if(groupName === '') return;

    const members = [currentUser];
    const groupMembers = document.querySelectorAll('#group-members-have-added option');

    groupMembers.forEach(member => {
        members.push(member.textContent);
    });

    fetch('/api/groupList/groupsList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameGroup: groupName, Members: members }),
    })
    .then(response => response.json())
    .then(() => {
        CancelCreateGroup();
        FetchUsersAndGroups();
    })
    .catch(error => console.error('Error creating group:', error));
}

function RunningChat() {
    window.onload = () => {
        FetchUsersAndGroups();
        sendButton.addEventListener('click', () => {
            if (ChatWith) 
                checkIfUserOrGroup(ChatWith);
        });
        PressEnterToSendMessage();
        logoutButton.addEventListener('click', Logout);
        searchInput.addEventListener('input', FilterUsersBySearch);
        searchUsersToInsertInGroup.addEventListener('input', FilterUsersToInsertInGroup);
        
        createGroupBtn.addEventListener('click', () => {
            popupOverlay.style.display = 'flex';
            EnterAllUsersToSelcectOptions();
        });
        cancelBtn.addEventListener('click', CancelCreateGroup);
        createBtn.addEventListener('click', createGroup);
    };
}

RunningChat();
