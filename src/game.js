var utils = {
    getRandomArbitary: function(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    },
    getRandomColor: function() {
        var colors = ['#ffeac9', '#ebf1ff', '#eafbff', '#d7ffff', '#9a81ec', '#ff8000', '#ff80bf', '#ebecf9', '#fcb314', '#ff7200', '#067ab4', '#226ce0', '#261941', '#4d3382', '#f2ff00', '#19e3d9', '#31ffd5', '#ffcadf', '#52a74f', '#416fa0', '#fedf83', '#e7e3e4', '#005abc', '#effcff', '#fff2ef', '#ffddd6', '#d6f7ff', '#3c3288', '#9c2902', '#800080', '#4285f4', '#0f9d58', '#6694b8', '#a2af93', '#7f9a52', '#4a0910', '#fbbc05', '#ea4335', '#34a853', '#95a484', '#687e50', '#6a0d1b'],
            colorIndex = this.getRandomArbitary(0, (colors.length - 1))

        return colors[colorIndex];
    }
};
var Game = function() {
    this.player = document.getElementsByClassName('player')[0];
    this.food = [];
    this.enemies = {
        elements: [],
        intervals: []
    };
    this.config = {
        gameWindow: {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        },
        player: {
            width: 5,
            height: 5
        }
    }
};
Game.prototype.init = function() {
    this.addEventListeners();
    this.addEnemies();
    this.addFood();
}
Game.prototype.addEventListeners = function() {
    var self = this;
    var mouseMove = function(e) {
        var x = e.pageX,
            y = e.pageY;

        if(!self.player) return;
        requestAnimationFrame(function() {
            var positionX, positionY, size;
            self.player.style.left = x + 'px';
            self.player.style.top = y + 'px';
            for(var index in self.food) {
                positionX = self.food[index].style.left.replace('px', '');
                positionY = self.food[index].style.top.replace('px', '');
                if(
                   (positionX >= x) &&
                   (positionX <= x + self.config.player.width) &&
                   (positionY >= y) &&
                   (positionY <= y + self.config.player.height)
                   ) {
                    self.food[index].remove();
                    self.food.splice(index, 1);
                    self.growPlayer(1);
                }
            }
            for(var index in self.enemies.elements) {
                size = parseInt(self.enemies.elements[index].style.width.replace('px', ''));
                positionX = parseInt(self.enemies.elements[index].style.left.replace('px', ''));
                positionY = parseInt(self.enemies.elements[index].style.top.replace('px', ''));
                if(
                   (positionX <= x) &&
                   ((positionX + size) >= x) &&
                   (positionY <= y) &&
                   ((positionY + size) >= y)
                   ) {
                    if(size > self.config.player.height) {
                        self.end();
                    }
                    else {
                        var powerup = parseInt(((self.config.player.height - size)/10), 10);
                        self.growPlayer(powerup);
                        self.removeEnemy(index);
                    }
                }
            }
        });
    }
    document.addEventListener('mousemove', mouseMove);
}
Game.prototype.end = function() {
    document.getElementsByClassName('game-vw')[0].classList.add('blurred');
    this.player.remove();
    this.player = false;
    document.getElementsByClassName('game-over')[0].classList.remove('hidden');
};
Game.prototype.removeEnemy = function(index) {
    this.enemies.elements[index].remove();
    this.enemies.elements.splice(index, 1);
    window.clearInterval(this.enemies.intervals[index]);
    this.enemies.intervals.splice(index, 1);
};
Game.prototype.addEnemies = function() {
    var self = this,
        randomNumer;

    setInterval(function() {
        var posFactor = [1,-1],
            xposFactor = posFactor[utils.getRandomArbitary(0,2)],
            yposFactor = posFactor[utils.getRandomArbitary(0,2)],
            div = document.createElement('div');
        div.style.backgroundColor = utils.getRandomColor();
        div.style.left = (utils.getRandomArbitary(0, self.config.gameWindow.width)) + 'px';
        div.style.top = (utils.getRandomArbitary(0, self.config.gameWindow.height/2)) + 'px';
        randomNumer = (utils.getRandomArbitary(0, 100))
        div.style.width = randomNumer + 'px';
        div.style.height = randomNumer + 'px';
        div.classList.add('enemy');
        document.body.appendChild(div);
        self.enemies.elements.push(div);
        self.enemies.intervals.push(setInterval(function() {
            var posX = parseInt(div.style.left.replace('px', '')),
                posY = parseInt(div.style.top.replace('px', '')),
                enemyIndex;

            div.style.left = (posX + xposFactor) + 'px';
            div.style.top = (posY + yposFactor) + 'px';
            if(
               (posX > self.config.gameWindow.width) ||
               (posY > self.config.gameWindow.height)
               ) {
                enemyIndex = self.enemies.elements.indexOf(div);
                self.removeEnemy(enemyIndex);
            }
        }, utils.getRandomArbitary(1, 50)));
    }, 300);
};
Game.prototype.growPlayer = function(power) {
    this.config.player.width += power;
    this.config.player.height += power;
    this.player.style.width = this.config.player.width + 'px';
    this.player.style.height = this.config.player.height + 'px';
    document.getElementById('score-count').innerHTML = this.config.player.width - 5;
};
Game.prototype.addFood = function() {
    var self = this;
    setInterval(function() {
        var div = document.createElement('div');
        div.style.backgroundColor = utils.getRandomColor();
        div.style.left = (utils.getRandomArbitary(21, self.config.gameWindow.width)) + 'px';
        div.style.top = (utils.getRandomArbitary(21, self.config.gameWindow.height)) + 'px';
        div.classList.add('food');
        self.food.push(div);
        document.body.appendChild(div);
    }, 1000);
}
window.onload = function() {
    var game = new Game();
    game.init();
};