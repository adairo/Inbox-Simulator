let messages;
const chat_section = document.querySelector('.chat-section');
const img_profile = document.querySelector('.receiver-photo-profile');

readMessages();

function readMessages(){
   messages = document.querySelectorAll('.message');

    for (msg of messages) 
        msg.addEventListener('click', toggleControls);
}



img_profile.addEventListener('click', () => {
    const msg_text = window.prompt('Enter the message text');
    const time = window.prompt('Enter the sending time');

    createMessage('receiver', msg_text, time);
});

function toggleControls(e) {

    const message = e.currentTarget;
    const controls = message.querySelector('.controls');
    const edit_btn = controls.querySelector('.edit-control');
    const delete_btn = controls.querySelector('.delete-control');

    if (controls.style.display === 'flex')
        controls.style.display = 'none';
    else {
        controls.style.display = 'flex';
    }    
        

    edit_btn.addEventListener('click', function() {
        console.log('editing')
        const msg_text = message.querySelector('.message-text');
        const new_text = window.prompt('Nuevo mensaje', msg_text.textContent);
        msg_text.textContent = new_text;
    });

    delete_btn.addEventListener('click', deleteMessage);

}

function deleteMessage(e) {
    let msg = e.currentTarget.parentElement.parentElement;
    msg.parentElement.removeChild(msg);
}

function addReceiverMessage(e) {
    const message = document.createElement(); 
}

function createMessage(source, txt, tm){
    const message = document.createElement('div');
    message.classList.add('message', `message-${source}`);

    const controls = document.createElement('div');
    controls.classList.add('controls');

    // edit button
    const edit_btn = document.createElement('button');
    edit_btn.classList.add('message-control', 'edit-control');
    
    const edit_icon = document.createElement('span');
    edit_icon.classList.add('material-icons');
    edit_icon.textContent = 'edit';

    // delete button
    const delete_btn = document.createElement('button');
    delete_btn.classList.add('message-control', 'delete-control');
    
    const delete_icon = document.createElement('span');
    delete_icon.classList.add('material-icons');
    delete_icon.textContent = 'clear';

    // message text
    const msg_text = document.createElement('p');
    msg_text.classList.add('message-text');
    msg_text.textContent = txt;

    // time of send
    const time = document.createElement('span');
    time.classList.add('data-time');
    time.textContent = tm;

    message.appendChild(controls);
    controls.appendChild(edit_btn);
    controls.appendChild(delete_btn);
    edit_btn.appendChild(edit_icon);
    delete_btn.appendChild(delete_icon);
    message.appendChild(msg_text);
    message.appendChild(time);

    chat_section.appendChild(message);
    readMessages();
}





