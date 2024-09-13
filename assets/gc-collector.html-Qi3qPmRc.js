import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,e as a,o as s}from"./app-BeHkqkE2.js";const r={};function n(l,e){return s(),i("div",null,e[0]||(e[0]=[a(`<h1 id="第十一节-垃圾收集器" tabindex="-1"><a class="header-anchor" href="#第十一节-垃圾收集器"><span>第十一节：垃圾收集器</span></a></h1><p>垃圾回收对于 Java 党来说，是一个绕不开的话题，工作中涉及到的调优工作也经常围绕着垃圾回收器展开。面对不同的业务场景，往往需要不同的垃圾收集器才能保证 GC 性能，因此，对于面大厂或者有远大志向的球友可以卷一下垃圾收集器。</p><p>就目前来说，JVM 的垃圾收集器主要分为两大类：<strong>分代收集器</strong>和<strong>分区收集器</strong>，分代收集器的代表是 CMS，分区收集器的代表是 G1 和 ZGC，下面我们来看看这两大类的垃圾收集器。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231227143820.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="分代收集器" tabindex="-1"><a class="header-anchor" href="#分代收集器"><span>分代收集器</span></a></h2><h3 id="cms" tabindex="-1"><a class="header-anchor" href="#cms"><span>CMS</span></a></h3><p>以获取最短回收停顿时间为目标，采用“标记-清除”算法，分 4 大步进行垃圾收集，其中初始标记和重新标记会 STW，JDK 1.5 时引入，JDK9 被标记弃用，JDK14 被移除，详情可见  <a href="https://openjdk.java.net/jeps/363" target="_blank" rel="noopener noreferrer">JEP 363</a>。</p><p><strong>CMS（Concurrent Mark Sweep）垃圾收集器是第一个关注 GC 停顿时间（STW 的时间）的垃圾收集器</strong>。之前的垃圾收集器，要么是串行的垃圾回收方式，要么只关注系统吞吐量。</p><p>CMS 垃圾收集器之所以能够实现对 GC 停顿时间的控制，其本质来源于对「可达性分析算法」的改进，即三色标记算法。在 CMS 出现之前，无论是 Serious 垃圾收集器，还是 ParNew 垃圾收集器，以及 Parallel Scavenge 垃圾收集器，它们在进行垃圾回收的时候都需要 Stop the World，无法实现垃圾回收线程与用户线程的并发执行。</p><blockquote><p>标记-清除算法、Stop the World、可达性分析算法等知识我们<a href="https://javabetter.cn/jvm/gc.html" target="_blank" rel="noopener noreferrer">上一节</a>也讲过了，忘记的<a href="https://javabetter.cn/zhishixingqiu/" target="_blank" rel="noopener noreferrer">球友</a>可以回顾一下。</p></blockquote><p>CMS 垃圾收集器通过三色标记算法，实现了垃圾回收线程与用户线程的并发执行，从而极大地降低了系统响应时间，提高了强交互应用程序的体验。它的运行过程分为 4 个步骤，包括：</p><ul><li>初始标记</li><li>并发标记</li><li>重新标记</li><li>并发清除</li></ul><p><strong>初始标记</strong>，指的是寻找所有被 GCRoots 引用的对象，该阶段需要「Stop the World」。这个步骤仅仅只是标记一下 GC Roots 能直接关联到的对象，并不需要做整个引用的扫描，因此速度很快。</p><p><strong>并发标记</strong>，指的是对「初始标记阶段」标记的对象进行整个引用链的扫描，该阶段不需要「Stop the World」。 对整个引用链做扫描需要花费非常多的时间，因此通过垃圾回收线程与用户线程并发执行，可以降低垃圾回收的时间。</p><p>这也是 CMS 能极大降低 GC 停顿时间的核心原因，但这也带来了一些问题，即：并发标记的时候，引用可能发生变化，因此可能发生漏标（本应该回收的垃圾没有被回收）和多标（本不应该回收的垃圾被回收）了。</p><p><strong>重新标记</strong>，指的是对「并发标记」阶段出现的问题进行校正，该阶段需要「Stop the World」。正如并发标记阶段说到的，由于垃圾回收算法和用户线程并发执行，虽然能降低响应时间，但是会发生漏标和多标的问题。所以对于 CMS 来说，它需要在这个阶段做一些校验，解决并发标记阶段发生的问题。</p><p><strong>并发清除</strong>，指的是将标记为垃圾的对象进行清除，该阶段不需要「Stop the World」。 在这个阶段，垃圾回收线程与用户线程可以并发执行，因此并不影响用户的响应时间。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228211056.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>CMS 的优点是：并发收集、低停顿。但缺点也很明显：</p><p>①、对 CPU 资源非常敏感，因此在 CPU 资源紧张的情况下，CMS 的性能会大打折扣。</p><p>默认情况下，CMS 启用的垃圾回收线程数是<code>（CPU数量 + 3)/4</code>，当 CPU 数量很大时，启用的垃圾回收线程数占比就越小。但如果 CPU 数量很小，例如只有 2 个 CPU，垃圾回收线程占用就达到了 50%，这极大地降低系统的吞吐量，无法接受。</p><p>②、CMS 采用的是「标记-清除」算法，会产生大量的内存碎片，导致空间不连续，当出现大对象无法找到连续的内存空间时，就会触发一次 Full GC，这会导致系统的停顿时间变长。</p><p>③、CMS 无法处理浮动垃圾，当 CMS 在进行垃圾回收的时候，应用程序还在不断地产生垃圾，这些垃圾会在 CMS 垃圾回收结束之后产生，这些垃圾就是浮动垃圾，CMS 无法处理这些浮动垃圾，只能在下一次 GC 时清理掉。</p><h2 id="分区收集器" tabindex="-1"><a class="header-anchor" href="#分区收集器"><span>分区收集器</span></a></h2><h3 id="g1" tabindex="-1"><a class="header-anchor" href="#g1"><span>G1</span></a></h3><p>G1（Garbage-First Garbage Collector）在 JDK 1.7 时引入，在 JDK 9 时取代 CMS 成为了默认的垃圾收集器。G1 有五个属性：分代、增量、并行、标记整理、STW。</p><p>①、分代：相信大家还记得我们<a href="https://javabetter.cn/jvm/gc.html" target="_blank" rel="noopener noreferrer">上一讲中的年轻代和老年代</a>，G1 也是基于这个思想进行设计的。它将堆内存分为多个大小相等的区域（Region），每个区域都可以是 Eden 区、Survivor 区或者 Old 区。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228213824.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以通过 <code>-XX:G1HeapRegionSize=n</code> 来设置 Region 的大小，可以设定为 1M、2M、4M、8M、16M、32M（不能超过）。</p><p>G1 有专门分配大对象的 Region 叫 Humongous 区，而不是让大对象直接进入老年代的 Region 中。在 G1 中，大对象的判定规则就是一个大对象超过了一个 Region 大小的 50%，比如每个 Region 是 2M，只要一个对象超过了 1M，就会被放入 Humongous 中，而且一个大对象如果太大，可能会横跨多个 Region 来存放。</p><p>G1 会根据各个区域的垃圾回收情况来决定下一次垃圾回收的区域，这样就避免了对整个堆内存进行垃圾回收，从而降低了垃圾回收的时间。</p><p>②、增量：G1 可以以增量方式执行垃圾回收，这意味着它不需要一次性回收整个堆空间，而是可以逐步、增量地清理。有助于控制停顿时间，尤其是在处理大型堆时。</p><p>③、并行：G1 垃圾回收器可以并行回收垃圾，这意味着它可以利用多个 CPU 来加速垃圾回收的速度，这一特性在年轻代的垃圾回收（Minor GC）中特别明显，因为年轻代的回收通常涉及较多的对象和较高的回收速率。</p><p>④、标记整理：在进行老年代的垃圾回收时，G1 使用标记-整理算法。这个过程分为两个阶段：标记存活的对象和整理（压缩）堆空间。通过整理，G1 能够避免内存碎片化，提高内存利用率。</p><p>年轻代的垃圾回收（Minor GC）使用复制算法，因为年轻代的对象通常是朝生夕死的。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230100404.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>⑤、STW：G1 也是基于「标记-清除」算法，因此在进行垃圾回收的时候，仍然需要「Stop the World」。不过，G1 在停顿时间上添加了预测机制，用户可以指定期望停顿时间。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228213622.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>G1 中存在三种 GC 模式，分别是 Young GC、Mixed GC 和 Full GC。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228215108.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>当 Eden 区的内存空间无法支持新对象的内存分配时，G1 会触发 Young GC。</p><p>当需要分配对象到 Humongous 区域或者堆内存的空间占比超过 <code>-XX:G1HeapWastePercent</code> 设置的 InitiatingHeapOccupancyPercent 值时，G1 会触发一次 concurrent marking，它的作用就是计算老年代中有多少空间需要被回收，当发现垃圾的占比达到 <code>-XX:G1HeapWastePercent</code> 中所设置的 G1HeapWastePercent 比例时，在下次 Young GC 后会触发一次 Mixed GC。</p><p>Mixed GC 是指回收年轻代的 Region 以及一部分老年代中的 Region。Mixed GC 和 Young GC 一样，采用的也是复制算法。</p><p>在 Mixed GC 过程中，如果发现老年代空间还是不足，此时如果 G1HeapWastePercent 设定过低，可能引发 Full GC。<code>-XX:G1HeapWastePercent</code> 默认是 5，意味着只有 5% 的堆是“浪费”的。如果浪费的堆的百分比大于 G1HeapWastePercent，则运行 Full GC。</p><p>在以 Region 为最小管理单元以及所采用的 GC 模式的基础上，G1 建立了停顿预测模型，即 Pause Prediction Model 。这也是 G1 非常被人所称道的特性。</p><p>我们可以借助 <code>-XX:MaxGCPauseMillis</code> 来设置期望的停顿时间（默认 200ms），G1 会根据这个值来计算出一个合理的 Young GC 的回收时间，然后根据这个时间来制定 Young GC 的回收计划。</p><h3 id="zgc" tabindex="-1"><a class="header-anchor" href="#zgc"><span>ZGC</span></a></h3><p>ZGC（The Z Garbage Collector）是 JDK11 推出的一款低延迟垃圾收集器，适用于大内存低延迟服务的内存管理和回收，SPEC jbb 2015 基准测试，在 128G 的大堆下，最大停顿时间才 1.68 ms，停顿时间远胜于 G1 和 CMS。</p><p>ZGC 的设计目标是：在不超过 10ms 的停顿时间下，支持 TB 级的内存容量和几乎所有的 GC 功能，这也是 ZGC 名字的由来，Z 代表着 Zettabyte，也就是 1024EB，也就是 1TB 的 1024 倍。</p><p>不过，我需要告诉大家的是，上面这段是我胡编的（😂），JDK 官方并没有明确给出 Z 的定义，就像小米汽车 su7，7 也是个魔数，没有明确的定义。</p><p>总之就是，ZGC 很牛逼，它的目标是：</p><ul><li>停顿时间不超过 10ms；</li><li>停顿时间不会随着堆的大小，或者活跃对象的大小而增加；</li><li>支持 8MB~4TB 级别的堆，未来支持 16TB。</li></ul><p>前面讲 G1 垃圾收集器的时候提到过，Young GC 和 Mixed GC 均采用的是<a href="https://javabetter.cn/jvm/gc.html" target="_blank" rel="noopener noreferrer">复制算法</a>，复制算法主要包括以下 3 个阶段：</p><p>①、标记阶段，从 GC Roots 开始，分析对象可达性，标记出活跃对象。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230101117.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>②、对象转移阶段，把活跃对象复制到新的内存地址上。</p><p>③、重定位阶段，因为转移导致对象地址发生了变化，在重定位阶段，所有指向对象旧地址的引用都要调整到对象新的地址上。</p><p>标记阶段因为只标记 GC Roots，耗时较短。但转移阶段和重定位阶段需要处理所有存活的对象，耗时较长，并且转移阶段是 STW 的，因此，G1 的性能瓶颈就主要卡在转移阶段。</p><p>与 G1 和 CMS 类似，ZGC 也采用了复制算法，只不过做了重大优化，ZGC 在标记、转移和重定位阶段几乎都是并发的，这是 ZGC 实现停顿时间小于 10ms 的关键所在。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230101805.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>ZGC 是怎么做到的呢？</p><ul><li>指针染色（Colored Pointer）：一种用于标记对象状态的技术。</li><li>读屏障（Load Barrier）：一种在程序运行时插入到对象访问操作中的特殊检查，用于确保对象访问的正确性。</li></ul><p>这两种技术可以让所有线程在并发的条件下就指针的颜色 (状态) 达成一致，而不是对象地址。因此，ZGC 可以并发的复制对象，这大大的降低了 GC 的停顿时间。</p><h4 id="指针染色" tabindex="-1"><a class="header-anchor" href="#指针染色"><span>指针染色</span></a></h4><p>在一个指针中，除了存储对象的实际地址外，还有额外的位被用来存储关于该对象的元数据信息。这些信息可能包括：</p><ul><li>对象是否被移动了（即它是否在回收过程中被移动到了新的位置）。</li><li>对象的存活状态。</li><li>对象是否被锁定或有其他特殊状态。</li></ul><p>通过在指针中嵌入这些信息，ZGC 在标记和转移阶段会更快，因为通过指针上的颜色就能区分出对象状态，不用额外做内存访问。</p><p>ZGC仅支持64位系统，它把64位虚拟地址空间划分为多个子空间，如下图所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230104011.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其中，0-4TB 对应 Java 堆，4TB-8TB 被称为 M0 地址空间，8TB-12TB 被称为 M1 地址空间，12TB-16TB 预留未使用，16TB-20TB 被称为 Remapped 空间。</p><p>当创建对象时，首先在堆空间申请一个虚拟地址，该虚拟地址并不会映射到真正的物理地址。同时，ZGC 会在 M0、M1、Remapped 空间中为该对象分别申请一个虚拟地址，且三个虚拟地址都映射到同一个物理地址。</p><p>下图是虚拟地址的空间划分：</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230105830.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>不过，三个空间在同一时间只有一个空间有效。ZGC 之所以设置这三个虚拟地址，是因为 ZGC 采用的是“空间换时间”的思想，去降低 GC 的停顿时间。</p><p>与上述地址空间划分相对应，ZGC实际仅使用64位地址空间的第0-41位，而第42-45位存储元数据，第47-63位固定为0。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230104802.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>由于仅用了第 0~43 位存储对象地址，$2^{44}$ = 16TB，所以 ZGC 最大支持 16TB 的堆。</p><p>至于对象的存活信息，则存储在42-45位中，这与传统的垃圾回收并将对象存活信息放在对象头中完全不同。</p><h4 id="读屏障" tabindex="-1"><a class="header-anchor" href="#读屏障"><span>读屏障</span></a></h4><p>当程序尝试读取一个对象时，读屏障会触发以下操作：</p><ul><li>检查指针染色：读屏障首先检查指向对象的指针的颜色信息。</li><li>处理移动的对象：如果指针表示对象已经被移动（例如，在垃圾回收过程中），读屏障将确保返回对象的新位置。</li><li>确保一致性：通过这种方式，ZGC 能够在并发移动对象时保持内存访问的一致性，从而减少对应用程序停顿的需要。</li></ul><p>ZGC读屏障如何实现呢？</p><p>来看下面这段伪代码，涉及 JVM 的底层 C++ 代码：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 伪代码示例，展示读屏障的概念性实现</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">Object</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> read_barrier</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(Object</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> ref) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    if</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">is_forwarded</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(ref)) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> get_forwarded_address</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(ref)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 获取对象的新地址</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    }</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> ref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 对象未移动，返回原始引用</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>read_barrier 代表读屏障。</li><li>如果对象已被移动（is_forwarded(ref)），方法返回对象的新地址（get_forwarded_address(ref)）。</li><li>如果对象未被移动，方法返回原始的对象引用。</li></ul><p>读屏障可能被GC线程和业务线程触发，并且只会在访问堆内对象时触发，访问的对象位于GC Roots时不会触发，这也是扫描GC Roots时需要STW的原因。</p><p>下面是一个简化的示例代码，展示了读屏障的触发时机。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> o </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> obj</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">FieldA</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">   // 从堆中读取引用，需要加入屏障</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Load</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> barrier</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Object</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> p </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> o  </span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 无需加入屏障，因为不是从堆中读取引用</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">o</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">dosomething</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 无需加入屏障，因为不是从堆中读取引用</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">  obj</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">FieldB</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">  //无需加入屏障，因为不是对象引用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="zgc-的工作过程" tabindex="-1"><a class="header-anchor" href="#zgc-的工作过程"><span>ZGC 的工作过程</span></a></h4><p>ZGC 周期由三个 STW 暂停和四个并发阶段组成：标记/重新映射( M/R )、并发引用处理( RP )、并发转移准备( EC ) 和并发转移( RE )。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102140237.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="stop-the-world-暂停阶段" tabindex="-1"><a class="header-anchor" href="#stop-the-world-暂停阶段"><span>Stop-The-World 暂停阶段</span></a></h5><ol><li><p><strong>标记开始（Mark Start）STW 暂停</strong>：这是 ZGC 的开始，进行 GC Roots 的初始标记。在这个短暂的停顿期间，ZGC 标记所有从 GC Root 直接可达的对象。</p></li><li><p><strong>重新映射开始（Relocation Start）STW 暂停</strong>：在并发阶段之后，这个 STW 暂停是为了准备对象的重定位。在这个阶段，ZGC 选择将要清理的内存区域，并建立必要的数据结构以进行对象移动。</p></li><li><p><strong>暂停结束（Pause End）STW 暂停</strong>：ZGC 结束。在这个短暂的停顿中，完成所有与该 GC 周期相关的最终清理工作。</p></li></ol><h5 id="并发阶段" tabindex="-1"><a class="header-anchor" href="#并发阶段"><span>并发阶段</span></a></h5><ol><li><p><strong>并发标记/重新映射 (M/R)</strong> ：这个阶段包括并发标记和并发重新映射。在并发标记中，ZGC 遍历对象图，标记所有可达的对象。然后，在并发重新映射中，ZGC 更新指向移动对象的所有引用。</p></li><li><p><strong>并发引用处理 (RP)</strong> ：在这个阶段，ZGC 处理各种引用类型（如软引用、弱引用、虚引用和幽灵引用）。这些引用的处理通常需要特殊的考虑，因为它们与对象的可达性和生命周期密切相关。</p></li><li><p><strong>并发转移准备 (EC)</strong> ：这是为对象转移做准备的阶段。ZGC 确定哪些内存区域将被清理，并准备相关的数据结构。</p></li><li><p><strong>并发转移 (RE)</strong> ：在这个阶段，ZGC 将存活的对象从旧位置移动到新位置。由于这一过程是并发执行的，因此应用程序可以在大多数垃圾回收工作进行时继续运行。</p></li></ol><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102142638.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>ZGC 的两个关键技术：指针染色和读屏障，不仅应用在并发转移阶段，还应用在并发标记阶段：将对象设置为已标记，传统的垃圾回收器需要进行一次内存访问，并将对象存活信息放在对象头中；而在ZGC中，只需要设置指针地址的第42-45位即可，并且因为是寄存器访问，所以速度比访问内存更快。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102142908.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h3><p>本篇内容我们主要介绍了 CMS、G1 和 ZGC 三种垃圾收集器，它们都是分区收集器，都是为了降低 GC 停顿时间而生的，但是它们各有优缺点，我们可以根据业务场景选择合适的垃圾收集器。</p><p>参考资料：</p><blockquote><p>1、树哥聊编程：<a href="https://mp.weixin.qq.com/s/V1utsm5Wn3uhV1QrATz4ag" target="_blank" rel="noopener noreferrer">CMS 垃圾收集器</a> 2、军哥聊技术：<a href="https://mp.weixin.qq.com/s/rVS5TBRU9QcnMNdBz6w_Mg" target="_blank" rel="noopener noreferrer">G1 垃圾收集器</a> 3、美团技术专家：<a href="https://tech.meituan.com/2016/09/23/g1.html" target="_blank" rel="noopener noreferrer">G1 GC 的一些关键技术</a> 4、极客时间：<a href="https://time.geekbang.org/column/article/703481" target="_blank" rel="noopener noreferrer">为什么 G1 被叫做 GC 中的王</a> 5、得物技术：<a href="https://mp.weixin.qq.com/s/W-RDY1mLDQG86hlLMNM0IQ" target="_blank" rel="noopener noreferrer">ZGC 关键技术分析</a> 6、美团技术：<a href="https://tech.meituan.com/2020/08/06/new-zgc-practice-in-meituan.html" target="_blank" rel="noopener noreferrer">ZGC 的探索与实践</a> 7、CoderW：<a href="https://mp.weixin.qq.com/s/FIr6r2dcrm1pqZj5Bubbmw" target="_blank" rel="noopener noreferrer">ZGC 垃圾收集器</a></p></blockquote><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括 Java 基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM 等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,106)]))}const c=t(r,[["render",n],["__file","gc-collector.html.vue"]]),h=JSON.parse('{"path":"/jvm/gc-collector.html","title":"深入理解 JVM 的垃圾收集器：CMS、G1、ZGC","lang":"zh-CN","frontmatter":{"title":"深入理解 JVM 的垃圾收集器：CMS、G1、ZGC","shortTitle":"垃圾收集器","category":["Java核心"],"tag":["Java虚拟机"],"description":"本篇内容我们主要介绍了 CMS、G1 和 ZGC 三种垃圾收集器，它们都是分区收集器，都是为了降低 GC 停顿时间而生的，但是它们各有优缺点，我们可以根据业务场景选择合适的垃圾收集器。","head":[["meta",{"name":"keywords","content":"Java,JavaSE,教程,二哥的Java进阶之路,jvm,Java虚拟机,CMS,G1,ZGC,垃圾收集器"}],["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/jvm/gc-collector.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"深入理解 JVM 的垃圾收集器：CMS、G1、ZGC"}],["meta",{"property":"og:description","content":"本篇内容我们主要介绍了 CMS、G1 和 ZGC 三种垃圾收集器，它们都是分区收集器，都是为了降低 GC 停顿时间而生的，但是它们各有优缺点，我们可以根据业务场景选择合适的垃圾收集器。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231227143820.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java虚拟机"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"深入理解 JVM 的垃圾收集器：CMS、G1、ZGC\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231227143820.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228211056.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228213824.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230100404.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228213622.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231228215108.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230101117.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230101805.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230104011.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230105830.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231230104802.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102140237.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102142638.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20240102142908.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"分代收集器","slug":"分代收集器","link":"#分代收集器","children":[{"level":3,"title":"CMS","slug":"cms","link":"#cms","children":[]}]},{"level":2,"title":"分区收集器","slug":"分区收集器","link":"#分区收集器","children":[{"level":3,"title":"G1","slug":"g1","link":"#g1","children":[]},{"level":3,"title":"ZGC","slug":"zgc","link":"#zgc","children":[]},{"level":3,"title":"小结","slug":"小结","link":"#小结","children":[]}]}],"git":{"createdTime":1703660241000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":16.43,"words":4929},"filePathRelative":"jvm/gc-collector.md","localizedDate":"2023年12月27日","excerpt":"\\n<p>垃圾回收对于 Java 党来说，是一个绕不开的话题，工作中涉及到的调优工作也经常围绕着垃圾回收器展开。面对不同的业务场景，往往需要不同的垃圾收集器才能保证 GC 性能，因此，对于面大厂或者有远大志向的球友可以卷一下垃圾收集器。</p>\\n<p>就目前来说，JVM 的垃圾收集器主要分为两大类：<strong>分代收集器</strong>和<strong>分区收集器</strong>，分代收集器的代表是 CMS，分区收集器的代表是 G1 和 ZGC，下面我们来看看这两大类的垃圾收集器。</p>\\n<figure><img src=\\"https://cdn.tobebetterjavaer.com/stutymore/gc-collector-20231227143820.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>"}');export{c as comp,h as data};
