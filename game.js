class Map {
  constructor(SIZE, TILE_SIZE, players) {
    this.reset(SIZE, TILE_SIZE, players);
  }

  // displays the map in the canvas
  show() {
    if (this.showTiles) {
      this.tiles.forEach(arr => {
        arr.forEach(tile => {
          tile.update(tile.mapX * tile.SIZE + this.offset.x,
                      tile.mapY * tile.SIZE + this.offset.y)
          tile.show();
        })
      });
      this.units.forEach(unit => unit.show());
      if (this.selectedUnit) {
        if (!this.selectedUnit.moved) {
          this.selectedUnit.showMoves();
        }
      }
    }

    this.turnIndicator();
  }

  // changes the translation offset of the map to allow panning
  pan() {
    let x = constrain(mouseX - this.mouse.x + this.pOffset.x,
                      - this.TILE_SIZE * 19 / 2,
                      width - this.TILE_SIZE / 2);
    let y = constrain(mouseY - this.mouse.y + this.pOffset.y,
                      - this.TILE_SIZE * 19 / 2,
                      height - this.TILE_SIZE / 2);
    this.offset.x = x
    this.offset.y = y
  }

  // resets the map
  reset(SIZE, TILE_SIZE, players) {
    this.SIZE = int(SIZE);
    this.TILE_SIZE = int(TILE_SIZE);
    // Array of tiles that makes up the map
    this.tiles = make2DArray(this.SIZE);
    // FOR PANNING THROUGH THE MAP:
    // Current offset
    this.offset = createVector(0 + TILE_SIZE / 2, 0 + TILE_SIZE / 2);

    // Previous offset
    this.pOffset = createVector(0, 0);

    // Vector to store mouse position for panning
    this.mouse = createVector(mouseX, mouseY);

    // Whether or not to show the Tiles/Point
    this.showTiles = true;

    // Variables to store references to currntly the focussed
    // tile and unit
    this.selectedTile = null;
    this.selectedUnit = null;

    // Initialise the 2D array of tiles
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        this.tiles[i][j] = new Tile(this, j, i);
        // this.tiles[i][j].col = color(126);
        this.tiles[i][j].col = color(127 / this.SIZE * j + 128,
          127 / this.SIZE * i + 128,
          127 / this.SIZE * (i + j) / 2 + 128);
      }
    }

    // Centre the map on Player 1's Village at (2, 2)
    this.centreOn(2, 2);

    // Array to contain all units in the map
    this.units = [];

    // Array containing all the players in the game
    this.players = players;
    // Set the current playeer to Player 1.
    this.playerTurn = 0;
    // Stores the current player for convenience
    this.cp = this.players[this.playerTurn];

    // The number of turns
    this.turnCount = 1;

    // Array containing all the villages on the map
    this.villages = []

    if (numPlayers >= 2) {
      this.players[0].colour = color('red');
      this.players[0].id = 0;
      this.createVillage(2, 2, this.players[0]);
      this.players[1].colour = color('magenta');
      this.players[1].id = 1;
      this.createVillage(8, 8, this.players[1]);
    }
    if (numPlayers >= 3) {
      this.players[2].colour = color('blue');
      this.players[2].id = 2;
      this.createVillage(2, 8, this.players[2]);
    }
    if (numPlayers === 4) {
      this.players[3].colour = color('green');
      this.players[3].id = 3;
      this.createVillage(8, 2, this.players[3]);
    }

  }

  // centre on a certain tile in the map
  centreOn() {
    let mx, my;
    if (typeof arguments[0] === "number" && typeof arguments[1] === "number") {
      mx = constrain(arguments[0], 0, this.SIZE - 1);
      my = constrain(arguments[1], 0, this.SIZE - 1);;
    } else if (typeof arguments[0] === "string") {
      if ((arguments[0].toLowerCase() === 'center') || (arguments[0].toLowerCase() === 'centre')) {
        mx = (this.SIZE - 1) / 2;
        my = (this.SIZE - 1) / 2;
      }
    } else {
      throw new Error("Unexpected Input");
    }
    let x, y;
    x = width / 2 - this.TILE_SIZE * constrain(mx, 0, this.SIZE - 1);
    y = height / 2 - this.TILE_SIZE * constrain(my, 0, this.SIZE - 1);
    this.offset.set(createVector(x, y));
  }

  // check which tile the mouse is over
  checkFocus() {
    this.selectedTile = null;
    for (let arr of this.tiles) {
      for (let t of arr) {
        t.setFocussed(t.hit())
        if (t.hit()) {
          this.selectedTile = t;
          // Is a unit selected
          if (this.selectedUnit) {
            if (this.selectedUnit.canMove(t)) {
              // If the unit can move, move it
              this.selectedUnit.move(t);
              this.selectedUnit = null;
            } else if (this.selectedUnit !== t.unit && t.unit) {
              // if the unit exists and it is not the currently selected unit
              if (t.unit.player !== this.cp) {
                // if the unit's player
                if (this.selectedUnit.canHit(t.unit)) {
                  this.selectedUnit.attack(t.unit);
                }
                this.selectedUnit = null;
              } else {
                if (this.selectedUnit !== t.unit) {
                  this.selectedUnit = t.unit;
                } else {
                  this.selectedUnit = null;
                }
              }
            } else {
              this.selectedUnit = null;
            }
          } else if (t.unit) {
            if (t.unit.player === this.cp) this.selectedUnit = t.unit;
          }
        }
      }
    }

  }

  // create a unit on the map on a certain tile and assign it to a player
  createUnit(mapX, mapY, unitType, player) {
    let u = new Unit(this, this.tiles[mapY][mapX], unitType, player)
    this.units.push(u);
    player.units.push(u);
  }

  // delete a unit
  removeUnit(unit) {
    this.units = this.units.filter(u => u !== unit);
    unit.tile.unit = null;
    unit.player.units.filter(u => u !== unit);
    unit = null;
  }

  // create a village
  createVillage(mx, my, player) {
    let village = {
      owner: player,
      mapPos: {
        x: mx,
        y: my
      }
    }
    this.villages.push(village);
    this.tiles[my][mx].village = village;
    player.village = village;
    // Create the player's units around their village
    this.createUnit(mx-1, my, "warrior", player);
    this.createUnit(mx+1, my, "warrior", player)
    this.createUnit(mx, my-1, "warrior", player);
    this.createUnit(mx, my+1, "warrior", player);
    this.createUnit(mx-1, my-1, "horseman", player);
    this.createUnit(mx+1, my+1, "horseman", player)
    this.createUnit(mx+1, my-1, "horseman", player);
    this.createUnit(mx-1, my+1, "horseman", player);
  }

  // Increments the playerTurn variable and if it exceeds the number of players,
  // calls nextTurn()
  nextPlayer() {
    this.playerTurn++;
    if (this.playerTurn > this.players.length - 1) [
      this.nextTurn()
    ]
    this.cp = this.players[this.playerTurn];
    let mx = this.cp.village.mapPos.x;
    let my = this.cp.village.mapPos.y;

    for (let village of this.villages) {
      if (this.cp === village.attackedBy) {
        if (this.turnCount - village.enemyStartTurn >= 1) {
          this.removePlayer(village.owner);
        }
      }
    }

  }

  // Sets up the map for the next turn and incremenst the turn counter
  nextTurn() {
    this.turnCount++;
    this.playerTurn = 0;
    this.cp = this.players[this.playerTurn]
    for (let player of this.players) {
      player.moved = false;
    }
    for (let unit of this.units) {
      unit.attacked = false;
    }
  }

  // shows whose turn it is
  turnIndicator() {
    let txt = `Player ${this.cp.id + 1}'s turn`;
    rectMode(CORNER);
    fill(0, 50);
    noStroke();
    rect(0, 0, width, width / 20);
    textAlign(RIGHT, BOTTOM);
    textSize((width + height) / 40);
    textFont(fonts.aquatico.regular);
    fill(this.cp.colour);
    text(txt, width * 0.99, width / 20);
  }

  // remove a player when they have lost
  removePlayer(player) {
    player.units.forEach(u => this.removeUnit(u));
    let mx = player.village.mapPos.x;
    let my = player.village.mapPos.y;
    this.tiles[my][mx].village = null;
    this.villages = this.villages.filter(village => village !== player.village);
    player.village = null;
    this.players = this.players.filter(plyr => plyr !== player);
    player = null;
    if (this.players.length === 1) {
      winner = this.players[0];
      screens.current = 'gameFinished';
    }
  }
}
class RectButton {
  constructor(options) {
    this.position = {
      x: 0,
      y: 0
    }
    this.fillColour = color('white');
    this.hitColour = color('gray');
    this.stroke = true;
    this.strokeColour = color('black');
    this.strokeWeight = 1;
    this.text = 'NO TEXT';
    this.textColour = color('black');
    this.textSize = 24;
    this.onClick = [];
    this.sizeMode = "auto";
    this.sizeMultiplyer = 1;
    this.w = 50;
    this.h = 50;
    this.activated = true;
    this.selected = false;
    this.selectedColour = color('blue');
    for (let option in options) {
      this[option] = options[option];
    }
  }

