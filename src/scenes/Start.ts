import Phaser from "phaser";
import Const from "~/consts/Const";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";
import Bird from "~/game/Bird";

export default class Start extends Phaser.Scene{
    private background!: Phaser.GameObjects.TileSprite;
    private ground!: Phaser.GameObjects.TileSprite;
    private bird!: Bird;
    constructor(){
        super(SceneKeys.StartGame);
    }
    create(){
        this.initBackGround()
        this.initBird();
        this.initHandleInput()
    }

    private initBackGround(){
        this.background = this.add.tileSprite(0, 0, Const.scene.width, Const.scene.height, TextureKeys.Background)
            .setOrigin(0)
        this.ground = this.add.tileSprite(0, 500, Const.scene.width, Const.scene.height, TextureKeys.Ground)
            .setOrigin(0)
        const imgMessage = this.add.image(Const.scene.width*0.5, Const.scene.height*0.5, TextureKeys.Message)
        .setOrigin(0.5);
        imgMessage.setDisplaySize(imgMessage.width*2, imgMessage.height*2);
    }
    
    private initBird(){
        this.bird = new Bird(this, Const.scene.width *0.25, Const.scene.height * 0.25);
        this.add.existing(this.bird);
    }

    private initHandleInput(){
        this.background.setInteractive()
            .on('pointerdown', () => {
                this.scene.stop(SceneKeys.Game); 
                this.scene.start(SceneKeys.Game); 
        } );
    }
    update(time: number, delta: number){
        const {width, height} = this.scale;
        this.background.tilePositionX += Const.speed*(delta/Const.dtOn240Fps);
        this.ground.tilePositionX += Const.speed*(delta/Const.dtOn240Fps);
        if(this.bird.y > height*0.3){
            const body = this.bird.body as Phaser.Physics.Arcade.Body;
            body.setVelocityY(-300);
        }
    }
}