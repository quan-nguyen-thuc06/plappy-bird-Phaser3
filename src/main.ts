import Phaser from 'phaser'
import Const from './consts/Const'

import PlayScene from './scenes/Game'
import Preloader from './scenes/Preloader'
import Start from './scenes/Start'
import TestScene from './scenes/TestScene'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: Const.scene.width,
	height: Const.scene.height ,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true 
		}
	},
	scene: [ Preloader,Start,PlayScene,TestScene]
}

export default new Phaser.Game(config)
