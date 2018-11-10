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

    this.input.addPointer(1);
    this.input.setTopOnly(true);
    this.input.on('gameobjectover', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('maquina')) {
        gameObject.setTint(0xcccccc);
      } else {
        selector.setVisible(true);
        selector.setPosition(gameObject.x, gameObject.y);
      }
    });
    this.input.on('gameobjectout', function (pointer, gameObject) {
      if(gameObject.data && gameObject.data.get('maquina')) {
        gameObject.clearTint();
      } else {
        selector.setVisible(false);
      }
    });
  }

  update(time, delta) {
    this.controls.update(delta);

    this.controlesMovil();
  }

  controlesMovil() {
    if(this.input.pointer1.isDown && this.input.pointer2.isDown) {
      if(this.origDragZoomPoints) {
        var zoom = this.cameras.main.zoom;
        var punteroAct1 = this.input.pointer1.position;
        var punteroAct2 = this.input.pointer2.position;
        var puntero1 = this.origDragZoomPoints[0];
        var puntero2 = this.origDragZoomPoints[1];

        if(punteroAct1.x != puntero1.x && punteroAct1.y != puntero1.y && punteroAct2.x != puntero2.x && punteroAct2.y != puntero2.y) {
          var distancia1 = Math.sqrt(Math.pow(puntero1.x - puntero2.x, 2) + Math.pow(puntero1.y - puntero2.y, 2));
          var distancia2 = Math.sqrt(Math.pow(punteroAct1.x - punteroAct2.x, 2) + Math.pow(punteroAct1.y - punteroAct2.y, 2));

          if(distancia1 < distancia2 && zoom < 4) {
            zoom += 0.2;
          } else if(distancia2 < distancia1 && zoom > 1) {
            zoom -= 0.2;
          }

          this.cameras.main.setZoom(zoom);
        }
      }
      this.origDragZoomPoints = [this.input.pointer1.position.clone(), this.input.pointer2.position.clone()];

      this.origDragPoint = null;
      return;
    }  else {
      this.origDragZoomPoints = null;
    }

    if(this.input.activePointer.isDown) {
      if(this.origDragPoint) {
        this.cameras.main.scrollX += (this.origDragPoint.x - this.input.activePointer.position.x)*0.5;
        this.cameras.main.scrollY += (this.origDragPoint.y - this.input.activePointer.position.y)*0.5;
      }
      this.origDragPoint = this.input.activePointer.position.clone();
    } else {
      this.origDragPoint = null;
    }
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

    new Casa(-1, 0, this);
    new PicaPiedra(5, -1, this);
    new PicaPiedra(4, 0, this);
    new HornoPiedra(-2, 0, this);
    new TaladoraBasica(-1, -5, this);
    new TaladoraBasica(-6, -1, this);
    new TaladoraBasica(1, 7, this);

    new PaloTransporte(0, 7, this);
    new PaloTransporte(0, 1, this);
    new PaloTransporte(4, -1, this);
    new PaloTransporte(-1, -4, this);
    new PaloTransporte(-1, -1, this);
    new PaloTransporte(-5, -1, this);
    for(var i=-3; i<-1; i++) {
      new CorreaTransporte(-1, i, this, 'vertical');
    }
    for(var i=-4; i<-1; i++) {
      new CorreaTransporte(i, -1, this, 'horizontal');
    }
    for(var i=0; i<4; i++) {
      new CorreaTransporte(i, -1, this, 'horizontal');
    }
    for(var i=2; i<7; i++) {
      new CorreaTransporte(0, i, this, 'vertical');
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
        zoom += 0.4;
      } else if(e.deltaY > 0 && zoom > 1) {
        zoom -= 0.4;
      }
      self.cameras.main.setZoom(zoom);
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
