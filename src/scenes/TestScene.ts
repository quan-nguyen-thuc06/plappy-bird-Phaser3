import Phaser from "phaser";
import AnimationKeys from "~/consts/AnimationKeys";
import Const from "~/consts/Const";
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";
import Virus from "~/game/Virus";

export default class TestScene extends Phaser.Scene{
    private virus!: Virus;
    constructor(){
        super(SceneKeys.TestScene);
    }
    create(){
        this.add.tileSprite(0, 0, Const.scene.width, Const.scene.height, TextureKeys.Background)
            .setOrigin(0)
        this.add.tileSprite(0, 500, Const.scene.width, Const.scene.height, TextureKeys.Ground)
            .setOrigin(0)
        this.virus = new Virus(this, Const.scene.width*0.5, Const.scene.height*0.5);
        this.add.existing(this.virus)

    }

    update(time: number, delta: number): void {
        this.virus.setPosition(100,100);
    }
}