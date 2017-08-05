const socket = io();

let messages = $('#messages');

function scrollToBottom () {
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMesageHeigth = newMessage.innerHeight();
    let lastMesageHeigth = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMesageHeigth + lastMesageHeigth >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    let li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    messages.append(li);
    scrollToBottom();
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    const formattedTime = moment().format('h:mm a');
    const $textBox = $('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: $textBox.val()
    }, function () {
        $textBox.val('')
    });
    let li = $('<li></li>');
    li.text(`'User' ${formattedTime}: ${$textBox.val()}`);
    messages.append(li);
    scrollToBottom();
});

$('#send-location').on('click', function (e) {

});