  // changes some of the options associated with the button
  config(options) {
    for (let option in options) {
      this[option] = options[option];
    }
  }

  // toggles the button
  toggle(bool) {
    this.activated = (typeof bool === 'boolean') ? bool : !this.activated;
  }

  // shows the button in the canvas
  show() {
    push();
    translate(this.position.x, this.position.y)
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    if (this.font) textFont(this.font);
    if (this.sizeMode === "auto") {
      this.w = (textWidth(this.text) + this.textSize/2) * this.sizeMultiplyer;
      this.h = (textAscent(this.text) + textDescent(this.text) + this.textSize/4) * this.sizeMultiplyer;
    }
    if (this.stroke) {
      stroke(this.strokeColour);
      strokeWeight(this.strokeWeight);
    } else {
      noStroke();
    }
    if (!this.activated) {
      fill(darken(this.fillColour));
    } else if (this.hit()) {
      fill(255,127,0);
      scale(1.05);
    } else if (this.selected) {
      fill(this.selectedColour);
    } else {
      if (this.fillColour) fill(this.fillColour);
      else fill(0)
    }
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 5);
    if (!this.activated) fill(darken(this.textColour));
    else fill(this.textColour);
    noStroke();
    text(this.text, 0, -1 * this.textSize / 10);
    pop();
  }

  // returns true if the mouse is over the button
  hit() {
    if (this.activated) {
      return mouseX > this.position.x - this.w / 2 &&
             mouseX < this.position.x + this.w / 2 &&
             mouseY > this.position.y - this.h / 2 &&
             mouseY < this.position.y + this.h / 2;
    }
    return false;
  }

  // runs the functions in onClick when the button is clicked
  clicked() {
    if (this.hit() && this.activated) {
      for (let func of this.onClick) {
        if (typeof func === "function") func();
      }
    }

  }
}
class imgButton {
  constructor(options) {
    this.w = 50;
    this.h = 50;
    this.position = {
      x: 0,
      y: 0
    };
    this.img = createImage(this.w,this.h);
    this.imgBaseTint = 'white';
    this.imgHitTint = 'grey';
    this.sizeMode = 'fixed';
    this.label = null;
    this.labelFont = null;
    this.labelFontSize = 24;
    this.labelFontColour = color('white');
    this.activated = true;
    this.selected = false;
    this.onClick = [];

    for (let id in options) {
      this[id] = options[id];
    }
  }

