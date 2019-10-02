/**
 * 实现new MyVue({data:{...}})的时候把传递进来的data变成响应式
 * Created by Tyler on 2019/10/2 15:56.
 */

class MyVue {
    constructor(options){
        this.$options = options;

        // 数据响应化
        this.$data = this.$options.data;
        MyVue.observe(this.$data);
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
        Object.defineProperty(obj, key, {
            get(){
                return value;
            },
            set(newVal){
                if(newVal === value){
                    return;
                }
                console.log(`${key}属性更新了：${value} --> ${newVal}`);
                value = newVal;
            }
        })
    }
}
