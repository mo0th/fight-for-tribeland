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
              sounds.bgMusic.loop();
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
