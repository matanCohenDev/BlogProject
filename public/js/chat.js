const userList = document.getElementsByClassName('user-list')[0];
const messagesList = document.getElementsByClassName('messages')[0];
const messageInput = document.getElementsByClassName('message')[0];
const sendButton = document.getElementsByClassName('send')[0];
const implementUser = document.getElementsByClassName('currentUser')[0];
const logoutButton = document.getElementsByClassName('logout')[0];
const searchInput = document.getElementsByClassName('search')[0];
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

function implementUserToChat() {
    const users = document.getElementsByClassName('user');
    for (let i = 0; i < users.length; i++) {
        users[i].addEventListener('click', function () {
            implementUser.textContent = "chat with " + this.textContent;
            ChatWith = this.textContent;
            FetchMessages(this.textContent);
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
//dsjkfbsuhbdfadsv
function FetchUsers() {
    FetchCurrentUserNameLoggedIn();
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

window.onload = () => {
    FetchUsers();
    sendButton.addEventListener('click', SendMessage);
    logoutButton.addEventListener('click', Logout);
    searchInput.addEventListener('input', FilterUsersBySearch);
    messageInput.addEventListener('keydown', PressEnterToSendMessage);
};
