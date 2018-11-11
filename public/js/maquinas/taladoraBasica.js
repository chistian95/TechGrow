class TaladoraBasica extends Extractor {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'taladoraBasica_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_taladoraBasica');
    this.nombre = 'Taladora Básica';
    this.tipo = 'taladoraBasica';
    this.recurso = 'madera';

    this.postInit();
  }
}
