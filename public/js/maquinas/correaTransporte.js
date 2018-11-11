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
    this.orientacion = orientacion;
    this.inputs = [0,0,0,0];

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
}
