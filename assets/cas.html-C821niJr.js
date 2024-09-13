import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,e,o as n}from"./app-BeHkqkE2.js";const t={};function l(h,i){return n(),a("div",null,i[0]||(i[0]=[e(`<h1 id="第十二节-乐观锁-cas" tabindex="-1"><a class="header-anchor" href="#第十二节-乐观锁-cas"><span>第十二节：乐观锁 CAS</span></a></h1><p>CAS（Compare-and-Swap）是一种乐观锁的实现方式，全称为“比较并交换”，是一种无锁的原子操作。</p><p>在并发编程中，我们都知道<code>i++</code>操作是非线程安全的，这是因为 <code>i++</code>操作不是原子操作，我们之前在讲<a href="https://javabetter.cn/thread/thread-bring-some-problem.html" target="_blank" rel="noopener noreferrer">多线程带来了什么问题</a>中有讲到，大家应该还记得吧？</p><p><strong>如何保证原子性呢？</strong></p><p>常见的做法就是加锁。</p><p>在 Java 中，我们可以使用 <a href="https://javabetter.cn/thread/synchronized-1.html" target="_blank" rel="noopener noreferrer">synchronized</a>关键字和 <code>CAS</code> 来实现加锁效果。</p><p><code>synchronized</code> 是悲观锁，尽管随着 JDK 版本的升级，synchronized 关键字已经“轻量级”了很多（<a href="https://javabetter.cn/thread/synchronized.html" target="_blank" rel="noopener noreferrer">前面有细讲，戳链接回顾</a>），但依然是悲观锁，线程开始执行第一步就要获取锁，一旦获得锁，其他的线程进入后就会阻塞并等待锁。</p><p>如果不好理解，我们来举个生活中的例子：一个人进入厕所后首先把门锁上（获取锁），然后开始上厕所，这个时候有其他人来了就只能在外面等（阻塞），就算再急也没用。上完厕所完事后把门打开（解锁），其他人就可以进入了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/cas-973e8804-c713-43f6-9a63-4b9f2be54f10.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>CAS</code> 是乐观锁，线程执行的时候不会加锁，它会假设此时没有冲突，然后完成某项操作；如果因为冲突失败了就重试，直到成功为止。</p><h2 id="乐观锁与悲观锁" tabindex="-1"><a class="header-anchor" href="#乐观锁与悲观锁"><span>乐观锁与悲观锁</span></a></h2><p>锁可以从不同的角度来分类。比如我们在前面讲 <a href="https://javabetter.cn/thread/synchronized.html" target="_blank" rel="noopener noreferrer">synchronized 四种锁状态</a>的时候，提到过偏向锁、轻量级锁、重量级锁，对吧？乐观锁和悲观锁也是一种分类方式。</p><h3 id="悲观锁" tabindex="-1"><a class="header-anchor" href="#悲观锁"><span>悲观锁</span></a></h3><p>对于悲观锁来说，它总是认为每次访问共享资源时会发生冲突，所以必须对每次数据操作加上锁，以保证临界区的程序同一时间只能有一个线程在执行。</p><h3 id="乐观锁" tabindex="-1"><a class="header-anchor" href="#乐观锁"><span>乐观锁</span></a></h3><p>乐观锁，顾名思义，它是乐观派。乐观锁总是假设对共享资源的访问没有冲突，线程可以不停地执行，无需加锁也无需等待。一旦多个线程发生冲突，乐观锁通常使用一种称为 CAS 的技术来保证线程执行的安全性。</p><p>由于乐观锁假想操作中没有锁的存在，因此不太可能出现死锁的情况，换句话说，<strong>乐观锁天生免疫死锁</strong>。</p><ul><li>乐观锁多用于“读多写少“的环境，避免频繁加锁影响性能；</li><li>悲观锁多用于”写多读少“的环境，避免频繁失败和重试影响性能。</li></ul><h2 id="什么是-cas" tabindex="-1"><a class="header-anchor" href="#什么是-cas"><span>什么是 CAS</span></a></h2><p>在 CAS 中，有这样三个值：</p><ul><li>V：要更新的变量(var)</li><li>E：预期值(expected)</li><li>N：新值(new)</li></ul><p>比较并交换的过程如下：</p><p>判断 V 是否等于 E，如果等于，将 V 的值设置为 N；如果不等，说明已经有其它线程更新了 V，于是当前线程放弃更新，什么都不做。</p><p>这里的<strong>预期值 E 本质上指的是“旧值”</strong>。</p><p>我们以一个简单的例子来解释这个过程：</p><ol><li>如果有一个多个线程共享的变量<code>i</code>原本等于 5，我现在在线程 A 中，想把它设置为新的值 6;</li><li>我们使用 CAS 来做这个事情；</li><li>首先我们用 i 去与 5 对比，发现它等于 5，说明没有被其它线程改过，那我就把它设置为新的值 6，此次 CAS 成功，<code>i</code>的值被设置成了 6；</li><li>如果不等于 5，说明<code>i</code>被其它线程改过了（比如现在<code>i</code>的值为 2），那么我就什么也不做，此次 CAS 失败，<code>i</code>的值仍然为 2。</li></ol><p>在这个例子中，<code>i</code>就是 V，5 就是 E，6 就是 N。</p><p>那有没有可能我在判断了<code>i</code>为 5 之后，正准备更新它的新值的时候，被其它线程更改了<code>i</code>的值呢？</p><p>不会的。因为 CAS 是一种原子操作，它是一种系统原语，是一条 CPU 的原子指令，从 CPU 层面已经保证它的原子性。</p><p><strong>当多个线程同时使用 CAS 操作一个变量时，只有一个会胜出，并成功更新，其余均会失败，但失败的线程并不会被挂起，仅是被告知失败，并且允许再次尝试，当然也允许失败的线程放弃操作。</strong></p><h2 id="cas-的原理" tabindex="-1"><a class="header-anchor" href="#cas-的原理"><span>CAS 的原理</span></a></h2><p>前面提到，CAS 是一种原子操作。那么 Java 是怎样来使用 CAS 的呢？我们知道，在 Java 中，如果一个<a href="https://javabetter.cn/oo/native-method.html" target="_blank" rel="noopener noreferrer">方法是 native 的</a>，那 Java 就不负责具体实现它，而是交给底层的 JVM 使用 C 语言 或者 C++ 去实现。</p><p>在 Java 中，有一个<code>Unsafe</code>类（<a href="https://javabetter.cn/thread/Unsafe.html" target="_blank" rel="noopener noreferrer">后面会细讲，戳链接直达</a>），它在<code>sun.misc</code>包中。它里面都是一些<code>native</code>方法，其中就有几个是关于 CAS 的：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">boolean</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> compareAndSwapObject</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> expected</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> x)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">boolean</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> compareAndSwapInt</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> expected</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> x)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">boolean</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> compareAndSwapLong</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> expected</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> x)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Unsafe 对 CAS 的实现是通过 C++ 实现的，它的具体实现和操作系统、CPU 都有关系。</p><p>Linux 的 X86 下主要是通过<code>cmpxchgl</code>这个指令在 CPU 上完成 CAS 操作的，但在多处理器情况下，必须使用<code>lock</code>指令加锁来完成。当然，不同的操作系统和处理器在实现方式上肯定会有所不同。</p><blockquote><p>CMPXCHG是“Compare and Exchange”的缩写，它是一种原子指令，用于在多核/多线程环境中安全地修改共享数据。CMPXCHG在很多现代微处理器体系结构中都有，例如Intel x86/x64体系。对于32位操作数，这个指令通常写作CMPXCHG，而在64位操作数中，它被称为CMPXCHG8B或CMPXCHG16B。</p></blockquote><p>除了上面提到的方法，Unsafe 里面还有其它的方法。比如支持线程挂起和恢复的<code>park</code>和<code>unpark</code> 方法， <a href="https://javabetter.cn/thread/LockSupport.html" target="_blank" rel="noopener noreferrer">LockSupport 类（后面会讲）</a>底层就调用了这两个方法。还有支持<a href="https://javabetter.cn/basic-extra-meal/fanshe.html" target="_blank" rel="noopener noreferrer">反射</a>操作的<code>allocateInstance()</code>方法。</p><h2 id="cas-如何实现原子操作" tabindex="-1"><a class="header-anchor" href="#cas-如何实现原子操作"><span>CAS 如何实现原子操作？</span></a></h2><p>上面介绍了 Unsafe 类的几个支持 CAS 的方法。那 Java 具体是如何通过这几个方法来实现原子操作的呢？</p><p>JDK 提供了一些用于原子操作的类，在<code>java.util.concurrent.atomic</code>包下面。在 JDK 8 中，有以下这些类：</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/cas-20230731195315.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>从名字就可以看出来这些类大概的用途（<a href="https://javabetter.cn/thread/atomic.html" target="_blank" rel="noopener noreferrer">原子类后面会细讲，戳链接直达</a>）：</p><ul><li>原子更新基本类型</li><li>原子更新数组</li><li>原子更新引用</li><li>原子更新字段（属性）</li></ul><p>这里我们以<code>AtomicInteger</code>类的<code>getAndAdd(int delta)</code>方法为例，来看看 Java 是如何实现原子操作的。</p><p>先来看 getAndAdd 方法的源码：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getAndAdd</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> delta) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> unsafe</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getAndAddInt</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, valueOffset, delta);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 unsafe 其实就是一个<code>Unsafe</code>对象：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// setup to use Unsafe.compareAndSwapInt for updates</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Unsafe</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> unsafe </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> Unsafe</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getUnsafe</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，<code>AtomicInteger</code>类的<code>getAndAdd()</code>方法是通过调用<code>Unsafe</code>类的方法实现的：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getAndAddInt</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> var1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> var2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> var4) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> var5</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    do</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        var5 </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getIntVolatile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(var1, var2);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">while</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">!</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">compareAndSwapInt</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(var1, var2, var5, var5 </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> var4)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> var5</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>让我们详细分析下这段代码，先看参数：</p><ul><li>Object var1，这个参数代表你想要进行操作的对象。</li><li>long var2，这个参数是你想要操作的 var1 对象中的某个字段的偏移量。这个偏移量可以通过 Unsafe 类的 objectFieldOffset 方法获得。</li><li>int var4，这个参数是你想要增加的值。</li></ul><p>再来看方法执行的过程：</p><ul><li>首先，在 do while 循环开始，通过<code>this.getIntVolatile(var1, var2)</code>获取当前对象指定字段的值，将其存入临时变量 var5 中。这里的 getIntVolatile 方法能保证读操作的可见性，即读取的结果是最新的写入结果，不会因为 JVM 的优化策略（如<a href="https://javabetter.cn/thread/jmm.html" target="_blank" rel="noopener noreferrer">指令重排序</a>）或者 CPU 的缓存导致读取到过期的数据。</li><li>然后，执行<code>compareAndSwapInt(var1, var2, var5, var5 + var4)</code>进行 CAS 操作。如果对象 var1 在内存地址 var2 处的值等于预期值 var5，则将该位置的值更新为 var5 + var4，并返回 true；否则，不做任何操作并返回 false。</li><li>如果 CAS 操作成功，说明我们成功地将 var1 对象的 var2 偏移量处的字段的值更新为 var5 + var4，并且这个更新操作是原子性的，因此我们跳出循环并返回原来的值 var5。</li><li>如果 CAS 操作失败，说明在我们尝试更新值的时候，有其他线程修改了该字段的值，所以我们继续循环，重新获取该字段的值，然后再次尝试进行 CAS 操作。</li></ul><p>这里使用的是<strong>do-while 循环</strong>。这种循环不多见，它的目的是<strong>保证循环体内的语句至少会被执行一遍</strong>。这样才能保证 return 的值是我们期望的值。</p><p>JDK 9 及其以后版本中，getAndAddInt 方法和 JDK 8 中的实现有所不同，我们就拿 JDK 11 的源码来做一个对比吧：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">@</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B;">HotSpotIntrinsicCandidate</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getAndAddInt</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> delta) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> v</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    do</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        v </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getIntVolatile</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">while</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">!</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">weakCompareAndSetInt</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> offset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> v</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> v </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> delta))</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> v</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法上面增加了 <code>@HotSpotIntrinsicCandidate</code> 注解。这个注解允许 HotSpot VM 自己来写汇编或 IR 编译器来实现该方法以提供更加的性能。</p><blockquote><p>IR（Intermediate Representation）是一种用于帮助优化编译器的中间代码表示方法。编译器通常将源代码首先转化为 IR，然后对 IR 进行各种优化，最后将优化后的 IR 转化为目标代码。在 JVM（Java Virtual Machine）中，JIT（Just-In-Time）编译器将 Java 字节码（即.class 文件的内容）转化为 IR，然后对 IR 进行优化，最后将 IR 编译为机器码。这个过程在 Java 程序运行时进行，因此被称为“即时编译”。JVM 中的 C1 和 C2 编译器就是 IR 编译器。C1 编译器在编译时进行一些简单的优化，然后快速地将 IR 编译为机器码。C2 编译器在编译时进行更深入的优化，以获得更高的执行效率，但编译的时间也相对更长。</p></blockquote><p>也就是说，虽然表面上看到的是 weakCompareAndSet 和 compareAndSet，但是不排除 HotSpot VM 会手动来实现 weakCompareAndSet 真正功能的可能性。</p><p>简单来说，<code>weakCompareAndSet</code> 操作仅保留了<code>volatile</code> 自身变量的特性，而除去了 happens-before 规则带来的内存语义。换句话说，<code>weakCompareAndSet</code><strong>无法保证处理操作目标的 volatile 变量外的其他变量的执行顺序（编译器和处理器为了优化程序性能而对指令序列进行重新排序），同时也无法保证这些变量的可见性。</strong> 但这在一定程度上可以提高性能。</p><p>再回到循环条件上来，可以看到它是在不断尝试去用 CAS 更新。如果更新失败，就继续重试。</p><p>为什么要把获取“旧值”v 的操作放到循环体内呢？</p><p>这也好理解。前面我们说了，CAS 如果旧值 V 不等于预期值 E，就会更新失败。说明旧的值发生了变化。那我们当然需要返回的是被其他线程改变之后的旧值了，因此放在了 do 循环体内。</p><h2 id="cas-的三大问题" tabindex="-1"><a class="header-anchor" href="#cas-的三大问题"><span>CAS 的三大问题</span></a></h2><p>尽管 CAS 提供了一种有效的同步手段，但也存在一些问题，主要有以下三个：ABA 问题、长时间自旋、多个共享变量的原子操作。</p><h3 id="aba-问题" tabindex="-1"><a class="header-anchor" href="#aba-问题"><span>ABA 问题</span></a></h3><p>所谓的 ABA 问题，就是一个值原来是 A，变成了 B，又变回了 A。这个时候使用 CAS 是检查不出变化的，但实际上却被更新了两次。</p><p>ABA 问题的解决思路是在变量前面追加上<strong>版本号或者时间戳</strong>。从 JDK 1.5 开始，JDK 的 atomic 包里提供了一个类<code>AtomicStampedReference</code>类来解决 ABA 问题。</p><p>这个类的<code>compareAndSet</code>方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果二者都相等，才使用 CAS 设置为新的值和标志。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> boolean</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> compareAndSet</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">V</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">   expectedReference</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">                              V</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">   newReference</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">                              int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> expectedStamp</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">                              int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> newStamp) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    Pair</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">V</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> current </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> pair</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        expectedReference </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> current</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">reference</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> &amp;&amp;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        expectedStamp </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> current</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">stamp</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> &amp;&amp;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        ((newReference </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> current</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">reference</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> &amp;&amp;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">          newStamp </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> current</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">stamp</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">||</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          casPair</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(current</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> Pair</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">of</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(newReference, newStamp)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">))</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>先来看参数：</p><ul><li>expectedReference：预期引用，也就是你认为原本应该在那个位置的引用。</li><li>newReference：新引用，如果预期引用正确，将被设置到该位置的新引用。</li><li>expectedStamp：预期标记，这是你认为原本应该在那个位置的标记。</li><li>newStamp：新标记，如果预期标记正确，将被设置到该位置的新标记。</li></ul><p>执行流程：</p><p>①、<code>Pair&lt;V&gt; current = pair;</code> 这行代码获取当前的 pair 对象，其中包含了引用和标记。</p><p>②、接下来的 return 语句做了几个检查：</p><ul><li><code>expectedReference == current.reference &amp;&amp; expectedStamp == current.stamp</code>：首先检查当前的引用和标记是否和预期的引用和标记相同。如果二者中有任何一个不同，这个方法就会返回 false。</li><li>如果上述检查通过，也就是说当前的引用和标记与预期的相同，那么接下来就会检查新的引用和标记是否也与当前的相同。如果相同，那么实际上没有必要做任何改变，这个方法就会返回 true。</li><li>如果新的引用或者标记与当前的不同，那么就会调用 casPair 方法来尝试更新 pair 对象。casPair 方法会尝试用 newReference 和 newStamp 创建的新的 Pair 对象替换当前的 pair 对象。如果替换成功，casPair 方法会返回 true；如果替换失败（也就是说在尝试替换的过程中，pair 对象已经被其他线程改变了），casPair 方法会返回 false。</li></ul><h3 id="长时间自旋" tabindex="-1"><a class="header-anchor" href="#长时间自旋"><span>长时间自旋</span></a></h3><p>CAS 多与自旋结合。如果自旋 CAS 长时间不成功，会占用大量的 CPU 资源。</p><p>解决思路是让 JVM 支持处理器提供的<strong>pause 指令</strong>。</p><p>pause 指令能让自旋失败时 cpu 睡眠一小段时间再继续自旋，从而使得读操作的频率降低很多，为解决内存顺序冲突而导致的 CPU 流水线重排的代价也会小很多。</p><h3 id="多个共享变量的原子操作" tabindex="-1"><a class="header-anchor" href="#多个共享变量的原子操作"><span>多个共享变量的原子操作</span></a></h3><p>当对一个共享变量执行操作时，CAS 能够保证该变量的原子性。但是对于多个共享变量，CAS 就无法保证操作的原子性，这时通常有两种做法：</p><ol><li>使用<code>AtomicReference</code>类保证对象之间的原子性，把多个变量放到一个对象里面进行 CAS 操作；</li><li>使用锁。锁内的临界区代码可以保证只有当前线程能操作。</li></ol><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>CAS（Compare-and-Swap）是一种被广泛应用在并发控制中的算法，它是一种乐观锁的实现方式。CAS 全称为“比较并交换”，是一种无锁的原子操作。</p><p>CAS 的全称是：比较并交换（Compare And Swap）。在 CAS 中，有这样三个值：</p><ul><li>V：要更新的变量(var)</li><li>E：预期值(expected)</li><li>N：新值(new)</li></ul><p>比较并交换的过程如下：</p><p>判断 V 是否等于 E，如果等于，将 V 的值设置为 N；如果不等，说明已经有其它线程更新了 V，于是当前线程放弃更新，什么都不做。</p><p>这里的<strong>预期值 E 本质上指的是“旧值”</strong>。</p><p>CAS 虽好，但也有一些问题，比如说 ABA 问题、循环时间长开销大、只能保证一个共享变量的原子操作等。在开发中，我们要根据实际情况来选择使用 CAS 还是使用锁。</p><blockquote><p>编辑：沉默王二，编辑前的内容来源于朋友开源的这个仓库：<a href="http://concurrent.redspider.group/" target="_blank" rel="noopener noreferrer">深入浅出 Java 多线程</a>，强烈推荐。</p></blockquote><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第二份 PDF 《<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">并发编程小册</a>》终于来了！包括线程的基本概念和使用方法、Java的内存模型、sychronized、volatile、CAS、AQS、ReentrantLock、线程池、并发容器、ThreadLocal、生产者消费者模型等面试和开发必须掌握的内容，共计 15 万余字，200+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">太赞了，二哥的并发编程进阶之路.pdf</a></p><p><a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">加入二哥的编程星球</a>，在星球的第二个置顶帖「<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">知识图谱</a>」里就可以获取 PDF 版本。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/mianshi-20240723112714.png" alt="二哥的并发编程进阶之路获取方式" tabindex="0" loading="lazy"><figcaption>二哥的并发编程进阶之路获取方式</figcaption></figure>`,98)]))}const k=s(t,[["render",l],["__file","cas.html.vue"]]),d=JSON.parse('{"path":"/thread/cas.html","title":"一文彻底搞清楚Java实现CAS的原理","lang":"zh-CN","frontmatter":{"title":"一文彻底搞清楚Java实现CAS的原理","shortTitle":"乐观锁CAS","description":"CAS（Compare-and-Swap）是一种被广泛应用在并发控制中的算法，它是一种乐观锁的实现方式。CAS全称为“比较并交换”，是一种无锁的原子操作。","category":["Java核心"],"tag":["Java并发编程"],"head":[["meta",{"name":"keywords","content":"Java,并发编程,多线程,Thread,cas"}],["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/thread/cas.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"一文彻底搞清楚Java实现CAS的原理"}],["meta",{"property":"og:description","content":"CAS（Compare-and-Swap）是一种被广泛应用在并发控制中的算法，它是一种乐观锁的实现方式。CAS全称为“比较并交换”，是一种无锁的原子操作。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/cas-973e8804-c713-43f6-9a63-4b9f2be54f10.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java并发编程"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"一文彻底搞清楚Java实现CAS的原理\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/cas-973e8804-c713-43f6-9a63-4b9f2be54f10.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/cas-20230731195315.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/mianshi-20240723112714.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"乐观锁与悲观锁","slug":"乐观锁与悲观锁","link":"#乐观锁与悲观锁","children":[{"level":3,"title":"悲观锁","slug":"悲观锁","link":"#悲观锁","children":[]},{"level":3,"title":"乐观锁","slug":"乐观锁","link":"#乐观锁","children":[]}]},{"level":2,"title":"什么是 CAS","slug":"什么是-cas","link":"#什么是-cas","children":[]},{"level":2,"title":"CAS 的原理","slug":"cas-的原理","link":"#cas-的原理","children":[]},{"level":2,"title":"CAS 如何实现原子操作？","slug":"cas-如何实现原子操作","link":"#cas-如何实现原子操作","children":[]},{"level":2,"title":"CAS 的三大问题","slug":"cas-的三大问题","link":"#cas-的三大问题","children":[{"level":3,"title":"ABA 问题","slug":"aba-问题","link":"#aba-问题","children":[]},{"level":3,"title":"长时间自旋","slug":"长时间自旋","link":"#长时间自旋","children":[]},{"level":3,"title":"多个共享变量的原子操作","slug":"多个共享变量的原子操作","link":"#多个共享变量的原子操作","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"git":{"createdTime":1648037338000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":14.38,"words":4313},"filePathRelative":"thread/cas.md","localizedDate":"2022年3月23日","excerpt":"\\n<p>CAS（Compare-and-Swap）是一种乐观锁的实现方式，全称为“比较并交换”，是一种无锁的原子操作。</p>\\n<p>在并发编程中，我们都知道<code>i++</code>操作是非线程安全的，这是因为 <code>i++</code>操作不是原子操作，我们之前在讲<a href=\\"https://javabetter.cn/thread/thread-bring-some-problem.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">多线程带来了什么问题</a>中有讲到，大家应该还记得吧？</p>\\n<p><strong>如何保证原子性呢？</strong></p>"}');export{k as comp,d as data};
