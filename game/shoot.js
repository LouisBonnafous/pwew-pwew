var bulletTime1 = 0;
var immunityTime = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);        
    }

}

function collisions()
{
    bullet_collision();
    player_collision(player1, false);
    player_collision(player2, true);
    player_enemy_collision();
    player_falling();
}

function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        bulletPos = new THREE.Vector2(player1.bullets[i].position.x, player1.bullets[i].position.y)
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        } else if (player2.life > 0 && bulletPos.distanceTo(player2.position) < 12) {
            scene.remove(player2.graphic);
            player2.life = 0;
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

}

function player_collision(player, isEnemy)
{
    //collision between player and walls
    var x = player.graphic.position.x + WIDTH / 2;
    var y = player.graphic.position.y + HEIGHT / 2;

    if ( x > WIDTH ) {
        if (isEnemy) {
            player.graphic.position.x = - WIDTH / 2;
            player.position.x = - WIDTH / 2;
        } else {
            player.graphic.position.x -= x - WIDTH;
            player.position.x -= x - WIDTH;
        }
    }
    if ( x < 0 ) {
        if (isEnemy) {
            player.graphic.position.x = WIDTH / 2 - 1;
            player.position.x = WIDTH / 2 - 1;
        } else {
            player.graphic.position.x -= x;
            player.position.x -= x;
        }
    }
    if ( y < 0 ) {
        if (isEnemy) {
            player.position.y = HEIGHT / 2 - 1;
            player.graphic.position.y = HEIGHT / 2 - 1;
        } else {
            player.position.y -= y;
            player.graphic.position.y -= y;
        }
    }
    if ( y > HEIGHT ) {
        if (isEnemy) {
            player.position.y = - HEIGHT / 2 - 1;
            player.graphic.position.y -= - HEIGHT / 2 - 1;
        } else {
            player.position.y = y - HEIGHT;
            player.graphic.position.y -= y - HEIGHT;
        }
    }

}

function player_enemy_collision() {
    
    if (player1.position.distanceTo(player2.position) < 24) {
        // Quand on se fait toucher, on a une fenêtre de 0,8 secondes où on est immunisé
        if (immunityTime + 0.8 < clock.getElapsedTime()) {
            if (player1.life == 0) {
                player1.dead();
            }
            player1.life -= 1;
            immunityTime = clock.getElapsedTime();
        }
    }
}

function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.position.x | 0;
    var y = player1.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((x > tileX)
            && (x < mtileX)
            && (y > tileY) 
            && (y < mtileY))
        {
            player1.dead();
        }
    }

}
