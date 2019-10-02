/**
 * Created by Tyler on 2019/10/2 13:11.
 * configrable 描述属性是否配置，以及可否删除
 enumerable 描述属性是否会出现在for in 或者 Object.keys()的遍历中
 */
let Person = {};
let temp = null;
Object.defineProperty(Person, 'name', {
    get: function (){
        return temp
    },
    set: function (val){
        temp = val
    },
});

Person.name = 'jack';
console.log(Person.name);
