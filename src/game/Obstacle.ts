import Phaser from "phaser";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class Obstacle extends Phaser.GameObjects.Container{
    private obstacleGroup!: Phaser.Physics.Arcade.Group;
    private checkPoint!: Phaser.GameObjects.Image;
    bottom!: Phaser.GameObjects.Image;
    top!: Phaser.GameObjects.Image;
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);
        this.bottom = scene.physics.add.image(0,0, TextureKeys.Pipe)
            .setImmovable()
            .setOrigin(0,0);
        this.bottom.setDisplaySize(Const.pipeWidth, Const.pipeHeight);
        this.checkPoint = scene.physics.add.image(this.bottom.displayWidth,this.bottom.y - Const.blank - this.bottom.displayHeight, TextureKeys.Pipe)
            .setOrigin(0,0)
            .setVisible(false)
        this.checkPoint.displayWidth = 10;
        this.checkPoint.displayHeight = this.bottom.displayHeight*2 + Const.blank;

        this.top = scene.physics.add.image(0, this.bottom.y - Const.blank - this.bottom.displayHeight,TextureKeys.Pipe)
            .setImmovable()
            .setOrigin(0,0)
            .setFlipY(true)
        this.top.setDisplaySize(Const.pipeWidth, Const.pipeHeight);
    
        this.add(this.top)
        this.add(this.bottom)
        this.add(this.checkPoint)
        this.obstacleGroup = scene.physics.add.group([this.bottom,this.top],{
            allowGravity: false
        })
        // this.obstacleGroup.getChildren()[0].destroy();
    }

    public getObstacleGroup(): Phaser.Physics.Arcade.Group{
        return this.obstacleGroup;
    }

    public getCheckPoint(): Phaser.GameObjects.Image{
        return this.checkPoint;
    }
}