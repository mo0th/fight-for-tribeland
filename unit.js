class Unit {
  constructor(map, tile, type, player) {
    this.reset(map, tile, type, player);
  }

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

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this === this.map.selectedUnit) tint(127, 127, 127);
    this.info.show(this.tile.SIZE / 1.5);
    fill(this.player.colour);
    textSize(this.tile.SIZE / 4);
    textAlign(LEFT, BOTTOM);
    textFont(fonts.objective.regular);
    text(`${this.hp}/${this.maxHp}`, -this.tile.SIZE * 5 / 12, +this.tile.SIZE * 5 / 12);
    pop();
  }

  update() {
    this.pos = this.tile.pos;
  }

  attack(unit) {
    let atk = this.atk * this.hp / this.maxHp;
    let def = unit.def * unit.hp / this.maxHp;
    let total = atk + def;
    let dmg = round(atk / total * this.atk * 4.5);
    unit.damage(dmg);
    this.attacked = true;
  }

  damage(dmg) {
    this.hp -= (floor(dmg)) ? floor(dmg) : 1;
    if (this.hp <= 0) {
      m.removeUnit(this);
    }
  }

  showInfo() {

  }

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
            console.log(this.map.turnCount, "s");
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

  canHit(unit) {
    if (abs(unit.mapX - this.mapX) <= this.info.range &&
        abs(unit.mapY - this.mapY) <= this.info.movement) {
      if (unit.player !== this.player) {
        return true;
      }
      return false
    }
    return false;
  }

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

  setFocussed(bool) {
    this.hasFocus = bool;
  }
}

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
