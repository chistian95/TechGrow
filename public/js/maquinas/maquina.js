class Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    this.activa = true;
    this.coords = [{x: x, y: y}];
    this.inventario = {};
    this.invAcept = [];
    this.subtipo = 'generico';
    this.interfaz = 'hud_infoMaquinaGenerico';
    this.velocidad = 1000;
    this.eficiencia = 1;
    this.nombre = '';
    this.scene = scene;

    scene.tilesMundo[x+","+y].maquina = this;
  }

  postInit() {
    this.sprite.data.set('tipo', 'maquina');
    this.sprite.data.set('subtipo', this.subtipo);
    this.sprite.data.set('maquina', this.tipo);
    this.sprite.data.set('origenX', this.coords[0].x);
    this.sprite.data.set('origenY', this.coords[0].y);

    if(!this.scene.maquinas[this.tipo]) {
      this.scene.maquinas[this.tipo] = [];
    }
    this.scene.maquinas[this.tipo].push(this);
  }

  getCoordX(x) {
    return x * 32 - 16;
  }
  getCoordY(y) {
    return y * 32 - 16;
  }
}
