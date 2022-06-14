import Phaser from "phaser";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class Obstacle extends Phaser.GameObjects.Container{
    private obstacleGroup!: Phaser.Physics.Arcade.Group;
    private checkPoint!: Phaser.GameObjects.Image;
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);
        const bottom = scene.physics.add.image(0,0, TextureKeys.Pipe)
            .setOrigin(0,0);
        bottom.setDisplaySize(Const.pipeWidth, Const.pipeHeight);
        this.checkPoint = scene.physics.add.image(bottom.displayWidth -10,bottom.y - Const.blank, TextureKeys.Pipe)
            .setOrigin(0,0)
            // .setVisible(false)
        this.checkPoint.displayWidth = 10;
        this.checkPoint.displayHeight = Const.blank;
        // this.checkPointBody = checkPoint.body
        // this.checkPoint.body.allowGravity = false;

        const top = scene.physics.add.image(0, bottom.y - Const.blank - bottom.displayHeight,TextureKeys.Pipe)
            .setOrigin(0,0)
            .setFlipY(true)
        top.setDisplaySize(Const.pipeWidth, Const.pipeHeight);
    
        this.add(top)
        this.add(bottom)
        this.add(this.checkPoint)
        // scene.physics.add.existing(this)
        this.obstacleGroup = scene.physics.add.group([bottom,top],{
            // immovable: true  ,  
            allowGravity: false
        })
        top.setPushable(true)
        // const body = this.body as Phaser.Physics.Arcade.Body
        // body.allowGravity = false;
        // body.setSize(10,Const.blank);
        // body.setOffset(bottom.displayWidth -10,bottom.y - Const.blank)
    }

    public getObstacleGroup(): Phaser.Physics.Arcade.Group{
        return this.obstacleGroup;
    }

    public getCheckPointBody(): Phaser.GameObjects.Image{
        return this.checkPoint;
    }
}