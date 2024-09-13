import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,e as a,o as n}from"./app-BeHkqkE2.js";const r={};function o(p,e){return n(),i("div",null,e[0]||(e[0]=[a(`<h2 id="关于-spring-initializr" tabindex="-1"><a class="header-anchor" href="#关于-spring-initializr"><span>关于 Spring Initializr</span></a></h2><p>Spring 官方提供了 Spring Initializr 的方式来创建 Spring Boot 项目。网址如下：</p><blockquote><p><a href="https://start.spring.io/" target="_blank" rel="noopener noreferrer">https://start.spring.io/</a></p></blockquote><p>打开后的界面如下：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以将 Spring Initializr 看作是 Spring Boot 项目的初始化向导，它可以帮助开发人员在一分钟之内创建一个 Spring Boot 骨架，非常的傻瓜式。</p><p>来解释一下 Spring Initializr 初始化界面中的关键选项。</p><p>1）Project：项目的构建方式，可以选择 <a href="https://javabetter.cn/maven/maven.html" target="_blank" rel="noopener noreferrer">Maven</a>（安装方式可以戳链接） 和 Gradle（构建脚本基于 Groovy 或者 Kotlin 等语言来编写，而不是传统的 XML）。编程喵默认采用的 Maven。</p><p>2）Language：项目的开发语言，可以选择 Java、Kotlin（JetBrains开发的可以在 JVM 上运行的编程语言）、Groovy（可以作为 Java 平台的脚本语言来使用）。默认 Java 即可。</p><p>3）Spring Boot：项目使用的 Spring Boot 版本。默认版本即可，比较稳定。</p><p>4）Project Metada：项目的基础设置，包括包名、打包方式、JDK 版本等。</p><ul><li>Group：项目所属组织的标识符，比如说 top.codingmore；</li><li>Artifact：项目的标识符，比如说 coding-more；</li><li>Name：默认保持和 Artifact 一致即可；</li><li>Description： 项目的描述信息，比如说《编程喵实战项目（Spring Boot+Vue 前后端分离项目）》；</li><li>Package name：项目包名，根据Group和Artifact自动生成即可。</li><li>Packaging： 项目打包方式，可以选择 Jar 和 War（SSM 时代，JavaWeb 项目通常会打成 War 包，放在 Tomcat 下），Spring Boot 时代默认 Jar 包即可，因为 Spring Boot 可以内置 Tomcat、Jetty、Undertow 等服务容器了。</li><li>Java：项目选用的 JDK 版本，选择 11 或者 8 就行（编程喵采用的是最最最最稳定的 Java8）。</li></ul><p>5）Dependencies：项目所需要的依赖和 starter。如果不选择的话，默认只有核心模块 spring-boot-starter 和测试模块 spring-boot-starter-test。</p><p>好，接下来我们使用 Spring Initializr 初始化一个 Web 项目，Project 选择 Maven，Spring Boot 选择 2.6.1，Java 选择 JDK 8，Dependencies 选择「Build web, including RESTful, applications using Spring MVC. Uses Apache Tomcat as the default embedded container.」</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这预示着我们会采用 SpringMVC 并且使用 Tomcat 作为默认服务器来开发一个 Web 项目。</p><p>然后点击底部的「generate」按钮，就会生成一个 Spring Boot 初始化项目的压缩包。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-03.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果使用的是 Intellij IDEA 旗舰版，可以直接通过 Intellij IDEA 新建 Spring Boot 项目。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-2d03d0a4-0e87-4cd3-974d-f35bc440bdf0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="spring-boot-项目结构分析" tabindex="-1"><a class="header-anchor" href="#spring-boot-项目结构分析"><span>Spring Boot 项目结构分析</span></a></h2><p>解开压缩包，并导入到 Intellij IDEA 中，可以看到 Spring Boot 项目的目录结构。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-04.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以使用 <code>tree -CfL 3</code> 命令以树状图列出目录的内容：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-05.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>src/main/java 为项目的开发目录，业务代码在这里写。</li><li>src/main/resources 为配置文件目录，静态文件、模板文件和配置文件都放在这里。 <ul><li>子目录 static 用于存放静态资源文件，比如说 JS、CSS 图片等。</li><li>子目录 templates 用于存放模板文件，比如说 thymeleaf 和 freemarker 文件。</li></ul></li><li>src/test/java 为测试类文件目录。</li><li>pom.xml 用来管理项目的依赖和构建。</li></ul><h2 id="如何启动-部署-spring-boot-项目" tabindex="-1"><a class="header-anchor" href="#如何启动-部署-spring-boot-项目"><span>如何启动/部署 Spring Boot 项目</span></a></h2><p>第一次启动，我个人习惯在 main 类中右键，在弹出的右键菜单这种选择「run ... main()」启动。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-06.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>经过 2.5s 左右的 build 后，项目启动成功了，可以在日志中看到 Web 项目是以 Tomcat 为容器的，默认端口号为 8080，根路径为空。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-07.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这要比传统的 Web 项目省事省心省力，不需要打成 war 包，不需要把 war 包放到 Tomcat 的 webapp 目录下再启动。</p><p>那如果想把项目打成 jar 包放到服务器上，以 <code>java -jar xxx.jar</code> 形式运行的话，该怎么做呢？</p><p>打开 Terminal 终端， 执行命令 <code>mvn clean package</code>，等待打包结果。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-08.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们的项目在初始化的时候选择的是 Maven 构建方式，所以 pom.xml 文件中会引入 spring-boot-maven-plugin 插件。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>  &lt;plugins&gt;</span></span>
<span class="line"><span>    &lt;plugin&gt;</span></span>
<span class="line"><span>      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>      &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;/plugin&gt;</span></span>
<span class="line"><span>  &lt;/plugins&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此我们就可以利用 Maven 命令来完成项目打包，打包完成后，进入 target 目录下，就可以看到打包好的 jar 包了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-09.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>利用终端工具 <a href="https://mp.weixin.qq.com/s/HeUAPe4LqqjfzIeWDe8KIg" target="_blank" rel="noopener noreferrer">Tabby</a>，将 jar 包上传到服务器。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-10.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>执行 <code>java -jar tobebetterjavaer-0.0.1-SNAPSHOT.jar</code> 命令。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-11.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>what？？？？？？竟然没有安装 JDK。好吧，为了带白票阿里云服务器的小伙伴一起学习 Linux，我下了血本自己买了一台零添加的服务器。</p><p>PS：需要在 centos 环境下安装 JDK 的小伙伴可以看这篇。</p><blockquote><p><a href="https://segmentfault.com/a/1190000015389941" target="_blank" rel="noopener noreferrer">https://segmentfault.com/a/1190000015389941</a></p></blockquote><p>安装好 JDK 后，再次执行命令就可以看到 Spring Boot 项目可以正常在服务器上跑起来了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-12.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="第一个web项目" tabindex="-1"><a class="header-anchor" href="#第一个web项目"><span>第一个Web项目</span></a></h2><p>项目既然启动成功了，我们在浏览器里访问 8080 端口测试下吧。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-13.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>咦，竟然 Whitelabel 了，这个 404 页面是 Spring Boot 默认的错误页面，表示我们的请求在 Web 服务中不存在。</p><p>那该怎么办呢？</p><p>我们来增加一个 Controller 文件，用来处理 Web 请求，内容如下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Controller</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    @GetMapping(&quot;/hello&quot;)</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public String hello() {</span></span>
<span class="line"><span>        return &quot;hello, springboot&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码的业务逻辑非常简单，用户发送 hello 请求，服务器端响应一个“hello, springboot”回去。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-14.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>OK，现在可以访问到了。也就表明我们的第一个 Spring Boot 项目开发完成了。</p><h2 id="热部署" tabindex="-1"><a class="header-anchor" href="#热部署"><span>热部署</span></a></h2><p>作为开发者，我们希望每次修改代码后，代码能够自动编译，服务能够自动重新加载，这样就省去了重新运行代码的烦恼。</p><p>那 spring-boot-devtools 就是这样的一个神器，当我们把它添加到项目当中后，无论是代码修改，还是配置文件修改，服务都能够秒级重载（俗称热部署），这在我们开发的时候，非常有用。</p><p>怎么才能开启热部署呢？</p><p>第一步，在 pom.xml 文件中添加依赖。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步，没有第二步了，哈哈。</p><p>直接修改代码来体验一下吧。我们修改 HelloController 内容为：</p><hr><p>更多内容，只针对《二哥的Java进阶之路》星球用户开放，需要的小伙伴可以<a href="https://javabetter.cn/zhishixingqiu/" target="_blank" rel="noopener noreferrer">戳链接🔗</a>加入我们的星球，一起学习，一起卷。。<strong>编程喵</strong>🐱是一个 Spring Boot+Vue 的前后端分离项目，融合了市面上绝大多数流行的技术要点。通过学习实战项目，你可以将所学的知识通过实践进行检验、你可以拓宽自己的技术边界，你可以掌握一个真正的实战项目是如何从 0 到 1 的。</p><hr><h3 id="源码路径" tabindex="-1"><a class="header-anchor" href="#源码路径"><span>源码路径</span></a></h3><blockquote><ul><li>编程喵：<a href="https://github.com/itwanger/coding-more" target="_blank" rel="noopener noreferrer">https://github.com/itwanger/coding-more</a></li><li>helloworld：<a href="https://github.com/itwanger/codingmore-learning/tree/main/codingmore-helloword" target="_blank" rel="noopener noreferrer">https://github.com/itwanger/codingmore-learning</a></li></ul></blockquote><hr><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,73)]))}const g=t(r,[["render",o],["__file","initializr.html.vue"]]),c=JSON.parse('{"path":"/springboot/initializr.html","title":"搭建第一个Spring Boot项目","lang":"zh-CN","frontmatter":{"category":["Java企业级开发"],"tag":["Spring Boot"],"title":"搭建第一个Spring Boot项目","description":"关于 Spring Initializr Spring 官方提供了 Spring Initializr 的方式来创建 Spring Boot 项目。网址如下： https://start.spring.io/ 打开后的界面如下： 可以将 Spring Initializr 看作是 Spring Boot 项目的初始化向导，它可以帮助开发人员在一分钟之内...","head":[["meta",{"property":"og:url","content":"https://javabetter.cn/toBeBetterJavaer/springboot/initializr.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"搭建第一个Spring Boot项目"}],["meta",{"property":"og:description","content":"关于 Spring Initializr Spring 官方提供了 Spring Initializr 的方式来创建 Spring Boot 项目。网址如下： https://start.spring.io/ 打开后的界面如下： 可以将 Spring Initializr 看作是 Spring Boot 项目的初始化向导，它可以帮助开发人员在一分钟之内..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-01.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-13T06:18:01.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Spring Boot"}],["meta",{"property":"article:modified_time","content":"2024-09-13T06:18:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"搭建第一个Spring Boot项目\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-01.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-02.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-03.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-2d03d0a4-0e87-4cd3-974d-f35bc440bdf0.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-04.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-05.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-06.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-07.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-08.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-09.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-10.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-11.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-12.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-13.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-14.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":\\"2024-09-13T06:18:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"关于 Spring Initializr","slug":"关于-spring-initializr","link":"#关于-spring-initializr","children":[]},{"level":2,"title":"Spring Boot 项目结构分析","slug":"spring-boot-项目结构分析","link":"#spring-boot-项目结构分析","children":[]},{"level":2,"title":"如何启动/部署 Spring Boot 项目","slug":"如何启动-部署-spring-boot-项目","link":"#如何启动-部署-spring-boot-项目","children":[]},{"level":2,"title":"第一个Web项目","slug":"第一个web项目","link":"#第一个web项目","children":[]},{"level":2,"title":"热部署","slug":"热部署","link":"#热部署","children":[{"level":3,"title":"源码路径","slug":"源码路径","link":"#源码路径","children":[]}]}],"git":{"createdTime":1640249617000,"updatedTime":1726208281000,"contributors":[{"name":"root","email":"root@instance-tw.asia-east1-b.c.valid-arc-377619.internal","commits":1}]},"readingTime":{"minutes":5.83,"words":1748},"filePathRelative":"springboot/initializr.md","localizedDate":"2021年12月23日","excerpt":"<h2>关于 Spring Initializr</h2>\\n<p>Spring 官方提供了 Spring Initializr 的方式来创建 Spring Boot 项目。网址如下：</p>\\n<blockquote>\\n<p><a href=\\"https://start.spring.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://start.spring.io/</a></p>\\n</blockquote>\\n<p>打开后的界面如下：</p>\\n<figure><img src=\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/initializr-01.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>","autoDesc":true}');export{g as comp,c as data};
