import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKeys";

export default class Mage extends Phaser.GameObjects.Container{
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);
        var mage = this.scene.physics.add.sprite(0,0,TextureKeys.Mage)
        .setOrigin(0.5,0.5);
    }
}