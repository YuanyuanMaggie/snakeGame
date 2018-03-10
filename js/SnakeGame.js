/**
* SnakeGame class has dependency on constant.js.
* So if you want to use this class, don't forget to include constant.js first
*/

/**
* @class SnakeGame
*/
class SnakeGame {

    /**
    * @method constructor
    * @param {Object} config The object to init the snake game. gameAreaId is required.
    * options: brick_width - basic width of brick, default is 30(px).
    *          snake_speed - moving speed of snake, default is 300(ms).
    */
    constructor(config){
        // If the param config has options properties, options properties will override default config value
        const { gameAreaId, brick_width, snake_speed } = {...DEFAULT_CONFIG, ...config};
        if(!gameAreaId) return;

        // Initial custom config
        this.brickWidth = brick_width;
        this.snakeSpeed = snake_speed;

        // We also need to bind listening event here, or we can't do removeEventListener
        this.keyDownEventListener = this.keyDownEventListener.bind(this); 
        this.initGame(gameAreaId);
    }

    /**
    * @method initGame Init game setup
    * @param {String} gameAreaId Element query Id to find the game area.
    */
    initGame(gameAreaId){
        this.containerElem = document.getElementById(gameAreaId);
        if(!this.containerElem) return;
        this.setupVariables(); // init some basic resuable variables
        this.initGameArea(gameAreaId); // init game area including wall
        this.initPlayground(); // init playground without wall
        this.reset(); // init snake, food and events which need to be reset when game restart
    }

    /**
    * @method setupPlayground Init some basic resuable variables
    */
    setupVariables(){
        this.wallKey = WALL_KEY;
        this.foodKey = FOOD_KEY;
        this.snakeKey = SNAKE_KEY;
        this.direction_dic = DIRECTION_DIC;
        this.fullWidth = window.innerWidth - (window.innerWidth % this.brickWidth);
        this.fullHeight = window.innerHeight - (window.innerHeight % this.brickWidth);
    }

    /**
    * @method initGameArea // Init game area including wall and instructions
    * @param {String} gameAreaId Element query Id to find the game area.
    */
    initGameArea(gameAreaId){
        this.containerElem.classList.add("game-container");
        this.containerElem.style.width = this.fullWidth + "px";
        this.containerElem.style.height = this.fullHeight + "px";
        // // Init instruction
        // this.instructions = document.createElement('div')
    }

    /**
    * @method initPlayground Create playground element, this is the place where snake can move
    */
    initPlayground(){
        this.playgroundElem = document.createElement('div');
        this.playgroundElem.classList.add("playground");
        this.playgroundElem.style.left = this.brickWidth + "px";
        this.playgroundElem.style.top = this.brickWidth + "px";
        this.playgroundElem.style.width = this.fullWidth - this.brickWidth * 2 + "px";
        this.playgroundElem.style.height = this.fullHeight - this.brickWidth * 2 + "px";
        this.containerElem.appendChild(this.playgroundElem);
    }

    /**
    * @method reset Init snake, food and events which need to be reset when game restart
    */
    reset(){
        this.initCache();
        this.initSnake();
        this.initFood();
        this.initEvents();
    }
    
    /**
    * @method initCache Set a 2D array chache so we can know current value quickly
    */
    initCache(){
        this.chache = [];
        const maxRow = Math.floor(this.fullHeight / this.brickWidth);
        const maxCol = Math.floor(this.fullWidth / this.brickWidth);
        for(let row = 0; row < maxRow; row++){
            this.chache.push([]);
            for(let col = 0; col < maxCol; col++){
                // If it's the wall, we will set the value to be wall key
                if(row === 0 || row === maxRow - 1 || col === 0 || col === maxCol - 1){
                    this.chache[row][col] = this.wallKey;
                } else {
                    this.chache[row][col] = 0;
                }
            }
        }
    }

    /**
    * @method initSnake Clean all snake nodes and also init first snake node
    */
    initSnake(){
        this.cleanChildren('game-snake');
        const snakeElem = this.createSnakeElem(1, 1);
        this.snakeHead = snakeElem;
        this.snakeTail = snakeElem;
        // Make the snake node like a single linkedlist which know it's prev node.
        snakeElem.prev = snakeElem;
        this.snakeLength = 1;
        this.score = 0;
    }

    /**
    * @method cleanChildren This helper function will remove all nodes with same className
    * @param {String} className Pass a class name want to be removed.
    */
    cleanChildren(className){
        const removeElems = this.containerElem.getElementsByClassName(className);
        while(removeElems[0]){
            removeElems[0].parentNode.removeChild(removeElems[0]);
        }
    }

    /**
    * @method createSnakeElem Create a new snake element at the row and col
    * @param {Number} row Pass a class name want to be removed.
    * @param {Number} col Pass a class name want to be removed.
    * @return {Object} snake.elem is DOM Element. 
    */
    createSnakeElem(row, col){
        if(!this.chache) return;
        let snake= {};
        snake.row = row;
        snake.col = col;
        snake.elem = document.createElement('div');
        snake.elem.classList.add("game-snake");
        snake.elem.style.width = this.brickWidth + "px";
        snake.elem.style.height = this.brickWidth + "px";
        snake.elem.style.left = col * this.brickWidth + "px";
        snake.elem.style.top = row * this.brickWidth + "px";
        this.chache[row][col] = this.snakeKey;
        this.containerElem.appendChild(snake.elem);
        return snake;
    }

