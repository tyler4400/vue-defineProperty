/**
 * Created by Tyler on 2019/10/2 12:54.
 */

let person = {};
Object.defineProperty(person, 'name', {
    value: 'jack',
    writable: true
});
person.name = 'rose';
console.log(person);
