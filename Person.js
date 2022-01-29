class Person extends GameObject{
    constructor(config){
        super(config)
        this.isStanding = false
        this.movingProgressRemaining = 0
        this.playerControlled = config.controlled || false
        this.directionUpdate = {
            'up': ['y',-1],
            'down': ['y',1],
            'left': ['x',-1],
            'right': ['x',1],
        }
    }

    // TRIGGER ARROW KEY
    update(state){
        // CALL UPDATE POSITION
        if(this.movingProgressRemaining > 0){
            this.updatePosition()
        }else{
            if(state.arrow && this.playerControlled && !state.map.isCutscenePlaying){
                this.startBehavior(state, {
                    type: 'walk',
                    direction: state.arrow
                })
            }
            this.updateAnimation()
        }
    }

    startBehavior(state, behavior){
        this.direction = behavior.direction
        if(behavior.type == 'walk'){
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)){
                behavior.retry && setTimeout(()=>{
                    this.startBehavior(state,behavior)
                },10)
                return
            }
            state.map.moveWalls(this.x, this.y, this.direction)
            this.movingProgressRemaining = 16
            this.updateAnimation()
        }

        if(behavior.type == 'stand'){
            this.isStanding = true
            setTimeout(()=>{
                utils.emitEvent('PersonStandComplete',{
                    whoId: this.id
                })
                this.isStanding = false
            },behavior.time)
        }
    }

    // UPDATE POSITION XY
    updatePosition(){
        const [property, change] = this.directionUpdate[this.direction]
        this[property] += change
        this.movingProgressRemaining -= 1

        if(this.movingProgressRemaining == 0){
            utils.emitEvent('PersonWalkingComplete',{
                whoId:this.id
            })
        }
    }

    updateAnimation(){
        if(this.movingProgressRemaining > 0){
            this.sprite.setAnimation('walk-'+this.direction)
            return
        }
        this.sprite.setAnimation('idle-'+this.direction)
    }
}