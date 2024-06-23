//Variables - are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

// These variables will be used to monitor if the user already won in the value of 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//declaring variable used for touch input
let startY = 0
let startX = 0

// Function are callable programmed tasks

// Create function to set the game board
// setGame() function will be used to set the game board
function setGame(){	
	board = [
		[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// This is to create a tile through creating div elements
			let tile = document.createElement("div");

			// Each tile will have an id based on its row position and column position. 
            // Imagine students in a room who are given an id, but their id number is based on their seat row and column position.
			tile.id = r.toString() + "-" + c.toString();

			// Get the number of a tile from a backend board
			let num = board[r][c];

			// Use the number to update the tile's appearance through updateTile() function
			updateTile(tile, num);

			// Add the created tile with id to the frontend game board container.
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}

//this func is to update the appearance of the tile based on its number
function updateTile(tile, num){

    tile.innerText= "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
	setGame();
}

function handleSlide(e){
	console.log(e.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
		
		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight") {
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp") {
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown") {
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		checkWin();
	}, 500);
	

	if(hasLost() == true){
		setTimeout(() => {
			alert("Game Over! Sad :( You have lost the game. Game will restart");
			alert("Click any arrow key to restart");
			restartGame();
		}, 100)
		// setTimeout is used to delay the execution of the code inside the arrow function 
	}
}
document.addEventListener("keydown", handleSlide);

//removes the zeroes from the row/col
function filterZero(row){
	return row.filter(num => num != 0);
}

//slide function is the one merging the adjacent tiles
function slide(row) {

	// [0, 2, 0, 2]
	row = filterZero(row); // this will remove the zero

	for(let i = 0; i < row.length - 1; i++){
		if(row[i] == row[i+1]){ //checks if a tile is equal to its adjacent tile
		row[i] *= 2; //merge doubles the first tile to merge
					 // [4, 2]
		row[i + 1] = 0; // [4, 0]

		// this adds the merged tile value to the scoreboard.
		score += row[i];
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0); // [4, 0, 0, 0]
	}
	return row;
}

function slideLeft() {
	for(let r = 0; r < rows; r++){
        let row = board[r];

        // Line for animation
        // These docs the orig position of the tiles before sliding
        let originalRow = row.slice();
        
        row = slide(row); // We used the slide function, so that the slide function will merge the adjacent tiles.
        board[r] = row;
        
        // After merging, the position and the value of the tiles might change, thus it follows
        //that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // This Line for animation
            if(originalRow[c] !== num && num !== 0){ // if the original tile is not equal
            	//to the current tile, let's apply animation
            	tile.style.animation = "slide-from-right 0.3s"	
            	
            	// remove the animation class after the animation is
            	setTimeout(() => {
            		tile.style.animation = "";	
            	}, 300)
            }
      		updateTile(tile, num);
        }
    }
}

function slideRight() {
	for(let r = 0; r < rows; r++){
        let row = board[r];
        // Line for animation
        // These docs the orig position of the tiles before sliding
        let originalRow = row.slice();

        row.reverse();
        row = slide(row); //we used the slide func, so that the slide function 
            			  //will merge the adjacent tiles.
        row.reverse();
        board[r] = row;
        
        // After merging, the position and the value of the tiles might change, thus it follows
        //that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
           
            // This Line for animation
            if(originalRow[c] !== num && num !== 0){ // if the original tile is not equal
            	//to the current tile, let's apply animation
            	tile.style.animation = "slide-from-left 0.3s"	
            	
            	// remove the animation class after the animation is
            	setTimeout(() => {
            		tile.style.animation = "";	
            	}, 300)
            }
            updateTile(tile, num);
        }
    }
}

function slideUp(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
	
        // Line for animation
        // These docs the orig position of the tiles before sliding
        let originalCol = col.slice();
		
		col = slide(col);

       	// This will record the current position of the tiles that we have changed
        let changedIndices = []
        for (let r = 0; r < rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }
		
        // After merging, the position and the value of the tiles might change, thus it follows
        //that the id, number, color of the tile must be changed.

        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            
            // This Line for animation
            if(changedIndices.includes(r) && num !== 0){ // if the original tile is not equal
            	//to the current tile, let's apply animation
            	tile.style.animation = "slide-from-bottom 0.3s"	 //applies animation
            	
            	// remove the animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";	
            	}, 300)
            }
            updateTile(tile, num);
        }
	}
}

function slideDown(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// Line for animation
        // These docs the orig position of the tiles before sliding
        let originalCol = col.slice();
		
		col.reverse();
		col = slide(col);
		col.reverse();

		// This will record the current position of the tiles that we have changed
        let changedIndices = []
        for (let r = 0; r < rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }
        
        // After merging, the position and the value of the tiles might change, thus it follows
        //that the id, number, color of the tile must be changed.

        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            // This Line for animation
            if(changedIndices.includes(r) && num !== 0){ // if the original tile is not equal
            	//to the current tile, let's apply animation
            	tile.style.animation = "slide-from-top 0.3s"	 //applies animation
            	
            	// remove the animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";	
            	}, 300)
            }
            updateTile(tile, num);
        }
	}
}

// This func checks our board if there is an empty tile
function hasEmptyTile() {
	for (let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board [r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}

	// These next codes is for generating the random 2
	let found = false;

	while(found == false){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if (board[r][c] == 0){
			// Generate new tile
			board[r][c] = 2;
		let tile = document.getElementById(r.toString() + "-" + c.toString());
		tile.innerText = "2";
		tile.classList.add("x2");
		found = true;
		}
	}
}

function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if (board[r][c] == 2048 && is2048Exist == false) {
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 && is4096Exist == false) {
				alert("You are unstoppabble at 4096");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 && is8192Exist == false) {
				alert("Victory! You have reached 8192!");
				is8192Exist = true;
			}
		}
	}
}

// this func will check if there is still an empty tile (meaning, there is still a possible move and it will also check if there is a same tile value adjacent (beside / side by side / adjacent to each other, meaning, there is still a possible move).

function hasLost(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			
			// This code will check if there is a tile that equal to zero (meaning, empty tile)
			if(board[r][c] === 0) {
				return false;
			}

			const currentTile = board[r][c];

			// This code will check if there are a two adjacent tiles
			if(
				// Check current tile if it has possible merge to its left OR
				r > 0 && board[r-1][c] === currentTile ||

				// Check current tile if it has possible merge to its right
				r < rows - 1 && board[r + 1][c] === currentTile ||

				// Check current tile if it has possible merge to its left OR
				c > 0 && board[r][c-1] === currentTile ||			

				// Check current tile if it has possible merge to its right
				c < columns - 1 && board[r][c+1] === currentTile
				){

				// If we found an adjacent tile with the same value as the current tile, false, the user has not lost
				return false;
			}
		}
	}
	// No empty tile and no possible move
	return true;
}

function restartGame(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			board[r][c] = 0;
		}
	}
	score = 0
	setTwo();
}

// This code will listen when we touch the screen and assigns the x coordinates of that touch
// Inputs the x coordinate value to the startX 
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	// To disable scrolling feature
	e.preventDefault();
}, {passive: false}) // Use passive property to make sure that the preventDefault() will work

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
    	 // Vertical swipe
        if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}
	document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart"); 
	    }, 100);  
	}
})

