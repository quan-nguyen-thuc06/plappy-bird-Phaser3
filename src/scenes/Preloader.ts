import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import AudioKeys from "~/consts/AudioKeys";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class Preloader extends Phaser.Scene{
    constructor(){
        super(SceneKeys.Preloader); // key of the scene
    }
    preload(){
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        const {width, height} = this.scale
        var percentText = this.add.text(
            width / 2,
            height / 2 - 5,
            '0%',
            {
                font: '18px monospace',
            }
        );
        percentText.setOrigin(0.5, 0.5);
        this.load.image(
            TextureKeys.Background, 
            'Images/background/background-night.png');
        this.load.image(
            TextureKeys.Ground, 
            'Images/ground/base.png');
        this.load.image(
            TextureKeys.Pipe,
            'Images/obstacle/pipe-green.png');
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
        this.load.image(
            TextureKeys.Bullet,
            'Images/bullet.png'
        )
        this.load.image(
            TextureKeys.Virus,
            'Images/virus.png'
        )
        this.load.atlas(
            TextureKeys.Bird,
            'Images/character.png',
            'Images/character.json'
        ) 
        this.load.audio(AudioKeys.Fly,[
            'audio/swoosh.mp3'
        ])
        this.load.audio(AudioKeys.Point,[
            'audio/point.mp3'
        ])
        this.load.audio(AudioKeys.Hit,[
            'audio/hit.mp3'
        ])
        this.load.audio(AudioKeys.Die,[
            'audio/die.mp3'
        ])
        this.load.audio(AudioKeys.Background,[
            'audio/orchestrawav-26158.mp3'
        ])

        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(parseInt((value * 100).toString()) + '%');
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBar.destroy();
            percentText.destroy();
        });
        
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
        this.scene.start(SceneKeys.Game); 
    }
}