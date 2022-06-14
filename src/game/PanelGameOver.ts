import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class GameOver extends Phaser.GameObjects.Container{
    private textGameOver!: Phaser.GameObjects.Image;
    private replayButton!: Phaser.GameObjects.Image;
    private currentScore!: Phaser.GameObjects.Text;
    private highScore!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);
        const {width, height} = this.scene.scale;
        this.textGameOver = scene.add.image(width*0.5, height*0.3, TextureKeys.GameOver)
            .setOrigin(0.5)
        this.textGameOver.setDepth(1);
        this.textGameOver.setDisplaySize(this.textGameOver.width *3,this.textGameOver.height *3)
        this.replayButton = scene.add.image(width*0.5,height *0.6, TextureKeys.ReplayButton);
        this.replayButton.setDepth(1);
        this.replayButton.setDisplaySize(this.replayButton.width/2,this.replayButton.height/2)
            .setInteractive()
            .on('pointerdown', () => {
                scene.scene.stop(SceneKeys.Game); 
                scene.scene.start(SceneKeys.Game); 
            } );
        this.initScore();
        this.set_Active(false);
    }

    private initScore() {
        const {width, height} = this.scene.scale;
        this.currentScore = this.scene.add.text(width*0.15,height *0.42, "Score: 0", {
            fontSize: '36px',
            color: '#fff',
            backgroundColor: '#848080',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
            .setDepth(1);

        this.highScore = this.scene.add.text(width*0.5,height *0.42, "High Score: 0", {
            fontSize: '36px',
            color: '#fff',
            backgroundColor: '#848080',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
            })
            .setDepth(1);

    }

    public set_Active(active: boolean){
        this.textGameOver.setActive(active)
            .setVisible(active);
        this.replayButton.setActive(active)
            .setVisible(active);
        this.currentScore.setVisible(active)
        this.highScore.setVisible(active);
    }

    public setScore(score: number, highScore: number){
        this.currentScore.text = "Score: " + score;
        this.highScore.text = "High Score: " + highScore;
    }
}