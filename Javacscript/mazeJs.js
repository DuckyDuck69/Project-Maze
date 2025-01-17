const myCanvas = document.getElementById("maze");
const ctx = myCanvas.getContext("2d");
var collumns, rows;
var close = true;
var open = false;

let mazeGen;
let isRunning = true;  //animation
let paused = false;    //program is pause or not 

let size = 30;  
let difficulty = '1';

var stack=[];
var grid = [];

let lastFrame = 0; //time of the last frame
let fps = 100;
let frame = 1000/fps;

var current; //the current cell assign to a variable

var x_cor, y_cor;

document.addEventListener('DOMContentLoaded', function() {    //make sure DOM is loaded before update difficulty 
    const difficultySelect = document.querySelector('select[name="difficultyList"]');
    difficultySelect.addEventListener('change', function(e) {
        difficulty = e.target.value;
        updateDifficulty();
    });
    MoveTheBox();
});

function updateDifficulty(){
    switch(difficulty){
        case "1":
            size = 70;
            fps = 20;       
            break;
        case "2":
            size = 40;
            fps = 30;
            break;
        case "3":
            size = 30;
            fps = 50;
            break;
        case "4":
            size = 20;
            fps = 150;
            break;
    }
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height); 
    console.log(myCanvas.width);
    frame = 1000/fps;
    grid = [];
    stack = []
    current = null;
}

function doMaze(){
    isRunning = true;
    updateDifficulty()
    grid = [];
    stack = [];

    const devicePixelRatio = window.devicePixelRatio || 1; //get the ratio of any display 
    const displayWidth = 800;
    const displayHeight = 600;
    myCanvas.width = displayWidth * devicePixelRatio;  //canvas resolution 
    myCanvas.height = displayHeight * devicePixelRatio;
    myCanvas.style.width = displayWidth + 'px';  //scale canvas height + width 
    myCanvas.style.height = displayHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio); //scale according to the API value, in this case 2 
                                                   //so it scale by a value of 200%
    collumns= Math.floor(displayWidth/size);
    rows=Math.floor(displayHeight/size);

    ctx.lineWidth = Math.floor(2 * devicePixelRatio);    //improve line rendering
    ctx.strokeStyle = '#000000';
    ctx.imageSmoothingEnabled = false; //antialiasing

    for (var y =0; y < rows; y++){
        for (var x = 0; x < collumns; x++){ 
            var cell = new Cell(x,y);
            grid.push(cell);   //put the new objects in array grid, make them a Cell object
        }
    }
    current = grid[0];  //set initial cell
    draw();
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, size, size); 
    if(!loop()){
        StartPlaying();
        console.log('Pay');
    }
}


function draw(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    for(var i =0; i < grid.length; i++){
        grid[i].show();
    }
    current.visited = true;
    current.highlight();
    //Step 1: pick a random neighbor
    var nextCell = current.checkNeighbor();
    if(nextCell){
        nextCell.visited= true;
        //Step 2: push the current cell into the stack 
        stack.push(current);
        //Step 3: remove the wall between the current and the chose cell
        removeWalls(current, nextCell);
        //Step 4: mark the chosen cell the current and mark as visited
        current = nextCell;
    }else if (stack.length>0){
        current = stack.pop();
    }
    mazeGen = requestAnimationFrame(loop); 
}

function Cell(x, y){
    this.x = x;
    this.y = y;
    this.walls=[close, close, close, close]
    this.visited = false;

    this.highlight = function(){
        var x_coor = this.x * size;
        var y_coor = this.y * size;
        rectCurrent(x_coor, y_coor, size, size);
    }

    this.checkNeighbor = function(){
        var neighbor = [];

        var top = grid[index(x, y - 1)];       //top cell
        var right = grid[index(x + 1, y)];     //right cell
        var bottom = grid[index(x, y+1)];      //bottom cell
        var left = grid[index(x - 1, y)];      //left cell
        //check the neighbors of the cells
        if(top && !top.visited){
            neighbor.push(top);
        }
        if(right && !right.visited){
            neighbor.push(right);
        }
        if(bottom && !bottom.visited){
            neighbor.push(bottom);
        }
        if(left && !left.visited){
            neighbor.push(left);
        }

        if (neighbor.length > 0){
            var ran = Math.floor(Math.random() * neighbor.length);
            console.log(ran);
            return neighbor[ran];
        }else{
            return undefined;
        }
    }

    this.show = function() {
        var x_coor = this.x * size;
        var y_coor = this.y * size; 
        if(this.walls[0]){
            line(x_coor       , y_coor       , x_coor + size, y_coor);  //top
        }
        if(this.walls[1]){
            line(x_coor + size, y_coor       , x_coor + size, y_coor +size);  //right
        }
        if(this.walls[2]){
            line(x_coor + size, y_coor + size, x_coor       , y_coor + size);  //bottom
        }
        if(this.walls[3]){
            line(x_coor       , y_coor + size, x_coor       , y_coor);    //left
        }
        if(this.visited){
            rectVisited(x_coor, y_coor, size, size);
        }
    }
}   


