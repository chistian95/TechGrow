class HornoPiedra extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'hornoPiedra_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_hornoPiedra');
    this.nombre = 'Horno de Piedra';
    this.tipo = 'hornoPiedra';
    this.subtipo = 'fragua';
    this.interfaz = 'hud_infoMaquinaFragua';
    this.invAcept.push('piedra');
    this.invAcept.push('madera');
    this.invAcept.push('hierro');

    this.postInit();

    scene.time.addEvent({delay: this.velocidad, callback: this.onTick, callbackScope: this, loop: true});
  }

  onTick() {
    var maquina = this;

    if(!maquina.activa) {
      return;
    }
  }
}
