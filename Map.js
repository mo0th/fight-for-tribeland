class Map {
  constructor(SIZE, TILE_SIZE, players) {
    this.reset(SIZE, TILE_SIZE, players);
  }

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

  toggleTiles(bool) {
    this.showTiles = (typeof bool === "boolean") ? bool : !this.showTiles;
  }

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

  showOffsets() {
    console.log("offset: " + this.offset);
  }

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

  createUnit(mapX, mapY, unitType, player) {
    let u = new Unit(this, this.tiles[mapY][mapX], unitType, player)
    this.units.push(u);
    player.units.push(u);
  }

  removeUnit(unit) {
    this.units = this.units.filter(u => u !== unit);
    unit.tile.unit = null;
    unit.player.units.filter(u => u !== unit);
    unit = null;
  }

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
