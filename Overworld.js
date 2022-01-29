class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas')
        this.ctx = this.canvas.getContext('2d')
        this.map = null
    }

    startGameLoop(){
        const step = ()=>{

            // Clear Rect
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)

            this.cameraPerson = this.map.gameObject.hero

            Object.values(this.map.gameObject).forEach(object =>{
                object.update({
                    arrow : this.directionInput.direction,
                    map : this.map
                })
            })

            // Draw Lower Layer
            this.map.drawLowerLayer(this.ctx, this.cameraPerson)

            // Draw Game Object
            Object.values(this.map.gameObject).sort((a,b)=>{
                return a.y-b.y
            }).forEach(object =>{
                object.sprite.draw(this.ctx, this.cameraPerson)
            })


            // Draw Upper Layer
            this.map.drawUpperLayer(this.ctx, this.cameraPerson)
            requestAnimationFrame(()=>{
                step()
            })
        }
        step()
    }

    bindAcionInput(){
        new KeyPressListener('KeyZ', ()=>{
            this.map.checkForActionCutscene()
        })
    }

    bindPositionHero(){
        document.addEventListener('PersonWalkingComplete',e=>{
            if(e.detail.whoId == 'hero'){
                this.map.checkForFootstepCutscene()
            }
        })
    }

    startMap(mapConfig){
        this.map = new OverworldMap(mapConfig)
        this.map.overworld = this
        this.map.mountObject()
    }

    init(){
        this.startMap(window.OverworldMap.DemoRoom)

        this.bindAcionInput();
        this.bindPositionHero()

        this.directionInput = new DirectionInput()
        this.directionInput.init()

        this.startGameLoop()

        this.map.startCutscene([
            {type:'textMessage', text: 'Hello!!  what is yor name by the way brooh'}
            // {who : 'hero', type : 'walk',  direction: 'left'},
            // {who : 'hero', type : 'walk',  direction: 'left'},
            // {who : 'hero', type : 'walk',  direction: 'up'},
            // {who : 'hero', type : 'walk',  direction: 'up'},
            // {who : 'hero', type : 'walk',  direction: 'up'},
            // {who : 'hero', type : 'walk',  direction: 'up'},
            // {who : 'hero', type : 'walk',  direction: 'left'},
            // {who : 'hero', type : 'walk',  direction: 'left'},
            // {who : 'npcA', type : 'stand',  direction: 'right', time:10000},
        ])
    }
}