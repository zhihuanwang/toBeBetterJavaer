import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,e as s,o as i}from"./app-BeHkqkE2.js";const n={};function r(p,e){return i(),t("div",null,e[0]||(e[0]=[s(`<h1 id="java-问题诊断和排查工具-查看-jvm-参数、内存使用情况及分析" tabindex="-1"><a class="header-anchor" href="#java-问题诊断和排查工具-查看-jvm-参数、内存使用情况及分析"><span>Java 问题诊断和排查工具（查看 JVM 参数、内存使用情况及分析）</span></a></h1><h2 id="jdk-自带的工具" tabindex="-1"><a class="header-anchor" href="#jdk-自带的工具"><span>JDK 自带的工具</span></a></h2><p>在 JDK 的 bin 目录下有很多命令行工具：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-547b1b2c-9fb4-4d1d-9c72-013ec210f6a5.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们可以看到各个工具的大小基本上都稳定在 27kb 左右，这个不是 JDK 开发团队刻意为之的，而是因为这些工具大多数是 <code>jdk\\lib\\tools.jar</code> 类库的一层薄包装而已，他们的主要功能代码是在 tools 类库中实现的。</p><p>命令行工具的好处是：当应用程序部署到生产环境后，无论是直接接触物理服务器还是远程 telnet 到服务器上都会受到限制。而借助 tools.jar 类库里面的接口，我们可以直接在应用程序中实现功能强大的监控分析功能。</p><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令：</span></a></h3><p>这里主要介绍如下几个工具：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>1、jps：查看本机 java 进程信息</p><p>2、jstack：打印线程的<strong>栈</strong>信息，制作   线程 dump 文件</p><p>3、jmap：打印内存映射信息，制作   堆 dump 文件</p><p>4、jstat：性能监控工具</p><p>5、jhat：内存分析工具，用于解析堆 dump 文件并以适合人阅读的方式展示出来</p><p>6、jconsole：简易的 JVM 可视化工具</p><p>7、jvisualvm：功能更强大的 JVM 可视化工具</p><p>8、javap：查看字节码</p><h3 id="java-dump" tabindex="-1"><a class="header-anchor" href="#java-dump"><span>JAVA Dump：</span></a></h3><p>JAVA Dump 就是虚拟机运行时的快照，将虚拟机运行时的状态和信息保存到文件中，包括：</p><p>线程 dump：包含所有线程的运行状态，纯文本格式</p><p>堆 dump：包含所有堆对象的状态，二进制格式</p><h2 id="_1、jps" tabindex="-1"><a class="header-anchor" href="#_1、jps"><span>1、jps</span></a></h2><p>显示当前所有 java 进程 pid 的命令，我们可以通过这个命令来查看到底启动了几个 java 进程（因为每一个 java 程序都会独占一个 java 虚拟机实例），不过 jps 有个缺点是只能显示当前用户的进程 id，要显示其他用户的还只能用 linux 的 ps 命令。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-2017daf6-832a-4673-b776-ad3380e47402.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>执行 jps 命令，会列出所有正在运行的 java 进程，其中 jps 命令也是一个 java 程序。前面的数字就是进程的 id，这个 id 的作用非常大，后面会有相关介绍。</p><p><strong>jps -help：</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-031be661-e47e-44f0-9e33-34368b187662.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>jps -l</strong>  输出应用程序 main.class 的完整 package 名或者应用程序 jar 文件完整路径名</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-0ccc96dc-8053-4222-9824-b116f02776a4.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>jps -v</strong>  输出传递给 JVM 的参数</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-059a3285-4a01-4f7a-a6ed-1cc5dcbf3f18.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>jps 失效</strong></p><p>我们在定位问题过程会遇到这样一种情况，用 jps 查看不到进程 id，用 ps -ef | grep java 却能看到启动的 java 进程。</p><p>要解释这种现象，先来了解下 jps 的实现机制：</p><p>java 程序启动后，会在目录/tmp/hsperfdata_{userName}/下生成几个文件，文件名就是 java 进程的 pid，因此 jps 列出进程 id 就是把这个目录下的文件名列一下而已，至于系统参数，则是读取文件中的内容。</p><p>我们来思考下：<strong>如果由于磁盘满了，无法创建这些文件，或者用户对这些文件没有读的权限。又或者因为某种原因这些文件或者目录被清除，出现以上这些情况，就会导致 jps 命令失效。</strong></p><p>如果 jps 命令失效，而我们又要获取 pid，还可以使用以下两种方法：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1、top | grep java</span></span>
<span class="line"><span>2、ps -ef |grep java</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、jstack" tabindex="-1"><a class="header-anchor" href="#_2、jstack"><span>2、jstack</span></a></h2><p>主要用于生成指定进程当前时刻的线程快照，线程快照是当前 java 虚拟机每一条线程正在执行的方法堆栈的集合，生成线程快照的主要目的是用于定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致长时间等待。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-e80d0925-2dcf-4204-b46d-47312df2a673.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>3、jmap</strong></p><p>主要用于打印指定 java 进程的共享对象内存映射或堆内存细节。</p><p><strong>堆 Dump 是反映堆使用情况的内存镜像，其中主要包括系统信息、虚拟机属性、完整的线程 Dump、所有类和对象的状态等。一般在内存不足，GC 异常等情况下，我们会去怀疑内存泄漏，这个时候就会去打印堆 Dump。</strong></p><p>jmap 的用法摘要：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-96a70bab-5cee-4068-8ccb-1d35124abeea.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>1、<code>jmap pid</code></strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-38d5c9da-e433-43d2-b1bc-3f3634e05497.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>打印的信息分别为：共享对象的起始地址、映射大小、共享对象路径的全程。</p><p><strong>2、<code>jmap -heap pid</code>:查看堆使用情况</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-75acf4c8-393d-43d1-b208-04de1f0ba6bd.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>3、<code>jmap -histo pid</code>：查看堆中对象数量和大小</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-5e42fe47-e1e6-4649-acb5-e17bd277a771.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>打印的信息分别是：序列号、对象的数量、这些对象的内存占用大小、这些对象所属的类的全限定名</p><p>如果是内部类，类名的开头会加上*，如果加上 live 子参数的话，如 jmap -histo：live pid，这个命名会触发一次 FUll GC，只统计存活对象</p><p><strong>4、<code>jmap -dump:format=b,file=heapdump pid</code>：将内存使用的详细情况输出到文件</strong></p><p>然后使用 jhat 命令查看该文件：jhat -port 4000 文件名 ，在浏览器中访问 http:localhost:4000/</p><p>总结：</p><p>该命令适用的场景是程序内存不足或者 GC 频繁，这时候很可能是内存泄漏。通过用以上命令查看堆使用情况、大量对象被持续引用等情况。</p><h2 id="_4、jstat" tabindex="-1"><a class="header-anchor" href="#_4、jstat"><span><strong>4、jstat</strong></span></a></h2><p>主要是对 java 应用程序的资源和性能进行实时的命令行监控，包括了对 heap size 和垃圾回收状况的监控。</p><p><code>jstat -&lt;option&gt; [-t] [-h&lt;lines&gt;] &lt;vmid&gt; [&lt;interval&gt; [&lt;count&gt;]]</code></p><p>option：我们经常使用的选项有 gc、gcutil</p><p>vmid：java 进程 id</p><p>interval：间隔时间，单位为毫秒</p><p>count：打印次数</p><p><strong>1、jstat -gc PID 5000 20</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-3f71397d-3ff6-430d-adf4-ff5ab9f111d5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>S0C:年轻代第一个 survivor 的容量（字节）</p><p>S1C：年轻代第二个 survivor 的容量（字节）</p><p>S0U：年轻代第一个 survivor 已使用的容量（字节）</p><p>S1U：年轻代第二个 survivor 已使用的容量（字节）</p><p>EC：年轻代中 Eden 的空间（字节）</p><p>EU：年代代中 Eden 已使用的空间（字节）</p><p>OC：老年代的容量（字节）</p><p>OU:老年代中已使用的空间（字节）</p><p>PC：永久代的容量</p><p>PU：永久代已使用的容量</p><p>YGC：从应用程序启动到采样时年轻代中 GC 的次数</p><p>YGCT:从应用程序启动到采样时年轻代中 GC 所使用的时间（单位：S）</p><p>FGC：从应用程序启动到采样时老年代中 GC（FULL GC）的次数</p><p>FGCT：从应用程序启动到采样时老年代中 GC 所使用的时间（单位：S）</p><p><strong>2、jstat -gcutil PID 5000 20</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-c2a84c1d-e853-482a-88a5-27ef39da66a0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>s0:年轻代中第一个 survivor 已使用的占当前容量百分比</p><p>s1:年轻代中第二个 survivor 已使用的占当前容量百分比</p><p>E:年轻代中 Eden 已使用的占当前容量百分比</p><p>O:老年代中已使用的占当前容量百分比</p><p>P:永久代中已使用的占当前容量百分比</p><h2 id="_5、jhat" tabindex="-1"><a class="header-anchor" href="#_5、jhat"><span>5、jhat</span></a></h2><p>主要用来解析 java 堆 dump 并启动一个 web 服务器，然后就可以在浏览器中查看堆的 dump 文件了。</p><p>生成 dump 文件的方法前面已经介绍了，这边主要介绍如何解析 java 堆转储文件，并启动一个 web server</p><p><strong>jhat heapdump</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-fd76ac30-53a5-4549-8206-18283f330758.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这个命令将 heapdump 文件转换成 html 格式，并且启动一个 http 服务，默认端口为 7000。</p><p>如果端口冲突，可以使用以下命令指定端口：<strong>jhat -port 4000 heapdump</strong></p><p>下面我们来访问下：ip：port</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-059e61f1-8263-4ee0-b36b-f117ecaf0a07.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_6、jinfo" tabindex="-1"><a class="header-anchor" href="#_6、jinfo"><span>6、jinfo</span></a></h2><p>jinfo 可以用来查看正在运行的 java 运用程序的扩展参数，甚至支持在运行时动态地更改部分参数。</p><p>基本使用语法如下： <code>jinfo -&lt; option &gt; &lt; pid &gt; </code>，其中 option 可以为以下信息：</p><p><code>-flag&lt; name &gt;</code>: 打印指定 java 虚拟机的参数值</p><p><code>-flag [+|-]&lt; name &gt;</code>：设置或取消指定 java 虚拟机参数的布尔值</p><p><code>-flag &lt; name &gt;=&lt; value &gt;</code>：设置指定 java 虚拟机的参数的值</p><p>使用示例</p><p>下面的命令显示了新生代对象晋升到老年代对象的最大年龄。在运行程序运行时并没有指定这个参数，但是通过 jinfo，可以查看这个参数的当前的值。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-f37517b7-20b4-4243-ae03-d41126ae43e5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下面的命令显示是否打印 gc 详细信息：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-86c5ace2-7377-4d5a-a780-0a194e14c9a0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下面的命令在运用程序运行时动态打开打印详细 gc 信息开关：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-d258d260-65eb-48f9-8585-6bed74de5a47.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>注意事项：jinfo 虽然可以在 java 程序运行时动态地修改虚拟机参数，但并不是所有的参数都支持动态修改。</p><h2 id="_7、jcmd" tabindex="-1"><a class="header-anchor" href="#_7、jcmd"><span>7、jcmd</span></a></h2><p>在 JDK 1.7 之后，新增了一个命令行工具 jcmd。它是一个多功能工具，可以用来导出堆，查看 java 进程，导出线程信息，执行 GC 等。jcmd 拥有 jmap 的大部分功能，Oracle 官方建议使用 jcmd 代替 jmap。</p><p>使用  jcmd -l  命令列出当前运行的所有虚拟机，示例： <img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-4fa6915b-d39c-4d6d-a6e7-edc989cac76f.png" alt="" loading="lazy"></p><p>针对每一个虚拟机，可以使用 help 命令列出该虚拟机支持的所有命令，示例：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-219b7cac-c9a9-4d47-8ecf-93a4a04fc1db.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>子命令含义：</p><ul><li>VM.native_memory</li><li>VM.commercial_features</li><li>GC.rotate_log</li><li>ManagementAgent.stop</li><li>ManagementAgent.start_local</li><li>ManagementAgent.start</li><li>Thread.print，                         打印线程栈信息</li><li>GC.class_histogram，              查看系统中类统计信息</li><li>GC.heap_dump，                    导出堆信息，与 jmap -dump 功能一样</li><li>GC.run_finalization，               触发 finalize()</li><li>GC.run，                                触发 gc()</li><li>VM.uptime，                           VM 启动时间</li><li>VM.flags，                              获取 JVM 启动参数</li><li>VM.system_properties，          获取系统 Properties</li><li>VM.command_line，                 启动时命令行指定的参数</li><li>VM.version</li><li>help</li></ul><p>示例：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-b0742677-4ad0-4fd3-b985-054238af8865.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_8、可视化监控工具-jconsole、jvisualvm" tabindex="-1"><a class="header-anchor" href="#_8、可视化监控工具-jconsole、jvisualvm"><span>8、可视化监控工具（JConsole、JVisualVM）</span></a></h2><h3 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h3><p>在 JDK 安装目录的 <code>bin</code> 文件夹下，除了提供有命令行监控工具外，还提供了几种可视化的监控工具，以方便用户直观地了解虚拟机的运行状态。常用的可视化监控工具如下：</p><h3 id="jconsole" tabindex="-1"><a class="header-anchor" href="#jconsole"><span>JConsole</span></a></h3><h4 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h4><p>JConsole（Java Monitoring and Management Console）是一款基于 JMX（Java Manage-ment Extensions）的可视化监视工具。它的主要功能是通过 JMX 的 MBean（Managed Bean）对系统信息进行收集和动态调整系统参数。JMX（Java Management Extensions）是一个为应用程序、设备、系统等植入管理功能的框架，通常用于监控系统的运行状态或管理系统的部分功能。</p><h4 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h4><p>打开位于 bin 目录下的 <code>jconsole</code> 程序后，它会自动扫描当前主机上的所有 JVM 进程：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-6b614bd9-5e75-48e0-b51e-50cbd33669a5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>选中需要监控的进程后，点击连接，即可进入监控界面。监控界面包含了 <em>概览</em>、<em>内存</em>、<em>线程</em>、<em>类</em>、<em>VM 概要</em>、<em>MBean</em> 六个选项卡。其中概览界面显示的是 <em>内存</em>、<em>线程</em>、<em>类</em> 等三个选项卡界面的概览信息，如下所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-10f3df05-e209-4bca-a8dc-99668a2d8e07.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>而内存界面主要用于显示堆和非堆上各个区域的使用量：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-ddabe66e-18ac-4cb6-9e9e-f446645a4501.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>线程界面内主要显示各个线程的堆栈信息，最下角有一个 <strong>检测死锁</strong> 按钮，点击后如果检测到死锁存在，则在下部的线程选项卡旁边会出现死锁选项卡：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-a97902be-6084-4009-81b2-cbe08d60a617.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>点击死锁选项卡则可以看到造成死锁的线程：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-a76f6714-0efd-4208-a203-9264bc9963d9.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最后的 <strong>类</strong> 选项卡主要用于显示当前已加载和已卸载的类的数量。而 <strong>VM 概要</strong> 选项卡则主要用于显示虚拟机的相关参数，如下所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-519acfd8-943e-4005-b1af-9de1e4187971.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="visualvm" tabindex="-1"><a class="header-anchor" href="#visualvm"><span>VisualVM</span></a></h3><h4 id="简介-2" tabindex="-1"><a class="header-anchor" href="#简介-2"><span>简介</span></a></h4><p>VisualVM（All-in-One Java Troubleshooting Tool）是 Oracle 提供的功能最强大的运行监视和故障处理程序之一， 它除了支持常规的运行监视、故障处理等功能外，还能用于性能分析（Profiling）。同时因为 VisualVM 是基于 NetBeans 平台的开发工具，所以它还支持通过插件来进行功能的拓展。VisualVM 的主要功能如下：</p><ul><li>显示虚拟机进程及其配置信息、环境信息（与 jps、jinfo 功能类似）；</li><li>监视应用程序的处理器、垃圾收集、堆、方法区以及线程的信息（与 jstat、jstack 功能类似）；</li><li>dump 以及分析堆转储快照（与 jmap、jhat 功能类似）；</li><li>方法级的程序运行性能分析，找出被调用最多、运行时间最长的方法；</li><li>离线程序快照：可以收集程序的运行时配置、线程 dump、内存 dump 等信息来建立快照。</li></ul><h4 id="使用-1" tabindex="-1"><a class="header-anchor" href="#使用-1"><span>使用</span></a></h4><p>打开位于 bin 目录下的 <code>jvisualvm</code> 程序， 它会自动扫描当前主机上的所有 JVM 进程：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-221c1e6e-bcfd-4bf3-be85-6172a3f72962.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>点击需要监控的进程后，右侧即会显示相关的监控信息：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-0e0a833a-d13c-4b70-b7ee-c58651a58185.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>1. 堆 Dump</strong></p><p>在监控界面点击按钮可以 <strong>执行垃圾回收</strong> 或者 <strong>堆 Dump</strong> 。进行堆 Dump 后，还会显示其分析结果：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-afaf433c-6ae7-4c4b-b686-48504cd4c3e9.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>2. 线程 Dump</strong></p><p>在线程界面可以查看所有线程的状态，如果出现死锁，该界面还会进行提示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-9dbc6b53-c9e6-4051-845f-ef2d848b5d60.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>此时可以进行 <strong>线程 Dump</strong> 来获取具体的线程信息，效果和 jstack 命令类似：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-74941c88-d009-4d7f-8264-efc7d94c94ee.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>3. 性能分析</strong></p><p>在 Profiler 界面，可以进行 CPU 和 内存的性能分析。要开始性能分析，需要先选择 <strong>CPU</strong> 或 <strong>内存</strong> 按钮中的一个，VisualVM 将会开始记录应用程序执行过的所有方法：如果是进行的是 CPU 执行时间分析，将会统计每个方法的执行次数、执行耗时；如果是内存分析，则会统计每个方法关联的对象数以及这些对象所占的空间。想要结束性能分析，点击停止按钮即可：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-946d7f3e-9519-4a0b-8905-0bf2c1d83fcb.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>4. Visual GC</strong></p><p>Visual GC 面板默认是不显示的，需要通过插件进行扩展。它会实时监控虚拟机的状态，在功能上类似于 jstat 命令：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-b6f23234-8b1d-44df-8b12-e723dc0d1903.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="安装插件" tabindex="-1"><a class="header-anchor" href="#安装插件"><span>安装插件</span></a></h4><p>在主界面，点击 <strong>工具 =&gt; 插件</strong> ，可以打开插件面板。右击插件选项或者点击安装按钮即可完成对应插件的安装：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-4518bc2f-ef1f-4ed6-8da9-47a0fdc03338.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>需要注意的是，安装插件前需要按照自己 JVM 的版本来配置插件中心，否则会抛出 ”无法连接到插件中心“ 的异常。每个版本对应的插件中心可以在该网址上查看：https://visualvm.github.io/pluginscenters.html，界面如下：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-146f715c-a902-4725-9101-07d608a04770.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>之后需要将正确的插件中心的地址配置到程序中：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-55919d48-88f4-4ee5-842f-3ed20b9f7cd6.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="连接远程进程" tabindex="-1"><a class="header-anchor" href="#连接远程进程"><span>连接远程进程</span></a></h3><p>以上演示 JConsole 和 VisualVM 时，我们都是用的本地进程，但在实际开发中，我们更多需要监控的是服务器上的远程进程。想要监控远程主机上的进程，需要进行 JMX 的相关配置，根据连接时是否需要用户名和密码，可以分为以下两种配置方式：</p><h4 id="不使用安全凭证" tabindex="-1"><a class="header-anchor" href="#不使用安全凭证"><span>不使用安全凭证</span></a></h4><p>启动服务器上的 Java 进程时增加以下参数：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Dcom.sun.management.jmxremote.port=12345</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">  #jmx远程连接的端口号</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> -Dcom.sun.management.jmxremote.ssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">false</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> -Dcom.sun.management.jmxremote.authenticate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">false</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> -jar</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> springboot.jar</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时只需要知道主机地址和端口号就可以连接，不需要使用用户名和密码，所以安全性比较低。</p><h4 id="使用安全凭证" tabindex="-1"><a class="header-anchor" href="#使用安全凭证"><span>使用安全凭证</span></a></h4><p>启动服务器上的 Java 进程时增加以下参数：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Dcom.sun.management.jmxremote.port=12345</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-Dcom.sun.management.jmxremote.ssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">false</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-Dcom.sun.management.jmxremote.authenticate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">true</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-Dcom.sun.management.jmxremote.access.file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=/usr/local/jmxremote.access</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-Dcom.sun.management.jmxremote.password.file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=/usr/local/jmxremote.password</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-jar</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> springboot.jar</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>jmxremote.access </code> 的内容如下，其中 admin 为用户名，readwrite 表示可读可写，也可以设置为 readonly（只读）：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">admin</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> readwrite</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><code>jmxremote.password</code> 的内容如下，其中 admin 为用户名，123456 为密码：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">admin</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 123456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>两个文件创建好后，还需要赋予其执行权限：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 600</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/jmxremote.access</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 600</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/jmxremote.password</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root:root</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/jmxremote.access</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root:root</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/jmxremote.password</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>之后在使用 VisualVM 进行远程连接时，配置如下：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-f84f1b0a-3ff7-444f-8285-709a234ce670.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>需要注意的是这里的端口号是配置的 <code>Dcom.sun.management.jmxremote.port</code> 的值，而不是 Java 程序的端口号。连接完成后，即可查看到对应进程的监控状态。</p><h2 id="其他工具" tabindex="-1"><a class="header-anchor" href="#其他工具"><span>其他工具</span></a></h2><p>JOL（即 Java Object Layout）：OpenJDK 提供的库，用于查看 Java 对象的内存布局，这个很有用，可以借助它来跟踪锁升级等过程。只需要引入 Maven 即可使用，示例：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//引入依赖</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.openjdk.jol&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;jol-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;0.16&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class TTTT {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        System.err.println(ClassLayout.parseInstance(new Person()).toPrintable());</span></span>
<span class="line"><span>        System.err.println(ClassLayout.parseClass(Person.class).toPrintable());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Person {</span></span>
<span class="line"><span>    private int age = 1;</span></span>
<span class="line"><span>    private String name = &quot;zhangsan&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//代码执行结果</span></span>
<span class="line"><span>com.marchon.learning.Person object internals:</span></span>
<span class="line"><span>OFF  SZ               TYPE DESCRIPTION               VALUE</span></span>
<span class="line"><span>  0   8                    (object header: mark)     0x0000005e4c804101 (hash: 0x5e4c8041; age: 0)</span></span>
<span class="line"><span>  8   4                    (object header: class)    0xf8010dd9</span></span>
<span class="line"><span> 12   4                int Person.age                1</span></span>
<span class="line"><span> 16   4   java.lang.String Person.name               (object)</span></span>
<span class="line"><span> 20   4                    (object alignment gap)</span></span>
<span class="line"><span>Instance size: 24 bytes</span></span>
<span class="line"><span>Space losses: 0 bytes internal + 4 bytes external = 4 bytes total</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>openJDK 源码：查看 JDK native 方法的实现</p><p>strace：跟踪程序运行过程发起的系统调用</p><p>https://fastthread.io：线程栈分析的网站</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-6d57b323-9665-4453-9fee-ea3111ad8629.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="上问题排查思路-八股" tabindex="-1"><a class="header-anchor" href="#上问题排查思路-八股"><span>上问题排查思路（八股）</span></a></h2><p>硬盘使用情况：du 命令</p><p>内存使用且情况：free 命令</p><p>CPU 使用情况：top 命令</p><p>网络使用情况：netstat 命令</p><p>Java 程序问题分析：jmap 分析堆内存、jstack 分析线程栈等，见前文。</p><ul><li>参考链接 1：<a href="https://www.cnblogs.com/z-sm/p/6745375.html" target="_blank" rel="noopener noreferrer">https://www.cnblogs.com/z-sm/p/6745375.html</a></li><li>参考链接：<a href="https://github.com/heibaiying/Full-Stack-Notes/blob/master/notes/JVM_%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E4%B9%8B%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B7%A5%E5%85%B7.md" target="_blank" rel="noopener noreferrer">https://github.com/heibaiying/Full-Stack-Notes/blob/master/notes/JVM_性能监控之可视化工具.md</a></li></ul><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括 Java 基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM 等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,206)]))}const c=a(n,[["render",r],["__file","problem-tools.html.vue"]]),d=JSON.parse('{"path":"/jvm/problem-tools.html","title":"Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）","lang":"zh-CN","frontmatter":{"title":"Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）","shortTitle":"Java问题诊断和排查工具","category":["Java核心"],"tag":["Java虚拟机"],"description":"二哥的Java进阶之路，小白的零基础Java教程，从入门到进阶，Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）","head":[["meta",{"name":"keywords","content":"Java,JavaSE,教程,二哥的Java进阶之路,jvm,Java虚拟机"}],["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/jvm/problem-tools.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）"}],["meta",{"property":"og:description","content":"二哥的Java进阶之路，小白的零基础Java教程，从入门到进阶，Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-547b1b2c-9fb4-4d1d-9c72-013ec210f6a5.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java虚拟机"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java问题诊断和排查工具（查看JVM参数、内存使用情况及分析）\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-547b1b2c-9fb4-4d1d-9c72-013ec210f6a5.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-01.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-2017daf6-832a-4673-b776-ad3380e47402.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-031be661-e47e-44f0-9e33-34368b187662.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-0ccc96dc-8053-4222-9824-b116f02776a4.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-059a3285-4a01-4f7a-a6ed-1cc5dcbf3f18.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-e80d0925-2dcf-4204-b46d-47312df2a673.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-96a70bab-5cee-4068-8ccb-1d35124abeea.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-38d5c9da-e433-43d2-b1bc-3f3634e05497.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-75acf4c8-393d-43d1-b208-04de1f0ba6bd.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-5e42fe47-e1e6-4649-acb5-e17bd277a771.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-3f71397d-3ff6-430d-adf4-ff5ab9f111d5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-c2a84c1d-e853-482a-88a5-27ef39da66a0.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-fd76ac30-53a5-4549-8206-18283f330758.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-059e61f1-8263-4ee0-b36b-f117ecaf0a07.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-f37517b7-20b4-4243-ae03-d41126ae43e5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-86c5ace2-7377-4d5a-a780-0a194e14c9a0.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-d258d260-65eb-48f9-8585-6bed74de5a47.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-4fa6915b-d39c-4d6d-a6e7-edc989cac76f.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-219b7cac-c9a9-4d47-8ecf-93a4a04fc1db.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-b0742677-4ad0-4fd3-b985-054238af8865.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-6b614bd9-5e75-48e0-b51e-50cbd33669a5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-10f3df05-e209-4bca-a8dc-99668a2d8e07.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-ddabe66e-18ac-4cb6-9e9e-f446645a4501.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-a97902be-6084-4009-81b2-cbe08d60a617.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-a76f6714-0efd-4208-a203-9264bc9963d9.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-519acfd8-943e-4005-b1af-9de1e4187971.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-221c1e6e-bcfd-4bf3-be85-6172a3f72962.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-0e0a833a-d13c-4b70-b7ee-c58651a58185.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-afaf433c-6ae7-4c4b-b686-48504cd4c3e9.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-9dbc6b53-c9e6-4051-845f-ef2d848b5d60.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-74941c88-d009-4d7f-8264-efc7d94c94ee.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-946d7f3e-9519-4a0b-8905-0bf2c1d83fcb.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-b6f23234-8b1d-44df-8b12-e723dc0d1903.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-4518bc2f-ef1f-4ed6-8da9-47a0fdc03338.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-146f715c-a902-4725-9101-07d608a04770.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-55919d48-88f4-4ee5-842f-3ed20b9f7cd6.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-f84f1b0a-3ff7-444f-8285-709a234ce670.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-6d57b323-9665-4453-9fee-ea3111ad8629.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"JDK 自带的工具","slug":"jdk-自带的工具","link":"#jdk-自带的工具","children":[{"level":3,"title":"常用命令：","slug":"常用命令","link":"#常用命令","children":[]},{"level":3,"title":"JAVA Dump：","slug":"java-dump","link":"#java-dump","children":[]}]},{"level":2,"title":"1、jps","slug":"_1、jps","link":"#_1、jps","children":[]},{"level":2,"title":"2、jstack","slug":"_2、jstack","link":"#_2、jstack","children":[]},{"level":2,"title":"4、jstat","slug":"_4、jstat","link":"#_4、jstat","children":[]},{"level":2,"title":"5、jhat","slug":"_5、jhat","link":"#_5、jhat","children":[]},{"level":2,"title":"6、jinfo","slug":"_6、jinfo","link":"#_6、jinfo","children":[]},{"level":2,"title":"7、jcmd","slug":"_7、jcmd","link":"#_7、jcmd","children":[]},{"level":2,"title":"8、可视化监控工具（JConsole、JVisualVM）","slug":"_8、可视化监控工具-jconsole、jvisualvm","link":"#_8、可视化监控工具-jconsole、jvisualvm","children":[{"level":3,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":3,"title":"JConsole","slug":"jconsole","link":"#jconsole","children":[]},{"level":3,"title":"VisualVM","slug":"visualvm","link":"#visualvm","children":[]},{"level":3,"title":"连接远程进程","slug":"连接远程进程","link":"#连接远程进程","children":[]}]},{"level":2,"title":"其他工具","slug":"其他工具","link":"#其他工具","children":[]},{"level":2,"title":"上问题排查思路（八股）","slug":"上问题排查思路-八股","link":"#上问题排查思路-八股","children":[]}],"git":{"createdTime":1648354033000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":15.94,"words":4781},"filePathRelative":"jvm/problem-tools.md","localizedDate":"2022年3月27日","excerpt":"\\n<h2>JDK 自带的工具</h2>\\n<p>在 JDK 的 bin 目录下有很多命令行工具：</p>\\n<figure><img src=\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/problem-tools-547b1b2c-9fb4-4d1d-9c72-013ec210f6a5.jpg\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>\\n<p>我们可以看到各个工具的大小基本上都稳定在 27kb 左右，这个不是 JDK 开发团队刻意为之的，而是因为这些工具大多数是 <code>jdk\\\\lib\\\\tools.jar</code> 类库的一层薄包装而已，他们的主要功能代码是在 tools 类库中实现的。</p>"}');export{c as comp,d as data};
