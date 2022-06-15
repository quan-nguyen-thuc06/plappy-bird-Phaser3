import Phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import Bird from '~/game/Bird';
import Obstacle from '~/game/Obstacle';
import Const from '~/consts/Const';
import PanelGameOver from '~/game/PanelGameOver';
import AudioKeys from '~/consts/AudioKeys';

export default class PlayScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private ground!: Phaser.GameObjects.TileSprite;
    private pipes!: Obstacle[];
    private groupObstacle!: Phaser.Physics.Arcade.Group[];
    private checkPoint!: Phaser.GameObjects.Image[];
    private bird!: Bird;
    private score = 0; 
    private heightScore = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private addScore: Phaser.GameObjects.GameObject|null;
    private panelGameOver!: PanelGameOver;
    private speed!: number;
    private audioPoint!: Phaser.Sound.BaseSound;
    private audioHit!: Phaser.Sound.BaseSound;
    private audioDie!: Phaser.Sound.BaseSound;
    private audioBackground!: Phaser.Sound.BaseSound;
    private checkPlayAudioHit!: boolean
    private virus!: Phaser.GameObjects.Image;
    private timerEvents!: Phaser.Time.TimerEvent;

    constructor(){
        super(SceneKeys.Game);
        this.addScore = null;
    }
    init(){
        this.score = 0;
        this.panelGameOver = new PanelGameOver(this,0,0);
        this.add.existing(this.panelGameOver)
        this.audioPoint = this.sound.add(AudioKeys.Point);
        this.audioHit = this.sound.add(AudioKeys.Hit);
        this.audioDie = this.sound.add(AudioKeys.Die);
        this.audioBackground = this.sound.add(AudioKeys.Background);
       
    }
    create(){
        this.pipes = [];
        this.groupObstacle = [];
        this.checkPoint = [];
        this.speed = Const.speed;
        this.checkPlayAudioHit = false;
        this.timerEvents = this.time.addEvent({ delay: 5000, loop: false });
        // store the width and height of the game screen
        const { width, height } = this.scale

        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
    
        this.pipes = this.initListPipe(width);
        this.ground =  this.add.tileSprite(0, 500, width, height, TextureKeys.Ground)
            .setOrigin(0)
            .setDepth(1)
        this.bird = new Bird(this, width *0.25, height * 0.25).setDepth(1);
        this.bird.setAlive(true);
        this.add.existing(this.bird);
        const bodyBird = this.bird.body as Phaser.Physics.Arcade.Body;
        bodyBird.setCollideWorldBounds(true);
        
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
        
        this.initScore();

        this.physics.world.setBounds(
            0,0, // x, y
            Number.MAX_SAFE_INTEGER, height-100 // width, height
        )
        this.virus = this.physics.add.image(
            Phaser.Math.Between(width, width *1.5), 
            height*0.5, TextureKeys.Virus)
            .setDisplaySize(100,100);
        this.audioBackground.play() 
        this.input.on('pointerdown',()=>{
            if(this.bird.getAlive()){
                var bullet = this.physics.add.image(this.bird.x,this.bird.y, TextureKeys.Bullet);
                const body = bullet.body as Phaser.Physics.Arcade.Body;
                body.setVelocityX(1000);
                body.setGravityY(980);
                this.physics.add.overlap(bullet, this.virus,(obj1,obj2) => {
                    obj2.destroy();
                    console.log(this.virus); 
                    obj1.destroy();
                    this.audioHit.play()
                });
                this.physics.add.overlap(bullet, this.groupObstacle,(obj1,obj2) => {
                    obj1.destroy();
                    this.audioHit.play()
                });
            }
        })
        this.physics.add.overlap(this.bird, this.groupObstacle,()=>this.handleGameOver());
        this.physics.add.overlap(this.bird, this.virus,()=>this.handleGameOver());
        this.physics.add.overlap(this.bird, this.checkPoint,(obj1,obj2) =>this.handleAddScore(obj1,obj2)); 
    }
    update(time: number, delta: number): void {
        const { width, height } = this.scale
        this.background.tilePositionX += this.speed;
        this.ground.tilePositionX += this.speed;
        this.virus.x -= this.speed;  
        for (let i = 0; i <Const.numPipe;i++){
            this.pipes[i].x -= this.speed;
        } 
        if(this.bird.y >= height-100-50){
            this.handleGameOver()
        }  
        if(this.virus.visible == false || this.virus.x <= -100) {
            this.virus = this.physics.add.image(
                Phaser.Math.Between(width, width *1.5), 
                Phaser.Math.Between(height*0.1, height *0.8), 
                TextureKeys.Virus)
                .setDisplaySize(100,100)
                .setDepth(1);
        };
        this.wrapObstacle(); 
    }

    private initScore(){
        this.scoreLabel = this.add.text(10, 10, "Score: " + this.score  , {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
            .setDepth(1);
    }

    private initListPipe(width: number): Obstacle[] {
        var pipes: Obstacle[] = [];
        for (let i = 0; i < Const.numPipe;i++){
            let x = i*Const.distance + Const.pipeWidth + width *0.75 ;
            let y = Phaser.Math.Between(250 ,450)
            let pipe = new Obstacle(this,x,y);
            this.add.existing(pipe);
            pipes.push(pipe) 
            this.checkPoint.push(pipe.getCheckPoint())
            this.groupObstacle.push(pipe.getObstacleGroup())
        }
        return pipes;
    }
    private wrapObstacle(){
        this.pipes.map((pipe,index) => {
            if(pipe.x < -100){
                var preIndex = index -1;
                if(preIndex<0) preIndex = this.pipes.length -1;
                pipe.x = this.pipes[preIndex].x + Const.distance;
                let newPipe = new Obstacle(this,pipe.x,pipe.y).setDepth(0);
                this.add.existing(newPipe);
                this.pipes[index] = newPipe;
                this.checkPoint[index] = newPipe.getCheckPoint();
                this.groupObstacle[index] = newPipe.getObstacleGroup()
            }
        })
    }
    private handleGameOver(){
        // console.log("Overlapping") 
        this.audioBackground.pause()
        this.speed = 0;
        this.bird.setAlive(false);
        if(!this.audioHit.isPlaying&&!this.checkPlayAudioHit){
            this.audioHit.play();
            if(this.heightScore<this.score)
                this.heightScore = this.score
            this.panelGameOver.setScore(this.score,this.heightScore);
            setTimeout(() =>{
                this.panelGameOver.set_Active(true);
                this.audioDie.play();
            }, 500);
        }
        this.checkPlayAudioHit = true;
        
    }
    
    private handleAddScore(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject){
        if(this.addScore != obj2){
            this.score +=1; 
            this.scoreLabel.text = "Score: "+ this.score;
            this.audioPoint.play();
        }
        this.addScore = obj2;
    }
}