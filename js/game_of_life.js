// Game of Life
const Y = 20;
const X = 33;
const DEAD_COLOR = "black"; // !attention: more complex colors will break functionality "linear-gradient(to top right, #111, #000)";
const ALIVE_COLOR = "darkorange"; // conic-gradient(darkorange, orange, darkorange)";
const INACTIVE_BUTTON_COLOR = "#444";
const ACTIVE_BUTTOM_COLOR = "linear-gradient(to top right, #222, #000)";
const SPEED_RANGE_COLOR = "linear-gradient(to right, yellow , red)";
let GAME_PROGRESS = null;
let INTERVAL = 200;
let generation = 0;

function init(){
    document.getElementById("speed").value = 600 - INTERVAL;
    document.getElementById("speed_display").textContent = 600 -INTERVAL;
    document.getElementById("generation").textContent = generation;
    document.getElementById("ant_counter").textContent = ant_counter;
    create_grid();
    let buttons = document.getElementsByTagName("button");
    for (let i=0; i<buttons.length; i++) buttons[i].style.background = ACTIVE_BUTTOM_COLOR;
    document.getElementById("speed").style.background =  SPEED_RANGE_COLOR;
    set_inactive(["start_ant", "pause_ant", "pause_gol", "stop_gol", "move_ant"])
    switch_languages();
}

function create_grid(){
    for (let y=Y; y>=1; y--){
        for (let x=1; x<=X; x++){
            create_cell(x, y);
            set_dead(x, y);
        }
    }
}

function get_cell(x, y){
    return document.getElementById(get_cell_id(x,y));
}

function get_cell_id(x, y){
    return "x" + x + "y" + y;
}

function create_cell(x, y) {
    let grid = document.getElementById("grid");
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell")
    cell.setAttribute("id", get_cell_id(x,y))
    // cell.textContent = get_cell_id(x,y); // for debuging   
    cell.onclick = function(){change_state(x, y)};
    grid.appendChild(cell);
}

function change_state(x, y) {
    cell = get_cell(x, y);
    if (GAME_PROGRESS == null){
        if (cell_is_alive(x, y)) set_dead(x, y);
        else set_live(x, y);
    }
}

function set_live(x, y){
    let cell = get_cell(x, y);
    cell.style.background = ALIVE_COLOR;
}

function set_dead(x, y){
    let cell = get_cell(x, y);
    cell.style.background = DEAD_COLOR;
}

// cell marked like this will live in next generation
function set_live_mark(x, y) {
    let cell = get_cell(x, y);
    cell.classList.add("live_mark");
}

// cell marked like this will die in next generation
function set_dead_mark(x, y) {
    let cell = get_cell(x, y);
    cell.classList.add("dead_mark");
}

function reset_marks(){
    for (let y=Y; y>=1; y--){
        for (let x=1; x<=X; x++){
            get_cell(x, y).classList.remove("live_mark");
            get_cell(x, y).classList.remove("dead_mark");
        }
    }
}

function cell_is_alive(x, y){
    let coordinates_adjusted = adjust_border_cells_coordinates(x, y);
    let cell = get_cell(coordinates_adjusted.x, coordinates_adjusted.y);
    if (cell.style.background == ALIVE_COLOR) return true;
    else if (cell.style.background == DEAD_COLOR) return false;
    console.log("Unknown cell status");
}

// if testing cell behind borders, cell on the other side of grid will be tested
function adjust_border_cells_coordinates(x, y){
    let x_adjusted = x;
    let y_adjusted = y;
    if (x == 0) x_adjusted = X; // if (x <= 0) x_adjusted = X + x;
    if (y == 0) y_adjusted = Y; // if (y <= 0) y_adjusted = Y + y;
    if (x == X+1) x_adjusted = 1; // if (x > X) x_adjusted = 0 + x - X;
    if (y == Y+1) y_adjusted = 1; // if (y > Y) y_adjusted = 0 + y - Y;
    return {
        x: x_adjusted,
        y: y_adjusted
    }
}

function next_gen(){
    for (let y=Y; y>=1; y--){
        for (let x=1; x<=X; x++){
            if (live_to_next_gen(x, y)) set_live_mark(x, y);
            else set_dead_mark(x, y);
        }
    }
    let cells_with_dead_mark = document.getElementsByClassName("dead_mark");
    let cells_with_live_mark = document.getElementsByClassName("live_mark");
    for (let i=0; i<cells_with_dead_mark.length; i++) cells_with_dead_mark[i].style.background = DEAD_COLOR;
    for (let i=0; i<cells_with_live_mark.length; i++) cells_with_live_mark[i].style.background = ALIVE_COLOR;
    reset_marks();
    generation++;
    document.getElementById("generation").textContent = generation;
    set_inactive(["init_default", "add_ant", "start_ant", "pause_ant", "move_ant"]);
}

