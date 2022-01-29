class TextMessage{
    constructor({text, onComplete}){
        this.text = text
        this.onComplete = onComplete
        this.element = null
    }

    createElement(){
        this.element = document.createElement('div')
        this.element.classList.add('TextMessage')
        this.element.innerHTML = (`
        <p class='TextMessage_p'></p>
        <button class='TextMessage_button'>Next</button>
        `)

        this.revelaingText = new RevelaingText({
            text: this.text,
            element : this.element.querySelector('.TextMessage_p')
        })

        this.element.querySelector('button').addEventListener('click',()=>{
            this.done()
        })


        this.actionListener = new KeyPressListener('KeyZ', ()=>{
            this.done()
        })
    }
    
    done(){
        if(this.revelaingText.isDone){
            this.element.remove()
            this.onComplete()
            this.actionListener.unbind()
        }else{
            this.revelaingText.wrapToDone()
        }
    }

    init(container){
        this.createElement()
        container.appendChild(this.element)
        this.revelaingText.init()
    }
}