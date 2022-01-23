import Chat from "./Chat.js"
import Message from "./Message.js"
import { getDateString, getTimeString } from "./common.js";

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

const messages = [];

setup();
const chat = new Chat('default');
chat.readMessages();


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

   const source = source_input.value
   const date = msg_date_input.value;
   const time = msg_time_input.value;

   if (chat.current_editing_message) {
      chat.current_editing_message.update(txt, source)
      chat.current_editing_message = undefined;
      
      add_msg_button.textContent = "Add Message";
      msg_txt_input.value = "";
      msg_date_input.disabled = msg_time_input.disabled = false;
      chat.readMessages();
      return;
   }

   const msgDateTime = new Date();

   if (date !== "") {
      msgDateTime.setFullYear(date.slice(0, 4));
      msgDateTime.setMonth(Number(date.slice(5, 7)) - 1);
      msgDateTime.setDate(date.slice(8, 10));
   }

   if (time !== "") {
      msgDateTime.setHours(time.slice(0, 2));
      msgDateTime.setMinutes(time.slice(3, 5));
      msgDateTime.setSeconds(0);
      msgDateTime.setMilliseconds(0);
   }

   chat.insertMessage(new Message(chat, source, txt, msgDateTime))
   chat.readMessages();

   msg_txt_input.value = "";
});


// Form color considering source 
source_input.addEventListener('change', () => {
   (function (elements) {
      for (let el of elements) {
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


function setup() {
   // times
   const currentDateTime = new Date();
   sys_time.textContent = getTimeString(currentDateTime);

   // batery level 

   sys_battery.textContent = sys_battery_input.placeholder + '%';

   // receiver info

   receiver_name.textContent = name_input.placeholder;

   receiver_status.textContent = status_input.placeholder;

   // default profile picture
   const img_url = './default-profile.png';
   img_profile[0].style['background-image'] = `url(${img_url})`;
   img_profile[1].style['background-image'] = `url(${img_url})`;

   // source selector
   source_input.value = "self";
   const option = document.querySelector('.source-select option[value=receiver]');
   option.innerText = name_input.placeholder;
}

// function getMessageByElement(element) {
//    const date_index = messages
//       .findIndex(day => {
//          console.log(day)
//          if (getDateString(day.date) === element.dataset.date)
//             return true;
//       });

//    const message_index = messages[date_index].findIndex(msg => element.id == msg.id);

//    return {
//       message: messages[date_index][message_index],
//       messageIndex: message_index,
//       dateIndex: date_index
//    };
// }

