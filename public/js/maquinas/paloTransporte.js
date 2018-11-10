class PaloTransporte extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'paloTransporte').setOrigin(0,0).setInteractive().setDataEnabled();
    this.nombre = 'Palo Transporte';
    this.tipo = 'paloTransporte';
    this.subtipo = 'paloTransporte';
    this.interfaz = 'hud_infoPaloTransporte';
    this.invAcept = ['TODO'];
    this.inputs = [0,0,0,0];

    this.postInit();
  }
}
