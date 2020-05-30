export default class ProfileNave {
    constructor() {
        this.postsButton = $('#posts')[0]
        this.followersButton = $('#followers')[0]
        this.followingsButton = $('#followings')[0]
        this.addEvents()
    }
    addEvents() {
        this.postsButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.toggle(event.target)
        })
        this.followersButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.toggle(event.target)
        })
        this.followingsButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.toggle(event.target)
        })
    }
    toggle(target) {
        $('#posts-tab')[0].classList.add('--hidden')
        $('#followers-tab')[0].classList.add('--hidden')
        $('#followings-tab')[0].classList.add('--hidden')
        $(`#${target.id}-tab`)[0].classList.remove('--hidden')

        this.postsButton.classList.remove('active')
        this.followersButton.classList.remove('active')
        this.followingsButton.classList.remove('active')
        target.classList.add('active')
    }
}