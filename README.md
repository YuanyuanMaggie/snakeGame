# Snake Game

- Demon link: [http://yuanyuanli.me/snakeGame/](http://yuanyuanli.me/snakeGame/)
- Github Repo: [https://github.com/YuanyuanMaggie/snakeGame](https://github.com/YuanyuanMaggie/snakeGame)

This is the simple javascript game for the classic arcade game in which a player controls a snake.

## Play instructions

* Open index.html file with your browser or visit [http://yuanyuanli.me/snakeGame/](http://yuanyuanli.me/snakeGame/)
* Use your arrow keys to control the moving snake
* Try to avoid the snake to collide with itself or a wall, the game would end. 


## Library instructions

* `SnakeGame.js` has dependency on `constant.js`
* To make a new game, you can use SnakeGame class, gameAreaId is required, but brick_width and snake_speed are optional

```
new SnakeGame({
    gameAreaId: 'game-area',
})
```

Or you can override some custom config:

```

new SnakeGame({
    gameAreaId: 'game-area',
    brick_width: 20,
    snake_speed: 100
})

```

## How to improve it?
- Better playder instructions, for example, a modal pop up to give instruction when the game loaded. And another modal pop up if game over.
- Give player a control panel to pause the game, change speed and level
