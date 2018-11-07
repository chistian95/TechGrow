var config = {
  type: Phaser.AUTO,
  parent: 'juegoDiv',
  width: 1280,
  height: 720,
  render: {
    antialias: false
  },
  banner: false,
  backgroundColor: '#1976d2',
  scene: [
    ScenePrecarga,
    ScenePrincipal,
    HUD_InfoRecursos,
    HUD_InfoMaquinaExtractor,
    HUD_InfoMaquinaCasaInventos
  ],
}

var game = new Phaser.Game(config);
