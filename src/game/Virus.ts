import Phaser from "phaser";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class Virus extends Phaser.GameObjects.Container{
    private timerEvents!: Phaser.Time.TimerEvent;
    virus!: Phaser.GameObjects.Image;
    groupVirus!: Phaser.GameObjects.Group;
    private speed!: number;
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene,x,y);
        this.initVirus();
        this.initGroupVirus();
        this.initTimerEvents();
        this.setSpeed(Const.speed);
    }

    preUpdate() {     
        this.virus.x -= this.speed;
        if(this.virus.x <= -200||this.virus.active == false){
            this.virus.setActive(true).setVisible(true);
            this.virus.setPosition(
                Phaser.Math.Between(Const.scene.width*1.15, Const.scene.width *1.3), 
                Phaser.Math.Between(Const.scene.height*0.2, Const.scene.height *0.7)
            )
            Phaser.Actions.SetXY(this.groupVirus.getChildren(), this.virus.x, this.virus.y);
        }
        this.virus.setDisplaySize(this.timerEvents.getProgress()*300,this.timerEvents.getProgress()*300 );
    }

    private initTimerEvents(){
        this.timerEvents = this.scene.time.addEvent({ delay: 2000, callback: this.virusLifeCycle, callbackScope: this , loop: true });
    }

    private initVirus(){
        this.virus = this.scene.physics.add.image(
            Phaser.Math.Between(Const.scene.width, Const.scene.width *1.3), 
            Phaser.Math.Between(Const.scene.height*0.2, Const.scene.height *0.85), 
            TextureKeys.Virus)
            .setDepth(3)
            .setTint(0x1CF8E4, 0xff0000, 0xff00ff, 0xffff00)
        var body = this.virus.body as Phaser.Physics.Arcade.Body;
        body.setCircle(200);
        this.add(this.virus);
    }

    private initGroupVirus(){
        this.groupVirus = this.scene.physics.add.group();
        for(var i=0;i<10;i++){
            var virus = this.scene.physics.add.image(
                this.virus.x, 
                this.virus.y, 
                TextureKeys.Virus)
                .setDepth(2)
                .setTint(0x0000ff, 0xff0000, 0xff00ff, 0xffff00)
                .setDisplaySize(50,50)
                .setOrigin(0)
            virus.body.setCircle(200);
            this.groupVirus.add(virus);
        }
    }

    private virusLifeCycle(){
        Phaser.Actions.SetXY(this.groupVirus.getChildren(), this.virus.x, this.virus.y)
        this.groupVirus.getChildren().forEach(virus => {
            var body = virus.body as Phaser.Physics.Arcade.Body;
            this.scene.physics.velocityFromRotation(Phaser.Math.Between(-Math.PI,Math.PI), 300, body.velocity);
        })
    }

    setSpeed(speed: number){
        this.speed = speed;
    }
}