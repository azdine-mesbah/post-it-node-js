import axios from 'axios'
import DOMPurify from 'dompurify'
export default class LiveSearch {
    constructor() {
        this.searchButton = $('#live-search')[0]
        this.searchOverlay = $('.search-overlay')[0]
        this.closeOverlay = $('.close-live-search')[0]
        this.liveSearchField = $('.live-search-field')[0]
        this.circleLoader = $('.circle-loader')[0]
        this.liveSearchResults = $('.live-search-results')[0]
        this.typingTimer
        this.searchResults = $('#search-result')[0]
        this._csrf = $('[name=X-csrf]')[0].content
        this.addEvents()
    }
    addEvents() {
        this.searchButton.addEventListener('click', event => {
            event.preventDefault()
            this.searchOverlay.classList.add('search-overlay--visible')
        })
        this.closeOverlay.addEventListener('click', event => {
            event.preventDefault()
            this.searchOverlay.classList.remove('search-overlay--visible')
            this.circleLoader.classList.remove('circle-loader--visible')
            this.liveSearchField.value = ''
        })
        this.liveSearchField.addEventListener('keyup', () => {
            if (this.liveSearchField.value != '' && this.liveSearchField.value.length > 3) {
                this.circleLoader.classList.add('circle-loader--visible')
                this.liveSearchResults.classList.remove('live-search-results--visible')
                clearTimeout(this.typingTimer)
                this.typingTimer = setTimeout(() => {
                    if (this.liveSearchField.value != '' && this.liveSearchField.value.length > 3)
                        this.sendRequest()
                }, 1000)
            }else{
                this.circleLoader.classList.remove('circle-loader--visible')
            }
        })
    }
    sendRequest() {
        axios.post('/api/search', { _csrf: this._csrf, searchFor: this.liveSearchField.value })
            .then(result => {
                this.renderData(result.data)
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.circleLoader.classList.remove('circle-loader--visible')
                this.liveSearchResults.classList.add('live-search-results--visible')
            })
    }
    renderData(data) {
        this.searchResults.innerHTML = DOMPurify.sanitize(`<div class="list-group-item active"><strong>Search Results</strong> (${data.length} items found)</div>`
            + data.map(post => {
                post.createdAt = new Date(post.createdAt)
                return `<a href="/posts/show/${post._id}" class="list-group-item list-group-item-action">
            <img class="avatar-tiny" src="${post.author.avatar}">
            <strong>${post.title}</strong>
            <span class="text-muted small">by ${post.author.username} on ${post.createdAt.getDay()}/${post.createdAt.getMonth()}/${post.createdAt.getFullYear()}</span>
          </a>`
            }).join(''))
    }
}