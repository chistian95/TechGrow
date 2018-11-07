class PaloTransporte extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'paloTransporte').setOrigin(0,0).setDataEnabled();
    this.nombre = 'Palo Transporte';
    this.tipo = 'paloTransporte';
    this.subtipo = 'transporte';
    this.invAcept = ['TODO'];
    this.invEntAcept = ['TODO'];
    this.pullItems = true;
    this.pushItems = true;

    this.postInit();
  }

  tickTransporte() {
    var scene = this.scene;
    var maquina = this;

    var coords = maquina.coords[0];
    var maquinas = [];
    if(this.checkCogerRecursoCorrea(scene.tilesMundo[coords.x+","+(coords.y-1)])) {
      maquinas.push('up');
    }
    if(this.checkCogerRecursoCorrea(scene.tilesMundo[coords.x+","+(coords.y+1)])) {
      maquinas.push('down');
    }
    if(this.checkCogerRecursoCorrea(scene.tilesMundo[(coords.x-1)+","+coords.y])) {
      maquinas.push('left');
    }
    if(this.checkCogerRecursoCorrea(scene.tilesMundo[(coords.x+1)+","+coords.y])) {
      maquinas.push('right');
    }

    var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
    if(dir == 'up') {
      this.cogerRecursoCorrea(scene.tilesMundo[coords.x+","+(coords.y-1)]);
    } else if(dir == 'down') {
      this.cogerRecursoCorrea(scene.tilesMundo[coords.x+","+(coords.y+1)]);
    } else if(dir == 'left') {
      this.cogerRecursoCorrea(scene.tilesMundo[(coords.x-1)+","+coords.y]);
    } else if(dir == 'right') {
      this.cogerRecursoCorrea(scene.tilesMundo[(coords.x+1)+","+coords.y]);
    }
  }
}