  // changes some of the options associated with the button
  config(options) {
    for (let id in options) {
      this[id] = options[id];
    }
  }

  // shows the button in the canvas
  show() {
    push();
    translate(this.position.x, this.position.y);
    if (this.activated) {
      if (this.hit()) {
        tint('orange');
      } else {
        tint('blue');
      }
    } else {
      tint(darken(this.imgBaseTint));
    }
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    if (this.label) {
      if (this.labelFont) {
        textFont(this.labelFont);
      }
      textSize(this.labelFontSize);
      textAlign(CENTER, TOP);
      fill(this.labelFontColour);
      text(this.label, 0, this.h / 2)
    }
    pop();
  }

  // toggles the button
  toggle(bool) {
    this.activated = (typeof bool === 'boolean') ? bool : !this.activated;
  }

  // returns true if the mouse is over the button
  hit() {
    if (this.activated) {
      return mouseX > this.position.x - this.w / 2 &&
             mouseX < this.position.x + this.w / 2 &&
             mouseY > this.position.y - this.h / 2 &&
             mouseY < this.position.y + this.h / 2;
    }
    return false;
  }

  // runs the functions in onClick when the button is clicked
  clicked() {
    if (this.hit() && this.activated) {
      for (let func of this.onClick) {
        if (typeof func === "function") func();
      }
    }
  }
}
class Player {
  constructor(id) {
    this.id = id
    this.units = []
    this.colour = null;
    this.moved = false;
    this.lost = false;
    this.village = null;
  }

  // sets the village associated with this player
  setVillage(village) {
    this.village = village;
  }
}
class Tile {
  constructor(map, mapX, mapY) {
    this.reset(map, mapX, mapY);
  }

