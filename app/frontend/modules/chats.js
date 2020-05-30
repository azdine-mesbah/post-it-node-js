import DOMPurify from 'dompurify'
export default class Chats {
    constructor() {
        this.chatWrapper = $('#chat-wrapper')[0]
        this.chatIcon = $('.header-chat-icon')[0]
        this.closeChat = $('.chat-title-bar-close')[0]
        this.chatForm = $('.chat-form')[0]
        this.chatField = $('.chat-field')[0]
        this.chatLog = $('.chat-log')[0]
        this.openConnection()
        this.addEvents()
    }
    addEvents() {
        this.chatIcon.addEventListener('click', event => {
            this.chatWrapper.classList.add('chat--visible')
            this.chatField.focus()
        })
        this.closeChat.addEventListener('click', event => {
            this.chatWrapper.classList.remove('chat--visible')
        })
        this.chatForm.addEventListener('submit', event => {
            event.preventDefault()
            this.emitMessage(this.chatField.value)

        })
    }
    openConnection() {
        this.socket = io()
        this.socket.on('message', message => {
            this.renderMessage(message)
        })
    }
    emitMessage(message) {
        this.socket.emit('message', { message: message })
        this.chatField.value = ''
        this.chatField.focus()
    }

    renderMessage(message) {
        if (message.sender.username == this.chatField.getAttribute('sender')) {
            this.chatLog.innerHTML += DOMPurify.sanitize(`<div class="chat-self">
            <div class="chat-message">
                <div class="chat-message-inner">
                    ${message.body}
                </div>
            </div>
            <img class="chat-avatar avatar-tiny"
                src="${message.sender.avatar}">
        </div>`)
        } else {
            this.chatLog.innerHTML += DOMPurify.sanitize(`<div class="chat-other">
            <a href="/users/profile/${message.sender.username}"><img class="avatar-tiny"
                    src="${message.sender.avatar}"></a>
            <div class="chat-message">
                <div class="chat-message-inner">
                    <a href="/users/profile/${message.sender.username}"><strong>${message.sender.username}:</strong></a>
                    ${message.body}
                </div>
            </div>
        </div>`)
        }
        this.chatLog.scrollTop = this.chatLog.scrollHeight
    }
}