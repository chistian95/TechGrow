class Casa extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    scene.tilesMundo[(x+1)+","+y].maquina = this;
    this.coords.push({x: x+1, y: y});
    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'casa_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_casa');
    this.nombre = 'Casa de Inventos';
    this.tipo = 'casa';
    this.subtipo = 'casa';
    this.interfaz = 'hud_infoMaquinaCasaInventos';
    
    this.invAcept.push("piedra");
    this.invAcept.push("madera");

    this.postInit();
  }
}
