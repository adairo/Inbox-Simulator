let messages = document.querySelectorAll('.message');
let chat_section = document.querySelector('.chat-section');

// chat_section.addEventListener('click', function(e) {
//     if (e.target === e.currentTarget)
//         for (cntrl of document.querySelectorAll('.controls'))
//             cntrl.style.display = 'none';
// });

for (msg of messages) {
    msg.addEventListener('click', showControls);
}

function showControls(e) {

        
    console.log(e)
    const message = e.currentTarget;
    const controls = message.querySelector('.controls');
    const edit_btn = controls.querySelector('.edit-control');
    const delete_btn = controls.querySelector('.delete-control');

    if (controls.style.display === '' || controls.style.display === 'none')
        controls.style.display = 'flex'
    else
        controls.style.display = 'none';

    // Hiding controls to prevent multiples controls showing up
    // message.addEventListener('focusout', (e) => {

    //     if (e.target.style.display !== 'flex')
    //         e.target.querySelector('.controls').style.display = 'none';
    // });

    edit_btn.addEventListener('click', function() {
        let new_text = window.prompt('Nuevo mensaje', message.textContent);
        message.textContent = new_text;
    })
    delete_btn.addEventListener('click', deleteMessage);

}

function deleteMessage(e) {
    let msg = e.currentTarget.parentElement.parentElement;
    msg.parentElement.removeChild(msg);
}





