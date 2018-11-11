class PaloTransporte extends Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    super(x, y, scene, orientacion);

    this.sprite = scene.add.sprite(this.getCoordX(x), this.getCoordY(y), 'terreno', 'paloTransporte').setOrigin(0,0).setInteractive().setDataEnabled();
    this.nombre = 'Palo Transporte';
    this.tipo = 'paloTransporte';
    this.subtipo = 'paloTransporte';
    this.interfaz = 'hud_infoPaloTransporte';
    this.invAcept = ['TODO'];
    this.coords[0].inputs = [INPUT.Off, INPUT.Off, INPUT.Off, INPUT.Off];
    this.enlaces = [];
    this.activa = false;

    this.postInit();
    this.ajustarInputs();
  }

  darItem(target, recorrido=[]) {
    recorrido = recorrido.slice(0);
    recorrido.push(this);

    var dirs = _.shuffle([0,1,2,3]);
    for(var d in dirs) {
      var dir = dirs[d];
      if(this.extraerItem(this.coords[0], dir, target, recorrido)) {
        return true;
      }
    }

    var enlaces = _.shuffle(this.enlaces);
    for(var en in enlaces) {
      var enlace = enlaces[en];

      if(enlace.coords[0].y == this.coords[0].y) { //horizontal
        if(enlace.coords[0].x < this.coords[0].x) { //oeste
          if(this.coords[0].inputs[3] == INPUT.In && enlace.coords[0].inputs[1] == INPUT.Out) {
             enlace.darItem(target, recorrido);
          }
        } else { //este
          if(this.coords[0].inputs[1] == INPUT.In && enlace.coords[0].inputs[3] == INPUT.Out) {
            enlace.darItem(target, recorrido);
          }
        }
      } else { //vertical
        if(enlace.coords[0].y < this.coords[0].y) { //norte
          if(this.coords[0].inputs[0] == INPUT.In && enlace.coords[0].inputs[2] == INPUT.Out) {
            enlace.darItem(target, recorrido);
          }
        } else { //sur
          if(this.coords[0].inputs[2] == INPUT.In && enlace.coords[0].inputs[0] == INPUT.Out) {
            enlace.darItem(target, recorrido);
          }
        }
      }
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
    if(_.isEmpty(target)) {
      this.coords[0].inputs[n] = INPUT.Off;
      return;
    }

    if(target.subtipo == 'casa') {
      this.coords[0].inputs[n] = INPUT.Out;
      return;
    }

    if(target.subtipo == 'extractor') {
      this.coords[0].inputs[n] = INPUT.In;
      return;
    }
  }

  crearEnlace(palo) {
    for(var p in this.enlaces) {
      var maquina = this.enlaces[p];
      if(maquina.coords[0].x == palo.coords[0].x && maquina.coords[0].y == palo.coords[0].y) {
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

    var palo1;
    var palo2;

    if(!_.isEmpty(scene.tilesMundo[c1[0]+","+c1[1]].maquina) && scene.tilesMundo[c1[0]+","+c1[1]].maquina.tipo == 'paloTransporte') {
      palo1 = scene.tilesMundo[c1[0]+","+c1[1]].maquina;
    }
    if(!_.isEmpty(scene.tilesMundo[c2[0]+","+c2[1]].maquina) && scene.tilesMundo[c2[0]+","+c2[1]].maquina.tipo == 'paloTransporte') {
      palo2 = scene.tilesMundo[c2[0]+","+c2[1]].maquina;
    }

    if(!palo1) {
      palo1 = new PaloTransporte(c1[0], c1[1], scene);
    }
    if(!palo2) {
      palo2 = new PaloTransporte(c2[0], c2[1], scene);
    }
    palo1.crearEnlace(palo2);
    palo2.crearEnlace(palo1);

    if(c1[0] == c2[0]) { //vertical
      var p1, p2;
      if(c1[1] < c2[1]) { //norte
        p1 = c1;
        p2 = c2;

        palo1.coords[0].inputs[2] = INPUT.Out;
        palo2.coords[0].inputs[0] = INPUT.In;
      } else { //sur
        p1 = c2;
        p2 = c1;

        palo1.coords[0].inputs[0] = INPUT.Out;
        palo2.coords[0].inputs[2] = INPUT.In;
      }

      for(var y=p1[1]+1; y<p2[1]; y++) {
        new CorreaTransporte(p1[0], y, scene, 'vertical');
      }
    } else { //horizontal
      var p1, p2;
      if(c1[0] < c2[0]) { //este
        p1 = c1;
        p2 = c2;

        palo1.coords[0].inputs[1] = INPUT.Out;
        palo2.coords[0].inputs[3] = INPUT.In;
      } else { //oeste
        p1 = c2;
        p2 = c1;

        palo1.coords[0].inputs[3] = INPUT.Out;
        palo2.coords[0].inputs[1] = INPUT.In;
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