  // Display the Tile in the canvas
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
    strokeWeight(1);
    fill(this.col);
    rect(0, 0, this.SIZE, this.SIZE);
    if (this.village) {
      tint(this.village.owner.colour);
      image(img.village, 0, 0, this.SIZE, this.SIZE)
    };
    pop();
    if (this.hit()) {
      this.highlight(this.hitCol);
    } else if (this.hasFocus) {
      this.highlight(darken(this.hitCol));
    }
  }

  // Update the position of the Tile
  update(x, y) {
    this.pos.set(x, y);
    if (this.unit) this.unit.update();
  }

  // Checks whether the mouse is within the Tile
  hit() {
    return (mouseX > this.pos.x - this.SIZE / 2 &&
            mouseX < this.pos.x + this.SIZE / 2 &&
            mouseY > this.pos.y - this.SIZE / 2 &&
            mouseY < this.pos.y + this.SIZE / 2);
  }

  // Highlight the Tile with a certain colour
  highlight(highlightColor, iw) {
    emptySquare(this.pos.x, this.pos.y,
                this.SIZE, iw || this.SIZE * 0.75,
                highlightColor);
  }

  // Reset the Tile
  reset(map, mapX, mapY) {
    this.pos = createVector(0, 0);
    this.map = map;
    this.SIZE = this.map.TILE_SIZE;
    this.hasFocus = false;
    this.col = null;
    this.hitCol = color(0, 0, 255);
    this.unit = null;
    this.mapX = mapX;
    this.mapY = mapY;
    this.village = null;
  }

  // Set the Unit in this Tile
  setUnit(unit) {
    this.unit = unit;
  }

  // Set the focus of the Tile
  setFocussed(bool) {
    this.hasFocus = bool;
    if (this.unit) {
      this.unit.setFocussed(true);
    }
  }

}
class Unit {
  constructor(map, tile, type, player) {
    this.reset(map, tile, type, player);
  }

  // resets the unit
  reset(map, tile, type, player) {
    this.map = map;
    this.hasFocus = false;
    this.type = type;
    this.info = unitTypes[type];
    this.maxHp = this.info.health;
    this.hp = this.info.health;
    this.atk = this.info.attack;
    this.def = this.info.defence;
    this.tile = tile;
    this.mapX = this.tile.mapX;
    this.mapY = this.tile.mapY;
    this.pos = this.tile.pos;
    this.tile.setUnit(this);
    this.player = player;
    this.moved = false;
    this.attacked = false;
  }

  // displays the unit in the canvas
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this === this.map.selectedUnit) tint(127, 127, 127);
    this.info.show(this.tile.SIZE / 1.5);
    fill(this.player.colour);
    textSize(this.tile.SIZE / 4);
    textAlign(LEFT, BOTTOM);
    text(`${this.hp}/${this.maxHp}`, -this.tile.SIZE * 5 / 12, +this.tile.SIZE * 5 / 12);
    pop();
  }

  // updates the position of the unit in the canvas
  update() {
    this.pos = this.tile.pos;
  }

  // calculates damage taken by the attacked unit
  attack(unit) {
    let atk = this.atk * this.hp / this.maxHp;
    let def = unit.def * unit.hp / this.maxHp;
    let total = atk + def;
    let dmg = round(atk / total * this.atk * 4.5);
    unit.damage(dmg);
    this.attacked = true;
  }

  // inflicts damage on the unit
  damage(dmg) {
    this.hp -= (floor(dmg)) ? floor(dmg) : 1;
    if (this.hp <= 0) {
      m.removeUnit(this);
    }
  }

  // moves the unit to a given tile
  move(tile) {
    if (this.player === this.map.cp) {
      if (!this.player.moved) {
        this.tile.unit = null
        this.tile = tile;
        tile.unit = this;
        this.mapX = tile.mapX;
        this.mapY = tile.mapY;
        this.hasFocus = false;
        this.pos = tile.pos;
        this.player.moved = true;
        if (tile.village) {
          if (tile.village.owner !== this.player) {
            tile.village.enemyStartTurn = this.map.turnCount;
            tile.village.attackedBy = this.player;
          } else {
            tile.village.enemyStartTurn = null;
            tile.village.attackedBy = null;
          }
        }
      }
    }
  }

  // checks whether the unit can move to a given tile
  canMove(tile) {
    if (abs(tile.mapX - this.mapX) <= this.info.movement &&
        abs(tile.mapY - this.mapY) <= this.info.movement) {
      if (tile.unit) {
        return false;
      }
      return true;
    }
    return false;
  }

  // checks whether the unit can hit another unit
  canHit(unit) {
    if (abs(unit.mapX - this.mapX) <= this.info.range &&
        abs(unit.mapY - this.mapY) <= this.info.range) {
      if (unit.player !== this.player) {
        if (!this.attacked) return true;
      }
      return false
    }
    return false;
  }

  // shows all the moves that a player can take
  showMoves() {
    if (this.map.cp === this.player) {
      for (let i = this.mapX - this.info.movement;
           i <= this.mapX + this.info.movement; i++) {
        if (i >= 0 && i < this.map.SIZE) {
          for (let j = this.mapY - this.info.movement;
               j <= this.mapY + this.info.movement; j++) {
            if (j >= 0 && j < this.map.SIZE) {
              if (!(j === this.mapY && i === this.mapX)) {
                let tile = this.map.tiles[j][i];
                if (tile.unit) {
                  if (this.canHit(tile.unit) && !this.attacked) {
                    tile.highlight(color('red'), tile.SIZE * 0.9375);
                  }
                } else if (!this.player.moved) {
                  tile.highlight(color('green'), tile.SIZE * 0.9375);
                }
              }
            }
          }
        }
      }
    }
  }

  // set the focus of the unit
  setFocussed(bool) {
    this.hasFocus = bool;
  }
}

