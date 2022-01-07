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
const msg_date_input = document.querySelector('#message-date');
const msg_time_input = document.querySelector('#message-time');

const receiver_name = document.querySelector('.receiver-name');
const receiver_status = document.querySelector('.receiver-status');
const sys_time = document.querySelector('.clock.notification-icon');
const sys_battery = document.querySelector('.percentaje.notification-icon');
const idGenerator = getNewID();

const messages = [];

class Message {
  constructor(source, text, date_time) {
    this.id = idGenerator.next().value;
    this.source = source;
    this.text = text;
    this.date_time = date_time;
    this.element = setUpMessage(this);
    insertMessage(this);
    readMessages();
  }
}

function* getNewID() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}

function insertMessage(newMessage) {
  const dates = Object.keys(messages)
  const dateMsg = getDateString(newMessage.date_time);

  if (dates.length === 0) {
    // Create a new day and its date-tag
    messages[dateMsg] = [newMessage];
    messages[dateMsg].date_tag = createDateTag(newMessage.date_time);
  }
  else {
    // check if there exists messages on that day
    if (dates.indexOf(dateMsg) >= 0) {
      messages[dateMsg].push(newMessage);
    }
    else {
      messages[dateMsg] = [newMessage];
      messages[dateMsg].date_tag = createDateTag(newMessage.date_time);
    }
  }
    // messages[getDateString(newMessage.date_time)].push(newMessage);
  
}

function setUpMessage(msg) {
  const message = document.createElement('div');
  message.classList.add('message', `message-${msg.source}`);
  message.setAttribute('id', msg.id);
  message.dataset.date = getDateString(msg.date_time);

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
  time.textContent = getTimeString(msg.date_time);

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
  const dates = Object.keys(messages);
  document.querySelector('.security-info').classList.toggle('show', dates.length === 0)

  // clear the chat-section
  // while(chat_section.firstChild)
  const prevMessages = chat_section.querySelectorAll('.message');
  const dateLabels = chat_section.querySelectorAll('.date-tag');

  prevMessages.forEach( element => element.parentElement.removeChild(element));
  dateLabels.forEach(element => element.parentElement.removeChild(element));

  for (let date of dates) {
    chat_section.append(messages[date].date_tag)
    for (let msg of messages[date]) {
        chat_section.append(msg.element);
        msg.element.addEventListener('click', toggleControls);

    }
  }

  // for (msg of messages){
  //     chat_section.appendChild(msg.element);
  //     msg.element.addEventListener('click', toggleControls);
  // }
}

function createDateTag(date) {
  const date_tag = document.createElement('p');
  date_tag.classList.add('date-tag');
  const month = date.toLocaleString('default', { month: 'long' });
  // switch(date.getMonth() + 1) {
  //   case 0:
  //     month = "January"
  //     break;
  // }
  date_tag.innerText = `${month} ${date.getDate()}, ${date.getFullYear()}`;
  return date_tag;
}

/* Event listeners */

sys_battery_input.addEventListener('input', () => {
  sys_battery.textContent = sys_battery_input.value <= 100 ? sys_battery_input.value + '%' : 100 + '%';
  if (sys_battery_input.value === "")
    sys_battery.textContent = sys_battery_input.placeholder + '%';
})

msg_form.addEventListener('submit', function createMessage(e) {
  // Creating a new message
  e.preventDefault();

  const txt = msg_txt_input.value;

  if (txt.trim() === "")
    return;

  const msgDateTime = new Date();
  const source = source_input.value
  const date = msg_date_input.value;
  const time = msg_time_input.value;

  if (date !== "") {
    msgDateTime.setFullYear(date.slice(0, 4));
    msgDateTime.setMonth(Number(date.slice(5, 7)) - 1);
    msgDateTime.setDate(date.slice(8, 10));
  }
  
  if (time !== "") {
    msgDateTime.setHours(time.slice(0, 2));
    msgDateTime.setMinutes(time.slice(3, 5));
  }

  new Message(source, txt, msgDateTime);
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
  sys_time.textContent = this.value;
  if (this.value === "")
    sys_time.textContent = getTimeString(new Date());
});


photo_input.addEventListener('input', function () {
  const img_url = URL.createObjectURL(this.files[0]);
  img_profile[0].style['background-image'] = `url(${img_url})`;
  img_profile[1].style['background-image'] = `url(${img_url})`;
});

name_input.addEventListener('input', function () {
  receiver_name.textContent = this.value;

  if (this.value === "")
    receiver_name.textContent = this.placeholder;
});

status_input.addEventListener('input', function () {
  receiver_status.textContent = this.value;

  if (this.value === "")
    receiver_status.textContent = this.placeholder;
});

function getTimeString(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10)
    hours = "0" + hours;
  if (minutes < 10)
    minutes = "0" + minutes;

  return `${hours}:${minutes}`;
}

function getDateString(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // return a number between 0-11
  let day = date.getDate();

  if (month < 10)
    month = '0' + month;

  if (day < 10)
    day = '0' + day;

  return `${year}-${month}-${day}`;
}


function setup() {

  // times
  const currentDateTime = new Date();
  sys_time_input.value = sys_time.textContent = msg_time_input.value = getTimeString(currentDateTime);

  // batery level 
  sys_battery.textContent = sys_battery_input.value + '%';
  if (sys_battery_input.value === "")
    sys_battery.textContent = sys_battery_input.placeholder + '%';

  // receiver info
  receiver_name.textContent = name_input.value;
  receiver_status.textContent = status_input.value;

  if (name_input.value === "")
    receiver_name.textContent = name_input.placeholder;

  if (status_input.value === "")
    receiver_status.textContent = status_input.placeholder;

  // default profile picture
  const img_url = './default-profile.png';
  img_profile[0].style['background-image'] = `url(${img_url})`;
  img_profile[1].style['background-image'] = `url(${img_url})`;

  // source selector
  source_input.value = "self";

  // message stuff
  // msg_date_input.value = getDateString(currentDateTime);
}

function toggleControls(e) {

  const message = e.currentTarget;
  const controls = message.querySelector('.controls');
  const edit_btn = controls.querySelector('.edit-control');
  const delete_btn = controls.querySelector('.delete-control');

  controls.classList.toggle('active');


  edit_btn.addEventListener('click', function () {
    
    const msg_text = message.querySelector('.message-text');
    const new_text = window.prompt('Nuevo mensaje', msg_text.textContent);
    msg_text.textContent = new_text;
  });

  delete_btn.addEventListener('click', deleteMessage);

}

function deleteMessage(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const date = element.dataset.date;

  const msgIndex = messages[date]
  .indexOf(messages[date]
  .find( msg => msg.id == element.id));

  messages[date].splice(msgIndex, 1); // remove the msg object

  if (messages[date].length === 0)
    delete messages[date];

  //element.parentElement.removeChild(element); // we just need to remove it from the list, I think
  readMessages();
}









