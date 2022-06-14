import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class ProgressBar extends Phaser.Scene{
    private timerEvents!: Phaser.Time.TimerEvent;
    private progressBar!: Phaser.GameObjects.Graphics
    private index!: number;
    constructor(){
        super(SceneKeys.ProgressBar);
    }

    create(){
        const {width, height} = this.scale;
        this.timerEvents = this.time.addEvent({ delay: 5000, loop: false });
        this.progressBar = this.add.graphics({ x: width*0.1, y: height*0.5 });
        this.add.text(width*0.4, height*0.4, "Loading .... "  , {
            fontSize: '24px',
            color: '#fff',
            // backgroundColor: '#F8E71C',
            shadow: { fill: true, blur: 0, offsetY: 0 },
             padding: { left: 15, right: 15, top: 10, bottom: 10 }
        })
        this.index = width*0.1;
    }

    update(){
        const {width, height} = this.scale;
        this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
            .setDepth(-1)
        this.add.tileSprite(0, 500, width, height, TextureKeys.Ground)
            .setOrigin(0)
            .setDepth(-1)
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(0, 0, width*0.8 * this.timerEvents.getProgress(), 30);
        if(this.timerEvents.getProgress()==1){
            this.scene.start(SceneKeys.StartGame); 
        }
    }
}