var GameState = {
    preload: function() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('correct', 'assets/images/correct.png');
        this.load.image('wrong', 'assets/images/wrong.png');
        this.load.image('arm', 'assets/images/arm.png');
        this.load.image('ear', 'assets/images/ear.png');
        this.load.image('eye', 'assets/images/eye.png');
        this.load.image('foot', 'assets/images/foot.png');
        this.load.image('hand', 'assets/images/hand.png');
        this.load.image('leg', 'assets/images/leg.png');
        this.load.image('nose', 'assets/images/nose.png');
        this.load.image('head', 'assets/images/head.png');
        this.load.image('heartEmpty', 'assets/images/heart-empty.png');
        this.load.image('heartFull', 'assets/images/heart-full.png');
        this.load.image('restart', 'assets/images/restart.png');

        this.load.audio('correctSound', ['assets/sound/correct.ogg', 'assets/sound/correct.mp3']);
        this.load.audio('wrongSound', ['assets/sound/wrong.ogg', 'assets/sound/wrong.mp3']);
        this.load.audio('musicSound', ['assets/sound/music.ogg', 'assets/sound/music.mp3']);
    },

    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.score = 0;
        this.hpThreshold = 0;

        this.background = this.game.add.sprite(0, 0, 'background');
        this.restart = this.game.add.sprite(-1000, -1000, 'restart');
        this.restart.anchor.setTo(0.5);
        this.restart.scale.setTo(0.1);
        this.restart.inputEnabled = true;
        this.restart.input.pixelPerfectClick = true;
        this.restart.events.onInputDown.add(this.resetGame, this);

        this.bodyParts = [
            { key: 'arm', text: 'ARM' },
            { key: 'ear', text: 'EAR' },
            { key: 'eye', text: 'EYE' },
            { key: 'foot', text: 'FOOT' },
            { key: 'hand', text: 'HAND' },
            { key: 'leg', text: 'LEG' },
            { key: 'nose', text: 'NOSE' },
            { key: 'head', text: 'HEAD' }
        ];

        this.bodyPartsGroup = this.game.add.group();
        var self = this;
        var bodyPart;
        this.bodyParts.forEach(function(element) {
            bodyPart = self.bodyPartsGroup.create(-1000, 280, element.key);
            bodyPart.customParams = { text: element.text };
            bodyPart.anchor.setTo(0.5);
            bodyPart.scale.setTo(0.05);

            bodyPart.inputEnabled = true;
            bodyPart.input.pixelPerfectClick = true;
            bodyPart.events.onInputDown.add(self.selectBodyPart, self);
        });

        this.heart1Full = this.game.add.sprite(this.game.width - 90, this.game.height * 0.06, 'heartFull');
        this.heart1Full.anchor.setTo(0.5);
        this.heart1Full.scale.setTo(0.1);

        this.heart1Empty = this.game.add.sprite(-1000, this.game.height * 0.06, 'heartEmpty');
        this.heart1Empty.anchor.setTo(0.5);
        this.heart1Empty.scale.setTo(0.1);

        this.heart2Full = this.game.add.sprite(this.game.width - 60, this.game.height * 0.06, 'heartFull');
        this.heart2Full.anchor.setTo(0.5);
        this.heart2Full.scale.setTo(0.1);

        this.heart2Empty = this.game.add.sprite(-1000, this.game.height * 0.06, 'heartEmpty');
        this.heart2Empty.anchor.setTo(0.5);
        this.heart2Empty.scale.setTo(0.1);

        this.heart3Full = this.game.add.sprite(this.game.width - 30, this.game.height * 0.06, 'heartFull');
        this.heart3Full.anchor.setTo(0.5);
        this.heart3Full.scale.setTo(0.1);

        this.heart3Empty = this.game.add.sprite(-1000, this.game.height * 0.06, 'heartEmpty');
        this.heart3Empty.anchor.setTo(0.5);
        this.heart3Empty.scale.setTo(0.1);

        this.hearts = [
            { position: 1, full: true },
            { position: 2, full: true },
            { position: 3, full: true },
        ];

        this.correctSound = this.game.add.audio('correctSound');
        this.wrongSound = this.game.add.audio('wrongSound');
        this.musicSound = this.game.add.audio('musicSound');
        this.musicSound.loopFull(0.6);

        this.setupScene();
    },

    update: function() {

    },

    resetGame: function() {
        console.log('resetou');
        this.heart1Full.position.set(this.game.width - 90, this.game.height * 0.06);
        this.heart2Full.position.set(this.game.width - 60, this.game.height * 0.06);
        this.heart3Full.position.set(this.game.width - 30, this.game.height * 0.06);

        this.heart1Empty.position.set(-1000, this.game.height * 0.06);
        this.heart2Empty.position.set(-1000, this.game.height * 0.06);
        this.heart3Empty.position.set(-1000, this.game.height * 0.06);

        this.hearts[0].full = true;
        this.hearts[1].full = true;
        this.hearts[2].full = true;

        this.gameOverText.position.set(-1000, -1000);
        this.score = 0;
        this.hpThreshold = 0;
        this.restart.position.set(-1000, -1000);
        this.bodyPartText.position.set(this.game.width / 2, this.game.height * 0.25);

        this.gameOver = false;

        this.setupScene();
    },

    selectBodyPart: function(sprite, event) {
        if (this.sprite1 != null) {
            this.sprite1.position.set(-1000, this.game.world.centerY + 100);
            this.sprite2.position.set(-1000, this.game.world.centerY + 100);
            this.currentPart.position.set(-1000, this.game.world.centerY + 100);
        }

        if (sprite.key == this.currentPart.key) {
            this.score += 100;
            this.correctSound.play();
            this.hpThreshold += 100;
            if (this.hpThreshold == 300) {
                this.hpThreshold = 0;
                this.addHp();
            }
        } else {
            this.wrongSound.play();
            this.removeHp();

        }

        if (!this.gameOver) this.setupScene();
    },

    addHp: function() {
        if (!this.hearts[1].full) {
            this.heart2Full.position.set(this.game.width - 60, this.game.height * 0.06);
            this.heart2Empty.position.set(-1000, this.game.height * 0.06);
            this.hearts[1].full = true;
        } else if (!this.hearts[2].full) {
            this.heart3Full.position.set(this.game.width - 30, this.game.height * 0.06);
            this.heart3Empty.position.set(-1000, this.game.height * 0.06);
            this.hearts[2].full = true;
        }
    },

    removeHp: function() {
        if (this.hearts[2].full) {
            this.heart3Full.position.set(-1000, this.game.height * 0.06);
            this.heart3Empty.position.set(this.game.width - 30, this.game.height * 0.06);
            this.hearts[2].full = false;
            this.hpThreshold = 0;
        } else if (this.hearts[1].full) {
            this.heart2Full.position.set(-1000, this.game.height * 0.06);
            this.heart2Empty.position.set(this.game.width - 60, this.game.height * 0.06, this.game.height * 0.06);
            this.hearts[1].full = false;
            this.hpThreshold = 0;
        } else if (this.hearts[0].full) {
            this.heart1Full.position.set(-1000, this.game.height * 0.06);
            this.heart1Empty.position.set(this.game.width - 90, this.game.height * 0.06, this.game.height * 0.06);
            this.hearts[0].full = false;
            this.gameOver = true;
            this.showGameOverScreen();
        }
    },

    showGameOverScreen: function() {
        this.sprite1.position.set(-1000, -1000);
        this.sprite2.position.set(-1000, -1000);
        this.currentPart.position.set(-1000, -1000);
        this.restart.position.set(this.game.world.centerX, this.game.world.centerY + 50);

        if (this.gameOverText == null) {
            var style = {
                font: 'bold 30pt Arial',
                fill: 'D0171B',
                align: 'center'
            }
            this.gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'GAME OVER !!!', style);
            this.gameOverText.anchor.setTo(0.5);

            this.bodyPartText.position.set(-1000, -1000);
        }
    },

    setupScene: function() {
        this.currentPart = this.bodyPartsGroup.next();
        this.showText(this.currentPart);

        var index = random(0, this.bodyParts.length - 1);
        var part1 = this.bodyParts[index];
        while (part1.text == this.currentPart.customParams.text) {
            index = random(0, this.bodyParts.length - 1);
            part1 = this.bodyParts[index];
        }

        this.sprite1 = this.getSprite(part1.key);

        index = random(0, this.bodyParts.length - 1);
        var part2 = this.bodyParts[index];
        while (part2.text == this.currentPart.customParams.text || part2.text == part1.text) {
            index = random(0, this.bodyParts.length - 1);
            part2 = this.bodyParts[index];
        }

        this.sprite2 = this.getSprite(part2.key);
        var x1 = random(1, 3); // sprite1
        var x2 = random(1, 3); // sprite2
        while (x2 == x1) {
            x2 = random(1, 3);
        }
        var x3 = random(1, 3); // currentPart
        while (x3 == x1 || x3 == x2) {
            x3 = random(1, 3);
        }

        var left = this.game.world.centerX - 200;
        var middle = this.game.world.centerX;
        var right = this.game.world.centerX + 200;

        switch (x1) {
            case 1:
                this.sprite1.position.set(left, this.game.world.centerY + 50);
                break;
            case 2:
                this.sprite2.position.set(left, this.game.world.centerY + 50);
                break;
            case 3:
                this.currentPart.position.set(left, this.game.world.centerY + 50);
                break;
        }

        switch (x2) {
            case 1:
                this.sprite1.position.set(middle, this.game.world.centerY + 50);
                break;
            case 2:
                this.sprite2.position.set(middle, this.game.world.centerY + 50);
                break;
            case 3:
                this.currentPart.position.set(middle, this.game.world.centerY + 50);
                break;
        }

        switch (x3) {
            case 1:
                this.sprite1.position.set(right, this.game.world.centerY + 50);
                break;
            case 2:
                this.sprite2.position.set(right, this.game.world.centerY + 50);
                break;
            case 3:
                this.currentPart.position.set(right, this.game.world.centerY + 50);
                break;
        }

        this.updateScore();
    },

    updateScore: function() {
        if (this.scoreText == null) {
            this.scoreText = this.game.add.text(80, this.game.height * 0.06, '');
            this.scoreText.anchor.setTo(0.5);
        }
        this.scoreText.setText('Score: ' + this.score);
    },

    getSprite: function(spriteKey) {
        var ret;
        for (var i = 0; i < this.bodyPartsGroup.children.length; i++) {
            if (spriteKey == this.bodyPartsGroup.children[i].key) {
                ret = this.bodyPartsGroup.children[i];
            }
        }

        return ret;
    },

    showText: function(bodyPart) {
        if (!this.bodyPartText) {
            var style = {
                font: 'bold 30pt Arial',
                fill: 'D0171B',
                align: 'center'
            }
            this.bodyPartText = this.game.add.text(this.game.width / 2, this.game.height * 0.25, '', style);
            this.bodyPartText.anchor.setTo(0.5);
        }

        this.bodyPartText.setText(bodyPart.customParams.text);
        this.bodyPartText.visible = true;
    }
};

var scaleRatio = window.devicePixelRatio / 3;
var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameArea');
//var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');