class CorreaTransporte extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    if(orientacion == 'horizontal') {
      this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'correaLarga').setOrigin(0,0).setDataEnabled();
    } else {
      this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'correaLargaVertical').setOrigin(0,0).setDataEnabled();
    }
    this.nombre = 'Correa de Transporte';
    this.tipo = 'correaTransporte';
    this.subtipo = 'transporte';
    this.velocidad = 1000;
    this.transportando = false;
    this.transporteListo = false;
    this.orientacion = orientacion;

    if(this.orientacion == 'horizontal') {
      var coords = this.coords[0];
      var t = scene.tilesMundo[(coords.x-1)+","+coords.y];
      if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
        t.maquina.spriteExtra = scene.add.sprite(this.getCoordX(coords.x-1), this.getCoordY(y), 'terreno', 'correaPalo').setOrigin(0,0).setFlipX(true);
      }

      t = scene.tilesMundo[(coords.x+1)+","+coords.y];
      if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
        t.maquina.spriteExtra = scene.add.sprite(this.getCoordX(coords.x+1), this.getCoordY(y), 'terreno', 'correaPalo').setOrigin(0,0);
      }
    } else {
      var coords = this.coords[0];
      var t = scene.tilesMundo[coords.x+","+(coords.y-1)];
      if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
        t.maquina.spriteExtra = scene.add.sprite(this.getCoordX(x), this.getCoordY(y-1), 'terreno', 'correaPaloAbajo').setOrigin(0,0);
      }

      t = scene.tilesMundo[coords.x+","+(coords.y+1)];
      if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
        t.maquina.spriteExtra = scene.add.sprite(this.getCoordX(x), this.getCoordY(y+1), 'terreno', 'correaPaloArriba').setOrigin(0,0);
      }
    }

    this.postInit();
  }

  tickTransporte() {
    var scene = this.scene;
    var maquina = this;

    var coords = maquina.coords[0];
    if(maquina.orientacion == 'horizontal') {
      var maquinas = [];
      if(this.checkTransportarRecursoMaquina(scene.tilesMundo[(coords.x-1)+","+coords.y])) {
        maquinas.push('left');
      }
      if(this.checkTransportarRecursoMaquina(scene.tilesMundo[(coords.x+1)+","+coords.y])) {
        maquinas.push('right');
      }

      var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
      if(dir == 'left') {
        this.transportarRecursoMaquina(scene.tilesMundo[(coords.x-1)+","+coords.y]);
      } else if(dir == 'right') {
        this.transportarRecursoMaquina( scene.tilesMundo[(coords.x+1)+","+coords.y]);
      }
    } else {
      var maquinas = [];
      if(this.checkTransportarRecursoMaquina( scene.tilesMundo[coords.x+","+(coords.y-1)])) {
        maquinas.push('up');
      }
      if(this.checkTransportarRecursoMaquina( scene.tilesMundo[coords.x+","+(coords.y+1)])) {
        maquinas.push('down');
      }

      var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
      if(dir == 'up') {
        this.transportarRecursoMaquina(scene.tilesMundo[coords.x+","+(coords.y-1)]);
      } else if(dir == 'down') {
        this.transportarRecursoMaquina(scene.tilesMundo[coords.x+","+(coords.y+1)]);
      }
    }
  }
}
