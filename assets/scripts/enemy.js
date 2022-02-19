cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // 碰撞回掉
    onCollisionEnter(other, self) {
        if (other.node.group == 'hero') {
            this.isHit = true;
            this.enemyAni.play('hit');
        }
    },

    onLoad () {
        this.hp = 5;
        this.isHit = false;
        this.enemyAni = this.node.getComponent(cc.Animation);
        this.enemyAni.on('finished', (e, data) => {
            if (data.name == 'dead') {
                this.node.destroy();
                return;
            } 
            this.hp--;
            this.isHit = false;

            if (this.hp <= 0) {
                this.enemyAni.play('dead');
            }
        });
    },

    start () {

    },

    // update (dt) {},
});
