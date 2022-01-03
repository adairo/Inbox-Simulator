const chat_section = document.querySelector('.chat-section');
const img_profile = document.querySelectorAll('.receiver-photo-profile');
const msg_form = document.querySelector('.message-form');
const source_input = document.querySelector('.source-select');
const msg_txt_input = document.querySelector('.msg-text-input');
const add_msg_button = document.querySelector('.add-message-button');
const sys_time_input = document.querySelector('#sys-time');
const sys_battery_input = document.querySelector('#battery-percentaje-input');
const photo_input = document.querySelector('#receiver-input-photo');
const name_input = document.querySelector('#receiver-input-name');
const status_input = document.querySelector('#receiver-input-status');
const msg_time_input = document.querySelector('#message-time');

const receiver_name = document.querySelector('.receiver-name');
const receiver_status = document.querySelector('.receiver-status');
const sys_time = document.querySelector('.clock.notification-icon');
const sys_battery = document.querySelector('.percentaje.notification-icon');

const messages = [];

class Message {
    constructor(source, text, time) {
        this.source = source;
        this.text = text;
        this.time = time;
        this.element = setUpMessage(this);
        messages.push(this);
        readMessages();
    }
}

function setUpMessage(msg) {
    const message = document.createElement('div');
    message.classList.add('message', `message-${msg.source}`);

    // controls section
    const controls = document.createElement('div');
    controls.classList.add('controls');

    // edit button
    const edit_btn = document.createElement('button');
    edit_btn.classList.add('message-control', 'edit-control');

    // edit icon
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
    msg_text.textContent = msg.text;

    // time of send
    const time = document.createElement('span');
    time.classList.add('data-time');
    time.textContent = msg.time;

    message.appendChild(controls);
    controls.appendChild(edit_btn);
    controls.appendChild(delete_btn);
    edit_btn.appendChild(edit_icon);
    delete_btn.appendChild(delete_icon);
    message.appendChild(msg_text);
    message.appendChild(time);
    
    return message;
}

setup();
readMessages();

function readMessages() {

    for (msg of messages){
        chat_section.appendChild(msg.element);
        msg.element.addEventListener('click', toggleControls);
    }
}

/* Event listeners */

sys_battery_input.addEventListener('input', () => {
    sys_battery.textContent = sys_battery_input.value + '%';
})

msg_form.addEventListener('submit', e => {
    e.preventDefault();
    
    const source = source_input.value;
    const txt = msg_txt_input.value;
    let time = msg_time_input.value;
    if (time === "")
        time = getCurrentTime();
    new Message(source, txt, time);    
    msg_txt_input.value = "";
});


source_input.addEventListener('change', () => {
    // color setting

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

sys_time_input.addEventListener('input', function () {
    console.log(this)
    sys_time.textContent = this.value;
    if (this.value === "") 
        sys_time_input.value = sys_time.textContent = getCurrentTime();
});


photo_input.addEventListener('input', function() {
    const img_url = URL.createObjectURL(this.files[0]);
    console.log(img_profile);
    img_profile[0].style['background-image'] = `url(${img_url})`;
    img_profile[1].style['background-image'] = `url(${img_url})`;
});
    
name_input.addEventListener('input', function() {
    receiver_name.textContent = this.value;

    if (this.value === "")
        receiver_name.textContent = this.placeholder;
});

status_input.addEventListener('input', function() {
    receiver_status.textContent = this.value;

    if (this.value === "")
        receiver_status.textContent = this.placeholder;
});

function getCurrentTime() {
    const t = new Date();
    let hours = t.getHours();
    let minutes = t.getMinutes();

    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;

    return `${hours}:${minutes}`;
}
function setup() {

    // times
    sys_time_input.value = sys_time.textContent = msg_time_input.value = getCurrentTime();

    // batery level 
    sys_battery.textContent = sys_battery_input.value + '%';

    // receiver info
    receiver_name.textContent = name_input.value;
    receiver_status.textContent = status_input.value;
 
    if (name_input.value === "") 
        receiver_name.textContent = name_input.placeholder;
    
    if (status_input.value === "")
        receiver_status.textContent = status_input.placeholder;

    // source selector
    source_input.value = "self";


}

function toggleControls(e) {

    const message = e.currentTarget;
    const controls = message.querySelector('.controls');
    const edit_btn = controls.querySelector('.edit-control');
    const delete_btn = controls.querySelector('.delete-control');

    controls.classList.toggle('active');


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









