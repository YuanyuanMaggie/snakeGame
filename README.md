# Snake Game

- Demon link: [http://yuanyuanli.me/snakeGame/](http://yuanyuanli.me/snakeGame/)
- Github Repo: [https://github.com/YuanyuanMaggie/snakeGame](https://github.com/YuanyuanMaggie/snakeGame)

This is the simple javascript game for the classic arcade game in which a player controls a snake.

## Play instructions

* Use your arrow keys to control the moving sn
* Try to avoid the snake to collide with itself or a wall, the game would end. 


## Library use instructions

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