// different types of units
let unitTypes = {
  "warrior": {
    attack: 2,
    defence: 2,
    health: 15,
    movement: 1,
    range: 1,
    show(wh) {
      imageMode(CENTER);
      image(img.warrior, 0, 0, wh, wh);
    },
  },
  "horseman": {
    attack: 2,
    defence: 1,
    health: 10,
    movement: 2,
    range: 1,
    show(wh) {
      imageMode(CENTER);
      image(img.horseman, 0, 0, wh, wh);
    }
  }
}

// Creates a new array of length rows then returns a new array
// where each item is an array of length cols
function make2DArray(rows, cols = rows) {
  return new Array(rows).fill().map(e => new Array(cols));
}

// Draws the outline of a square to the canvas with a given inner width and
// outer width
function emptySquare(x, y, outsideWidth, insideWidth, color) {
  push();
  w = (outsideWidth + insideWidth) / 2;
  noFill();
  stroke(color);
  rectMode(CENTER);
  strokeWeight((outsideWidth - insideWidth) / 2);
  rect(x, y, w, w);
  pop();
}

// Checks whether text is wider than a specified width
// and returns either the height of the text or the
// given width
function textWider(text, font, fontSize, w) {
  let rtn;
  push();
  textFont(font);
  textSize(fontSize);
  if (w < textWidth(text) + fontSize / 2) {
    rtn = textWidth(text) + fontSize / 2;
  } else {
    rtn = w;
  }
  pop();
  return rtn;
}

// Checks whether text is taller than a specified height
// and returns either the height of the text or the
// given height
function textTaller(text, font, fontSize, h) {
  let rtn;
  push();
  textFont(font);
  textSize(fontSize);
  let textHeight = textAscent(text) + textDescent(text)
  if (h < textHeight) {
    rtn = textHeight;
  } else {
    rtn = h;
  }
  pop();
  return rtn;
}

// Accepts a p5.Color object and return a new p5.Color
// with halved red, green and blue values
function darken(col) {
  col = color(col);
  return color(red(col) / 2, green(col) / 2, blue(col) / 2);
}

