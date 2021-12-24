let messages = document.querySelectorAll('.message');

for (msg of messages) {
    msg.addEventListener('click', function(e) {
        const btn_close = document.createElement('button');
        btn_close.textContent = 'x';
        this.remove();
    });
}





