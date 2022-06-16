import Phaser from 'phaser'
import Const from './consts/Const'

import PlayScene from './scenes/Game'
import GameOver from './scenes/GameOver'
import Preloader from './scenes/Preloader'
import ProgressBar from './scenes/ProgressBar'
import Start from './scenes/Start'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: Const.scene.width,
	height: Const.scene.height ,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			// debug: true 
		}
	},
	scene: [ Preloader,Start,PlayScene,GameOver, ProgressBar]
}

export default new Phaser.Game(config)
