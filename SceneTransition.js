class SceneTransition{
    constructor(){
        this.element= null
    }

    createElement(){
        this.element = document.createElement('div')
        this.element.classList.add('SceneTransition')
    }

    fadeOut(){
        this.element.classList.add('fadeOut')
        document.addEventListener('animationend',()=>{
            this.element.remove()
        },{once:true})

    }

    init(container, callback){
        this.createElement()
        container.appendChild(this.element)
        document.addEventListener('animationend',()=>{
            callback()
        },{once:true})
    }
}