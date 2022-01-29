class Sprite{
    constructor(config){

        // SetUP the Image
        this.image = new Image()
        this.image.src = config.src
        this.image.onload = ()=>{
            this.isLoaded = true
        }

        // Shadow
        this.shadow = new Image()
        this.useShadow = true
        if(this.useShadow){
            this.shadow.src = 'images/characters/shadow.png'
        }
        this.shadow.onload = ()=>{
            this.isShadowLoaded = true
        }

        // Configure Animation
        this.animation = config.animation || {
            'idle-down' : [[0,0]],
            'idle-right' : [[0,1]],
            'idle-up' : [[0,2]],
            'idle-left' : [[0,3]],
            'walk-down' : [[1,0],[2,0],[3,0],[0,0]],
            'walk-right' : [[1,1],[2,1],[3,1],[0,1]],
            'walk-up' : [[1,2],[2,2],[3,2],[0,2]],
            'walk-left' : [[1,3],[2,3],[3,3],[0,3]],

        }
        this.currentAnimation = config.animation || 'idle-down'
        this.currentAnimationFrame = 0

        this.animationFrameLimit = 8
        this.animationFrameProgres = this.animationFrameLimit

        // Refrance gameObject
        this.gameObject = config.gameObject
    }

    setAnimation(key){
        if(this.currentAnimation !== key){
            this.currentAnimation = key
            this.currentAnimationFrame = 0;
            this.animationFrameProgres = this.animationFrameLimit
        }
    }

    get frame(){
        return this.animation[this.currentAnimation][this.currentAnimationFrame]
    }

    updateAnimationProgress(){
        if(this.animationFrameProgres > 0){
            this.animationFrameProgres -= 1
            return
        }
        this.animationFrameProgres = this.animationFrameLimit
        this.currentAnimationFrame += 1
        if(this.frame == undefined){
            this.currentAnimationFrame = 0
        }
    }

    // Draw Method
    draw(ctx, cameraPerson){
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x
        const y = this.gameObject.y - 16 + utils.withGrid(6) - cameraPerson.y

        this.isShadowLoaded && ctx.drawImage(
            this.shadow,
            x,y
        )

        const [frameX, frameY] = this.frame

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX*32,frameY*32,
            32,32,
            x,y,
            32,32
        )
        this.updateAnimationProgress()
    }
}