/**
 * 实现new MyVue({data:{...}})的时候把传递进来的data变成响应式
 * Created by Tyler on 2019/10/2 15:56.
 */
// import Dep from './Dep';  //才用import的方式控制台会报Uncaught SyntaxError: Cannot use import statement outside a module。百度也没有解决，所以先不用import的方式了

class MyVue {
    constructor(options){
        this.$options = options;

        // 数据响应化
        this.$data = this.$options.data;
        MyVue.observe(this.$data);


        // 测试样例
        // new Watcher();
        // this.$data.name;
        // this.$data.name;
    }

    static observe(obj){
        if (!obj || typeof obj !== 'object') {
            return;
        }

        // 遍历对象，对data进行响应化
        for (let [key, value] of Object.entries(obj)) {
            MyVue.defineReactive(obj, key, value);
            MyVue.observe(value); //递归调用，解决嵌套属性的响应式
        }
    }

    //  数据响应化
    static defineReactive(obj, key, value){
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get(){
                Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set(newVal){
                if(newVal === value){
                    return;
                }
                // console.log(`${key}属性更新了：${value} --> ${newVal}`);
                dep.notify();
                value = newVal;
            }
        })
    }
}

// Dep 用来管理watcher
class Dep {
    constructor(){
        // 这里存放若干监视器
        this.watchers = [];
    }

    addDep(watcher){
        this.watchers.push(watcher);
    }

    notify(){
        this.watchers.forEach(watcher => {
            watcher.update();
        });
    }
}

class Watcher {
    constructor(){
        Dep.target = this; // 等于 let watcher = new Watcher(); Dep.target = watcher;
    }

    update(){
        console.log('watcher监听到了');
    }
}
