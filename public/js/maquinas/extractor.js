class Extractor extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.subtipo = 'extractor';
    this.interfaz = 'hud_infoMaquinaExtractor';
    this.coords[0].inputs = [INPUT.Out,INPUT.Out,INPUT.Out,INPUT.Out];
  }

  postInit() {
    super.postInit();
    this.scene.time.addEvent({delay: this.velocidad, callback: this.onTick, callbackScope: this, loop: true});
  }

  onTick() {
    var maquina = this;
    var scene = this.scene;

    if(!maquina.activa) {
      return;
    }

    var x = maquina.sprite.data.get('origenX');
    var y = maquina.sprite.data.get('origenY');
    var tile = scene.tilesMundo[x+','+y];

    if(!tile.recurso || tile.recurso.puntos == 0 || tile.recurso.tipo != maquina.recurso) {
      return;
    }
    tile.recurso.puntos -= maquina.eficiencia;

    if(!maquina.inventario[tile.recurso.tipo]) {
      maquina.inventario[tile.recurso.tipo] = 0;
    }
    maquina.inventario[tile.recurso.tipo] += maquina.eficiencia;

    if(tile.recurso.puntos / tile.recurso.puntosMax <= 0.20) {
      if(tile.recurso.sprite.frame.name != tile.recurso.tipo+'_2') {
          tile.recurso.sprite.setFrame(tile.recurso.tipo+'_2');
      }
    } else if(tile.recurso.puntos / tile.recurso.puntosMax <= 0.65) {
      if(tile.recurso.sprite.frame.name != tile.recurso.tipo+'_1') {
          tile.recurso.sprite.setFrame(tile.recurso.tipo+'_1');
      }
    }

    if(tile.recurso.puntos == 0) {
      maquina.activa = false;
      maquina.sprite.anims.stopOnRepeat();
      tile.recurso.sprite.destroy();
    }
  }
}
