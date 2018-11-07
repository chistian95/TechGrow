class HUD_InfoRecursos extends Phaser.Scene {
  constructor() {
    super('hud_infoRecursos');
  }

  create() {
    var self = this;

    this.crearSelector();
    var fondo = this.add.image(640, 20, 'hud', 'hudInfoPeque').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.textoRecurso = this.add.text(640, 37, "", {align: 'center', wordWrap: true, wordWrapWidth: fondo.width}).setOrigin(0.5, 0);

    this.events.on('actualizarScene', function() {
      if(self.tile) {
        var texto = self.tile.recurso.nombre + " | " + self.tile.recurso.puntos + "/" + self.tile.recurso.puntosMax;
        self.textoRecurso.setText(texto);
      }
    }, this);

    this.scene.sendToBack();
  }

  crearSelector() {
    var self = this;

    var principal = this.scene.get('principal');

    principal.input.on('pointerdown', function(pointer, gameObjects) {
      if(!gameObjects[0] || !gameObjects[0].data) {
        self.scene.sendToBack();
        principal.selectorFijo.setVisible(false);
        return;
      }

      var tipo = gameObjects[0].data.get('tipo');
      if(!tipo || tipo != 'recurso') {
        self.scene.sendToBack();
        principal.selectorFijo.setVisible(false);
        return;
      }

      principal.selectorFijo.setVisible(true);
      principal.selectorFijo.setPosition(gameObjects[0].x, gameObjects[0].y);

      var coordX = gameObjects[0].x / 32;
      var coordY = gameObjects[0].y / 32;
      self.tile = principal.tilesMundo[coordX+","+coordY];

      self.events.emit('actualizarScene');
      self.scene.bringToTop();
    });
  }
}