// stores each individual screen and methods to interact with them
let screens = {
  currentScreen: null,
  set current(scrn) {
    if (this.currentScreen) this.currentScreen.clear();
    this.currentScreen = this[scrn];
    this.currentScreen.init();
  },
  showCurrent() {
    this.currentScreen.show();
  },
  onClick() {
    for (let id in this.currentScreen.buttons) {
      if (this.currentScreen.buttons[id]) this.currentScreen.buttons[id].clicked();
    }
  },
  MainMenu: {
    buttons: {
      start: null,
      help: null,
      settings: null
    },
    clear() {
      for (let id in this.buttons) {
        this.buttons[id] = null;
      }
    },
    init() {
      this.buttons.start = new RectButton({
        position: {
          x: width / 2,
          y: 9 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "START",
        textColour: color('white'),
        textSize: (width + height) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'GameSetup';
          }
        ],
        activated: true
      });
      this.buttons.help = new RectButton({
        position: {
          x: width / 2,
          y: 11 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "HELP",
        textColour: color('white'),
        textSize: (width + height) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'Help';
          }
        ],
        activated: true
      });
      this.buttons.settings = new RectButton({
        position: {
          x: width / 2,
          y: 13 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "SETTINGS",
        textColour: color('white'),
        textSize: (width + height) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'Settings';
          }
        ],
        activated: true
      });
    },
    show() {
      background(255);
      imageMode(CENTER);
      image(img.bg, width / 2, height / 2, width, height);
      let logow = width / 1.5 + 50 * sin(frameCount / 30);
      let logoh = logow * img.logo.height / img.logo.width;
      image(img.logo, width / 2, height / 4, logow, logoh);
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.start.config({
        position: {
          x: width / 2,
          y: 9 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
      this.buttons.help.config({
        position: {
          x: width / 2,
          y: 11 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
      this.buttons.settings.config({
        position: {
          x: width / 2,
          y: 13 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
    }
  },
  GameSetup: {
    buttons: {
      start: null,
      mainmenu: null,
      playerSelect: null
    },
    clear() {
      for (let id in this.buttons) {
        this.buttons[id] = null;
      }
    },
    init() {
      this.buttons.start = new RectButton({
        position: {
          x: width / 2,
          y: 12 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "START",
        textColour: color('white'),
        textSize: (width + height) / 40,
        font: fonts.aquatico.regular,
        onClick: [
          winner = null,
          function() {
            screens.current = 'Game';
          }
        ],
        activated: true
      });
      this.buttons.mainmenu = new RectButton({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "MAIN MENU",
        textColour: color('white'),
        textSize: (width + height ) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'MainMenu';
          }
        ],
        activated: true
      });
      this.buttons.playerSelect = {
        opt2: new RectButton({
          sizeMode: 'fixed',
          fillColour: color('blue'),
          hitColour: color('orange'),
          selectedColour: color('darkorange'),
          w: width / 10,
          h: width / 10,
          position: {
            x: width / 2 - width / 10 * 1.1,
            y: height / 2
          },
          stroke: false,
          text: '2',
          textSize: width / 20,
          textColour: color('white'),
          font: fonts.aquatico.regular,
          onClick: [

            function() {
              screens.currentScreen.buttons.playerSelect.opt2.selected = true;
              screens.currentScreen.buttons.playerSelect.opt3.selected = false;
              screens.currentScreen.buttons.playerSelect.opt4.selected = false;
              numPlayers = 2;
            }
          ]
        }),
        opt3: new RectButton({
          position: {
            x: width / 2,
            y: height / 2
          },
          sizeMode: 'fixed',
          fillColour: color('blue'),
          hitColour: color('orange'),
          selectedColour: color('darkorange'),
          w: width / 10,
          h: width / 10,
          stroke: false,
          text: '3',
          textSize: width / 20,
          textColour: color('white'),
          font: fonts.aquatico.regular,
          onClick: [

            function() {
              screens.currentScreen.buttons.playerSelect.opt2.selected = false;
              screens.currentScreen.buttons.playerSelect.opt3.selected = true;
              screens.currentScreen.buttons.playerSelect.opt4.selected = false;
              numPlayers = 3;
            }
          ]
        }),
        opt4: new RectButton({
          sizeMode: 'fixed',
          fillColour: color('blue'),
          hitColour: color('orange'),
          selectedColour: color('darkorange'),
          w: width / 10,
          h: width / 10,
          position: {
            x: width / 2 + width / 10 * 1.1,
            y: height / 2
          },
          stroke: false,
          text: '4',
          textSize: width / 20,
          textColour: color('white'),
          font: fonts.aquatico.regular,
          onClick: [

            function() {
              screens.currentScreen.buttons.playerSelect.opt2.selected = false;
              screens.currentScreen.buttons.playerSelect.opt3.selected = false;
              screens.currentScreen.buttons.playerSelect.opt4.selected = true;
              numPlayers = 4;
            }
          ]
        }),
        clicked() {
          screens.currentScreen.buttons.start.toggle(true);
          this.opt2.clicked();
          this.opt3.clicked();
          this.opt4.clicked();
        },
        show() {
          for (let btn in this) {
            if (this[btn].show) this[btn].show();
          }
        },
        value() {
          for (let btn in this) {
            if (this[btn].selected) {
              return int(btn[btn.length - 1]);
            }
          }
          return 0;
        },
        config(options) {
          for (let btn in options) {
            this[btn].config(options[btn]);
          }
        }
      }
    },
    show() {
      if (!this.buttons.playerSelect.value()) {
        this.buttons.start.toggle(false);
      }
      background(255);
      imageMode(CENTER);
      image(img.bg, width / 2, height / 2, width, height);
      textFont(fonts.aquatico.regular);
      textSize((width + height) / 25);
      textAlign(CENTER, CENTER);
      fill(0);
      text("GAME SETUP", width / 2, height / 14);
      textSize((width + height) / 40);
      text("Number of Players", width / 2, height / 3);
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.mainmenu.config({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
      this.buttons.start.config({
        position: {
          x: width / 2,
          y: 12 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
      this.buttons.playerSelect.config({
        opt2: {
          w: width / 10,
          h: width / 10,
          position: {
            x: width / 2 - width / 10 * 1.1,
            y: height / 2
          },
          textSize: width / 20
        },
        opt3: {
          position: {
            x: width / 2,
            y: height / 2
          },
          w: width / 10,
          h: width / 10,
          textSize: width / 20
        },
        opt4: {
          w: width / 10,
          h: width / 10,
          position: {
            x: width / 2 + width / 10 * 1.1,
            y: height / 2
          },
          textSize: width / 20
        },
      });
    }
  },
  Help: {
    buttons: {
      mainmenu: null
    },
    clear() {
      for (let id in this.buttons) {
        this.buttons[id] = null;
      }
    },
    init() {
      this.buttons.mainmenu = new RectButton({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "MAIN MENU",
        textColour: color('white'),
        textSize: (width + height ) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'MainMenu';
          }
        ],
        activated: true
      });
    },
    show() {
      background(255);
      imageMode(CENTER);
      image(img.bg, width / 2, height / 2, width, height);
      textFont(fonts.aquatico.regular);
      textSize((width + height) / 25);
      textAlign(CENTER, CENTER);
      fill(0);
      text("HELP", width / 2, height / 14);
      textAlign(CENTER, LEFT);
      rectMode(CENTER);
      textSize((width + height) / 80);
      text("Press the big START button in the main menu. Select the number of players by clicking on that number. Now press START to start playing.\nTo pan around the map, click anywhere and drag. To move a unit select it by clicking on it and click a highlighted tile. To attack another unit, click the attacking unit and select a unit that is in range (denoted by it being highlighted).", width / 2 , height / 2, width * 2 / 3, height / 2);
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.mainmenu.config({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
    }
  },
  Game: {
    buttons: {
      endTurn: null
    },
    clear() {
      m = null;
    },
    init() {
      this.buttons.endTurn = new RectButton({
        position: {
          x: textWider('END TURN', fonts.aquatico.regular, (width + height) / 40, 0) / 2,
          y: width / 40
        },
        w: textWider('END TURN', fonts.aquatico.regular, (width + height) / 40, 0),
        h: width / 20,
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "END TURN",
        textColour: color('white'),
        textSize: (width + height) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            m.nextPlayer();
          }
        ],
        activated: true
      });
      m = new Map(11, 100, new Array(numPlayers).fill().map(e => new Player()));
    },
    show() {
      m.show();
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.endTurn.config({
        position: {
          x: textWider('END TURN', fonts.aquatico.regular, (width + height) / 40, 0) / 2,
          y: width / 40
        },
        w: textWider('END TURN', fonts.aquatico.regular, (width + height) / 40, 0),
        h: width / 20,
        textSize: (width + height) / 40
      });
    }
  },
  Settings: {
    buttons: {
      mainmenu: null,
      music: null
    },
    clear() {
      for (let id in this.buttons) {
        this.buttons[id] = null;
      }
    },
    init() {
      this.buttons.mainmenu = new RectButton({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "MAIN MENU",
        textColour: color('white'),
        textSize: (width + height ) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'MainMenu';
          }
        ],
        activated: true
      });
      this.buttons.music = new RectButton({
        position: {
          x: width / 2,
          y: 7 * height / 20
        },
        w: textWider('OFF', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('OFF', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "ON",
        textColour: color('white'),
        textSize: (width + height ) / 40,
        font: fonts.aquatico.regular,
        onClick: [
          function() {
            if (sounds.bgMusic.isPlaying()) {
              sounds.bgMusic.pause();
            } else {
              sounds.bgMusic.play();
            }
            let txt = screens.currentScreen.buttons.music.text;
            if (txt === 'ON') {
              screens.currentScreen.buttons.music.text = 'OFF';
            } else {
              screens.currentScreen.buttons.music.text = 'ON';
            }
          }
        ],
        activated: true
      });
    },
    show() {
      background(255);
      imageMode(CENTER);
      image(img.bg, width / 2, height / 2, width, height);
      textFont(fonts.aquatico.regular);
      textSize((width + height) / 25);
      textAlign(CENTER, CENTER);
      fill(0);
      text("SETTINGS", width / 2, height / 14);
      textSize((width + height) / 35);
      text("MUSIC", width / 2, height / 5);
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.mainmenu.config({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
      this.buttons.music.config({
        position: {
          x: width / 2,
          y: 7 * height / 20
        },
        w: textWider('OFF', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('OFF', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height ) / 40
      })
    }
  },
  gameFinished: {
    buttons: {
      mainmenu: null
    },
    clear() {
      for (let id in this.buttons) {
        this.buttons[id] = null;
      }
    },
    init() {
      this.buttons.mainmenu = new RectButton({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        sizeMode: 'fixed',
        fillColour: color('blue'),
        hitColour: color('orange'),
        stroke: false,
        text: "MAIN MENU",
        textColour: color('white'),
        textSize: (width + height ) / 40,
        font: fonts.aquatico.regular,
        onClick: [

          function() {
            screens.current = 'MainMenu';
          }
        ],
        activated: true
      });
    },
    show() {
      background(255);
      imageMode(CENTER);
      image(img.bg, width / 2, height / 2, width, height);
      textFont(fonts.aquatico.regular);
      textSize((width + height) / 25);
      textAlign(CENTER, CENTER);
      fill(0);
      text("GAME OVER!", width / 2, height / 14);
      textSize((width + height) / 35);
      fill(winner.colour);
      text(`CONGRATULATIONS!\nPLAYER ${winner.id + 1}\nhas won the game!`, width / 2, height / 3);
      for (let id in this.buttons) {
        this.buttons[id].show();
      }
    },
    resizeElt() {
      this.buttons.mainmenu.config({
        position: {
          x: width / 2,
          y: 14 * height / 16
        },
        w: textWider('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, width / 4),
        h: textTaller('MAIN MENU', fonts.aquatico.regular, (width + height) / 30, height / 10),
        textSize: (width + height) / 40
      });
    }
  }
}


// Map variable
let m;

// variable is true when the mouse is being dragged
let dragging = false;

// JavaScript object containing all fonts, images and sounds used
let fonts = {
  aquatico: {
    regular: null,
  }
};
let img = {
  logo: null,
  bg: null,
  menuBtn: null,
  warrior: null,
  horseman: null,
  village: null
}
let sounds = {
  bgMusic: null
}

// The number of players in the game
let numPlayers = 4;

// the winner of the game
let winner = null;

// Called once before the canvas loads
function preload() {
  // loads all assets
  for (let font in fonts) {
    for (let style in fonts[font]) {
      fonts[font][style] = loadFont(`Fonts/${font}-${style}.otf`)
    }
  }
  for (let image in img) {
    img[image] = loadImage(`Images/${image}.png`);
  }
  for (let sound in sounds) {
    sounds[sound] = loadSound(`sounds/${sound}.mp3`);
  }
}

// Called once after the page is loaded
function setup() {
  // Create the canvas to fill the window
  cnv = createCanvas(windowWidth, windowHeight);
  // Set maximum framerate to 120 fps
  frameRate(120);
  // Set the current screen to the main menu
  screens.current = 'MainMenu';

  // Start playing the background music
  sounds.bgMusic.loop();
}

// Continous loop
function draw() {
  background(0);
  screens.showCurrent();
}

// Function called when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  screens.currentScreen.resizeElt();
}

// Function called when the mouse is pressed
function mousePressed() {
  // Only pan the map if it exists
  if (m) {
    m.mouse = createVector(mouseX, mouseY);
    m.pOffset.set(m.offset);
  }
}

// Function called if the mouse is pressed and is moving
function mouseDragged() {
  dragging = true;
  if (m) m.pan();
}

// Function called if the mouse is released after being pressed
function mouseClicked() {
  screens.onClick();
  if (!dragging) {
    if (m) m.checkFocus();
  }
  dragging = false;
}
