import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import Const from "~/consts/Const";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class TestScene extends Phaser.Scene{
    private mage!: Phaser.GameObjects.Sprite;
    private timerEvents!: Phaser.Time.TimerEvent;
    private groupFire!: Phaser.GameObjects.Group;
    constructor(){
        super(SceneKeys.TestScene);
    }
    create(){
        this.add.tileSprite(0, 0, Const.scene.width, Const.scene.height, TextureKeys.Background)
            .setOrigin(0)
        this.add.tileSprite(0, 500, Const.scene.width, Const.scene.height, TextureKeys.Ground)
            .setOrigin(0)
        this.timerEvents = this.time.addEvent({ delay: 1500 , loop: true })
        this.mage = this.physics.add.sprite(Const.scene.width*0.5,30,TextureKeys.Mage)
            .setOrigin(0)
            .setDisplaySize(200,200)
            .setFlipX(true)
            .setGravityY(980)
            .setCollideWorldBounds(true)
            .play(AnimationKeys.Attack)
        const body = this.mage.body as Phaser.Physics.Arcade.Body;
        body.setSize(60,60)
        body.setOffset(60,60*0.8);
        this.physics.world.setBounds(
            0,0, // x, y
            Number.MAX_SAFE_INTEGER, Const.scene.height-100 // width, height
        )
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, Const.scene.height);
        this.groupFire = this.initGroupFire();
    }

    update(){
        Phaser.Actions.SetX(this.groupFire.getChildren(), this.mage.x);
        Phaser.Actions.SetY(this.groupFire.getChildren(), this.mage.y);
        if(this.timerEvents.getProgress() >0.99){
            
        }
    }

    private initGroupFire(){
        var groupFire = this.physics.add.group();
        for(var i=0;i<4;i++){
            var fire = this.physics.add.sprite(this.mage.x,this.mage.y+90,TextureKeys.Mage)
                .setFlipX(true)
                .setOrigin(0)
                .setDisplaySize(200,200)
                
            const bodyFire = fire.body as Phaser.Physics.Arcade.Body;
            bodyFire.setSize(30,30)
            bodyFire.setVelocityX(-300);
            groupFire.add(fire);
        }
        return groupFire;
    }
}