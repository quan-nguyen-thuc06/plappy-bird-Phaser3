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
        const {width, height} = this.scale;
        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
        this.ground = this.add.tileSprite(0, 500, width, height, TextureKeys.Ground)
            .setOrigin(0)
        const imgMessage = this.add.image(width*0.5, height*0.5, TextureKeys.Message)
            .setOrigin(0.5);
        imgMessage.setDisplaySize(imgMessage.width*2, imgMessage.height*2);
        this.bird = new Bird(this, width *0.25, height * 0.25);
        this.add.existing(this.bird);
        this.background.setInteractive()
            .on('pointerdown', () => {
                this.scene.stop(SceneKeys.Game); 
                this.scene.start(SceneKeys.Game); 
            } );
    }
    update(){
        const {width, height} = this.scale;
        this.background.tilePositionX += Const.speed;
        this.ground.tilePositionX += Const.speed;
        if(this.bird.y > height*0.3){
            const body = this.bird.body as Phaser.Physics.Arcade.Body;
            body.setVelocityY(-300);
        }
    }
}