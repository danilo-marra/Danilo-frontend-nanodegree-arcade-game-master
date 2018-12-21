// Enemies our player must avoid
var Enemy = function(x,y, velocidade) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.velocidade * dt;

    //enimigos realizam loop para esquerda do canvas após chegar ao limite do canvas.width (505)
    if (this.x >= 505) {
        this.x = 0;
    }

    // Checa colisão com enimgos ou barreiras
    checarColisao(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//Classe Player
var Player = function (x, y, velocidade) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.update = function() {
}

//Exibir player e o SCORE
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    exibeScoreNível(score, gameLevel);
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

Player.prototype.handleInput = function (keyPress) {
    if (keyPress == 'left') {
        player.x -= player.velocidade; //esquerda
    }

    if (keyPress == 'up') {
        player.y -= player.velocidade -20; //cima
    }
    if (keyPress == 'right') {
        player.x += player.velocidade; //direita
    }

    if (keyPress == 'down') {
        player.y += player.velocidade -20; //baixo
    }
    console.log('keyPress é:' + keyPress);
};


var checarColisao = function(anEnemy) {
    // checa colisão entre enimigo e o player
    if (
        player.y + 131 >= anEnemy.y + 90
        && player.x + 25 <= anEnemy.x + 88
        && player.y + 73 <= anEnemy.y + 135
        && player.x + 76 >= anEnemy.x + 11) {
        console.log('colisão');
        //Reseta posição inicial do player
        player.x = 202.5;
        player.y = 383;
    }

    // Se chegar ao topo ganha o jogo e adiciona +1 à ponuação e ao nível
    // passa score como argumento para a função aumentaDificuldade
    if (player.y + 63 <= 0) { 
        //Reseta posição inicial do player       
        player.x = 202.5;
        player.y = 383;
        console.log('Ganhou!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        score += 1;
        gameLevel += 1;
        console.log('Pontuação Atual: ' + score + ', Nível Atual: ' + gameLevel);
        aumentaDificuldade(score);

    }

    // verifica se o player não ultrapassa os limites da tela
    if (player.y > 383 ) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }
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
var player = new Player(202.5, 383, 50);
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.createElement('div');
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

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
