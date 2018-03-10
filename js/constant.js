
const DEFAULT_CONFIG = {
    brick_width: 30,
    snake_speed: 300,
}

const WALL_KEY = 1;
const FOOD_KEY = 2;
const SNAKE_KEY = 3;
const DIRECTION_DIC = {
    37: {
        x: -1,
        y: 0,
    },
    38: {
        x: 0,
        y: -1,
    },
    39: {
        x: 1,
        y: 0,
    },
    40: {
        x: 0,
        y: 1,
    },
}