import { getDateString } from "./common.js";

export default class Day {
   constructor(message) {
      this.date = message.date_time;
      this.messages = new Array(message);
   }

   insertMessage(newMessage) {
      let msg_index = 0;
      while (msg_index < this.messages.length &&
         newMessage.date_time.getTime() >=
         this.messages[msg_index].date_time.getTime()) {
         msg_index++;
      }
      this.messages.splice(msg_index, 0, newMessage);
   }

   get dateLabel() {
      const date_label = document.createElement('p');
      const today = new Date();
      date_label.classList.add('date-tag');

      if (getDateString(this.date) === getDateString(today)) {
         date_label.textContent = 'Today';
         return date_label;
      }

      const yersterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      if (getDateString(this.date) === getDateString(yersterday)) {
         date_label.innerText = 'Yesterday';
         return date_label;
      }

      const month = this.date.toLocaleString('default', { month: 'long' });
      date_label.innerText = `${month} ${this.date.getDate()}, ${this.date.getFullYear()}`;
      return date_label;
   }
}