    /**
    * @method initFood Clean all food nodes and also init first food node
    */
    initFood(){
        this.cleanChildren('game-food');
        this.foodElem = document.createElement('div');
        this.foodElem.classList.add("game-food");
        this.foodElem.style.width = this.brickWidth + "px";
        this.foodElem.style.height = this.brickWidth + "px";
        // Before we know the position, we hide the food brick;
        this.foodElem.style.left = "-1000px";
        this.foodElem.style.top ="-1000px";
        this.containerElem.appendChild(this.foodElem);
        this.placeRandomFood();
    }

    /**
    * @method placeRandomFood Clean all food nodes and also init first food node
    */
    placeRandomFood(){
        if(!this.chache || !this.foodElem) return;
        
        // Clear previous food in cache
        if(this.foodRow && this.foodCol){
            this.chache[this.foodRow][this.foodCol] = 0
        }

        // We try 1000 times and if we still can't find the place to move food, we will give up
        for(let i = 0; i < 1000; i++){
            const newFoodRow = this.getRandomNum(1, this.chache.length - 2);
            const newFoodCol = this.getRandomNum(1, this.chache[0].length - 2);
            if(this.chache[newFoodRow][newFoodCol] === 0){
                this.foodRow = newFoodRow;
                this.foodCol = newFoodCol;
                this.chache[newFoodRow][newFoodCol] = this.foodKey;
                this.foodElem.style.left = newFoodCol * this.brickWidth + "px";
                this.foodElem.style.top = newFoodRow * this.brickWidth + "px";
                return;
            }
        }
        
    }

    /**
    * @method getRandomNum A helper function to find random number in range
    */
    getRandomNum(min, max){
        return Math.floor(Math.random()*(max - min + 1)) + min; 
    }

    /**
    * @method initEvents Initial keydown listen event
    */
    initEvents(){
        this.eventQueue = [];
        document.addEventListener('keydown', this.keyDownEventListener);
    }

    /**
    * @method keyDownEventListener A listener fuction can be added into document and also be removed
    * @param {Object} event We need to use event.keyCode to distinguish which arrow key was pressed
    */
    keyDownEventListener(event){
        // Only track left arrow || right arrow || top arrow || down arrow
        if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){
                event.preventDefault();
                this.eventQueue.push(event.keyCode);
                // clear previous timeout event
                if(this.timeoutEvent){
                    clearTimeout(this.timeoutEvent);
                }
                this.snakeMove();
        }
    }

    /**
    * @method snakeMove make th snake move
    */
    snakeMove(){
        const dic = this.direction_dic;
        if(this.eventQueue.length > 0){
            this.currentDirection = this.eventQueue.shift();
        }
        
        const nextNode = this.snakeHead;
        const nextRow = nextNode.row + dic[this.currentDirection].y;
        const nextCol = nextNode.col + dic[this.currentDirection].x;
        // if the next block's value is 0, which is safe to move
        if(this.chache[nextRow][nextCol] === 0){
            this.snakeSimpleMove(nextRow, nextCol);
            this.timeoutEvent = setTimeout(this.snakeMove.bind(this), this.snakeSpeed);
        // if the next block's value is food key, which will trigger replace food and snake grow
        } else if (this.chache[nextRow][nextCol] === this.foodKey){
            this.score++;
            this.placeRandomFood();
            this.snakeEatenMove(nextRow, nextCol);
            this.timeoutEvent = setTimeout(this.snakeMove.bind(this), this.snakeSpeed);
        // else the snake might hit the wall or eat itself. then the game over and restart again
        } else {
            document.removeEventListener('keydown', this.keyDownEventListener);
            alert(`You died!!!! current score is ${this.score}. Good job!`)
            this.reset();
        }
    }

    /**
    * @method snakeSimpleMove Move the tail node to the next block, so the snake can move 1 block
    * @param {Number} nextRow The row index of next block
    * @param {Number} nextCol The column index of next block
    */
    snakeSimpleMove(nextRow, nextCol){
        const moveElem = this.snakeTail;
        const newTail = this.snakeTail.prev;

        // Clear snake tail cache
        this.chache[moveElem.row][moveElem.col] = 0;
        moveElem.row = nextRow;
        moveElem.col = nextCol;
        moveElem.elem.style.top = nextRow * this.brickWidth + "px";
        moveElem.elem.style.left = nextCol * this.brickWidth + "px";
        this.snakeTail = newTail;
        this.snakeHead.prev = moveElem;
        this.snakeHead = moveElem;
        // Update chache
        this.chache[nextRow][nextCol] = this.snakeKey;
    }

    /**
    * @method snakeEatenMove When snake eats a food, it will growth a block at the food position
    * @param {Number} nextRow The row index of next block, also the row index of the food
    * @param {Number} nextCol The column index of next block, also the column index of the food
    */
    snakeEatenMove(nextRow, nextCol){
        const moveElem = this.createSnakeElem(nextRow, nextCol);
        this.snakeHead.prev = moveElem;
        this.snakeHead = moveElem; // move the head to the new element
    }
}