class OverworldMap {
    constructor(config) {
        this.overworld = null

        this.gameObject = config.gameObject
        this.lowerLayer = new Image();
        this.lowerLayer.src = config.lowerSrc
        this.upperLayer = new Image();
        this.upperLayer.src = config.upperSrc

        this.isCutscenePlaying = false

        // Collision
        this.walls = config.walls || {}
        this.cutsceneSpaces = config.cutsceneSpaces || []
    }


    drawLowerLayer(ctx, cameraPerson) {
        ctx.drawImage(this.lowerLayer,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    drawUpperLayer(ctx, cameraPerson) {
        ctx.drawImage(this.upperLayer,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        )
    }

    isSpaceTaken(curentX, curentY, direction) {
        const {
            x,
            y
        } = utils.nextPosition(curentX, curentY, direction)
        return this.walls[`${x},${y}`] || false
    }


    mountObject() {
        Object.keys(this.gameObject).forEach(key => {
            let object = this.gameObject[key]
            object.id = key
            object.mount(this)
        })
    }

    addWalls(x, y) {
        this.walls[`${x},${y}`] = true
    }
    removeWalls(x, y) {
        delete this.walls[`${x},${y}`]
    }
    moveWalls(wasX, wasY, direction) {
        this.removeWalls(wasX, wasY)
        const {
            x,
            y
        } = utils.nextPosition(wasX, wasY, direction)
        this.addWalls(x, y)
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init()
        }
        this.isCutscenePlaying = false

        Object.values(this.gameObject).forEach(object => {
            object.doBehaviorLoop(this)
        })
    }

    checkForActionCutscene() {
        const hero = this.gameObject['hero']
        const nextCoor = utils.nextPosition(hero.x, hero.y, hero.direction)
        const match = Object.values(this.gameObject).find(object => {
            return `${object.x},${object.y}` === `${nextCoor.x},${nextCoor.y}`
        })
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].event1)
        }
    }

    checkForFootstepCutscene(){
        const hero = this.gameObject['hero']
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]
        if(match && !this.isCutscenePlaying){
            this.startCutscene(match[0].event1)
        }    
    }
}

window.OverworldMap = {
    DemoRoom: {
        lowerSrc: 'images/maps/DemoLower.png',
        upperSrc: 'images/maps/DemoUpper.png',
        gameObject: {
            hero: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(8),
                controlled: true
            }),
            npcA: new Person({
                x: utils.withGrid(2),
                y: utils.withGrid(4),
                src: 'images/characters/people/npc1.png',
                behaviorLoop: [{
                        type: 'stand',
                        direction: 'left',
                        time: 500
                    },
                    {
                        type: 'stand',
                        direction: 'down',
                        time: 300
                    },
                    {
                        type: 'stand',
                        direction: 'right',
                        time: 800
                    },
                    {
                        type: 'stand',
                        direction: 'down',
                        time: 1000
                    },
                ],
                talking: [{
                    event1: [{
                            type: 'textMessage',
                            text: 'Hello there',
                            faceHero: 'npcA'
                        },
                        {
                            type: 'textMessage',
                            text: 'Iam not your mother'
                        },
                    ]
                }]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: 'images/characters/people/npc2.png',
            }),
        },
        walls: {
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7, 4)]: [{
                event1: [{
                    type: 'textMessage',
                    text: "You can't be in there",
                    faceHero: 'npcA'
                }, ]
            }],
            [utils.asGridCoord(5, 10)]: [{
                event1: [{
                    type: 'changeMap',
                    map: 'Kitchen'
                }, ]
            }],
        }
    },
    Kitchen: {
        gameObject: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                controlled : true
            }),
            npcA: new Person({
                x: utils.withGrid(9),
                y: utils.withGrid(8),
                src: 'images/characters/people/npc3.png',
                talking:[
                    {event1:[
                        {type:'textMessage', text:'Hello', faceHero:'npcA'}
                    ]}
                ]
            })
        },
        lowerSrc: 'images/maps/KitchenLower.png',
        upperSrc: 'images/maps/KitchenUpper.png'
    }
}