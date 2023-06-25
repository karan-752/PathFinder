/*
Multiple obstacles in single click;
Custom Alert;
*/

var onloadWorking = false;
var setSource = false;
var setTarget = false;
var setObstacles = false;
var choosenSource = [-1, -1];
var choosenTarget = [-1, -1];
var choosenObstacles = [];
var delayInMilliseconds = 10000;

function makeGrid() {
    let table = document.getElementById("clickable-grid");

    if(!onloadWorking) {
        for(var ind = table.rows.length - 1; ind >= 0; ind--) {
            table.deleteRow("row" + ind);
        }
    }

    table.addEventListener("click", function(event) {
        var choosenRow = event.target.parentNode.rowIndex;
        var choosenCol = event.target.cellIndex;

        if(event.target.tagName === "TD") {
            if(setSource) {
                setSourceNumber(choosenRow, choosenCol);
                setSource = false;
            }
            else if(setTarget) {
                setTargetNumber(choosenRow, choosenCol);
                setTarget = false;
            }
            else if(setObstacles) {
                addObstacle(choosenRow, choosenCol);
                setObstacles = false;
            }
        }
    }); 

    for(let ind1 = 0; ind1 < document.getElementById("row-range").value; ind1++) {
        let addRow = document.createElement("tr");
        addRow.id = "row" + ind1;

        table.appendChild(addRow);
        let currRow = document.getElementById("row" + ind1);

        for(let ind2 = 0; ind2 < document.getElementById("col-range").value; ind2++) {
            let curCell = document.createElement("td");
            curCell.id = "" + ind1 + ind2;
            curCell.style.backgroundColor = "black";
            currRow.appendChild(curCell);
        }
    }
}

window.onload = function() {
    onloadWorking = true;
    this.makeGrid();
    onloadWorking = false;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("main-btn-plt").style.display = "block";
    document.getElementById("save-btn-plt").style.display = "none";
});

function changeGridSize() {
    document.getElementById("main-btn-plt").style.display = "none";
    document.getElementById("save-btn-plt").style.display = "block";
}

function chooseSource() {
    this.setSource = true;
    this.setTarget = false;
    this.setObstacles = false;
}

function setSourceNumber(choosenRow, choosenCol) {
    if(choosenSource[0] != -1 && choosenSource[1] != -1) {
        if(choosenSource[0] == choosenRow && choosenSource[1] == choosenCol){
            var choosenCell = document.getElementById("" + choosenRow + choosenCol);
            choosenCell.style.backgroundColor = "black";

            choosenSource[0] = -1;
            choosenSource[1] = -1;
        }else {
            var prevCell = document.getElementById("" + choosenSource[0] + choosenSource[1]);
            prevCell.style.backgroundColor = "black";

            var choosenCell = document.getElementById("" + choosenRow + choosenCol);
            choosenCell.style.backgroundColor = "blue";

            choosenSource[0] = choosenRow;
            choosenSource[1] = choosenCol;
        }
    }
    else {
        var choosenCell = document.getElementById("" + choosenRow + choosenCol);
        choosenCell.style.backgroundColor = "blue";

        choosenSource[0] = choosenRow;
        choosenSource[1] = choosenCol;
    }
}

function chooseTarget() {
    this.setSource = false;
    this.setTarget = true;
    this.setObstacles = false;
}

function setTargetNumber(choosenRow, choosenCol) {
    if(choosenTarget[0] != -1 && choosenTarget[1] != -1) {
        if(choosenTarget[0] == choosenRow && choosenTarget[1] == choosenCol){
            var choosenCell = document.getElementById("" + choosenRow + choosenCol);
            choosenCell.style.backgroundColor = "black";

            choosenTarget[0] = -1;
            choosenTarget[1] = -1;
        }else {
            var prevCell = document.getElementById("" + choosenTarget[0] + choosenTarget[1]);
            prevCell.style.backgroundColor = "black";

            var choosenCell = document.getElementById("" + choosenRow + choosenCol);
            choosenCell.style.backgroundColor = "turquoise";

            choosenTarget[0] = choosenRow;
            choosenTarget[1] = choosenCol;
        }
    }
    else {
        var choosenCell = document.getElementById("" + choosenRow + choosenCol);
        choosenCell.style.backgroundColor = "turquoise";

        choosenTarget[0] = choosenRow;
        choosenTarget[1] = choosenCol;
    }
}

function chooseObstacle() {
    this.setSource = false;
    this.setTarget = false;
    this.setObstacles = true;
}

function addObstacle(choosenRow, choosenCol) {
    var coOrd = {choosenRow, choosenCol};

    if(choosenObstacles.some(obstacle => ((obstacle.choosenRow == choosenRow) && (obstacle.choosenCol == choosenCol)))) {
        choosenObstacles.splice(choosenObstacles.indexOf(coOrd), 1);
        var choosenCell = document.getElementById("" + choosenRow + choosenCol);
        choosenCell.style.backgroundColor = "black";
    }else{
        choosenObstacles.push(coOrd);
        var choosenCell = document.getElementById("" + choosenRow + choosenCol);
        choosenCell.style.backgroundColor = "red";
    }
}

function resetGrid() {
    this.setSource = false;
    this.setTarget = false;
    this.setObstacles = false;
    this.choosenSource = [-1, -1];
    this.choosenTarget = [-1, -1];
    this.choosenObstacles = [];
    this.makeGrid();
}

