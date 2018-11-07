class Maquina {
  constructor(x, y, scene, orientacion='horizontal') {
    this.activa = true;
    this.coords = [{x: x, y: y}];
    this.inventario = {};
    this.invAcept = [];
    this.inventarioEntrada = {};
    this.invEntAcept = [];
    this.subtipo = 'generico';
    this.interfaz = 'hud_infoMaquinaGenerico';
    this.pullItems = false;
    this.pullOcupado = false;
    this.pushItems = false;
    this.velocidad = 1000;
    this.eficiencia = 1;
    this.nombre = '';
    this.scene = scene;

    scene.tilesMundo[x+","+y].maquina = this;
  }

  postInit() {
    if(this.pullItems || this.pushItems) {
      this.scene.time.addEvent({delay: this.velocidad, callback: this.onTickInventario, callbackScope: this, loop: true});
    }

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

  onTickInventario() {
    for(var i in this.coords) {
      var coords = this.coords[i];
      if(this.pullItems) {
        var maquinas = [];
        if(this.checkExtraerRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y-1)])) {
          maquinas.push('up');
        }
        if(this.checkExtraerRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y+1)])) {
          maquinas.push('down');
        }
        if(this.checkExtraerRecursoMaquina(this.scene.tilesMundo[(coords.x-1)+","+coords.y])) {
          maquinas.push('left');
        }
        if(this.checkExtraerRecursoMaquina(this.scene.tilesMundo[(coords.x+1)+","+coords.y])) {
          maquinas.push('right');
        }

        var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
        if(dir == 'up') {
          this.extraerRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y-1)])
        } else if(dir == 'down') {
          this.extraerRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y+1)])
        } else if(dir == 'left') {
          this.extraerRecursoMaquina(this.scene.tilesMundo[(coords.x-1)+","+coords.y])
        } else if(dir == 'right') {
          this.extraerRecursoMaquina(this.scene.tilesMundo[(coords.x+1)+","+coords.y])
        }
      }
      if(this.pushItems) {
        var maquinas = [];
        if(this.checkInsertarRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y-1)])) {
          maquinas.push('up');
        }
        if(this.checkInsertarRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y+1)])) {
          maquinas.push('down');
        }
        if(this.checkInsertarRecursoMaquina(this.scene.tilesMundo[(coords.x-1)+","+coords.y])) {
          maquinas.push('left');
        }
        if(this.checkInsertarRecursoMaquina(this.scene.tilesMundo[(coords.x+1)+","+coords.y])) {
          maquinas.push('right');
        }

        var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
        if(dir == 'up') {
          this.insertarRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y-1)]);
        } else if(dir == 'down') {
          this.insertarRecursoMaquina(this.scene.tilesMundo[coords.x+","+(coords.y+1)]);
        } else if(dir == 'left') {
          this.insertarRecursoMaquina(this.scene.tilesMundo[(coords.x-1)+","+coords.y]);
        } else if(dir == 'right') {
          this.insertarRecursoMaquina(this.scene.tilesMundo[(coords.x+1)+","+coords.y]);
        }
      }
    }
  }

  getCoordX(x) {
    return x * 32 - 16;
  }
  getCoordY(y) {
    return y * 32 - 16;
  }

  checkCogerRecursoCorrea(target) {
    var maquina = this;
    if(!target) {
      return false;
    }

    target = target.maquina;

    if(!maquina || maquina.transportando || Object.keys(target).length === 0 || target.tipo != 'correaTransporte' || maquina == target) {
      return false;
    }

    if(!target.transporteListo || (target.transportando.origen.x == maquina.coords[0].x && target.transportando.origen.y == maquina.coords[0].y)) {
      return false;
    }

    var itemTransportar = target.transportando;
    if(!maquina.inventario[itemTransportar.item]) {
      maquina.inventario[itemTransportar.item] = 0;
    }
    if(maquina.inventario[itemTransportar.item] > 0) {
      return false;
    }

    if(target.spriteTransporte) {
      return true;
    }

    return false;
  }

  cogerRecursoCorrea(target) {
    var self = this.scene;
    var maquina = this;
    target = target.maquina;

    var itemTransportar = target.transportando;
    maquina.inventario[itemTransportar.item] += itemTransportar.cantidad;

    target.transportando = false;
    target.transporteListo = false;

    if(target.spriteTransporte) {
      if(maquina.spriteTransporte) {
        target.spriteTransporte.destroy();
        target.spriteTransporte = false;

        return true;
      }
      maquina.spriteTransporte = target.spriteTransporte;
      target.spriteTransporte = false;

      if(target.orientacion == 'horizontal') {
        if(target.coords[0].x < maquina.coords[0].x) {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            x: maquina.spriteTransporte.x + 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        } else {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            x: maquina.spriteTransporte.x - 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        }
      } else {
        if(target.coords[0].y < maquina.coords[0].y) {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            y: maquina.spriteTransporte.y + 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        } else {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            y: maquina.spriteTransporte.y - 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        }
      }
    }
  }

  checkTransportarRecursoMaquina(target) {
    var self = this.scene;
    var maquina = this;
    if(!target) {
      return false;
    }
    target = target.maquina;

    if(!maquina || maquina.transportando || Object.keys(target).length === 0 || maquina == target) {
      return false;
    }

    if(target.tipo == 'paloTransporte') {
      for(var item in target.inventarioEntrada) {
        if(target.inventarioEntrada[item] > 0) {
          return true;
        }
      }
    } else if(target.tipo == 'correaTransporte') {
      if(!target.transporteListo || (target.transportando.origen.x == maquina.coords[0].x && target.transportando.origen.y == maquina.coords[0].y)) {
        return false;
      }
      return true;
    }
    return false;
  }

  transportarRecursoMaquina(target) {
    var self = this.scene;
    var maquina = this;
    target = target.maquina;
    var itemTransportar = false;
    if(target.tipo == 'paloTransporte') {
      for(var item in target.inventarioEntrada) {
        if(target.inventarioEntrada[item] > 0) {
          target.inventarioEntrada[item] -= 1;
          itemTransportar = {
            item: item,
            cantidad: 1,
            origen: {x: target.coords[0].x, y: target.coords[0].y},
          };
          break;
        }
      }
    } else if(target.tipo == 'correaTransporte') {
      itemTransportar = target.transportando;
      itemTransportar.origen.x = target.coords[0].x;
      itemTransportar.origen.y = target.coords[0].y;
      target.transportando = false;
      target.transporteListo = false;
    }
    if(!itemTransportar) {
      return;
    }

    maquina.transportando = itemTransportar;

    if(target.spriteTransporte) {
      maquina.spriteTransporte = target.spriteTransporte;
      target.spriteTransporte = false;

      if(maquina.orientacion == 'horizontal') {
        if(target.coords[0].x < maquina.coords[0].x) {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            x: maquina.spriteTransporte.x + 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y].maquina.tickTransporte();
            }
          });
        } else {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            x: maquina.spriteTransporte.x - 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y].maquina.tickTransporte();
            }
          });
        }
      } else {
        if(target.coords[0].y < maquina.coords[0].y) {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            y: maquina.spriteTransporte.y + 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)].maquina.tickTransporte();
            }
          });
        } else {
          self.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            y: maquina.spriteTransporte.y - 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)].maquina.tickTransporte();
            }
          });
        }
      }
    }
  }

  checkExtraerRecursoMaquina(target) {
    var self = this.scene;
    var maquina = this;
    if(!target) {
      return false;
    }
    target = target.maquina;

    if(!maquina || maquina.pullOcupado || Object.keys(target).length === 0 || maquina == target) {
      return false;
    }

    for(var item in target.inventario) {
      if(target.inventario[item] > 0 && (maquina.invEntAcept.indexOf(item) >= 0 || maquina.invEntAcept[0] == 'TODO')) {
        if(maquina.tipo == 'paloTransporte') {
          var correas = [];
          var t = self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('izq');
          }
          t = self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('drc');
          }
          t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('up');
          }
          t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('down');
          }

          if(correas.length > 0) {
            return true;
          }
          return false;
        }
        return true;
      }
    }

    return false;
  }

  extraerRecursoMaquina(target) {
    var self = this.scene;
    var maquina = this;
    target = target.maquina;

    for(var item in target.inventario) {
      if(target.inventario[item] > 0 && (maquina.invEntAcept.indexOf(item) >= 0 || maquina.invEntAcept[0] == 'TODO')) {
        if(!maquina.inventarioEntrada[item]) {
          maquina.inventarioEntrada[item] = 0;
        }
        target.inventario[item] -= 1;

        if(maquina.tipo == 'paloTransporte') {
          maquina.pullOcupado = true;

          var correas = [];
          var t = self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('izq');
          }
          t = self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('drc');
          }
          t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('up');
          }
          t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)];
          if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'correaTransporte') {
            correas.push('down');
          }

          if(correas.length > 0) {
            var dir = correas[Math.floor(Math.random() * correas.length)];
            var t = false;
            if(dir == 'izq') {
              t = self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y];
              maquina.spriteTransporte = self.add.sprite(maquina.getCoordX(maquina.coords[0].x), maquina.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporte').setOrigin(0,0);
              self.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                x: maquina.spriteTransporte.x - 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y].maquina.tickTransporte();
                }
              });
            } else if(dir == 'drc') {
              t = self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y];
              maquina.spriteTransporte = self.add.sprite(maquina.getCoordX(maquina.coords[0].x), maquina.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporte').setOrigin(0,0);
              self.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                x: maquina.spriteTransporte.x + 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y].maquina.tickTransporte();
                }
              });
            } else if(dir == 'up') {
              t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)];
              maquina.spriteTransporte = self.add.sprite(maquina.getCoordX(maquina.coords[0].x), maquina.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporteVertical').setOrigin(0,0);
              self.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                y: maquina.spriteTransporte.y - 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y-1)].maquina.tickTransporte();
                }
              });
            } else if(dir == 'down') {
              t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)];
              maquina.spriteTransporte = self.add.sprite(maquina.getCoordX(maquina.coords[0].x), maquina.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporteVertical').setOrigin(0,0);
              self.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                y: maquina.spriteTransporte.y + 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y+1)].maquina.tickTransporte();
                }
              });
            }
          }

          return;
        }
        maquina.inventarioEntrada[item] += 1;
      }
    }
  }

  checkInsertarRecursoMaquina(target) {
    var maquina = this;
    if(!target) {
      return false;
    }
    target = target.maquina;

    if(!maquina || Object.keys(target).length === 0 || maquina == target) {
      return false;
    }

    for(var item in maquina.inventario) {
      if(maquina.inventario[item] > 0 && (target.invEntAcept.indexOf(item) >= 0 || target.invEntAcept[0] == 'TODO')) {
        return true;
      }
    }
    return false;
  }

  insertarRecursoMaquina(target) {
    var maquina = this;
    target = target.maquina;
    for(var item in maquina.inventario) {
      if(maquina.inventario[item] > 0 && (target.invEntAcept.indexOf(item) >= 0 || target.invEntAcept[0] == 'TODO')) {
        if(!target.inventarioEntrada[item]) {
          target.inventarioEntrada[item] = 0;
        }
        target.inventarioEntrada[item] += 1;
        maquina.inventario[item] -= 1;
      }
    }
  }
}
