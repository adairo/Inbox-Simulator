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
let current_editing_message;

class Message {
  constructor(source, text, date_time) {
    this.id = idGenerator.next().value;
    this.source = source;
    this.text = text;
    this.date_time = date_time;
    this.element = setUpMessage(this);
  }
}

const messages = [];
// insertMessage(new Message('self', 'hola', new Date(2022, 0, 14, 7, 40)));
// insertMessage(new Message('self', 'que tal', new Date(2022, 0, 14, 8, 40)));

setup();
readMessages();


function* getNewID() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}

function insertMessage(newMessage) {      
  // first message on chat
  if (messages.length === 0)
  {
    messages.push(new Array(newMessage));
    messages[0].date = newMessage.date_time;
    messages[0].date_label = createDateLabel(newMessage.date_time);
    return;
  }
  
  // if that day already exists
  if (messages.length >= 1) {

    const day_index = messages.findIndex(day => {
      if (getDateString(day.date) === getDateString(newMessage.date_time))
        return true;
    });

    if(day_index != -1){ // I should remove this conditional
      messages[day_index].push(newMessage)
      return;
    }
  }

  // Search for the position to insert the message
  let index = 0;
  while(index < messages.length &&
    newMessage.date_time.getTime() >= messages[index].date.getTime()) {
    index++;
  }

  // Insert it 
  messages.splice(index, 0, [newMessage]);
  messages[index].date = newMessage.date_time;
  messages[index].date_label = createDateLabel(newMessage.date_time);
}


function setUpMessage(msg) {
  const message = document.createElement('div');
  
  message.classList.add('message', `message-${msg.source}`);
  message.setAttribute('id', msg.id);
  message.setAttribute('tabindex', "0");
  message.dataset.date = getDateString(msg.date_time);
  message.dataset.time = getTimeString(msg.date_time);
  
  // controls section
  const controls = document.createElement('div');
  controls.classList.add('controls');
  
  // edit button
  const edit_btn = document.createElement('button');
  edit_btn.classList.add('message-control', 'edit-control');
  edit_btn.addEventListener('click', () => {
    editMessage(msg);
    readMessages();
  });
  
  // edit icon
  const edit_icon = document.createElement('span');
  edit_icon.classList.add('material-icons');
  edit_icon.textContent = 'edit';
  
  // delete button
  const delete_btn = document.createElement('button');
  delete_btn.classList.add('message-control', 'delete-control');
  delete_btn.addEventListener('click', () => {
    deleteMessage(msg);
    readMessages();
  });
  
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
  
  message.addEventListener('click', toggleControls);
  message.addEventListener('blur', () => {
    // dont toggle the buttons if hovering them
    if (!delete_btn.matches(':hover') && 
    !edit_btn.matches(':hover')){
      controls.classList.remove('active')
      message.classList.remove('selected');
    }
  });
  
  return message;
}


function readMessages() {
  document.querySelector('.security-info')
  .classList.toggle('show', messages.length === 0)

  // clear the chat-section
  const prevMessages = chat_section.querySelectorAll('.message');
  const dateLabels = chat_section.querySelectorAll('.date-tag');
  prevMessages.forEach( element => element.parentElement.removeChild(element));
  dateLabels.forEach(element => element.parentElement.removeChild(element));

  for (let day of messages) {
    chat_section.append(day.date_label)
    for (let msg of day) {
        chat_section.append(msg.element);
        msg.element.addEventListener('click', toggleControls);
    }
  }

}

function createDateLabel(date) {
  const date_label = document.createElement('p');
  const today = new Date();
  date_label.classList.add('date-tag');

  if (getDateString(date) === getDateString(today)){
      date_label.innerText = 'Today';
      return date_label;
    }
  
    const yersterday = new Date(today.getTime() - 24*60*60*1000);
  
    if (getDateString(date) === getDateString(yersterday)){
      date_label.innerText = 'Yesterday';
      return date_label;
    }
    
  const month = date.toLocaleString('default', { month: 'long' });
  date_label.innerText = `${month} ${date.getDate()}, ${date.getFullYear()}`;
  return date_label;
}

/******************** */
/* Event listeners */
/******************** */

sys_battery_input.addEventListener('input', () => {
  sys_battery.textContent = sys_battery_input.value <= 100 ? 
  sys_battery_input.value + '%' : 100 + '%';
  
  if (sys_battery_input.value === "")
    sys_battery.textContent = sys_battery_input.placeholder + '%';
})

msg_form.addEventListener('submit', function createMessage(e) {
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

  if (current_editing_message) {
    // current_editing_message.source = source;
    // current_editing_message.text = txt;
    // current_editing_message.date_time = msgDateTime;
    // current_editing_message.element = setUpMessage(current_editing_message);
    // msg_txt_input.value = "";
    // readMessages();
    // current_editing_message = undefined;
    // return;
    deleteMessage(current_editing_message);
  }

  insertMessage(new Message(source, txt, msgDateTime));
  readMessages();

  msg_txt_input.value = "";
});


// Form color considering source 
source_input.addEventListener('change', () => {
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

// input on system time
sys_time_input.addEventListener('input', function () {
  sys_time.textContent = this.value;
  if (this.value === "")
    sys_time.textContent = getTimeString(new Date());
});

// profile picture input
photo_input.addEventListener('input', function () {
  const img_url = URL.createObjectURL(this.files[0]);
  img_profile[0].style['background-image'] = `url(${img_url})`;
  img_profile[1].style['background-image'] = `url(${img_url})`;
});

// Receiver's name input
name_input.addEventListener('input', function () {
  const option = document.querySelector('.source-select option[value=receiver]');
  receiver_name.textContent = option.innerText = this.value;
  if (this.value === "")
    receiver_name.textContent = option.innerText = this.placeholder;
});

// Receiver's status input
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
  sys_time_input.value = sys_time.textContent = 
  msg_time_input.value = getTimeString(currentDateTime);

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
  const option = document.querySelector('.source-select option[value=receiver]');
  option.innerText = receiver_name.textContent;
}

function toggleControls(e) {

  const element = e.currentTarget;
  const controls = element.querySelector('.controls');

  controls.classList.toggle('active');
  element.classList.toggle('selected');
}
  

  

function getMessageByElement(element) {
  const date_index = messages
  .findIndex(day => {
    console.log(day)
    if (getDateString(day.date) === element.dataset.date)
      return true;
  });

  const message_index = messages[date_index].findIndex(msg => element.id == msg.id);

  return {
    message: messages[date_index][message_index],
    messageIndex: message_index,
    dateIndex: date_index 
  };
}

function editMessage(msg) {
  console.log(msg);
  // source_input.value = msg.message.source;
  // source_input.dispatchEvent(new Event('change'));
  // msg_date_input.value = getDateString(msg.message.date_time);
  // msg_time_input.value = getTimeString(msg.message.date_time);
  // msg_txt_input.value = msg.message.text;
  // current_editing_message = msg.message;
}

function deleteMessage(message) {
  // remove the msg object
  const date = messages.findIndex(day => {
    if (getDateString(day.date) === getDateString(message.date_time))
      return true;
  });

  messages[date].splice(messages[date]
    .findIndex(msg => msg.id === message.id), 1);
  
  // Remove the entire day if empty
  if (messages[date].length === 0)
  messages.splice(date, 1)
}









