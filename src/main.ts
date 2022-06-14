import Phaser from 'phaser'

import PlayScene from './scenes/Game'
import GameOver from './scenes/GameOver'
import Preloader from './scenes/Preloader'
import Start from './scenes/Start'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			// debug: true  
		}
	},
	scene: [ Preloader,Start,PlayScene,GameOver]
}

export default new Phaser.Game(config)
