class HUD_InfoMaquinaExtractor extends Phaser.Scene {
  constructor() {
    super('hud_infoMaquinaExtractor');
  }

  create() {
    var self = this;

    var barraInfo = this.add.image(640, 20, 'hud', 'hudInfoPeque').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.nombreMaquina = this.add.text(640, 37, "", {align: 'center', wordWrap: true, wordWrapWidth: barraInfo.width}).setOrigin(0.5, 0);
    var panelInfo = this.add.image(640, 97, 'hud', 'menuEdificios').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.txtRecursoExtraido = this.add.text(640, 120, "", {align: 'center', wordWrap: true, wordWrapWidth: panelInfo.width}).setOrigin(0.5, 0);
    this.txtInventario = this.add.text(640, 140, "", {align: 'center', wordWrap: true, wordWrapWidth: panelInfo.width}).setOrigin(0.5, 0);

    var principal = this.scene.get('principal');
    principal.input.on('pointerdown', function(pointer, gameObjects) {
      if(!gameObjects[0] || !gameObjects[0].data) {
        self.scene.sendToBack();
        return;
      }

      var tipo = gameObjects[0].data.get('tipo');
      var subtipo = gameObjects[0].data.get('subtipo');
      if(!tipo || tipo != 'maquina' || subtipo != 'extractor') {
        self.scene.sendToBack();
        return;
      }

      var coordX = gameObjects[0].data.get('origenX');
      var coordY = gameObjects[0].data.get('origenY');
      self.maquina = principal.tilesMundo[coordX+","+coordY].maquina;
      self.nombreMaquina.setText(self.maquina.nombre);
      self.recurso = principal.tilesMundo[coordX+","+coordY].recurso;

      self.scene.bringToTop();
    });

    this.scene.sendToBack();
  }

  update() {
    if(!this.maquina) {
      return;
    }

    this.txtRecursoExtraido.setText('Recurso extraido: ' + this.recurso.nombre + " | " + this.recurso.puntos + "/" + this.recurso.puntosMax);

    var txtInv = "Inventario: ";
    for(var i in this.maquina.inventario) {
      txtInv += RECURSO[i].nombre + ": " + this.maquina.inventario[i] + " ";
    }
    this.txtInventario.setText(txtInv);
  }
}
