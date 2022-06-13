import Phaser from 'phaser';
import AnimationKeys from '~/consts/AnimationKeys';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import Bird from '~/game/Bird';
import Obstacle from '~/game/Obstacle';
import Const from '~/consts/Const';
export default class PlayScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private ground!: Phaser.GameObjects.TileSprite;
    private pipes!: Obstacle[];
    private groupObstacle!: Phaser.Physics.Arcade.Group[]
    private bird!: Bird;
    private score = 0; 
    private scoreLabel!: Phaser.GameObjects.Text;
    private addScore: Phaser.GameObjects.GameObject|null;
    constructor(){
        super(SceneKeys.Game);
        this.addScore = null;
    }
    init(){
        this.score = 0;
    }
    create(){
        this.pipes = [];
        this.groupObstacle = [];
        // store the width and height of the game screen
        const { width, height } = this.scale

        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
    
        this.pipes = this.initListPipe(width);
        this.ground =  this.add.tileSprite(0, 500, width, height, TextureKeys.Ground)
            .setOrigin(0)
        this.bird = new Bird(this, width *0.25, height * 0.25);
        this.add.existing(this.bird);
        const bodyBird = this.bird.body as Phaser.Physics.Arcade.Body;
        bodyBird.setCollideWorldBounds(true);
        bodyBird.setVelocityY(-800);
        this.physics.world.setBounds(
            0,0, // x, y
            Number.MAX_SAFE_INTEGER, height-100 // width, height
        )
        console.log(this.groupObstacle.length)
        this.physics.add.overlap(this.bird, this.groupObstacle,()=>this.handleGameOver());
        this.physics.add.overlap(this.bird, this.pipes,(obj1,obj2) =>this.handleAddScore(obj1,obj2));
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
        this.scoreLabel = this.add.text(10, 10, "Score: " + this.score  , {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
        .setScrollFactor(0)
    }
    update(time: number, delta: number): void {
        const height = this.scale.height
        this.background.tilePositionX += Const.speed;
        this.ground.tilePositionX += Const.speed;  
        for (let i = 0; i <Const.numPipe;i++){
            this.pipes[i].x -= Const.speed;
        }
        if(this.bird.y >= height-100-50){
            this.handleGameOver()
        } 
        this.wrapObstacle(); 
    }
    private initListPipe(width: number): Obstacle[] {
        var pipes: Obstacle[] = [];
        for (let i = 0; i < Const.numPipe;i++){
            let x = i*Const.distance + Const.pipeWidth + width *0.75 ;
            let y = Phaser.Math.Between(250 ,500)
            let pipe = new Obstacle(this,x,y);
            this.add.existing(pipe);
            pipes.push(pipe) 
            this.groupObstacle.push(pipe.obstacleGroup)
        }
        return pipes;
    }
    private wrapObstacle(){
        this.pipes.map((pipe,index) => {
            if(pipe.x < -100){
                var preIndex = index -1;
                if(preIndex<0) preIndex = this.pipes.length -1;
                pipe.x = this.pipes[preIndex].x + Const.distance;
            }
        })
    }
    private handleGameOver(){
        console.log("Overlapping")
        // Const.speed = 0;
        // stop and restart the Game scene
        this.scene.stop(SceneKeys.GameOver); 
        this.scene.start(SceneKeys.GameOver); 
    }
    
    private handleAddScore(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject){
        if(this.addScore != obj2){
            this.score +=1; 
            this.scoreLabel.text = "Score: "+ this.score;
        }
        this.addScore = obj2;
    }
}