function findPath() {
    if(choosenSource[0] == -1 || choosenSource[1] == -1) {
        alert("Select a Source");
        return;
    }
    if(choosenTarget[0] == -1 || choosenTarget[1] == -1) {
        alert("Select a Target");
        return;
    }
    if((choosenSource[0] == choosenTarget[0]) && (choosenSource[1] == choosenTarget[1])) {
        alert("Same Source and Target");
        return;
    }

    let targetFound = false;
    let gridRow = document.getElementById("row-range").value;
    let gridCol = document.getElementById("col-range").value;
    
    let que = [];
    const visited = new Set();
    const obstacleSet = new Set();
    const parent = [];

    que.push(choosenSource);

    for(const obs of choosenObstacles) {
        obstacleSet.add((obs.choosenRow + "|" + obs.choosenCol));
    }

    for(var ind1 = 0; ind1 < gridRow; ind1++) {
        parent.push([]);

        for(var ind2 = 0; ind2 < gridCol; ind2++) {
            parent[ind1].push([-1, -1]);
        }
    }

    while(que.length && !targetFound) {
        const curNode = que.shift();
        const curRow = curNode[0];
        const curCol = curNode[1];
        
        if(!visited.has(("" + curRow + "|" + curCol))) {
            visited.add(("" + curRow + "|" + curCol));
            
            if(curRow - 1 >= 0 && !visited.has(("" + (curRow - 1) + "|" + curCol)) && !obstacleSet.has(("" + (curRow - 1) + "|" + curCol))) {
                que.push([curRow - 1, curCol]);
                parent[curRow - 1][curCol] = curNode;

                if(curRow - 1 == choosenTarget[0] && curCol == choosenTarget[1]) {
                    targetFound = true;
                    this.enlightenPath(parent);
                    break;
                }
                
                setTimeout(function() {
                    console.log("");
                }, delayInMilliseconds);

                document.getElementById("" + (curRow - 1) + curCol).style.backgroundColor = "yellow";
            }
            
            if(curCol + 1 < gridCol && !visited.has(("" + curRow + "|" + (curCol + 1))) && !obstacleSet.has(("" + curRow + "|" + (curCol + 1)))) {
                que.push([curRow, curCol + 1]);
                parent[curRow][curCol + 1] = curNode;

                if(curRow == choosenTarget[0] && curCol + 1 == choosenTarget[1]) {
                    targetFound = true;
                    this.enlightenPath(parent);
                    break;
                }

                setTimeout(function() {
                    console.log("");
                }, delayInMilliseconds);

                document.getElementById("" + curRow + (curCol + 1)).style.backgroundColor = "yellow";
            }

            if(curRow + 1 < gridRow && !visited.has(("" + (curRow + 1) + "|" + curCol)) && !obstacleSet.has(("" + (curRow + 1) + "|" + curCol))) {
                que.push([curRow + 1, curCol]);
                parent[curRow + 1][curCol] = curNode;

                if(curRow + 1 == choosenTarget[0] && curCol == choosenTarget[1]) {
                    targetFound = true;
                    this.enlightenPath(parent);
                    break;
                }

                setTimeout(function() {
                    console.log("");
                }, delayInMilliseconds);

                document.getElementById("" + (curRow + 1) + curCol).style.backgroundColor = "yellow";
            }

            if(curCol - 1 >= 0 && !visited.has(("" + curRow + "|" + (curCol - 1))) && !obstacleSet.has(("" + curRow + "|" + (curCol - 1)))) {
                que.push([curRow, curCol - 1]);
                parent[curRow][curCol - 1] = curNode;

                if(curRow == choosenTarget[0] && curCol - 1 == choosenTarget[1]) {
                    targetFound = true;
                    this.enlightenPath(parent);
                    break;
                }

                setTimeout(function() {
                    console.log("");
                }, delayInMilliseconds);

                document.getElementById("" + curRow + (curCol - 1)).style.backgroundColor = "yellow";
            }
        }
    }
}

function enlightenPath(parent) {
    var curRow = choosenTarget[0];
    var curCol = choosenTarget[1];

    while((curRow != -1 && curCol != -1)) {
        var newRow = parent[curRow][curCol][0];
        var newCol = parent[curRow][curCol][1];

        if(newRow == choosenSource[0] && newCol == choosenSource[1]) {
            break;
        }

        setTimeout(function() {
            console.log("");
        }, delayInMilliseconds);

        document.getElementById("" + newRow + newCol).style.backgroundColor = "green";

        curRow = newRow;
        curCol = newCol;
    }
}

function goRandom() {
    this.resetGrid();
    let gridRow = document.getElementById("row-range").value;
    let gridCol = document.getElementById("col-range").value;
    let cellCount = gridRow * gridCol;

    for(var ind = 0; ind < Math.floor(Math.random() * cellCount); ind++) {
        this.addObstacle(Math.floor(Math.random() * gridRow), Math.floor(Math.random() * gridCol));
    }

    while(this.choosenSource[0] == -1 || this.choosenSource[1] == -1) {
        var randRow = Math.floor(Math.random() * gridRow);
        var randCol = Math.floor(Math.random() * gridCol);
        
        if(!choosenObstacles.some(obstacle => ((obstacle.choosenRow == randRow) && (obstacle.choosenCol == randCol)))) {
            this.setSourceNumber(randRow, randCol);
        }
    }

    while(this.choosenTarget[0] == -1 || this.choosenTarget[1] == -1) {
        var randRow = Math.floor(Math.random() * gridRow);
        var randCol = Math.floor(Math.random() * gridCol);
        
        if(!choosenObstacles.some(obstacle => ((obstacle.choosenRow == randRow) && (obstacle.choosenCol == randCol)))) {
            this.setTargetNumber(randRow, randCol);
        }
    }
}

function saveGridSize() {
    this.makeGrid();

    document.getElementById("main-btn-plt").style.display = "block";
    document.getElementById("save-btn-plt").style.display = "none";
}