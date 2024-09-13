import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,e as t,o as s}from"./app-BeHkqkE2.js";const n={};function r(l,a){return s(),i("div",null,a[0]||(a[0]=[t(`<h1 id="_5-12-java-抽象类和接口的区别" tabindex="-1"><a class="header-anchor" href="#_5-12-java-抽象类和接口的区别"><span>5.12 Java 抽象类和接口的区别</span></a></h1><p>“三妹，通过前面两篇，我们已经深入地了解了 Java <a href="https://javabetter.cn/oo/abstract.html" target="_blank" rel="noopener noreferrer">抽象类</a>和 Java <a href="https://javabetter.cn/oo/interface.html" target="_blank" rel="noopener noreferrer">接口</a>，那这篇我们来重点说一下抽象类和接口之间的区别。”我放下手中的鼠标和键盘，转向右手边，对三妹说。</p><p>“好啊。我挺想总结一波的，也算是对抽象类和接口做个了结。”三妹回应到。</p><h3 id="_01、抽象类" tabindex="-1"><a class="header-anchor" href="#_01、抽象类"><span>01、抽象类</span></a></h3><p>在 Java 中，通过关键字 <code>abstract</code> 定义的类叫做抽象类。Java 是一门面向对象的语言，因此所有的对象都是通过类来描述的；但反过来，并不是所有的类都是用来描述对象的，抽象类就是其中的一种。</p><p>以下示例展示了一个简单的抽象类：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 个人认为，一名教练必须攻守兼备</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">abstract</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Coach</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> abstract</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> defend</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> abstract</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> attack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_02、接口" tabindex="-1"><a class="header-anchor" href="#_02、接口"><span>02、接口</span></a></h3><p>我们知道，有抽象方法的类被称为抽象类，也就意味着抽象类中还能有不是抽象方法的方法。这样的类就不能算作纯粹的接口，尽管它也可以提供接口的功能——只能说抽象类是普通类与接口之间的一种中庸之道。</p><p><strong>接口（英文：Interface），在 Java 中是一个抽象类型，是抽象方法的集合</strong>；接口通过关键字 <code>interface</code> 来定义。接口与抽象类的不同之处在于：</p><ul><li>1、抽象类可以有方法体的方法，但接口没有（Java 8 以前）。</li><li>2、接口中的成员变量隐式为 <code>static final</code>，但抽象类不是的。</li><li>3、一个类可以实现多个接口，但只能继承一个抽象类。</li></ul><p>以下示例展示了一个简单的接口：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 隐式的abstract</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">interface</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Coach</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">	// 隐式的public</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">	void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> defend</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">	void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> attack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>接口是隐式抽象的，所以声明时没有必要使用 <code>abstract</code> 关键字；</li><li>接口的每个方法都是隐式抽象的，所以同样不需要使用 <code>abstract</code> 关键字；</li><li>接口中的方法都是隐式 <code>public</code> 的。</li></ul><h3 id="_03、两者差别" tabindex="-1"><a class="header-anchor" href="#_03、两者差别"><span>03、两者差别</span></a></h3><p>“哦，我理解了哥。那我再问一下，抽象类和接口有什么差别呢？”</p><p>“哇，三妹呀，你这个问题恰到好处，问到了点子上。”我不由得为三妹竖起了大拇指。</p><h4 id="_1-语法层面上" tabindex="-1"><a class="header-anchor" href="#_1-语法层面上"><span>1）语法层面上</span></a></h4><ul><li>抽象类可以提供成员方法的实现细节，而接口中只能存在 public abstract 方法；</li><li>抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是 public static final 类型的；</li><li>接口中不能含有静态代码块，而抽象类可以有静态代码块；</li><li>一个类只能继承一个抽象类，而一个类却可以实现多个接口。</li></ul><h4 id="_2-设计层面上" tabindex="-1"><a class="header-anchor" href="#_2-设计层面上"><span>2）设计层面上</span></a></h4><p>抽象类是对一种事物的抽象，即对类抽象，继承抽象类的子类和抽象类本身是一种 <code>is-a</code> 的关系。而接口是对行为的抽象。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口却是对类局部（行为）进行抽象。</p><p>举个简单的例子，飞机和鸟是不同类的事物，但是它们都有一个共性，就是都会飞。那么在设计的时候，可以将飞机设计为一个类 Airplane，将鸟设计为一个类 Bird，但是不能将 飞行 这个特性也设计为类，因此它只是一个行为特性，并不是对一类事物的抽象描述。</p><p>此时可以将 飞行 设计为一个接口 Fly，包含方法 fly()，然后 Airplane 和 Bird 分别根据自己的需要实现 Fly 这个接口。然后至于有不同种类的飞机，比如战斗机、民用飞机等直接继承 Airplane 即可，对于鸟也是类似的，不同种类的鸟直接继承 Bird 类即可。从这里可以看出，继承是一个 &quot;是不是&quot;的关系，而 接口 实现则是 &quot;有没有&quot;的关系。如果一个类继承了某个抽象类，则子类必定是抽象类的种类，而接口实现则是有没有、具备不具备的关系，比如鸟是否能飞（或者是否具备飞行这个特点），能飞行则可以实现这个接口，不能飞行就不实现这个接口。</p><p>接口是对类的某种行为的一种抽象，接口和类之间并没有很强的关联关系，举个例子来说，所有的类都可以实现 <a href="https://javabetter.cn/io/Serializbale.html" target="_blank" rel="noopener noreferrer"><code>Serializable</code> 接口</a>，从而具有序列化的功能，但不能说所有的类和 Serializable 之间是 <code>is-a</code> 的关系。</p><p>抽象类作为很多子类的父类，它是一种模板式设计。而接口是一种行为规范，它是一种辐射式设计。什么是模板式设计？最简单例子，大家都用过 ppt 里面的模板，如果用模板 A 设计了 ppt B 和 ppt C，ppt B 和 ppt C 公共的部分就是模板 A 了，如果它们的公共部分需要改动，则只需要改动模板 A 就可以了，不需要重新对 ppt B 和 ppt C 进行改动。而辐射式设计，比如某个电梯都装了某种报警器，一旦要更新报警器，就必须全部更新。也就是说对于抽象类，如果需要添加新的方法，可以直接在抽象类中添加具体的实现，子类可以不进行变更；而对于接口则不行，如果接口进行了变更，则所有实现这个接口的类都必须进行相应的改动。</p><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括Java基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,29)]))}const o=e(n,[["render",r],["__file","abstract-vs-interface.html.vue"]]),c=JSON.parse('{"path":"/oo/abstract-vs-interface.html","title":"Java 抽象类和接口的区别，看这一篇就够了，全面解析","lang":"zh-CN","frontmatter":{"title":"Java 抽象类和接口的区别，看这一篇就够了，全面解析","shortTitle":"Java抽象类和接口的区别","description":"本文详细讨论了Java抽象类与接口的区别，包括它们的定义、应用场景、语法规则等方面的异同。通过比较抽象类与接口的优缺点，我们将为您提供一些关于何时使用抽象类和何时使用接口的实际建议，以便在实际编程中做出明智的选择。","category":["Java 核心"],"tag":["面向对象编程"],"head":[["meta",{"name":"keywords","content":"Java,java 抽象类 接口,java interface abstract,抽象类, 接口"}],["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/oo/abstract-vs-interface.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"Java 抽象类和接口的区别，看这一篇就够了，全面解析"}],["meta",{"property":"og:description","content":"本文详细讨论了Java抽象类与接口的区别，包括它们的定义、应用场景、语法规则等方面的异同。通过比较抽象类与接口的优缺点，我们将为您提供一些关于何时使用抽象类和何时使用接口的实际建议，以便在实际编程中做出明智的选择。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"面向对象编程"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 抽象类和接口的区别，看这一篇就够了，全面解析\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":3,"title":"01、抽象类","slug":"_01、抽象类","link":"#_01、抽象类","children":[]},{"level":3,"title":"02、接口","slug":"_02、接口","link":"#_02、接口","children":[]},{"level":3,"title":"03、两者差别","slug":"_03、两者差别","link":"#_03、两者差别","children":[]}],"git":{"createdTime":1660095699000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":5.83,"words":1750},"filePathRelative":"oo/abstract-vs-interface.md","localizedDate":"2022年8月10日","excerpt":"\\n<p>“三妹，通过前面两篇，我们已经深入地了解了 Java <a href=\\"https://javabetter.cn/oo/abstract.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">抽象类</a>和 Java <a href=\\"https://javabetter.cn/oo/interface.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">接口</a>，那这篇我们来重点说一下抽象类和接口之间的区别。”我放下手中的鼠标和键盘，转向右手边，对三妹说。</p>\\n<p>“好啊。我挺想总结一波的，也算是对抽象类和接口做个了结。”三妹回应到。</p>"}');export{o as comp,c as data};
