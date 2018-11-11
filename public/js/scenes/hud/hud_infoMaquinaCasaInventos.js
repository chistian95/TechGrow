class HUD_InfoMaquinaCasaInventos extends Phaser.Scene {
  constructor() {
    super('hud_infoMaquinaCasaInventos');
  }

  create() {
    var self = this;

    var barraInfo = this.add.image(640, 20, 'hud', 'hudInfoPeque').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.nombreMaquina = this.add.text(640, 37, "", {align: 'center', wordWrap: true, wordWrapWidth: barraInfo.width}).setOrigin(0.5, 0);
    var panelInfo = this.add.image(640, 97, 'hud', 'menuEdificios').setScale(3).setOrigin(0.5, 0).setInteractive();
    this.txtInventario = this.add.text(640, 102, "", {align: 'center', wordWrap: true, wordWrapWidth: panelInfo.width}).setOrigin(0.5, 0);

    this.generarItems();

    var principal = this.scene.get('principal');
    principal.input.on('pointerdown', function(pointer, gameObjects) {
      if(!gameObjects[0] || !gameObjects[0].data) {
        self.scene.sendToBack();
        return;
      }

      var tipo = gameObjects[0].data.get('tipo');
      var subtipo = gameObjects[0].data.get('subtipo');
      if(!tipo || tipo != 'maquina' || subtipo != 'casa') {
        self.scene.sendToBack();
        return;
      }

      var coordX = gameObjects[0].data.get('origenX');
      var coordY = gameObjects[0].data.get('origenY');
      self.maquina = principal.tilesMundo[coordX+","+coordY].maquina;
      self.nombreMaquina.setText(self.maquina.nombre);

      self.scene.bringToTop();
    });

    this.scene.sendToBack();
  }

  update() {
    if(!this.maquina) {
      return;
    }

    var txtInv = "";
    for(var i in this.maquina.inventario) {
      txtInv += RECURSO[i].nombre + ": " + this.maquina.inventario[i] + " ";
    }
    this.txtInventario.setText(txtInv);
  }

  generarItems() {
    var objetos = ['hornoPiedra_0', 'taladoraBasica_0', 'picaPiedra_0', 'aire', 'aire'];

    var grupoCasilla = this.add.container(352+34, 97+33).setScale(3);
    for(var i=0; i<5; i++) {
      var casilla = this.add.image(i*36, 0, 'hud', 'casillaEdificio').setOrigin(0,0).setInteractive().setDataEnabled();

      var spriteItem = this.add.image(i*36, 0, 'terreno', objetos[i]).setOrigin(0.5,0.5);

      if(spriteItem.width > spriteItem.height) {
          spriteItem.setDisplaySize(24, 24 / spriteItem.width * spriteItem.height);
      } else {
        spriteItem.setDisplaySize(24 / spriteItem.height * spriteItem.width, 24);
      }
      spriteItem.setPosition(spriteItem.x + 13, spriteItem.y + 13);
      grupoCasilla.add([casilla, spriteItem]);

      casilla.data.set('item', objetos[i]);
      casilla.data.set('cantidad', 1);
      casilla.data.set('spriteItem', spriteItem);
      casilla.data.set('scaleX', spriteItem.scaleX);
      casilla.data.set('scaleY', spriteItem.scaleY);
    }

    this.input.setTopOnly(true);
    this.input.on('gameobjectover', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('item')) {
        var sprite = gameObject.data.get('spriteItem');
        sprite.setScale(gameObject.data.get('scaleX') + 0.075, gameObject.data.get('scaleY') + 0.075);
      }
    });
    this.input.on('gameobjectout', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('item')) {
        var sprite = gameObject.data.get('spriteItem');
        sprite.setScale(gameObject.data.get('scaleX'), gameObject.data.get('scaleY'));
      }
    });
    this.input.on('gameobjectdown', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('item')) {
        console.log("CLICK " + gameObject.data.get('item'));
      }
    });
  }
}
