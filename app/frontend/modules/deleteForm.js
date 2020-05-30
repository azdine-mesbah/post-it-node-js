export default class DelelePost{
    constructor(){
        this.form = $('#delete-post')[0]
        if(this.form){
            this.addEvents()
        }
    }
    addEvents(){
        this.form.addEventListener('submit',function(event){
            event.preventDefault()
            if(confirm('Delete Post ??')){
                this.submit()
            }
        })
    }
}