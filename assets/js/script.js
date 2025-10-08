var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', // 👈 IMPORTANTE: así se renderiza dentro del div del HTML
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};


var player;
var platforms;
var cursors;
var stars;
var bombs;
var score = 0;
var scoreText;
var gameOver = false;
var gameOverText;
var restartButton;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', '../images/sky.png');
    this.load.image('ground', '../images/platform.png');
    this.load.image('star', '../images/star.png');
    this.load.image('bomb', '../images/bomb.png');
    this.load.spritesheet('dude', '../images/dude.png', { frameWidth: 32, frameHeight: 48 });


}

function create() {
    this.add.image(400, 300, 'sky');

    // Plataformas
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Jugador
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // Estrellas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Puntuación
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Bombas
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Textos de Game Over (inicialmente ocultos)
    gameOverText = this.add.text(400, 250, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    restartButton = this.add.text(400, 340, 'Reiniciar', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#000000' })
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);

    restartButton.on('pointerover', () => {
        restartButton.setStyle({ fill: '#ffff00' });
    });

    restartButton.on('pointerout', () => {
        restartButton.setStyle({ fill: '#ffffff' });
    });

    restartButton.on('pointerdown', () => {
        this.scene.restart(); // Reinicia la escena completa
        score = 0;
        gameOver = false;
    });
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ?
            Phaser.Math.Between(400, 800) :
            Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;

    // Mostrar pantalla de Game Over
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
}

