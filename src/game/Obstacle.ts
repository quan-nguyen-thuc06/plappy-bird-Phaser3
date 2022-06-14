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
        this.checkPoint = scene.physics.add.image(bottom.displayWidth,bottom.y - Const.blank - bottom.displayHeight, TextureKeys.Pipe)
            .setOrigin(0,0)
            .setVisible(false)
        this.checkPoint.displayWidth = 10;
        this.checkPoint.displayHeight = bottom.displayHeight*2 + Const.blank;

        const top = scene.physics.add.image(0, bottom.y - Const.blank - bottom.displayHeight,TextureKeys.Pipe)
            .setOrigin(0,0)
            .setFlipY(true)
        top.setDisplaySize(Const.pipeWidth, Const.pipeHeight);
    
        this.add(top)
        this.add(bottom)
        this.add(this.checkPoint)
        this.obstacleGroup = scene.physics.add.group([bottom,top],{
            allowGravity: false
        })
        // this.obstacleGroup.getChildren()[0].destroy();
        console.log("0000", this.obstacleGroup.getChildren()[0])
        top.setPushable(true)
    }

    public getObstacleGroup(): Phaser.Physics.Arcade.Group{
        return this.obstacleGroup;
    }

    public getCheckPoint(): Phaser.GameObjects.Image{
        return this.checkPoint;
    }
}