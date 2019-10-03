/**
 * 实现当new compile(dom的id， myVue)的时候就能把这个html模板解析了
 * Created by Tyler on 2019/10/3 10:50.
 */
class Compile {
    constructor(el, vm){
        // 要遍历的宿主节点
        this.$el = document.querySelector(el);
        this.$vm = vm;

        // 编译
        if (this.$el) {
            // 转换内部内容为片段Fragment
            this.$fragment = Compile.node2Fragment(this.$el);
            // 执行编译
            this.compile(this.$fragment);
            // 将编译完的html结果追加至$el
            this.$el.appendChild(this.$fragment);
        }
    }

    // 将宿主元素中代码片段拿出来遍历，这样做比较高效。而不是直接操作dom元素
    static node2Fragment(el){
        const frag = document.createDocumentFragment();
        // 将el中所有子元素搬家至frag中。 注意是搬家
        let child;
        while ((child = el.firstChild)) {
            console.log(child);
            frag.appendChild(child);
        }
        return frag;
    }

    static isElement(node){
        return node.nodeType === 1;
    }
    // 插值文本
    static isInterpolation(node){
        return node.nodeType === 3 && /{{(.*)}}/.test(node.textContent);
    }
    static isDirective(attr) {
        return attr.indexOf("m-") === 0;
    }
    static isEvent(attr) {
        return attr.indexOf("@") === 0;
    }

    compile(el){
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 类型判断
            if (Compile.isElement(node)) { // 指令元素
                console.log('编译指令元素' + node.nodeName);
                const prefix = 'compileM';
                Array.from(node.attributes).forEach(({name: attrName, value: exp}) => {
                    if(Compile.isDirective(attrName)){

                        const dir = prefix + attrName.substring(2);// 例 k-text
                        this[dir] && this[dir](node, this.$vm, exp);
                    }
                    if(Compile.isEvent(attrName)){

                        const dir = attrName.substring(1); // 例 @click
                        this.eventHandler(node, this.$vm, exp, dir);
                    }
                })

            } else if (Compile.isInterpolation(node)) { // 文本
                console.log('编译插值文本' + node.textContent);

                this.compileText(node);

            }

            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });

    }

    compileText(node){
        this.update(node, this.$vm, RegExp.$1, 'text');
    }
    compileMtext(node, vm, exp) {
        this.update(node, vm, exp, "text");
    }
    compileMhtml(node, vm, exp) {
        this.update(node, vm, exp, "html");
    }
    //   双绑
    compileMmodel(node, vm, exp) {
        // 指定input的value属性
        this.update(node, vm, exp, "model");

        // 视图对模型响应
        node.addEventListener("input", e => {
            vm[exp] = e.target.value;
        });
    }

    // 更新函数 这里用了策略模式
    update(node, vm, exp, dir){
        const updateFn = this[dir + 'Updater'];
        // 初始化
        updateFn && updateFn(node, vm[exp]);

        // 依赖收集
        new Watcher(vm, exp, value => {
            updateFn && updateFn(node, value);
        })
    }

    modelUpdater(node, value) {
        node.value = value;
    }
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }
    textUpdater(node, value) {
        node.textContent = value;
    }

    //   事件处理器
    eventHandler(node, vm, exp, dir) {
        //   @click="onClick"
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if (dir && fn) {
            node.addEventListener(dir, fn.bind(vm));
        }
    }

}
