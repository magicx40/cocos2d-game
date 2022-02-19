const Input = {};
const State = {
    stand: 1,
    attack: 2
};

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.speed = 100;
        this.jumpSpeed = 150;
        this.canJump = true;
        this.isJumping = false;
        this.sp = cc.v2(0, 0);

        this.heroState = State.stand;
        this.anima = 'idle';
        this.heroAni = this.node.getComponent(cc.Animation);

        this.heroAni.on('finished', this.onAnimaFinished, this);

        cc.systemEvent.on('keydown', this.onKeydown, this);
        cc.systemEvent.on('keyup', this.onKeyup, this);
    },

    start() {

    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if ((otherCollider.node.group == 'wall' || otherCollider.node.group == 'enemy') && selfCollider.tag == '1') {
            this.canJump = true;
            this.isJumping = false;
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },

    onKeydown(e) {
        Input[e.keyCode] = 1;
    },

    onKeyup(e) {
        Input[e.keyCode] = 0;
    },

    onAnimaFinished(e, data) {
        if (data.name == 'attack') {
            this.heroState = State.stand;
            this.setAni('idle');
        }
    },

    setAni(anima) {
        if (this.anima == anima) return;
        this.anima = anima;

        this.heroAni.play(anima);
    },

    update(dt) {
        let anima = this.anima;
        let scaleX = Math.abs(this.node.scaleX);
        let scaleY = Math.abs(this.node.scaleY);
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;

        switch (this.heroState) {
            case State.stand:
                if (Input[cc.macro.KEY.j]) {
                    this.heroState = State.attack;
                }
                break;
        }

        if (this.heroState == State.attack) {
            if (Input[cc.macro.KEY.j]) {
                anima = 'attack';
            }
        }

        if (this.heroState != State.stand) {
            this.sp.x = 0;
        } else {
            if ((Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left])) {
                this.sp.x = -1;
                this.node.scaleX = -scaleX;
                if (!this.isJumping) {
                    anima = 'run';
                }
            } else if ((Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right])) {
                this.sp.x = 1;
                this.node.scaleX = scaleX;
                if (!this.isJumping) {
                    anima = 'run';
                }
            } else if (this.isJumping) {
                anima = 'jump';
            } else {
                this.sp.x = 0;
                anima = 'idle';
            }
        }



        if (this.sp.x) {
            this.lv.x = this.sp.x * this.speed;
        } else {
            this.lv.x = 0;
        }

        if ((Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) && this.canJump) {
            this.lv.y = this.jumpSpeed;
            anima = 'jump';
            this.canJump = false;
            this.isJumping = true;
        }

        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;

        if (anima) {
            this.setAni(anima);
        }
    },

    onDestroy() {
        this.heroAni.off('finished', this.onAnimaFinished, this);
        cc.systemEvent.off('keydown', this.onKeydown, this);
        cc.systemEvent.off('keyup', this.onKeyup, this);
    }
});
