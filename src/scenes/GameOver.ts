import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class GameOver extends Phaser.Scene{
    constructor(){
        super(SceneKeys.GameOver);
    }

    create(){
        const {width, height} = this.scale;
        this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
        this.add.tileSprite(0, 500, width, height, TextureKeys.Ground)
            .setOrigin(0)
        const textGameOver = this.add.image(width*0.5, height*0.3, TextureKeys.GameOver)
            .setOrigin(0.5)
        textGameOver.setDisplaySize(textGameOver.width *3,textGameOver.height *3)
        const replayButton = this.add.image(width*0.5,height *0.6, TextureKeys.ReplayButton);
        replayButton.setDisplaySize(replayButton.width/2,replayButton.height/2)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.stop(SceneKeys.Game); 
            this.scene.start(SceneKeys.Game); 
        } );
    }
}