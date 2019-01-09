'use strict';

//Configuracoes Globais
var config = {
    "player": {
           "initial_X": 202.5,
            "initial_Y": 383,
            "velocidadeInicial": 50
     },
      "board": {
             "square_width": 402.5,
             "canvas_width": 505
      }
}

//Classe Pai - Personagens
var Personagem = class Personagem{
    constructor(x,y, velocidade) {
        this.x = x;
        this.y = y;
        this.velocidade = velocidade;
    }
}

//Classe Enemy
var Enemy  =  class Enemy extends Personagem {
    constructor(xEnemy, yEnemy, velEnemy) {
        super(xEnemy, yEnemy, velEnemy);
        this.sprite = 'images/enemy-bug.png';
    }
}
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//Classe Player
var Player = class Player extends Personagem {
    constructor(xPlayer, yPlayer, velPlayer) {
        super(xPlayer, yPlayer, velPlayer);
        this.sprite = 'images/char-cat-girl.png';/*
        this.jogador = function () {
            return this;
        }; Pesquisar depois: Muito bem! Você implementou uma função para tratar a colisão entre o 
        player e os inimigos. Isso preserva o encapsulamento das classes, mas caso mude o nome da instância da classe Player de player para jogador,
        por exemplo, essa função não seria mais executada corretamente. Por isso, a dica do revisor anterior de utilizar this dentro
        de um método da classe Player ajudaria a tratar isso. */ 
    }
}
var player = new Player(config.player.initial_X, config.player.initial_Y, config.player.velocidadeInicial);

var checarColisao = function(enemy) {

    // checa colisão entre enimigo e o player
    if (
        player.y + 131 >= enemy.y + 90
        && player.x + 25 <= enemy.x + 88
        && player.y + 73 <= enemy.y + 135
        && player.x + 76 >= enemy.x + 11) {
        console.log('colisão');
        //Reseta posição inicial do player
        player.x = config.player.initial_X;
        player.y = config.player.initial_Y;
    }
};

// Função exibe SCORE
var exibeScoreNível = function(aScore, aLevel) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player score and level to div element created
    scoreLevelDiv.innerHTML = 'Pontuação: ' + aScore
        + ' / ' + 'Nível: ' + aLevel;
    document.body.insertBefore(scoreLevelDiv, firstCanvasTag[0]);
};

// Aumenta o número de inimigos baseado no nível atual
var aumentaDificuldade = function(numEnemies) {
    // remove todos os inimigos anteriores da tela
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
        
        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.createElement('div');
allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.enemy = enemy;
    this.x += this.velocidade * dt;

    //enimigos realizam loop para esquerda do canvas após chegar ao limite do canvas.width (505)
    if (this.x >= config.board.canvas_width) {
        this.x = 0;
    }

    // Checa colisão com enimgos ou barreiras
    checarColisao(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    
    // Se chegar ao topo ganha o jogo e adiciona +1 à ponuação e ao nível
    // passa score como argumento para a função aumentaDificuldade
    if (this.y + 63 <= 0) { 
        //Reseta posição inicial do player       
        this.x = config.player.initial_X;
        this.y = config.player.initial_Y;
        console.log('Ganhou!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        score += 1;
        gameLevel += 1;
        console.log('Pontuação Atual: ' + score + ', Nível Atual: ' + gameLevel);
        aumentaDificuldade(score);

    }

    // verifica se o player não ultrapassa os limites da tela
    if (this.y > config.player.initial_Y ) {
        this.y = config.player.initial_Y;
    }
    if (this.x > config.board.square_width) {
        this.x = config.board.square_width;
    }

    //limite esquerdo
    if (this.x < 2.5) {
        this.x = 2.5;
    }
}

//Exibir player e o SCORE
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    exibeScoreNível(score, gameLevel);
};

Player.prototype.handleInput = function (keyPress) {
    if (keyPress == 'left') {
        this.x -= this.velocidade; //esquerda
    }

    if (keyPress == 'up') {
        this.y -= this.velocidade -20; //cima
    }
    if (keyPress == 'right') {
        this.x += this.velocidade; //direita
    }

    if (keyPress == 'down') {
        this.y += this.velocidade -20; //baixo
    }
    console.log('keyPress é:' + keyPress);
};