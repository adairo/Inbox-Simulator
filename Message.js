import { getTimeString, getDateString } from "./common.js";

const source_input = document.querySelector('.source-select');
const name_input = document.querySelector('#receiver-input-name');
const status_input = document.querySelector('#receiver-input-status');
const msg_txt_input = document.querySelector('.msg-text-input');
const msg_date_input = document.querySelector('#message-date');
const msg_time_input = document.querySelector('#message-time');
const idGenerator = getNewID();

export default class Message {
    constructor(chat, source, text, date_time) {
        this.chat = chat;
        this.id = idGenerator.next().value;
        this.source = source;
        this.text = text;
        this.date_time = date_time;
        this.element = document.createElement('div');
        this.controls = document.createElement('div');
        this.setup()
    }

    toggleControls() {
        this.controls.classList.toggle('active');
        this.element.classList.toggle('selected');
    }

    editMessage() {
        source_input.value = msg.source;
        source_input.dispatchEvent(new Event('change'));
        msg_date_input.value = getDateString(msg.date_time);
        msg_time_input.value = getTimeString(msg.date_time, 24);
        msg_txt_input.value = msg.text;
        msg_date_input.disabled = msg_time_input.disabled = true;
        add_msg_button.textContent = "Save changes"
        current_editing_message = msg;
    }

    delete() {

        // Find the day of this message
        const day_index = this.chat.days.findIndex(day => {
            return getDateString(day.date) === getDateString(this.date_time)
        })

        // Delete the message
        const msg_index = this.chat.days[day_index].messages.findIndex(msg => {
            return msg.id === this.id
        });

        this.chat.days[day_index].messages.splice(msg_index, 1);

        // Delete the day if empty
        if (this.chat.days[day_index].messages.length === 0)
            this.chat.days.splice(day_index, 1);
        
        this.chat.readMessages();

    }

    setup() {

        this.element.classList.add('message', `message-${this.source}`, 'shadow');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('tabindex', 0);
        this.element.dataset.date = getDateString(this.date_time);
        this.element.dataset.time = getTimeString(this.date_time);

        // controls section
        this.controls.classList.add('controls');

        // edit button
        const edit_btn = document.createElement('button');
        edit_btn.classList.add('message-control', 'edit-control');
        edit_btn.addEventListener('click', () => {
            this.edit();
            // readMessages();
        });

        // edit icon
        const edit_icon = document.createElement('span');
        edit_icon.classList.add('material-icons');
        edit_icon.textContent = 'edit';

        // delete button
        const delete_btn = document.createElement('button');
        delete_btn.classList.add('message-control', 'delete-control');
        const delete_icon = document.createElement('span');
        delete_icon.classList.add('material-icons');
        delete_icon.textContent = 'delete';

        delete_btn.addEventListener('click', () => {
            this.delete();
            // readMessages();
        });

        // message text
        const msg_text = document.createElement('p');
        msg_text.classList.add('message-text');
        // msg_text.setAttribute('contenteditable', 'true');
        msg_text.textContent = this.text;

        // time of send
        const time = document.createElement('span');
        time.setAttribute('contenteditable', 'false')
        time.classList.add('data-time');
        time.textContent = getTimeString(this.date_time);

        // double check
        const check_icon = document.createElement('img');
        check_icon.classList.add('double-check');
        check_icon.setAttribute('src', 'resources/icons/double-check.svg');
        check_icon.setAttribute('width', "16");

        this.element.appendChild(this.controls);
        this.controls.appendChild(edit_btn);
        this.controls.appendChild(delete_btn);
        edit_btn.appendChild(edit_icon);
        delete_btn.appendChild(delete_icon);
        msg_text.appendChild(time);
        time.appendChild(check_icon);
        this.element.appendChild(msg_text);

        this.element.addEventListener('click', () => this.toggleControls.call(this));
        this.element.addEventListener('blur', () => {
            // dont toggle the buttons if hovering them
            if (!delete_btn.matches(':hover') &&
                !edit_btn.matches(':hover')) {
                this.controls.classList.remove('active')
                this.element.classList.remove('selected');
            }
        });
    }
}

function* getNewID() {
    let id = 0;
    while (true) {
        yield ++id;
    }
}