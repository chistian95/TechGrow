class ScenePrincipal extends Phaser.Scene {
  constructor() {
    super('principal');
  }

  init() {
    this.anchoMundo = 80;
    this.altoMundo = 45;

    this.maquinas = {};
    this.tilesMundo = {};
    for(var x=0, coordX=-40; x<=this.anchoMundo; x++, coordX++) {
      for(var y=0, coordY=-22; y<=this.altoMundo; y++, coordY++) {
        var tile = {
          x: coordX,
          y: coordY,
          fondo: {},
          recurso: {},
          maquina: {}
        }
        this.crearFondo(tile, x, y);
        this.crearRecursos(tile, x, y);

        this.tilesMundo[coordX+","+coordY]= tile;
      }
    }
  }

  create() {
    var self = this;

    this.pintarMundo();
    this.crearCamara();

    var selector = this.add.image(0, 0, 'terreno', 'selector').setVisible(false);
    this.selectorFijo = this.add.image(0, 0, 'terreno', 'selector').setVisible(false);

    this.tweens.add({
      targets: this.selectorFijo,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 500
    });

    this.input.setTopOnly(true);
    this.input.on('gameobjectover', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('maquina')) {
        gameObject.setTint(0xcccccc);
      } else {
        selector.setVisible(true);
        selector.setPosition(gameObject.x, gameObject.y);

        var coordX = gameObject.x / 32;
        var coordY = gameObject.y / 32;
        var tile = self.tilesMundo[coordX+","+coordY];
        var texto = "F: "+tile.fondo.tipo+" | R: "+tile.recurso.tipo+" | C: "+tile.x+","+tile.y;

        self.registry.set('casillaSeleccionada', texto);
      }
    });
    this.input.on('gameobjectout', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('maquina')) {
        gameObject.clearTint();
      } else {
        selector.setVisible(false);
        self.registry.set('casillaSeleccionada', "");
      }
    });
  }

  update(time, delta) {
    this.controls.update(delta);
  }

  pintarMundo() {
    for(var tileCoord in this.tilesMundo) {
      var tile = this.tilesMundo[tileCoord];

      var textura = tile.fondo.tipo;
      var coordX = tile.x * 32;
      var coordY = tile.y * 32;

      if(textura == 'f_agua') {
        tile.fondo.sprite = this.add.sprite(coordX, coordY, 'terreno').play('animAgua');
      } else {
        tile.fondo.sprite = this.add.image(coordX, coordY, 'terreno', textura);
      }

      var texturaRecurso = tile.recurso.tipo;
      if(texturaRecurso != 'aire') {
        tile.recurso.sprite = this.add.image(coordX, coordY, 'terreno', texturaRecurso).setDataEnabled().setInteractive();
        tile.recurso.sprite.data.set('tipo', 'recurso');
      }
    }

    this.crearMaquina(-1, 0, 'casa');
    this.crearMaquina(5, -1, 'picaPiedra');
    this.crearMaquina(4, 0, 'picaPiedra');
    this.crearMaquina(-2, 0, 'hornoPiedra');
    this.crearMaquina(-1, -5, 'taladoraBasica');
    this.crearMaquina(-6, -1, 'taladoraBasica');
    this.crearMaquina(1, 7, 'taladoraBasica');

    this.crearMaquina(0, 7, 'paloTransporte');
    this.crearMaquina(0, 1, 'paloTransporte');
    this.crearMaquina(4, -1, 'paloTransporte');
    this.crearMaquina(-1, -4, 'paloTransporte');
    this.crearMaquina(-1, -1, 'paloTransporte');
    this.crearMaquina(-5, -1, 'paloTransporte');
    for(var i=-3; i<-1; i++) {
      this.crearMaquina(-1, i, 'correaTransporte', 'vertical');
    }
    for(var i=-4; i<-1; i++) {
      this.crearMaquina(i, -1, 'correaTransporte', 'horizontal');
    }
    for(var i=0; i<4; i++) {
      this.crearMaquina(i, -1, 'correaTransporte', 'horizontal');
    }
    for(var i=2; i<7; i++) {
      this.crearMaquina(0, i, 'correaTransporte', 'vertical');
    }
  }

  crearCamara() {
    var self = this;

    var configControles = {
      camera: this.cameras.main,
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      acceleration: 0.4,
      drag: 0.5,
      maxSpeed: 3.0
    };
    this.cameras.main.setBounds(-1280, -720, 2560, 1440).setZoom(4).centerOn(0, 0);

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(configControles);

    window.addEventListener('wheel', function(e) {
      var zoom = self.cameras.main.zoom
      if(e.deltaY < 0 && zoom < 4) {
        self.cameras.main.setZoom(zoom += 0.1);
      } else if(e.deltaY > 0 && zoom > 0.5) {
        self.cameras.main.setZoom(zoom -= 0.1);
      }
    });
  }

  crearFondo(tile, x, y) {
    var colores = this.textures.getPixel(x, y, 'mapa');
    if(colores.r == 0 && colores.g == 0 && colores.b == 255) {
      tile.fondo.tipo = 'f_agua';
    } else if(colores.r == 255 && colores.g == 0 && colores.b == 0) {
      tile.fondo.tipo = 'f_arena';
    } else if(colores.r == 0 && colores.g == 255 && colores.b == 0) {
      tile.fondo.tipo = 'f_hierba';
    } else if(colores.r == 0 && colores.g == 0 && colores.b == 0) {
      tile.fondo.tipo = 'f_piedra';
    } else {
      tile.fondo.tipo = 'aire';
    }
  }

  crearRecursos(tile, x, y) {
    var coloresR = this.textures.getPixel(x, y, 'recursos');
    if(coloresR.r == 120 && coloresR.g == 60 && coloresR.b == 0) {
      tile.recurso.tipo = 'madera';
    } else if(coloresR.r == 200 && coloresR.g == 200 && coloresR.b == 200) {
      tile.recurso.tipo = 'piedra';
    } else if(coloresR.r == 255 && coloresR.g == 255 && coloresR.b == 0) {
      tile.recurso.tipo = 'hierro';
    } else {
      tile.recurso.tipo = 'aire';
    }
    tile.recurso.nombre = RECURSO[tile.recurso.tipo].nombre;
    tile.recurso.puntos = RECURSO[tile.recurso.tipo].puntosMax;
    tile.recurso.puntosMax = RECURSO[tile.recurso.tipo].puntosMax;
  }
}