// test if cell will be alive in next generation
function live_to_next_gen(x, y){
    let alive_neightbours = 0;
    if (cell_is_alive(x-1, y)) alive_neightbours++;
    if (cell_is_alive(x+1, y)) alive_neightbours++;
    if (cell_is_alive(x, y-1)) alive_neightbours++;
    if (cell_is_alive(x, y+1)) alive_neightbours++;
    if (cell_is_alive(x+1, y+1)) alive_neightbours++;
    if (cell_is_alive(x-1, y-1)) alive_neightbours++;
    if (cell_is_alive(x-1, y+1)) alive_neightbours++;
    if (cell_is_alive(x+1, y-1)) alive_neightbours++;
    if (cell_is_alive(x, y) == true && (alive_neightbours == 2 || alive_neightbours == 3)) return true;
    if (cell_is_alive(x, y) == false && alive_neightbours == 3) return true;
    else return false
}

function change_cell_cursor(){
    let cells = document.getElementsByClassName("cell");
    let cursor = "pointer";
    if (GAME_PROGRESS != null) cursor = "default";
    for (let i=0; i<cells.length; i++) cells[i].style.cursor = cursor;
}

function start() {
    remove_ant();
    if (GAME_PROGRESS == null || GAME_PROGRESS == "paused") {
        if (GAME_PROGRESS == null) save_init_state();
        GAME_PROGRESS = setInterval(next_gen, INTERVAL)
        change_cell_cursor();
    }
    set_inactive(["start_gol", "speed"])
    set_active(["pause_gol", "stop_gol"]);
}

function pause() {
    clearInterval(GAME_PROGRESS);
    GAME_PROGRESS = "paused";
    set_active(["start_gol", "speed"])
}

function stop() {
    clearInterval(GAME_PROGRESS);
    GAME_PROGRESS = null;
    change_cell_cursor();
    for (let y=Y; y>=1; y--) 
        for (let x=1; x<=X; x++)
            set_dead(x, y);
    load_init_state();
    set_active(["next_gen", "init_default", "add_ant", "start_ant", "pause_ant", "move_ant", "speed", "start_gol"]);
    generation = 0;
    document.getElementById("generation").textContent = generation;
}

function change_speed(value){
    let adjusted_value = 600 - value;
    document.getElementById("speed_display").textContent = value;
    INTERVAL = adjusted_value;
}

function save_init_state(){
    let grid = [];
    for (let y=Y; y>=1; y--){
        for (let x=1; x<=X; x++){
            let cell = {
                id: get_cell_id(x, y),
                alive: cell_is_alive(x, y)
            }
            grid.push(cell);
        }
    }
    localStorage.setItem("game_of_life_init_state", JSON.stringify(grid));
}

function load_init_state(){
    let grid = JSON.parse(localStorage.getItem("game_of_life_init_state"));
    let i=0;
    for (let y=Y; y>=1; y--){
        for (let x=1; x<=X; x++){
            if (get_cell_id(x, y) == grid[i].id){
                if (grid[i].alive) set_live(x, y);
                i++;
            } else console.log("load_init_state error");
        }
    }
}

function reset_grid() {
    remove_ant();
    for (let y=Y; y>=1; y--)
        for (let x=1; x<=X; x++)
            set_dead(x, y);
    clearInterval(GAME_PROGRESS);
    clearInterval(ANT_PROGRESS);
    generation = 0;
    ant_counter = 0;
    document.getElementById("generation").textContent = generation;
    document.getElementById("ant_counter").textContent = ant_counter;
    set_active(["next_gen", "init_default", "add_ant", "start_ant", "pause_ant", "move_ant", "start_gol", "speed"]);
    set_inactive(["start_ant", "pause_ant", "move_ant"]);
    GAME_PROGRESS = null;
    change_cell_cursor();
}

// set button to inactive
function set_inactive(buttons_id_array) {
    for (let i=0; i<buttons_id_array.length; i++){
        let button = document.getElementById(buttons_id_array[i]);
        button.disabled = true;
        button.style.background = INACTIVE_BUTTON_COLOR;
        button.style.cursor = "default";
    }
}

// set button to active
function set_active(buttons_id_array) {
    for (let i=0; i<buttons_id_array.length; i++){
        let button = document.getElementById(buttons_id_array[i]);
        button.disabled = false;
        button.style.background = ACTIVE_BUTTOM_COLOR;
        button.style.cursor = "pointer";
        if (button.id == "speed") button.style.background =  SPEED_RANGE_COLOR;
    }
}

function hide_alert() {
    document.getElementById("phone_alert").style.display = "none";
}

function init_default(){
    // glider
    change_state(4,19); change_state(4,18); change_state(4,17); change_state(3,17); change_state(2,18);
    // light ship
    change_state(25, 10); change_state(26, 10); change_state(27, 10); change_state(28, 10); change_state(29, 11);
    change_state(25, 11); change_state(25, 12); change_state(26, 13); change_state(29, 13);
}

