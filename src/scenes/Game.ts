import Phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import Bird from '~/game/Bird';
import Const from '~/consts/Const';
import PanelGameOver from '~/game/PanelGameOver';
import AudioKeys from '~/consts/AudioKeys';
import AnimationKeys from '~/consts/AnimationKeys';
import Virus from '~/game/Virus';
import ListPipe from '~/game/ListPipe';

export default class PlayScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private ground!: Phaser.GameObjects.TileSprite;
    private listPipe!: ListPipe;
    private scoreLabel!: Phaser.GameObjects.Text;
    private numBulletsLabel!: Phaser.GameObjects.Text;
    private destroyBullet!: Phaser.GameObjects.Image;
    private panelGameOver!: PanelGameOver;
    private virus!: Virus;
    private bird!: Bird;
    private score = 0; 
    private heightScore = 0;
    private speed!: number;
    private numBullets!: number;
    private checkAddScore: Phaser.GameObjects.GameObject|null;
    private checkPlayAudioHit!: boolean
    private audioPoint!: Phaser.Sound.BaseSound;
    private audioHit!: Phaser.Sound.BaseSound;
    private audioDie!: Phaser.Sound.BaseSound;
    private audioExplode!: Phaser.Sound.BaseSound;
    private audioBackground!: Phaser.Sound.BaseSound;
    private textGuide!: Phaser.GameObjects.Text;
    constructor(){
        super(SceneKeys.Game);
        this.checkAddScore = null;
    }
    init(){
        this.score = 0;
        this.panelGameOver = new PanelGameOver(this,0,0);
        this.add.existing(this.panelGameOver)
        this.initAudio();
        this.audioBackground = this.sound.add(AudioKeys.Background);
        this.audioExplode = this.sound.add(AudioKeys.Explode);
    }
    create(){
        // play audioBackground
        this.audioBackground.play();

        this.numBullets = Const.defaultNumBullets;
        this.speed = Const.speed;
        this.checkPlayAudioHit = false;
        // init 
        this.initListPipe();
        this.initInfor();
        this.initVirus();
        this.intiBackground();
        this.initBird();
        this.initHandleInput();
        this.initDestroyBullet();
        this.initTimerEvents();
        // listen for overlapping objects
        this.initHandleCollision();
        this.physics.world.setBounds(
            0,0, // x, y
            Number.MAX_SAFE_INTEGER, Const.scene.height-100 // width, height
        )
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, Const.scene.height);
    }

    update(time: number, delta: number): void {
        this.background.tilePositionX -= (this.speed-0.2)*(delta/Const.dtOn240Fps);
        this.ground.tilePositionX += this.speed*(delta/Const.dtOn240Fps);
        this.virus.getMainVirus().x -= this.speed*(delta/Const.dtOn240Fps);
        Phaser.Actions.IncX(this.listPipe.getListPipe().getChildren(), -this.speed*(delta/Const.dtOn240Fps))
        Phaser.Actions.IncX(this.listPipe.getCheckPoists().getChildren(), -this.speed*(delta/Const.dtOn240Fps))
        if(this.bird.y >= Const.scene.height-100-50){
            this.handleGameOver(this.bird,this.bird)
        }  
        this.listPipe.wrapPipe(); 
    }
   
    private initAudio(){
        this.audioPoint = this.sound.add(AudioKeys.Point);
        this.audioHit = this.sound.add(AudioKeys.Hit);
        this.audioDie = this.sound.add(AudioKeys.Die);
    }
    private initHandleCollision(){
        this.physics.add.collider(this.bird, this.listPipe.getListPipe(),(obj1, obj2)=>this.handleGameOver(obj1, obj2));
        this.physics.add.overlap (this.bird, this.virus.getGroupVirus(),(obj1, obj2)=>this.handleGameOver(obj1, obj2));
        this.physics.add.overlap(this.bird, this.virus.getMainVirus(),(obj1, obj2)=>this.handleGameOver(obj1, obj2));
        this.physics.add.overlap(this.bird, this.listPipe.getCheckPoists(),(obj1,obj2) =>this.handleAddScore(obj1,obj2)); 
    }

    private initHandleInput(){
        this.input.keyboard.on("keydown-RIGHT",()=>this.shootBullets())
        this.input.keyboard.on("keydown-ENTER",()=>{
            if(this.panelGameOver.active&&this.bird.getAlive()==false){
                this.scene.stop(SceneKeys.Game); 
                this.scene.start(SceneKeys.Game); 
            }
        })
    }

    private initTimerEvents(){
        this.time.addEvent({ delay: 2000,callback: this.hidenTextGuide, callbackScope: this , loop: true });
    }

    private initListPipe(){
        this.listPipe = new ListPipe(this);
    }

    private initVirus(){
        this.virus = new Virus(this,0,0).setDepth(2);
        this.add.existing(this.virus)
    }

    private initDestroyBullet(){
        this.destroyBullet = this.physics.add.image(Const.scene.width,0,TextureKeys.Pipe)
            .setOrigin(0)
            .setVisible(false)
            .setImmovable()
            .setDisplaySize(10,Const.scene.height)
    }

    private initBird(){
        this.bird = new Bird(this, Const.scene.width *0.25, Const.scene.height * 0.25)
            .setDepth(1);
        this.bird.setAlive(true);
        this.add.existing(this.bird);
        const bodyBird = this.bird.body as Phaser.Physics.Arcade.Body;
        bodyBird.setCollideWorldBounds(true);  
    }

    private intiBackground() {
        this.background = this.add.tileSprite(0, 0, Const.scene.width, Const.scene.height, TextureKeys.Background)
            .setOrigin(0)
        this.ground =  this.add.tileSprite(0, 500, Const.scene.width, Const.scene.height, TextureKeys.Ground)
            .setOrigin(0)
            .setDepth(2)
        this.textGuide = this.add.text(Const.scene.width*0.5, Const.scene.height*0.92,"Press Space to fly and Right Arrow shoot bullet",{
            fontSize: '24px',
            color: '#B51A1A',
            fontStyle: 'italic'
            })
            .setOrigin(0.5)
            .setDepth(2)
    }

    private initInfor(){
        this.scoreLabel = this.add.text(10, 10, "Score: " + this.score, {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
            .setDepth(3);
        this.numBulletsLabel = this.add.text(10, 60, "Bullet: " + this.numBullets , {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: { fill: true, blur: 0, offsetY: 0 },
                padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
            .setDepth(3);
    }

   
    private setHighScore(){
        var key = "highScore";
        const heightScore = localStorage.getItem(key);
        if(!heightScore || this.score > Number(heightScore)){
            localStorage.setItem(key, this.score.toString());
        }
        this.heightScore = Number(localStorage.getItem(key));
    }

    private hidenTextGuide() {
        this.textGuide.setVisible(false);
    }

    private handleGameOver(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject){
        if(obj2.active && obj1.active){
            this.audioBackground.pause()
            this.speed = 0;
            this.bird.setAlive(false);
            if(!this.audioHit.isPlaying&&!this.checkPlayAudioHit){
                this.audioHit.play();
                this.setHighScore();
                this.panelGameOver.setScore(this.score,this.heightScore);
                setTimeout(() =>{
                    this.audioDie.play();
                }, 300);
            }
            this.panelGameOver.set_Active(true);
            this.checkPlayAudioHit = true;
        }
    }
    
    private handleAddScore(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject){
        if(this.checkAddScore != obj2){
            this.score +=1;
            this.scoreLabel.text = "Score: "+ this.score;
            this.changeNumBullets("+")
            this.audioPoint.play();
        }
        this.checkAddScore = obj2;
    }

    private changeNumBullets(mode: string){
        if(mode == "+"){
            this.numBullets +=1;
        }
        else{
            this.numBullets -=1;
        }
        this.numBulletsLabel.text = "Bullet: "+ this.numBullets;
    }

    private shootBullets(){
        if(this.bird.getAlive()&&this.numBullets>0){
            this.changeNumBullets("-")
            var bullet = this.physics.add.sprite(this.bird.x,this.bird.y, TextureKeys.Bullet2)
                .setDisplaySize(50,30)
                .play(AnimationKeys.Bullet);
            const body = bullet.body as Phaser.Physics.Arcade.Body;
            body.setVelocityX(500) 

            this.physics.add.overlap(bullet, this.virus.getMainVirus(),(obj1,obj2) => {
                if(obj2.active){
                    this.virus.getMainVirus().setActive(false).setVisible(false);
                    var body = this.virus.getMainVirus().body as Phaser.Physics.Arcade.Body;
                    body.checkCollision.none = false;
                    obj1.destroy();
                    this.audioExplode.play()
                    this.explode(bullet);
                }
            });

            this.physics.add.overlap(bullet, this.virus.getGroupVirus(),(obj1,obj2) => {
                obj2.destroy();
                obj1.destroy();
                this.audioExplode.play()
                this.explode(bullet);
            });

            this.physics.add.collider(bullet, this.listPipe.getListPipe() ,(obj1,obj2) => {
                obj1.destroy();
                this.explode(bullet);
                this.audioExplode.play()
            });

            this.physics.add.collider(bullet, this.destroyBullet,(obj1,obj2) => {
                obj1.destroy();
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