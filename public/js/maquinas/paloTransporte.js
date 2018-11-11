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
    this.enlaces = [];
    this.activa = false;
    this.item = false;

    this.postInit();
    this.ajustarInputs();
  }

  postInit() {
    super.postInit();

    this.scene.time.addEvent({delay: this.velocidad, callback: this.onTick, callbackScope: this, loop: true});
  }

  onTick() {
    var dirs = _.shuffle([0,1,2,3]);

    for(var i=0; i<dirs.length; i++) {
      var dir = dirs[i];
      if(this.inputs[dir] == 2 && this.cogerItem(dir)) {
        return;
      } else if(this.inputs[dir] == 1 && this.enviarItem(dir)) {
        return;
      }
    }

    var enlaces = _.shuffle(this.enlaces);
    for(var i=0; i<enlaces.length; i++) {
      var enlace = enlaces[i];
      if(enlace.item) {
        continue;
      }

      if(enlace.coords[0].y == this.coords[0].y) { //horizontal
        if(enlace.coords[0].x < this.coords[0].x) { //oeste
          if(this.inputs[3] == 1 && enlace.inputs[1] == 2) {
            enlace.item = this.item;
            this.item = false;
            return;
          }
        } else { //este
          if(this.inputs[1] == 1 && enlace.inputs[3] == 2) {
            enlace.item = this.item;
            this.item = false;
            return;
          }
        }
      } else if(enlace.coords[0].x == this.coords[0].x) { //vertical
        if(enlace.coords[0].y < this.coords[0].y) { //sur
          if(this.inputs[0] == 1 && enlace.inputs[2] == 2) {
            enlace.item = this.item;
            this.item = false;
            return;
          }
        } else { //norte
          if(this.inputs[2] == 1 && enlace.inputs[0] == 2) {
            enlace.item = this.item;
            this.item = false;
            return;
          }
        }
      }
    }
  }

  cogerItem(dir) {
    if(this.item) {
      return false;
    }

    var maquina;
    var x = this.coords[0].x;
    var y = this.coords[0].y;
    if(dir == 0) {
      maquina = this.scene.tilesMundo[x+","+(y-1)].maquina;
    } else if(dir == 1) {
      maquina = this.scene.tilesMundo[(x+1)+","+y].maquina;
    } else if(dir == 2) {
      maquina = this.scene.tilesMundo[x+","+(y+1)].maquina;
    } else if(dir == 3) {
      maquina = this.scene.tilesMundo[(x-1)+","+y].maquina;
    }

    if(!maquina || _.isEmpty(maquina)) {
      return false;
    }

    var item;
    for(var i in maquina.inventario) {
      if(maquina.inventario[i] > 0) {
        item = i;
        maquina.inventario[i]--;
        break;
      }
    }

    if(!item) {
      return false;
    }

    this.item = item;

    return true;
  }

  enviarItem(dir) {
    if(!this.item) {
      return false;
    }

    var maquina;
    var x = this.coords[0].x;
    var y = this.coords[0].y;
    if(dir == 0) {
      maquina = this.scene.tilesMundo[x+","+(y-1)].maquina;
    } else if(dir == 1) {
      maquina = this.scene.tilesMundo[(x+1)+","+y].maquina;
    } else if(dir == 2) {
      maquina = this.scene.tilesMundo[x+","+(y+1)].maquina;
    } else if(dir == 3) {
      maquina = this.scene.tilesMundo[(x-1)+","+y].maquina;
    }

    if(!maquina || _.isEmpty(maquina)) {
      return false;
    }

    if(!maquina.invAcept.includes(this.item)) {
      return false;
    }

    if(maquina.tipo == 'paloTransporte') {
      if(maquina.item) {
        return false;
      }

      maquina.item = this.item;
      this.item = false;
      return true;
    }

    if(!maquina.inventario[this.item]) {
      maquina.inventario[this.item] = 0;
    }
    maquina.inventario[this.item]++;
    this.item = false;

    return true;
  }

  enviarItemTransporte(dir, maquina) {
    if(maquina.tipo == 'paloTransporte') {

    }

    return false;
  }

  ajustarInputs() {
    var target;
    var x = this.coords[0].x;
    var y = this.coords[0].y;

    //norte
    target = this.scene.tilesMundo[x+","+(y-1)].maquina;
    this.ajustarInput(target, 0);

    //este
    target = this.scene.tilesMundo[(x+1)+","+y].maquina;
    this.ajustarInput(target, 1);

    //sur
    target = this.scene.tilesMundo[x+","+(y+1)].maquina;
    this.ajustarInput(target, 2);

    //oeste
    target = this.scene.tilesMundo[(x-1)+","+y].maquina;
    this.ajustarInput(target, 3);
  }

  ajustarInput(target, n) {
    //off
    if(_.isEmpty(target)) {
      this.inputs[n] = 0;
      return;
    }

    //expulsar
    if(target.subtipo == 'casa') {
      this.inputs[n] = 1;
      return;
    }

    //recoger
    if(target.subtipo == 'extractor') {
      this.inputs[n] = 2;
      return;
    }
  }

  crearEnlace(palo) {
    for(var p in this.enlaces) {
      if(p.coords[0].x == palo.coords[0].x && p.coords[0].y == palo.coords[0].y) {
        return;
      }
    }

    this.enlaces.push(palo);
  }

  static crearTransporte(c1, c2, scene) {
    if(!PaloTransporte.checkCreacion(c1,c2,scene)) {
      console.log(`Transporte imposible para coordenadas ${c1[0]},${c1[1]} ; ${c2[0]},${c2[1]}`);
      return;
    }

    var palo1 = new PaloTransporte(c1[0], c1[1], scene);
    var palo2 = new PaloTransporte(c2[0], c2[1], scene);
    palo1.crearEnlace(palo2);
    palo2.crearEnlace(palo1);

    if(c1[0] == c2[0]) { //vertical
      var p1, p2;
      if(c1[1] < c2[1]) { //norte
        p1 = c1;
        p2 = c2;

        palo1.inputs[2] = 1;
        palo2.inputs[0] = 2;
      } else { //sur
        p1 = c2;
        p2 = c1;

        palo1.inputs[0] = 1;
        palo2.inputs[2] = 2;
      }

      for(var y=p1[1]+1; y<p2[1]; y++) {
        new CorreaTransporte(p1[0], y, scene, 'vertical');
      }
    } else { //horizontal
      var p1, p2;
      if(c1[0] < c2[0]) { //este
        p1 = c1;
        p2 = c2;

        palo1.inputs[1] = 1;
        palo2.inputs[3] = 2;
      } else { //oeste
        p1 = c2;
        p2 = c1;

        palo1.inputs[3] = 1;
        palo2.inputs[1] = 2;
      }

      for(var x=p1[0]+1; x<p2[0]; x++) {
        new CorreaTransporte(x, p1[1], scene, 'horizontal');
      }
    }

    palo1.activa = true;
    palo2.activa = true;
  }

  static checkCreacion(c1, c2, scene) {
    if(c1[0] != c2[0] && c1[1] != c2[1]) {
      return false;
    }
    if(c1[0] == c2[0] && c1[1] == c2[1]) {
      return false;
    }

    if(c1[0] == c2[0]) { //vertical
      var p1, p2;
      if(c1[1] < c2[1]) {
        p1 = c1;
        p2 = c2;
      } else {
        p1 = c2;
        p2 = c1;
      }

      for(var y=p1[1]; y<p2[1]; y++) {
        if(!_.isEmpty(scene.tilesMundo[p1[0]+","+y].maquina)) {
          return false;
        }
      }
    } else { //horizontal
      var p1, p2;
      if(c1[0] < c2[0]) {
        p1 = c1;
        p2 = c2;
      } else {
        p1 = c2;
        p2 = c1;
      }

      for(var x=p1[0]; x<p2[0]; x++) {
        if(!_.isEmpty(scene.tilesMundo[x+","+p1[1]].maquina)) {
          return false;
        }
      }
    }

    return true;
  }
}
