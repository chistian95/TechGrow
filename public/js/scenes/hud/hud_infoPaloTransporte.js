class HUD_InfoPaloTransporte extends Phaser.Scene {
  constructor() {
    super('hud_infoPaloTransporte');
  }

  create() {
    var self = this;

    var barraInfo = this.add.image(640, 20, 'hud', 'hudInfoPeque').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.nombreMaquina = this.add.text(640, 37, "", {align: 'center', wordWrap: true, wordWrapWidth: barraInfo.width}).setOrigin(0.5, 0);
    var panelInputs = this.add.image(640, 97, 'hud', 'hudInputs').setScale(4).setOrigin(0.5, 0).setInteractive();

    this.generarInputs();

    var principal = this.scene.get('principal');
    principal.input.on('pointerdown', function(pointer, gameObjects) {
      if(!gameObjects[0] || !gameObjects[0].data) {
        self.scene.sendToBack();
        return;
      }

      var tipo = gameObjects[0].data.get('tipo');
      var subtipo = gameObjects[0].data.get('subtipo');
      if(!tipo || tipo != 'maquina' || subtipo != 'paloTransporte') {
        self.scene.sendToBack();
        return;
      }

      var coordX = gameObjects[0].data.get('origenX');
      var coordY = gameObjects[0].data.get('origenY');
      self.maquina = principal.tilesMundo[coordX+","+coordY].maquina;
      self.nombreMaquina.setText(self.maquina.nombre);

      for(var i=0; i<self.spritesInputs.length; i++) {
        var dir = self.maquina.inputs[i];
        var frame = "";
        switch(dir) {
          case 0: frame = "inputOff"; break;
          case 1: frame = "inputFuera"; break;
          case 2: frame = "inputDentro"; break;
        }
        self.spritesInputs[i].setFrame(frame);
      }

      self.scene.bringToTop();
    });

    this.scene.sendToBack();
  }

  update() {
    if(!this.maquina) {
      return;
    }
  }

  generarInputs() {
    var self = this;

    this.spritesInputs = [];
    for(var i=0; i<4; i++) {
        this.spritesInputs[i] = this.add.sprite(556, 113+48*i, 'hud', 'inputOff').setScale(4).setOrigin(0, 0).setInteractive().setDataEnabled();
        this.spritesInputs[i].data.set('dir', i);

        var dir = "";
        switch(i) {
          case 0: dir = "Norte"; break;
          case 1: dir = "Este"; break;
          case 2: dir = "Sur"; break;
          case 3: dir = "Oeste"; break;
        }
        this.add.text(585, 115+48*i, dir).setOrigin(0, 0);

        this.spritesInputs[i].on('pointerdown', function(event) {
          var dir = this.data.get('dir');
          var statInput = self.maquina.inputs[dir];

          statInput++;
          if(statInput > 2) { statInput = 0; }
          self.maquina.inputs[dir] = statInput;

          switch(statInput) {
            case 0: this.setFrame('inputOff'); break;
            case 1: this.setFrame('inputFuera'); break;
            case 2: this.setFrame('inputDentro'); break;
          }
        });
    }
  }
}
