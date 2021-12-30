let messages;
const chat_section = document.querySelector('.chat-section');
const img_profile = document.querySelector('.receiver-photo-profile');
const msg_form = document.querySelector('.message-form');
const source_input = document.querySelector('.source-select');
const msg_txt_input = document.querySelector('.msg-text-input');
const add_msg_button = document.querySelector('.add-message-button');

readMessages();

function readMessages() {
    messages = document.querySelectorAll('.message');

    for (msg of messages)
        msg.addEventListener('click', toggleControls);
}


msg_form.addEventListener('submit', e => {
    e.preventDefault();
    const source = source_input.value;
    const txt = document.querySelector('.msg-text-input');
    const msg_txt = txt.value;
    createMessage(source, msg_txt);
    txt.value = "";
    
});


source_input.addEventListener('change', () => {
    // color setting
    console.log(msg_form.querySelectorAll('.self, .receiver'));

    (function (elements) {
        for (el of elements) {
            if (source_input.value === 'receiver') {
                el.classList.add('receiver');
                el.classList.remove('self');
            }
            else {
                el.classList.add('self');
                el.classList.remove('receiver');
            }
        }
    })(msg_form.querySelectorAll('.self, .receiver'));
});
    
    



img_profile.addEventListener('click', () => {
    msg_form.style.visibility = msg_form.style.visibility === 'hidden' ? 'visible' : 'hidden'

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


    edit_btn.addEventListener('click', function () {
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


function createMessage(source, txt, tm = "5:30 AM") {
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





