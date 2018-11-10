class ScenePrecarga extends Phaser.Scene {
  constructor() {
    super('precarga');
  }

  preload() {
    this.load.atlas('terreno', 'res/terreno.png', 'res/terreno.json');
    this.load.atlas('hud', 'res/hud.png', 'res/hud.json');
    this.load.image('mapa', 'res/mapaPreGen.png');
    this.load.image('recursos', 'res/recursosPreGen.png');
  }

  create() {
    this.scene.launch('principal');

    this.scene.launch('hud_infoRecursos');
    this.scene.launch('hud_infoMaquinaExtractor');
    this.scene.launch('hud_infoMaquinaCasaInventos');
    this.scene.launch('hud_infoPaloTransporte');

    this.crearAnimaciones();
  }

  crearAnimaciones() {
    this.anims.create({ key: 'animAgua', frames: this.anims.generateFrameNames('terreno', {prefix: 'f_agua_', end: 7}), repeat: -1, yoyo: true, frameRate: 3 });

    this.anims.create({ key: 'maquina_casa', frames: this.anims.generateFrameNames('terreno', {prefix: 'casa_', end: 1}), repeat: -1, frameRate: 4 });
    this.anims.create({ key: 'maquina_picaPiedra', frames: this.anims.generateFrameNames('terreno', {prefix: 'picaPiedra_', end: 3}), repeat: -1, frameRate: 6 });
    this.anims.create({ key: 'maquina_hornoPiedra', frames: this.anims.generateFrameNames('terreno', {prefix: 'hornoPiedra_', end: 7}), repeat: -1, frameRate: 8 });
    this.anims.create({ key: 'maquina_taladoraBasica', frames: this.anims.generateFrameNames('terreno', {prefix: 'taladoraBasica_', end: 5}), repeat: -1, yoyo: true, frameRate: 6 });
  }
}
