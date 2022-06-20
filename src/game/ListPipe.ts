import Phaser from "phaser";
import Const from "~/consts/Const";
import TextureKeys from "~/consts/TextureKeys";

export default class ListPipe{
    private listPipe!: Phaser.GameObjects.Group;
    private checkPoints!: Phaser.GameObjects.Group;
    constructor(scene: Phaser.Scene){
        this.initListPipe(scene);
    }

    private initListPipe(scene: Phaser.Scene){
        this.listPipe = scene.physics.add.group();
        this.checkPoints = scene.physics.add.group();
        for (let i = 0; i < Const.numPipe;i++){
            let x = i*Const.distance + Const.pipeWidth + Const.scene.width *0.75 ;
            let y = Phaser.Math.Between(250 ,450) 
            var bottom = this.listPipe.create(x,y,TextureKeys.Pipe)
                .setDepth(1)
                .setOrigin(0)
                .setDisplaySize(Const.pipeWidth, Const.pipeHeight)
            bottom.body.setImmovable()
            var top = this.listPipe.create(x,bottom.y - Const.blank - bottom.displayHeight,TextureKeys.Pipe)
                .setDepth(1)
                .setOrigin(0)
                .setDisplaySize(Const.pipeWidth, Const.pipeHeight)
            top.setFlipY(true)
            top.body.setImmovable()
            this.checkPoints.create(x + bottom.displayWidth,0, TextureKeys.Pipe)
                .setOrigin(0,0)
                .setVisible(false)
                .setDisplaySize(10,bottom.displayHeight*2 + Const.blank)
        }
    }

    wrapPipe(){
        this.listPipe.getChildren().map((pipe,index) => {
            if(index%2 ===0){
                var pipeDownBody = pipe.body as Phaser.Physics.Arcade.Body;
                if(pipeDownBody.x < -100){
                    var preIndex = index -1;
                    if(preIndex<0) preIndex = this.listPipe.getChildren().length -1;
                    var prePipeBody = this.listPipe.getChildren()[preIndex].body as Phaser.Physics.Arcade.Body;
                    var pipeUpBody = this.listPipe.getChildren()[index+1].body as Phaser.Physics.Arcade.Body;
                    var checkPoist = this.checkPoints.getChildren()[index/2].body as Phaser.Physics.Arcade.Body;
                    pipeDownBody.x =  prePipeBody.x + Const.distance;
                    pipeUpBody.x =  prePipeBody.x + Const.distance;
                    checkPoist.x = pipeDownBody.x + Const.pipeWidth;
                }
            }
        })
    }

    getListPipe() {
        return this.listPipe;
    }

    getCheckPoists() {
        return this.checkPoints;
    }
}