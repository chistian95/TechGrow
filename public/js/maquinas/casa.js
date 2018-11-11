class Casa extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    scene.tilesMundo[(x+1)+","+y].maquina = this;
    this.coords[0].inputs = [INPUT.In, INPUT.Off, INPUT.In, INPUT.In];
    this.coords.push({x: x+1, y: y, inputs: [INPUT.In, INPUT.In, INPUT.In, INPUT.Off]});
    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'casa_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_casa');
    this.nombre = 'Casa de Inventos';
    this.tipo = 'casa';
    this.subtipo = 'casa';
    this.interfaz = 'hud_infoMaquinaCasaInventos';

    this.invAcept.push("piedra");
    this.invAcept.push("madera");

    this.postInit();
  }

  postInit() {
    super.postInit();
    this.scene.time.addEvent({delay: this.velocidad, callback: this.onTick, callbackScope: this, loop: true});
  }

  onTick() {
    if(!this.activa) {
      return;
    }

    for(var c in this.coords) {
      var coord = this.coords[c];
      var dirs = _.shuffle([0,1,2,3]);
      for(var d in dirs) {
        var dir = dirs[d];
        if(coord.inputs[dir] == INPUT.In && this.extraerItem(coord, dir)) {
          return;
        }
      }
    }
  }
}
