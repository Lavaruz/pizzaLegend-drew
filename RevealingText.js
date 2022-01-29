class RevelaingText{
    constructor(config){
        this.element = config.element
        this.text = config.text
        this.speed = config.speed || 60

        this.timeout = null
        this.isDone = false
    }

    revealOneCharacter(lists){
        const next = lists.splice(0,1)[0]
        next.span.classList.add('revealed')
        if(lists.length > 0){
            this.timeout = setTimeout(()=>{
                this.revealOneCharacter(lists)
            },next.delayAfter)
        }else{
            this.isDone = true
        }
    }

    wrapToDone(){
        clearTimeout(this.timeout)
        this.element.querySelectorAll('span').forEach(chara =>{
            chara.classList.add('revealed')
        })
        this.isDone = true
    }

    init(){
        let characters = []
        this.text.split('').forEach(character => {
            let span = document.createElement('span')
            span.textContent = character
            this.element.appendChild(span)

            characters.push({
                span,
                delayAfter: character == ' ' ? 0 : this.speed
            })

        });
        this.revealOneCharacter(characters)
    }
}