function line(x1, y1, x2, y2) {
    x1 = Math.floor(x1) + 0.5;
    y1 = Math.floor(y1) + 0.5;
    x2 = Math.floor(x2) + 0.5;
    y2 = Math.floor(y2) + 0.5;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.stroke();
}

function rectVisited(x, y, width, height){
    ctx.fillStyle = 'yellow';
    ctx.fillRect(x, y, width, height); 
}

function rectCurrent(x, y, width, height){
    ctx.fillStyle = 'pink';
    ctx.fillRect(x, y, width, height); 
}

function rectPlaying(x, y, width, height){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    ctx.fillStyle = 'red';
    ctx.fillRect(x,y,width,height);
}

function index(x, y){
    if(x < 0 || y < 0 || x > collumns - 1 || y > rows - 1){   //if the cell is off the edge
        return -1; 
    }
    return x + y * collumns;
}

function loop(currentTime){ //the automatically value provided by requestAnimationFrame 
    if (!isRunning) return;  //stop if it is canceled
    if (currentTime - lastFrame >= frame){
        lastFrame = currentTime;   
        draw();
    }
    if (stack.length >= 0 || current.checkNeighbor()) {  //only if the maze is still generating that we continue drawing
        mazeGen = requestAnimationFrame(loop);
    }
    if(x_cor==0 && y_cor==0){ //stop drawing if the 
        isRunning = false;
    }
    else {
        drawBorder(); 
    }
}

function removeWalls(a,b){
    var x = a.x - b.x;
    if(x === -1){       //the chosen cell is the left of the current
        a.walls[1]=false;
        b.walls[3]=false;
    }else if(x === 1){  //vice versa
        a.walls[3]=false;
        b.walls[1]=false;
    }
    var y = a.y - b.y;
    if(y === -1){       //the chosen cell is below the current
        a.walls[2]=false;
        b.walls[0]=false;
    }else if (y === 1){  //vice versa
        a.walls[0]=false;
        b.walls[2]=false;
    }
}

function drawBorder(){  
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(2 * (window.devicePixelRatio || 1));
    ctx.rect(0, 0, myCanvas.width / (window.devicePixelRatio || 1), myCanvas.height / (window.devicePixelRatio || 1));
    ctx.stroke();
}

function stopGen(){
    isRunning = false;
    cancelAnimationFrame(mazeGen);
}

function resumeGen(){
    isRunning = true;
    mazeGen = requestAnimationFrame(loop);
}

function StartPlaying(){
    box = new Cell;
    var x_box = size /2;
    var y_box = size / 2;
    rectPlaying(x_box, y_box, size, size)
    MoveTheBox(box, x_box, y_box);
}

function MoveTheBox(a, x, y){
    //WASD to move and solve the maze
    window.addEventListener('keydown', (event)=>{
        switch (event.key){
            case 'w':
                console.log("w");
                if((y > 0 || y != null) && !a.walls[0]){      //going up
                        ctx.clearRect(x, y, size, size)
                        y -= size
                        a = grid[index(a.x, a.y -1)];         //update the cell 
                        rectPlaying(x, y, size, size);
                }
                else{
                    break;
                }
            case 'a':
                console.log("a");
                if((x > 0 || x!= null) && !a.walls[4]){  
                    ctx.clearRect(x, y, size, size)                        //going left
                    x -= size;
                    a = grid[index(a.x - 1, a.y)];
                    rectPlaying(x, y, size, size);
                }
                else{
                    break;
                }          
            case 's':
                console.log("s");
                if((y < myCanvas.height - size || y != null) && !a.walls[2]){     //going down
                        ctx.clearRect(x, y, size, size)
                        y += size
                        a = grid[index(a.x, a.y + 1)];    
                        rectPlaying(x, y, size, size);
                }else{
                    break;
                }
            case 'd':
                console.log("d");
                if((x < myCanvas.width - size || y != null) && !a.walls[1]){         //going right
                        ctx.clearRect(x, y, size, size)
                        x += size
                        a = grid[index(a.x + 1, a.y)];
                        rectPlaying(x, y, size, size);
                }else{
                    break;
                }
        }
    });
}