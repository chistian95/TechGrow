class PicaPiedra extends Extractor {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'picaPiedra_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_picaPiedra');
    this.nombre = 'Pica Piedra';
    this.tipo = 'picaPiedra';
    this.recurso = 'piedra';

    this.postInit();
  }
}
