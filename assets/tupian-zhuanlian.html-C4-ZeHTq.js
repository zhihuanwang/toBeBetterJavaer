import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,e,o as n}from"./app-BeHkqkE2.js";const t={};function l(p,i){return n(),a("div",null,i[0]||(i[0]=[e(`<p>作为一名技术博主，经常需要把同一份 MD 文件同步到不同的博客平台，以求获得更多的曝光，从而帮助到更多的小伙伴——瞧我这“达则兼济天下”的雄心壮志。像 CSDN 和掘金这两个博客平台都有自己的外链图片解析功能。</p><p>当我把 MD 源文档复制到 CSDN 或者掘金的编辑器中，它们会自动地帮我把外链转成内链，这样我就不用再重新上传图片，也不需要配置自己的图床了，否则图片会因为防盗链的原因显示不出来。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>举个例子，现在有这样一段 MD 文档，里面有一张图片。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-1.png)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把上面的 MD 文档复制到掘金编辑器的时候，就会出现「图片解析中...」！但会一直卡在这里，再也解析不下去了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-2.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这是因为图片加了防盗链，掘金这么牛逼的社区在解析的时候也会失败。CSDN 的转链功能更牛逼一点，基本上可以无视防盗链。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-3.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>还有一些博客平台是没有转链功能的，比如说二哥的静态小破站《二哥的Java进阶之路》。怎么办呢？我一开始的解决方案是：</p><ul><li>先将图片手动一张张下载到本地</li><li>再将本地图片上传到 GitHub 指定的仓库</li><li>修改 MD 文档中的图片链接，使用 CDN 加速服务</li></ul><p>这样就能解决问题，但是需要手动去做这些重复的动作，尤其遇到一篇文章有二三十张图片的时候就很烦。这有点丧失我作为程序员的尊严啊！</p><p>首先要解决的是图片下载的问题，可以利用爬虫技术：爬虫爬得早，局子进的早。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-4.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="二、关于-java-爬虫" tabindex="-1"><a class="header-anchor" href="#二、关于-java-爬虫"><span>二、关于 Java 爬虫</span></a></h3><p>Java 爬虫的类库非常多，比如说 crawler4j，我个人更喜欢 jsoup，它更轻量级。jsoup 是一款用于解析 HTML 的 Java 类库，提供了一套非常便捷的 API，用于提取和操作数据。</p><blockquote><p>官网地址：https://jsoup.org/</p></blockquote><p>jsoup 目前在 GitHub 上已经收获 9.3k+ 的 star，可以说是非常的受欢迎了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>jsoup 有以下特性：</p><ul><li>可以从 URL、文件或者字符串中抓取和解析</li><li>可以使用 DOM 遍历或者 CSS 选择器查找和提取数据</li><li>可以操作 HTML 元素、属性和文本</li><li>可以输出整洁的 HTML</li></ul><h3 id="三、实战-jsoup" tabindex="-1"><a class="header-anchor" href="#三、实战-jsoup"><span>三、实战 jsoup</span></a></h3><p><strong>第一步，添加 jsoup 依赖到项目中</strong>。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;!-- jsoup HTML parser library @ https://jsoup.org/ --&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.jsoup&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;jsoup&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.14.3&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>第二步， 获取网页文档</strong>。</p><p>就拿二哥之前发表的一篇文章《<a href="https://mp.weixin.qq.com/s/NtOD5q95xPEs4aQpu4lGcg" target="_blank" rel="noopener noreferrer">二哥的小破站终于上线了，颜值贼高</a>》来举例吧。通过以下代码就可以拿到网页文档了。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Document</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> doc </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> Jsoup</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">connect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;https://blog.csdn.net/qing_gee/article/details/122407829&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> title </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> doc</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Jsoup 类是 jsoup 的入口类，通过 connect 方法可以从指定链接中加载 HTML 文档（用 Document 对象来表示）。</p><p><strong>第三步，获取图片节点</strong>。</p><p>再通过以下代码可以获取文章所有的图片节点：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Elements</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> images </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> doc</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;.article_content img[src~=(?i)</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\\</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">.(png|jpe?g|gif)]&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">for</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Element</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> image </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> images) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;src : &quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> image</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">attr</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;src&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结构如下所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-6.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="四、下载图片" tabindex="-1"><a class="header-anchor" href="#四、下载图片"><span>四、下载图片</span></a></h3><p>拿到图片的 URL 地址后，事情就好办了，可以直接通过 JDK 的原生 API 下载图片到指定文件夹。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> downloadPath </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;/tobebetterjavaer-beian-&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">for</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Element</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> image </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> images) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    URL</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> url </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> URL</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">image</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">attr</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;src&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    InputStream</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> inputStream </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> url</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">openStream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    OutputStream</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> outputStream </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> FileOutputStream</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(downloadPath </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;.png&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#C678DD;">    byte</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">[] buffer </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD;"> byte</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">2048</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> length </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    while</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> ((length </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> inputStream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">read</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(buffer)</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">!=</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> -</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        outputStream</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">write</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(buffer, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, length);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想加快节奏的话，可以把上面的代码封装一下，然后开个多线程，简单点的话，可以每张图片起一个线程，速度杠杠的。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Thread</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> MyRunnable</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(originImgUrl</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> destinationImgPath))</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">start</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="五、使用-cdn-加速图片" tabindex="-1"><a class="header-anchor" href="#五、使用-cdn-加速图片"><span>五、使用 CDN 加速图片</span></a></h3><p>图片下载到本地后，接下来的工作就更简单了，读取原 MD 文档，修改图片链接，使用 CDN 进行加速。我的图床采用的是 GitHub+jsDelivr CDN 的方式，不过由于 jsDelivr 的国内节点逐渐撤离了，图片在某些网络环境下访问的时候还是有点慢，后面打算用 OSS+CDN 的方式，更靠谱一点。</p><p>读取文件可以借助一下 hutool 这款 GitHub 上开源的工具类库，省去很多繁琐的 IO 操作。</p><blockquote><p>官网：https://hutool.cn/</p></blockquote><p>第一步，将 hutool 添加到 pom.xml 文件中</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;cn.hutool&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;hutool-all&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;5.7.20&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步，按照行读取 MD 文件，需要用到 hutool 的 FileReader 类：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FileReader</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> fileReader </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> FileReader</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">create</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> File</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(docPath </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">fileName),</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">                Charset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">forName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;utf-8&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">List</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> list </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> fileReader</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">readLines</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步，通过正则表达式来匹配是否有需要替换的图片标签，MD 中的图片标记关键字为 <code>![]()</code>。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-7.png)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果匹配到，就替换为 jsDelivr CDN 链接的地址，写文件时需要用到 hutool 的FileWriter 类。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>FileWriter writer = new FileWriter(docPath + fileName);</span></span>
<span class="line"><span>for (String line : list) {</span></span>
<span class="line"><span>    Matcher m = pattern.matcher(line);</span></span>
<span class="line"><span>    if (m.matches()) {</span></span>
<span class="line"><span>        writer.append(&quot;![](&quot; + imgCdnPre +  num + imgSuffix +&quot;)\\n&quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        writer.append(line+&quot;\\n&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>writer.flush();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到此为止，整个代码的编写工作就告一段落了。很简单，两个类库，几行代码就搞定了！</p><p>转换前的 MD 文件如下所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-8.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>运行代码转换后，发现图片地址已经变成 jsDelivr CDN 图库了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-9.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>使用 GitHub 桌面版把图片和 MD 文档提交到 GitHub 仓库后，就可以看到图片已经加载完成可以访问了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-10.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="六、一点小心得" tabindex="-1"><a class="header-anchor" href="#六、一点小心得"><span>六、一点小心得</span></a></h3><p>不得不说，懂点技术，还是非常爽的。撸了几行代码，解放了双手，可以干点正经事了（狗头）。</p><p>这不，重新把《二哥的Java进阶之路》的小破站整理排版了一下，新增了不少优质的内容。学习 Java 的小伙伴可以开卷了，有需要增加的内容也欢迎提交 issue 啊！</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-11.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>再次感谢各位小伙伴的厚爱，我也会一如既往地完善这个专栏，我们下期见~</p><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/xingbiaogongzhonghao.png">`,61)]))}const k=s(t,[["render",l],["__file","tupian-zhuanlian.html.vue"]]),d=JSON.parse('{"path":"/szjy/tupian-zhuanlian.html","title":"","lang":"zh-CN","frontmatter":{"description":"作为一名技术博主，经常需要把同一份 MD 文件同步到不同的博客平台，以求获得更多的曝光，从而帮助到更多的小伙伴——瞧我这“达则兼济天下”的雄心壮志。像 CSDN 和掘金这两个博客平台都有自己的外链图片解析功能。 当我把 MD 源文档复制到 CSDN 或者掘金的编辑器中，它们会自动地帮我把外链转成内链，这样我就不用再重新上传图片，也不需要配置自己的图床了...","head":[["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/szjy/tupian-zhuanlian.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:description","content":"作为一名技术博主，经常需要把同一份 MD 文件同步到不同的博客平台，以求获得更多的曝光，从而帮助到更多的小伙伴——瞧我这“达则兼济天下”的雄心壮志。像 CSDN 和掘金这两个博客平台都有自己的外链图片解析功能。 当我把 MD 源文档复制到 CSDN 或者掘金的编辑器中，它们会自动地帮我把外链转成内链，这样我就不用再重新上传图片，也不需要配置自己的图床了..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-1.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-1.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-2.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-3.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-4.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-6.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-7.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-8.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-9.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-10.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-11.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":3,"title":"二、关于 Java 爬虫","slug":"二、关于-java-爬虫","link":"#二、关于-java-爬虫","children":[]},{"level":3,"title":"三、实战 jsoup","slug":"三、实战-jsoup","link":"#三、实战-jsoup","children":[]},{"level":3,"title":"四、下载图片","slug":"四、下载图片","link":"#四、下载图片","children":[]},{"level":3,"title":"五、使用 CDN 加速图片","slug":"五、使用-cdn-加速图片","link":"#五、使用-cdn-加速图片","children":[]},{"level":3,"title":"六、一点小心得","slug":"六、一点小心得","link":"#六、一点小心得","children":[]}],"git":{"createdTime":1646613281000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":5.13,"words":1540},"filePathRelative":"szjy/tupian-zhuanlian.md","localizedDate":"2022年3月7日","excerpt":"<p>作为一名技术博主，经常需要把同一份 MD 文件同步到不同的博客平台，以求获得更多的曝光，从而帮助到更多的小伙伴——瞧我这“达则兼济天下”的雄心壮志。像 CSDN 和掘金这两个博客平台都有自己的外链图片解析功能。</p>\\n<p>当我把 MD 源文档复制到 CSDN 或者掘金的编辑器中，它们会自动地帮我把外链转成内链，这样我就不用再重新上传图片，也不需要配置自己的图床了，否则图片会因为防盗链的原因显示不出来。</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" data-title=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span>举个例子，现在有这样一段 MD 文档，里面有一张图片。</span></span>\\n<span class=\\"line\\"><span></span></span>\\n<span class=\\"line\\"><span>![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/szjy/tupian-zhuanlian-1.png)</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{k as comp,d as data};
