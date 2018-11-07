ScenePrincipal.include({
  TiposMaquinas: {
    paloTransporte: function(maquina, x, y, scene, orientacion='horizontal') {
      var self = ScenePrincipal.prototype;
      maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'paloTransporte').setOrigin(0,0).setDataEnabled();
      maquina.nombre = 'Palo Transporte';
      maquina.subtipo = 'transporte';
      maquina.velocidad = 1000;
      maquina.inventarioEntrada = [];
      maquina.invAcept = ['TODO'];
      maquina.invEntAcept = ['TODO'];
      maquina.pullItems = true;
      maquina.pushItems = true;
      maquina.orientacion = orientacion;

      maquina.tickTransporte = function(scene) {
        var coords = maquina.coords[0];

        var maquinas = [];
        if(scene.checkCogerRecursoCorrea(maquina, scene.tilesMundo[coords.x+","+(coords.y-1)])) {
          maquinas.push('up');
        }
        if(scene.checkCogerRecursoCorrea(maquina, scene.tilesMundo[coords.x+","+(coords.y+1)])) {
          maquinas.push('down');
        }
        if(scene.checkCogerRecursoCorrea(maquina, scene.tilesMundo[(coords.x-1)+","+coords.y])) {
          maquinas.push('left');
        }
        if(scene.checkCogerRecursoCorrea(maquina, scene.tilesMundo[(coords.x+1)+","+coords.y])) {
          maquinas.push('right');
        }

        var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
        if(dir == 'up') {
          scene.cogerRecursoCorrea(maquina, scene.tilesMundo[coords.x+","+(coords.y-1)]);
        } else if(dir == 'down') {
          scene.cogerRecursoCorrea(maquina, scene.tilesMundo[coords.x+","+(coords.y+1)]);
        } else if(dir == 'left') {
          scene.cogerRecursoCorrea(maquina, scene.tilesMundo[(coords.x-1)+","+coords.y]);
        } else if(dir == 'right') {
          scene.cogerRecursoCorrea(maquina, scene.tilesMundo[(coords.x+1)+","+coords.y]);
        }
      }
    },
    correaTransporte: function(maquina, x, y, scene, orientacion='horizontal') {
      var self = ScenePrincipal.prototype;
      if(orientacion == 'horizontal') {
          maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'correaLarga').setOrigin(0,0).setDataEnabled();
      } else {
        maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'correaLargaVertical').setOrigin(0,0).setDataEnabled();
      }
      maquina.nombre = 'Correa de Transporte';
      maquina.subtipo = 'transporte';
      maquina.velocidad = 1000;
      maquina.transportando = false;
      maquina.transporteListo = false;
      maquina.orientacion = orientacion;

      if(maquina.orientacion == 'horizontal') {
        var coords = maquina.coords[0];
        var t = scene.tilesMundo[(coords.x-1)+","+coords.y];
        if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
          t.maquina.spriteExtra = scene.add.sprite(self.getCoordX(coords.x-1), self.getCoordY(y), 'terreno', 'correaPalo').setOrigin(0,0).setFlipX(true);
        }

        t = scene.tilesMundo[(coords.x+1)+","+coords.y];
        if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
          t.maquina.spriteExtra = scene.add.sprite(self.getCoordX(coords.x+1), self.getCoordY(y), 'terreno', 'correaPalo').setOrigin(0,0);
        }
      } else {
        var coords = maquina.coords[0];
        var t = scene.tilesMundo[coords.x+","+(coords.y-1)];
        if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
          t.maquina.spriteExtra = scene.add.sprite(self.getCoordX(x), self.getCoordY(y-1), 'terreno', 'correaPaloAbajo').setOrigin(0,0);
        }

        t = scene.tilesMundo[coords.x+","+(coords.y+1)];
        if(t && Object.keys(t.maquina).length !== 0 && t.maquina.tipo == 'paloTransporte') {
          t.maquina.spriteExtra = scene.add.sprite(self.getCoordX(x), self.getCoordY(y+1), 'terreno', 'correaPaloArriba').setOrigin(0,0);
        }
      }

      maquina.tickTransporte = function(scene) {
        var coords = maquina.coords[0];
        if(maquina.orientacion == 'horizontal') {
          var maquinas = [];
          if(scene.checkTransportarRecursoMaquina(maquina, scene.tilesMundo[(coords.x-1)+","+coords.y])) {
            maquinas.push('left');
          }
          if(scene.checkTransportarRecursoMaquina(maquina, scene.tilesMundo[(coords.x+1)+","+coords.y])) {
            maquinas.push('right');
          }

          var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
          if(dir == 'left') {
            scene.transportarRecursoMaquina(maquina, scene.tilesMundo[(coords.x-1)+","+coords.y]);
          } else if(dir == 'right') {
            scene.transportarRecursoMaquina(maquina, scene.tilesMundo[(coords.x+1)+","+coords.y]);
          }
        } else {
          var maquinas = [];
          if(scene.checkTransportarRecursoMaquina(maquina, scene.tilesMundo[coords.x+","+(coords.y-1)])) {
            maquinas.push('up');
          }
          if(scene.checkTransportarRecursoMaquina(maquina, scene.tilesMundo[coords.x+","+(coords.y+1)])) {
            maquinas.push('down');
          }

          var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
          if(dir == 'up') {
            scene.transportarRecursoMaquina(maquina, scene.tilesMundo[coords.x+","+(coords.y-1)]);
          } else if(dir == 'down') {
            scene.transportarRecursoMaquina(maquina, scene.tilesMundo[coords.x+","+(coords.y+1)]);
          }
        }
      }
    },
    picaPiedra: function(maquina, x, y, scene) {
      var self = ScenePrincipal.prototype;
      maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'picaPiedra_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_picaPiedra');
      maquina.nombre = 'Pica Piedra';
      maquina.subtipo = 'extractor';
      maquina.interfaz = 'hud_infoMaquinaExtractor';

      maquina.onTick = function() {
        if(!maquina.activa) {
          return;
        }

        var x = maquina.sprite.data.get('origenX');
        var y = maquina.sprite.data.get('origenY');
        var tile = this.tilesMundo[x+','+y];

        if(!tile.recurso || tile.recurso.puntos == 0 || tile.recurso.tipo != 'piedra') {
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
      scene.time.addEvent({delay: maquina.velocidad, callback: maquina.onTick, callbackScope: scene, loop: true});
    },

    hornoPiedra: function(maquina, x, y, scene) {
      var self = ScenePrincipal.prototype;
      maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'hornoPiedra_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_hornoPiedra');
      maquina.nombre = 'Horno de Piedra';
      maquina.subtipo = 'fragua';
      maquina.interfaz = 'hud_infoMaquinaFragua';
      maquina.invAcept.push('piedra');
      maquina.invAcept.push('madera');
      maquina.invAcept.push('hierro');

      maquina.onTick = function() {
        if(!maquina.activa) {
          return;
        }
      }
      scene.time.addEvent({delay: maquina.velocidad, callback: maquina.onTick, callbackScope: scene, loop: true});
    },

    taladoraBasica: function(maquina, x, y, scene) {
      var self = ScenePrincipal.prototype;
      maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'taladoraBasica_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_taladoraBasica');
      maquina.nombre = 'Taladora Básica';
      maquina.subtipo = 'extractor';
      maquina.interfaz = 'hud_infoMaquinaExtractor';

      maquina.onTick = function() {
        if(!maquina.activa) {
          return;
        }

        var x = maquina.sprite.data.get('origenX');
        var y = maquina.sprite.data.get('origenY');
        var tile = this.tilesMundo[x+','+y];

        if(!tile.recurso || tile.recurso.puntos == 0 || tile.recurso.tipo != 'madera') {
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
      scene.time.addEvent({delay: maquina.velocidad, callback: maquina.onTick, callbackScope: scene, loop: true});
    },

    casa: function(maquina, x, y, scene) {
      var self = ScenePrincipal.prototype;
      scene.tilesMundo[(x+1)+","+y].maquina = maquina;
      maquina.coords.push({x: x+1, y: y});
      maquina.sprite = scene.add.sprite(self.getCoordX(x), self.getCoordY(y), 'terreno', 'casa_0').setOrigin(0,0).setInteractive().setDataEnabled().play('maquina_casa');
      maquina.nombre = 'Casa de Inventos';
      maquina.subtipo = 'casa';
      maquina.interfaz = 'hud_infoMaquinaCasaInventos';
      maquina.invEntAcept.push('piedra');
      maquina.invEntAcept.push('madera');
      maquina.pullItems = true;
    }
  },

  crearMaquina: function(x, y, tipo, orientacion='horizontal') {
    if(!this.maquinas[tipo]) {
      this.maquinas[tipo] = [];
    }

    var maquina = {
      activa: true,
      coords: [{x: x, y: y}],
      inventario: {},
      invAcept: [],
      inventarioEntrada: {},
      invEntAcept: [],
      tipo: tipo,
      subtipo: 'generico',
      interfaz: 'hud_infoMaquinaGenerico',
      pullItems: false,
      pullOcupado: false,
      pushItems: false,
      velocidad: 1000,
      eficiencia: 1,
    };
    this.tilesMundo[x+","+y].maquina = maquina;

    if(typeof this.TiposMaquinas[tipo] === 'function') {
      this.TiposMaquinas[tipo](maquina, x, y, this, orientacion);
    } else {
      var coordX = x * 32 - 16;
      var coordY = y * 32 - 16;
      maquina.sprite = this.add.sprite(coordX, coordY, 'terreno', tipo).setOrigin(0,0).setInteractive().setDataEnabled();
      maquina.nombre = '';
    }

    if(maquina.pullItems || maquina.pushItems) {
      maquina.onTickInventario = function() {
        for(var i in maquina.coords) {
          var coords = maquina.coords[i];
          if(maquina.pullItems) {
            var maquinas = [];
            if(this.checkExtraerRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y-1)])) {
              maquinas.push('up');
            }
            if(this.checkExtraerRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y+1)])) {
              maquinas.push('down');
            }
            if(this.checkExtraerRecursoMaquina(maquina, this.tilesMundo[(coords.x-1)+","+coords.y])) {
              maquinas.push('left');
            }
            if(this.checkExtraerRecursoMaquina(maquina, this.tilesMundo[(coords.x+1)+","+coords.y])) {
              maquinas.push('right');
            }

            var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
            if(dir == 'up') {
              this.extraerRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y-1)])
            } else if(dir == 'down') {
              this.extraerRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y+1)])
            } else if(dir == 'left') {
              this.extraerRecursoMaquina(maquina, this.tilesMundo[(coords.x-1)+","+coords.y])
            } else if(dir == 'right') {
              this.extraerRecursoMaquina(maquina, this.tilesMundo[(coords.x+1)+","+coords.y])
            }
          }
          if(maquina.pushItems) {
            var maquinas = [];
            if(this.checkInsertarRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y-1)])) {
              maquinas.push('up');
            }
            if(this.checkInsertarRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y+1)])) {
              maquinas.push('down');
            }
            if(this.checkInsertarRecursoMaquina(maquina, this.tilesMundo[(coords.x-1)+","+coords.y])) {
              maquinas.push('left');
            }
            if(this.checkInsertarRecursoMaquina(maquina, this.tilesMundo[(coords.x+1)+","+coords.y])) {
              maquinas.push('right');
            }

            var dir = maquinas[Math.floor(Math.random() * maquinas.length)];
            if(dir == 'up') {
              this.insertarRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y-1)]);
            } else if(dir == 'down') {
              this.insertarRecursoMaquina(maquina, this.tilesMundo[coords.x+","+(coords.y+1)]);
            } else if(dir == 'left') {
              this.insertarRecursoMaquina(maquina, this.tilesMundo[(coords.x-1)+","+coords.y]);
            } else if(dir == 'right') {
              this.insertarRecursoMaquina(maquina, this.tilesMundo[(coords.x+1)+","+coords.y]);
            }
          }
        }
      }
      this.time.addEvent({delay: maquina.velocidad, callback: maquina.onTickInventario, callbackScope: this, loop: true});
    }

    maquina.sprite.data.set('tipo', 'maquina');
    maquina.sprite.data.set('subtipo', maquina.subtipo);
    maquina.sprite.data.set('maquina', tipo);
    maquina.sprite.data.set('origenX', x);
    maquina.sprite.data.set('origenY', y);

    this.maquinas[tipo].push(maquina);
  },

  getCoordX: function(x) {
    return x * 32 - 16;
  },
  getCoordY: function(y) {
    return y * 32 - 16;
  },

  checkCogerRecursoCorrea: function(maquina, target) {
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
  },

  cogerRecursoCorrea: function(maquina, target) {
    var self = this;
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
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            x: maquina.spriteTransporte.x + 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        } else {
          this.tweens.add({
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
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad / 2,
            y: maquina.spriteTransporte.y + 16,
            onComplete: function() {
              if(maquina.spriteTransporte) maquina.spriteTransporte.destroy();
              maquina.spriteTransporte = false;
            }
          });
        } else {
          this.tweens.add({
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
  },

  checkTransportarRecursoMaquina: function(maquina, target) {
    var self = this;
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
  },

  transportarRecursoMaquina: function(maquina, target) {
    var self = this;
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
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            x: maquina.spriteTransporte.x + 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y].maquina.tickTransporte(self);
            }
          });
        } else {
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            x: maquina.spriteTransporte.x - 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y].maquina.tickTransporte(self);
            }
          });
        }
      } else {
        if(target.coords[0].y < maquina.coords[0].y) {
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            y: maquina.spriteTransporte.y + 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)].maquina.tickTransporte(self);
            }
          });
        } else {
          this.tweens.add({
            targets: maquina.spriteTransporte,
            duration: maquina.velocidad,
            y: maquina.spriteTransporte.y - 32,
            onComplete: function() {
              maquina.transporteListo = true;

              self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)].maquina.tickTransporte(self);
            }
          });
        }
      }
    }
  },

  checkExtraerRecursoMaquina: function(maquina, target) {
    var self = this;
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
  },

  extraerRecursoMaquina: function(maquina, target) {
    var self = this;
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
              maquina.spriteTransporte = this.add.sprite(self.getCoordX(maquina.coords[0].x), self.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporte').setOrigin(0,0);
              this.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                x: maquina.spriteTransporte.x - 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[(maquina.coords[0].x - 1)+","+maquina.coords[0].y].maquina.tickTransporte(self);
                }
              });
            } else if(dir == 'drc') {
              t = self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y];
              maquina.spriteTransporte = this.add.sprite(self.getCoordX(maquina.coords[0].x), self.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporte').setOrigin(0,0);
              this.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                x: maquina.spriteTransporte.x + 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[(maquina.coords[0].x + 1)+","+maquina.coords[0].y].maquina.tickTransporte(self);
                }
              });
            } else if(dir == 'up') {
              t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y - 1)];
              maquina.spriteTransporte = this.add.sprite(self.getCoordX(maquina.coords[0].x), self.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporteVertical').setOrigin(0,0);
              this.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                y: maquina.spriteTransporte.y - 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y-1)].maquina.tickTransporte(self);
                }
              });
            } else if(dir == 'down') {
              t = self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y + 1)];
              maquina.spriteTransporte = this.add.sprite(self.getCoordX(maquina.coords[0].x), self.getCoordY(maquina.coords[0].y), 'terreno', 'cestaTransporteVertical').setOrigin(0,0);
              this.tweens.add({
                targets: maquina.spriteTransporte,
                duration: maquina.velocidad / 2,
                delay: maquina.velocidad / 2,
                y: maquina.spriteTransporte.y + 16,
                onComplete: function() {
                  maquina.inventarioEntrada[item] += 1;
                  maquina.pullOcupado = false;

                  self.tilesMundo[maquina.coords[0].x+","+(maquina.coords[0].y+1)].maquina.tickTransporte(self);
                }
              });
            }
          }

          return;
        }
        maquina.inventarioEntrada[item] += 1;
      }
    }
  },

  checkInsertarRecursoMaquina: function(maquina, target) {
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
  },

  insertarRecursoMaquina: function(maquina, target) {
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
});
