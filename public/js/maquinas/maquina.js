class Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    this.activa = true;
    this.coords = [{x: x, y: y, inputs: [INPUT.Off, INPUT.Off, INPUT.Off, INPUT.Off]}];
    this.inventario = {};
    this.invAcept = [];
    this.interfaz = 'hud_infoMaquinaGenerico';
    this.velocidad = 1000;
    this.eficiencia = 1;
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

  extraerItem(coord, dir, destino=this) {
    var maquina;
    if(dir == 0) {
      maquina = this.scene.tilesMundo[coord.x+","+(coord.y-1)].maquina;
      if(!maquina || _.isEmpty(maquina) || maquina == this || maquina.coords[0].inputs[2] != INPUT.Out) {
        maquina = false;
      }
    } else if(dir == 1) {
      maquina = this.scene.tilesMundo[(coord.x+1)+","+coord.y].maquina;
      if(!maquina || _.isEmpty(maquina) || maquina == this || maquina.coords[0].inputs[3] != INPUT.Out) {
        maquina = false;
      }
    } else if(dir == 2) {
      maquina = this.scene.tilesMundo[coord.x+","+(coord.y+1)].maquina;
      if(!maquina || _.isEmpty(maquina) || maquina == this || maquina.coords[0].inputs[0] != INPUT.Out) {
        maquina = false;
      }
    } else if(dir == 3) {
      maquina = this.scene.tilesMundo[(coord.x-1)+","+coord.y].maquina;
      if(!maquina || _.isEmpty(maquina) || maquina == this || maquina.coords[0].inputs[1] != INPUT.Out) {
        maquina = false;
      }
    }

    if(!maquina) {
      return false;
    }

    if(maquina.darItem(destino)) {
      return true;
    }

    return false;
  }

  darItem(target) {
    for(var item in this.inventario) {
      if(this.inventario[item] > 0 && target.invAcept.includes(item)) {
        this.inventario[item] -= 1;
        target.añadirItem(item, 1);
        return true;
      }
    }

    return false;
  }

  añadirItem(item, cant=1) {
    if(!this.inventario[item]) {
      this.inventario[item] = 0;
    }
    this.inventario[item] += cant;
  }
}
