import { getDateString } from "./common.js";
import Day from './Day.js';



export default class Chat {
   constructor(receiver) {
      this.receiver = receiver;
      this.days = new Array();
      // this.chat_section = document.querySelector('chat-section');
   }

   insertMessage(newMessage) {
      // is the first message of the entire chat?
      if (this.days.length === 0) {
         this.days.push(new Day(newMessage))
         return;
      }

      // Does that day exist on the chat?
      const day = this.days.find(day_msg => {
         if (getDateString(day_msg.date) === getDateString(newMessage.date_time)) {
            day_msg.insertMessage(newMessage);
            return true;
         }
      });

      if (day)
         return;

      // Where should we insert the new Day
      let day_index = 0;
      while (day_index < this.days.length &&
         newMessage.date_time.getTime() >=
         this.days[day_index].date.getTime()) {
         index++;
      }

      this.days.splice(day_index, 0, new Day(newMessage));
   }

   readMessages() {
      const chat_section = document.querySelector('.chat-section');
      chat_section.querySelector('.security-info')
         .classList.toggle('show', this.days.length === 0)

      // clear the chat-section
      const prevMessages = chat_section.querySelectorAll('.message');
      const dateLabels = chat_section.querySelectorAll('.date-tag');
      prevMessages.forEach(element => element.parentElement.removeChild(element));
      dateLabels.forEach(element => element.parentElement.removeChild(element));

      for (let day of this.days) {
         chat_section.append(day.dateLabel)
         for (let msg of day.messages) {
            chat_section.append(msg.element);
            // msg.element.addEventListener('click', toggleControls);
         }

      }
   }
}