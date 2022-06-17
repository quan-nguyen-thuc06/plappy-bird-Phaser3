import Phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import Bird from '~/game/Bird';
import Obstacle from '~/game/Obstacle';
import Const from '~/consts/Const';
import PanelGameOver from '~/game/PanelGameOver';
import AudioKeys from '~/consts/AudioKeys';
import AnimationKeys from '~/consts/AnimationKeys';

export default class PlayScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private ground!: Phaser.GameObjects.TileSprite;
    private obstacles!: Phaser.GameObjects.Group;
    private groupVirus!: Phaser.GameObjects.Group;
    private checkPoints!: Phaser.GameObjects.Group;
    private scoreLabel!: Phaser.GameObjects.Text;
    private virus!: Phaser.GameObjects.Image;
    private panelGameOver!: PanelGameOver;
    private bird!: Bird;
    private score = 0; 
    private heightScore = 0;
    private speed!: number;
    // private angle!: number
    private addScore: Phaser.GameObjects.GameObject|null;
    private checkPlayAudioHit!: boolean
    private checkExplode !: boolean;
    private timerEvents!: Phaser.Time.TimerEvent;
    private audioPoint!: Phaser.Sound.BaseSound;
    private audioHit!: Phaser.Sound.BaseSound;
    private audioDie!: Phaser.Sound.BaseSound;
    private audioExplode!: Phaser.Sound.BaseSound;
    private audioBackground!: Phaser.Sound.BaseSound;
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
        this.audioExplode = this.sound.add(AudioKeys.Explode);
        this.checkPoints = this.physics.add.group();
        this.obstacles = this.physics.add.group();
        this.groupVirus = this.physics.add.group();
    }
    create(){
        this.checkExplode = false;
        this.speed = Const.speed;
        this.checkPlayAudioHit = false;

        // play audioBackground
        this.audioBackground.play();

        // init 
        this.initListPipe();
        this.initScore();
        this.virus = this.initVirus();
        this.groupVirus = this.initGroupVirus();

        // init timer
        this.timerEvents = this.time.addEvent({ delay: 4500 , loop: true });

        // init Background
        this.background = this.add.tileSprite(0, 0, Const.scene.width, Const.scene.height, TextureKeys.Background)
            .setOrigin(0)
        this.ground =  this.add.tileSprite(0, 500, Const.scene.width, Const.scene.height, TextureKeys.Ground)
            .setOrigin(0)
            .setDepth(2)
        
        // init bird
        this.bird = new Bird(this, Const.scene.width *0.25, Const.scene.height * 0.25)
            .setDepth(1);
        this.bird.setAlive(true);
        this.add.existing(this.bird);
        const bodyBird = this.bird.body as Phaser.Physics.Arcade.Body;
        bodyBird.setCollideWorldBounds(true);
        
        // this.input.on('pointermove', (pointer) =>{
        //     this.angle = Phaser.Math.Angle.BetweenPoints(this.bird, pointer);
        // });

        this.input.keyboard.on("keydown-RIGHT",()=>this.shootBullets())
        this.input.keyboard.on("keydown-SPACE",()=>{
            if(this.panelGameOver.active&&this.bird.getAlive()==false){
                this.scene.stop(SceneKeys.Game); 
                this.scene.start(SceneKeys.Game); 
            }
        })
        this.input.keyboard.on("keydown-A",()=>{
                this.scene.pause(SceneKeys.Game);
                this.audioBackground.pause()
        })


        // listen for overlapping objects
        this.physics.add.collider(this.bird, this.obstacles,()=>this.handleGameOver());
        this.physics.add.overlap (this.bird, this.groupVirus,()=>this.handleGameOver());
        this.physics.add.overlap(this.bird, this.virus,()=>this.handleGameOver());
        this.physics.add.overlap(this.bird, this.checkPoints,(obj1,obj2) =>this.handleAddScore(obj1,obj2)); 
        
        this.physics.world.setBounds(
            0,0, // x, y
            Number.MAX_SAFE_INTEGER, Const.scene.height-100 // width, height
        )
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, Const.scene.height);
    }
    update(time: number, delta: number): void {
        this.background.tilePositionX += this.speed;
        this.ground.tilePositionX += this.speed;
        this.virus.x -= this.speed;  
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.speed)
        Phaser.Actions.IncX(this.checkPoints.getChildren(), -this.speed)
        if(this.bird.y >= Const.scene.height-100-50){
            this.handleGameOver()
        }  
        if(this.virus.x <= -150||this.virus.visible === false){
            this.checkExplode = false;
            var heSo = 1;
            if(!this.virus.visible) heSo = 1.2;
            this.virus.setActive(true).setVisible(true);
            this.virus.setPosition(
                Phaser.Math.Between(Const.scene.width*heSo, Const.scene.width *1.3), 
                Phaser.Math.Between(Const.scene.height*0.2, Const.scene.height *0.7)
            )
            Phaser.Actions.SetX(this.groupVirus.getChildren(), this.virus.x);
            Phaser.Actions.SetY(this.groupVirus.getChildren(), this.virus.y);
            // this.physics.add.overlap(this.bird, this.virus,()=>this.handleGameOver());
        }
        if(this.checkExplode){
            Phaser.Actions.SetX(this.groupVirus.getChildren(), this.virus.x);
            Phaser.Actions.SetY(this.groupVirus.getChildren(), this.virus.y);
        };
        this.virus.setDisplaySize(this.timerEvents.getProgress()*300,this.timerEvents.getProgress()*300 );
        this.virusLifeCycle()
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
            .setDepth(2);
    }
    private initVirus(){
        var virus = this.physics.add.image(
            Phaser.Math.Between(Const.scene.width, Const.scene.width *1.3), 
            Phaser.Math.Between(Const.scene.height*0.2, Const.scene.height *0.7), 
            TextureKeys.Virus)
            .setDepth(2)
            .setTint(0x1CF8E4, 0xff0000, 0xff00ff, 0xffff00)
        virus.body.setCircle(200);
        return virus; 
    }
    private initGroupVirus(){
        var groupVirus = this.physics.add.group();
        for(var i=0;i<10;i++){
            var virus = this.physics.add.image(
                this.virus.x, 
                this.virus.y, 
                TextureKeys.Virus)
                .setDepth(1)
                .setTint(0x0000ff, 0xff0000, 0xff00ff, 0xffff00)
                .setDisplaySize(50,50)
                // .setGravityY(980)
                .setOrigin(0)
            virus.body.setCircle(200);
            groupVirus.add(virus);
        }
        return groupVirus;
    }

    private virusLifeCycle(){
        if(this.timerEvents.getProgress() >0.8 && this.virus.visible == true){
            if(!this.checkExplode){
                this.groupVirus.getChildren().forEach(virus => {
                    var body = virus.body as Phaser.Physics.Arcade.Body;
                    this.physics.velocityFromRotation(Phaser.Math.Between(-Math.PI,Math.PI), 300, body.velocity);
                })
            }
            this.checkExplode = true;
        }else{
            this.checkExplode = false;
        }
    }

    private initListPipe(){
        // var pipes: Obstacle[] = [];
        for (let i = 0; i < Const.numPipe;i++){
            let x = i*Const.distance + Const.pipeWidth + Const.scene.width *0.75 ;
            let y = Phaser.Math.Between(250 ,450) 
            var bottom = this.obstacles.create(x,y,TextureKeys.Pipe)
                .setDepth(1)
                .setOrigin(0)
                .setDisplaySize(Const.pipeWidth, Const.pipeHeight)
            bottom.body.setImmovable()
            this.add.existing(bottom)
            var top = this.obstacles.create(x,bottom.y - Const.blank - bottom.displayHeight,TextureKeys.Pipe)
                .setDepth(1)
                .setOrigin(0)
                .setDisplaySize(Const.pipeWidth, Const.pipeHeight)
            top.setFlipY(true)
            top.body.setImmovable()
            this.checkPoints.create(x + bottom.displayWidth,0, TextureKeys.Pipe)
                .setOrigin(0,0)
                .setVisible(false)
                .setDisplaySize(10,bottom.displayHeight*2 + Const.blank)
        }
    }

    private wrapObstacle(){
        this.obstacles.getChildren().map((pipe,index) => {
            if(index%2 ===0){
                var pipeDownBody = pipe.body as Phaser.Physics.Arcade.Body;
                if(pipeDownBody.x < -100){
                    var preIndex = index -1;
                    if(preIndex<0) preIndex = this.obstacles.getChildren().length -1;
                    var prePipeBody = this.obstacles.getChildren()[preIndex].body as Phaser.Physics.Arcade.Body;
                    var pipeUpBody = this.obstacles.getChildren()[index+1].body as Phaser.Physics.Arcade.Body;
                    var checkPoist = this.checkPoints.getChildren()[index/2].body as Phaser.Physics.Arcade.Body;
                    pipeDownBody.x =  prePipeBody.x + Const.distance;
                    pipeUpBody.x =  prePipeBody.x + Const.distance;
                    checkPoist.x = pipeDownBody.x + Const.pipeWidth;
                }
            }
        })
    }
    private handleGameOver(){
        this.audioBackground.pause()
        this.speed = 0;
        this.bird.setAlive(false);
        if(!this.audioHit.isPlaying&&!this.checkPlayAudioHit){
            this.audioHit.play();
            if(this.heightScore<this.score)
                this.heightScore = this.score
            this.panelGameOver.setScore(this.score,this.heightScore);
            setTimeout(() =>{
                this.audioDie.play();
            }, 300);
        }
        this.panelGameOver.set_Active(true);
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

    private shootBullets(){
        if(this.bird.getAlive()){
            var bullet = this.physics.add.sprite(this.bird.x,this.bird.y, TextureKeys.Bullet2)
                .setDisplaySize(50,30)
                .play(AnimationKeys.Bullet);
            const body = bullet.body as Phaser.Physics.Arcade.Body;
            // this.physics.velocityFromRotation(this.angle, 600, body.velocity);
            body.setVelocityX(500) 
            this.physics.add.overlap(bullet, this.virus,(obj1,obj2) => {
                this.virus.setActive(false).setVisible(false);
                obj1.destroy();
                this.audioExplode.play()
                this.explode(bullet);
            });
            this.physics.add.overlap(bullet, this.groupVirus,(obj1,obj2) => {
                obj2.destroy();
                obj1.destroy();
                this.audioExplode.play()
                this.explode(bullet);
            });
            this.physics.add.collider(bullet, this.obstacles ,(obj1,obj2) => {
                obj1.destroy();
                this.explode(bullet);
                this.audioExplode.play()
            });
        }
    }

    private explode(bullet: Phaser.GameObjects.Sprite){
        var explode = this.physics.add.sprite(bullet.x,bullet.y, TextureKeys.Bullet2)
            .setDisplaySize(100,100)
            .setDepth(2)
            .play(AnimationKeys.Explode).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>{
                explode.destroy()
            })
    }
}