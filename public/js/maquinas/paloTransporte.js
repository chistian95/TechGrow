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

    this.postInit();

    this.ajustarInputs();
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
      if(c1[1] < c2[1]) {
        p1 = c1;
        p2 = c2;
      } else {
        p1 = c2;
        p2 = c1;
      }

      for(var y=p1[1]+1; y<p2[1]; y++) {
        new CorreaTransporte(p1[0], y, scene, 'vertical');
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

      for(var x=p1[0]+1; x<p2[0]; x++) {
        new CorreaTransporte(x, p1[1], scene, 'horizontal');
      }
    }

    palo1.ajustarInputs();
    palo2.ajustarInputs();
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
