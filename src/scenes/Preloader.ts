import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class Preloader extends Phaser.Scene{
    constructor(){
        super(SceneKeys.Preloader); // key of the scene
    }
    preload(){
        this.load.image(
            TextureKeys.Background, 
            'Images/background/background-night.png');
        this.load.image(
            TextureKeys.Ground, 
            'Images/ground/base.png');
        this.load.image(
            TextureKeys.Pipe,
            'obstacle/pipe-green.png');
        this.load.image(
            TextureKeys.GameOver,
            'Images/panelGameOver/gameOver.png'
        )
        this.load.image(
            TextureKeys.ReplayButton,
            'Images/panelGameOver/replay-button.png'
        )
        this.load.image(
            TextureKeys.Message,
            'Images/gameStart/message.png'
        )
        this.load.atlas(
            TextureKeys.Bird,
            'character.png',
            'character.json'
        ) 
    }
    create(){
    
    this.anims.create({
        key: AnimationKeys.BirdFly, // name of this animation
        // helper to generate frames
        frames: this.anims.generateFrameNames(TextureKeys.Bird, {
        start: 1,
        end: 8,
        prefix: 'frame-',
        zeroPad: 1, // so chu so
        suffix: '.png'
        }),
        frameRate: 20,
        repeat: -1 // -1 to loop forever
    })
        this.scene.start(SceneKeys.StartGame); 
    }
}