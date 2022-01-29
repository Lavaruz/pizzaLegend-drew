class GameObject{
    constructor(config){
        this.id = null
        this.isMounted = false
        // Object Position
        this.x = config.x || 0
        this.y = config.y || 0
        this.direction = config.dirction || 'down'
        // Object Sprite
        this.sprite = new Sprite({
            gameObject : this,
            src : config.src || 'images/characters/people/hero.png'
        })

        this.behaviorLoop = config.behaviorLoop || []
        this.behaviorLoopIndex = 0

        this.talking = config.talking || []
    }

    mount(map){
        this.isMounted = true
        map.addWalls(this.x,this.y)
        setTimeout(()=>{
            this.doBehaviorLoop(map)
        },10)
    }

    update(){
    }

    async doBehaviorLoop(map){

        if(map.isCutscenePlaying || this.behaviorLoop.length == 0 || this.isStanding){
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        const eventHandler = new OverworldEvent({map, event: eventConfig})
        await eventHandler.init()

        this.behaviorLoopIndex += 1
        if (this.behaviorLoopIndex === this.behaviorLoop.length){
            this.behaviorLoopIndex = 0
        }

        this.doBehaviorLoop(map)
    }

}