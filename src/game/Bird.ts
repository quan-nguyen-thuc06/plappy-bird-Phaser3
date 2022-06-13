import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class Bird extends Phaser.GameObjects.Container{

    private bird: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene,x,y);
        this.bird = scene.add.sprite(0,0, TextureKeys.Bird)
            .setOrigin(0.5,0.5)
            .play(AnimationKeys.BirdFly)
        this.bird.displayHeight = 50;
        this.bird.displayWidth = 50;
        this.add(this.bird);
        
        //add a physics body
        scene.physics.add.existing(this)
        // adjust physics body size and offset
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(50,50)
        body.setOffset(-25,-25)
        body.setGravityY( 980);
        this.scene.input.keyboard.on("keydown", ()=>{
            body.setVelocityY(-500);
        })  
    }
    preUpdate(): void {     
        const body = this.body as Phaser.Physics.Arcade.Body
        if(body.velocity.y >= 0){
            this.bird.angle +=1;   
            if(this.bird.angle>60)  this.bird.angle = 60; 
        }
        else{
            this.bird.angle -=1;
            if(this.bird.angle<-20)  this.bird.angle = -20; 
        }
    }
}