let ANT_PROGRESS = null;
let ANT = "<div class='cell' style='background-image: radial-gradient(rgba(255,255,255,1), rgba(255,255,250,0.2), rgba(0,0,0,0))'></div>"
let current_position = null;
let previous_position = null;
let ant_counter = 0;

function add_ant() {
    remove_ant();
    ant_hover();
    set_inactive(["add_ant"]);
    let cells = document.getElementsByClassName("cell");
    for (let i=0; i<cells.length; i++) cells[i].onclick = function(){
        cells[i].innerHTML = ANT;        
        current_position = {
            "x": parseInt(get_cell_coordinates(cells[i].id).x),
            "y": parseInt(get_cell_coordinates(cells[i].id).y)
        }
        previous_position = {
            "x": current_position.x,
            "y": current_position.y - 1 
        }
        for (let i=0; i<cells.length; i++) cells[i].onclick = function(){
            change_state(get_cell_coordinates(cells[i].id).x, get_cell_coordinates(cells[i].id).y);
        };
        set_active(["start_ant", "pause_ant", "move_ant"]);
    };        
}

function remove_ant(){
    clearInterval(ANT_PROGRESS);
    let cells = document.getElementsByClassName("cell");
    for (let i=0; i<cells.length; i++) {
        cells[i].innerHTML = null;
    }
    current_position = null;
    previous_position = null;
    // cells[i].textContent = "";  TODO zjistit kde je mravenec a oddelat ho
}

function move_ant() {
    if (!current_position) return;
	let new_position = {
        "x": current_position.x,
        "y": current_position.y
    };
    let x = current_position.x;
    let y = current_position.y;
	if (ant_come_from() == "left" && cell_is_alive(x, y) ||
	    ant_come_from() == "right" && !cell_is_alive(x, y)) new_position.y = new_position.y+1 ; // todo check vypocet pozice
	if (ant_come_from() == "left" && !cell_is_alive(x, y) ||
	    ant_come_from() == "right" && cell_is_alive(x, y)) new_position.y = new_position.y-1 ;
	if (ant_come_from() == "top" && cell_is_alive(x, y) ||
	    ant_come_from() == "bottom" && !cell_is_alive(x, y)) new_position.x = new_position.x+1;
	if (ant_come_from() == "top" && !cell_is_alive(x, y) ||
	    ant_come_from() == "bottom" && cell_is_alive(x, y)) new_position.x = new_position.x-1;
    new_position = adjust_border_cells_coordinates(new_position.x, new_position.y);    
    get_cell(current_position.x, current_position.y).innerHTML = null;
    get_cell(new_position.x, new_position.y).innerHTML = ANT;
    change_state(x, y);
	previous_position = current_position;
	current_position = new_position;	
    ant_counter++;
    document.getElementById("ant_counter").textContent = ant_counter;
}

function ant_come_from(){
	if (previous_position.x < current_position.x) return "left";
	if (previous_position.x > current_position.x) return "right";
	if (previous_position.y < current_position.y) return "bottom";
	if (previous_position.y > current_position.y) return "top";
    console.log("exception") // TODO exception
}

function start_ant () {
    if (ANT_PROGRESS == null || ANT_PROGRESS == "paused")
        ANT_PROGRESS = setInterval(move_ant, INTERVAL)
    set_inactive(["init_default", "add_ant", "start_ant", "move_ant", "next_gen", "pause_gol", "stop_gol", "start_gol", "speed"]);
}

function pause_ant() {
    clearInterval(ANT_PROGRESS);
    ANT_PROGRESS = "paused";
    set_active(["init_default", "start_ant", "move_ant", "next_gen", "start_gol", "speed"]);
}

function ant_hover(){
    let cells = document.getElementsByClassName("cell");
    for (let i=0; i<cells.length; i++) {
        cells[i].onmouseenter = function(){cells[i].innerHTML = ANT};
        cells[i].onmouseleave = function(){cells[i].innerHTML = null};
        cells[i].onmousedown = function(){
            for (let q=0; q<cells.length; q++) {
                cells[q].onmouseenter = undefined;
                cells[q].onmouseleave = undefined;
                cells[q].onmousedown = undefined;
            }  
        };
    }
}

function get_cell_coordinates(cell_id) {
    return {
        "x": cell_id.split("x")[1].split("y")[0],
        "y": cell_id.split("x")[1].split("y")[1]
    }
}