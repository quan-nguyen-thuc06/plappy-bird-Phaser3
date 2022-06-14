import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class Bird extends Phaser.GameObjects.Container{

    private bird: Phaser.GameObjects.Sprite
    private isAlive!: boolean;
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene,x,y);
        this.setAlive(true);
        this.bird = scene.add.sprite(0,0, TextureKeys.Bird)
            .setOrigin(0.5,0.5)
            .play(AnimationKeys.BirdFly)
        this.bird.displayHeight = Const.birdWidth;
        this.bird.displayWidth = Const.birdHeight;
        this.add(this.bird);
        
        //add a physics body
        scene.physics.add.existing(this)
        // adjust physics body size and offset
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(Const.birdWidth,Const.birdHeight)
        body.setOffset(-Const.birdWidth*0.5,-Const.birdHeight*0.5)
        body.setGravityY(980);
        this.scene.input.keyboard.on("keydown",()=>this.birdMoveMent())  
    }
    preUpdate(): void {     
        const body = this.body as Phaser.Physics.Arcade.Body
        if(body.velocity.y >= 0){
            this.bird.anims.isPlaying = false;
            this.bird.angle +=1;   
            if(this.bird.angle>60)  this.bird.angle = 60; 
        }
        else{
            this.bird.anims.isPlaying = true;
            this.bird.angle -=1;
            if(this.bird.angle<-20)  this.bird.angle = -20; 
        }
        // pause animation
        if(!this.isAlive){
            this.bird.anims.isPlaying = false;
        }
    }

    private birdMoveMent(){
        const body = this.body as Phaser.Physics.Arcade.Body
        if(this.isAlive){
            body.setVelocityY(-500);
        }
    }

    public setAlive(isAlive: boolean){
        this.isAlive = isAlive;
    }
}