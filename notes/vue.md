```  
1、你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。  
2、模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不应该在模板表达式中试图访问用户定义的全局变量。  
3、<a v-bind:[someAttr]="value"> ... </a>//在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。除非在实例中有一个名为“someattr”的 property，否则代码不会工作。  
4、<a v-bind:href="url">...</a>   
缩写：<a :href="url">...</a>  
5、<a v-on:click="doSomething">...</a>  
缩写：<a @click="doSomething">...</a>   
动态：<a @[event]="doSomething"> ... </a>  
6、计算属性是基于它们的响应式依赖进行缓存的，所以跟函数相比有性能优势，注意：Date.now()不是响应式依赖（默认只有get，要时你也可以提供一个 setter）  
7、Watch监听变化，计算属性大多数时候可以代替watch。充当触发器比较有优势   
8、v-show 会创建dom，通过css隐藏  
9、v-if 不会真正创建dom。且切换到v-else时会复用v-if的dom，如果不需要复用的话可以添加一个key并赋予不同的值即可  
10、<div v-for="(item,index) of items"></div>  
11、<div v-for="(value, key, index) in object"></div>  
12、v-for 的优先级比 v-if 更高，但不推荐在同一个标签中使用  
13、使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。  
14、.exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。  
   <!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->  
   <button v-on:click.ctrl="onClick">A</button>  
   <!-- 有且只有 Ctrl 被按下的时候才触发 -->  
   <button v-on:click.ctrl.exact="onCtrlClick">A</button>  
15、<table>  
  		<blog-post-row></blog-post-row>会被作为无效的内容提升到外部，并导致最终渲染结果出错  
	</table>  
   <table>  
      <tr is="blog-post-row"></tr> 这样子可以完成你想要的效果  
   </table>  
16、<div :is="currentComponent"></div> is也可以用来切换组件  
17、<my-component-name> 和 <MyComponentName> 都是可接受的。注意，尽管如此，直接在 DOM (即非字符串的模板) 中使用时只有 kebab-case 是有效的  
18、有了inheritAttrs: false 和 $attrs。你就可以手动决定这些 attribute 会被赋予哪个元素。在撰写基础组件的时候是常会用到的：  
类似的还有$listeners  
19、<slot name="header"></slot> // 多插槽  
20、<template v-slot:header> // V-slot:header ≈ #header  
      <h1>Here might be a page title</h1>  
   </template>  
21、	作用域插槽，可以使得slot内的作用域，被外部模板调用。  
22、	解构插槽 Prop  
23、	异步组件可以解决组件互相嵌套带来的死循环  
  
```  