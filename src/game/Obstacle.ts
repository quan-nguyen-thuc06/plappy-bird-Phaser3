import Phaser from "phaser";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class Obstacle extends Phaser.GameObjects.Container{
    obstacleGroup!: Phaser.Physics.Arcade.Group;
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);
        const bottom = scene.physics.add.image(0,0, TextureKeys.Pipe)
            .setOrigin(0,0);
        bottom.body.allowGravity = false;
        const checkPoint = scene.physics.add.image(bottom.displayWidth -10,bottom.y - Const.blank, TextureKeys.Pipe)
            .setOrigin(0,0)
        checkPoint.setVisible(false);  
        checkPoint.body.allowGravity = false;
        checkPoint.displayWidth = 10;
        checkPoint.displayHeight = Const.blank;

        const top = scene.physics.add.image(0, bottom.y - Const.blank - bottom.displayHeight,TextureKeys.Pipe)
            .setOrigin(0,0)
            .setFlipY(true)
        top.body.allowGravity = false;
        this.add(top)
        this.add(bottom)
        this.add(checkPoint)
        scene.physics.add.existing(this)
        this.obstacleGroup = scene.physics.add.group([bottom,top],{
            immovable: false  ,  
            allowGravity: false
        })
        const body = this.body as Phaser.Physics.Arcade.Body
        body.allowGravity = false;
        body.setSize(10,Const.blank);
        body.setOffset(bottom.displayWidth -10,bottom.y - Const.blank)
    }
}