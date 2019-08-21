class Player {
  constructor(id) {
    this.id = id
    this.units = []
    this.colour = null;
    this.moved = false;
    this.lost = false;
    this.village = null;
  }

  setVillage(village) {
    this.village = village;
  }
}
