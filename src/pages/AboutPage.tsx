/**
 * 「关于」页：整理自博客 about 文稿，展示站长简介与联系方式。
 * 输入：无（静态内容）。输出：关于页 JSX。
 */
export function AboutPage() {
  return (
    <div className="page page--about stack">
      <header className="page-header about-intro">
        <h1 className="h1">关于</h1>
        <p className="lead">
          <li>欢迎来到{' '}
          <a href="https://www.ben-air.cn/web_tools/" target="_blank" rel="noopener noreferrer">
            WebTools 
          </a>
          资源导航与在线工具，这里是我收集整理的一些生物信息方向的工具、数据库、社群信息。
          </li>
          <li>  也欢迎访问我的博客{' '}
          <a href="https://www.ben-air.cn/" target="_blank" rel="noopener noreferrer">
            Ben-air 的博客
          </a>
          ，里面有我的一些学习笔记、生活感悟、技术分享等。
          </li>
          <li>同样的欢迎关注我的个人公众号，不定期分享各类泛生信的相关知识。</li>
          <figure className="about-qr">
          <img
            src={`${import.meta.env.BASE_URL}qrcode_for_wechat.jpg`}
            alt="微信公众号「生信知识库」二维码"
            width={180}
            height={180}
          />
          <figcaption className="muted small">扫码关注公众号「生信知识库」</figcaption>
        </figure>
        </p>
      </header>

      <section className="about-section stack">
        <h2 className="h2">个人简介</h2>
        <ul className="about-list">
          <li>超 10 年生物信息行业从业经验。</li>
          <li>
            近 10 年临床检测（肿瘤临检、遗传病检测）研发经验，完成多款产品落地，含千万级与亿级年收入产品。
          </li>
          <li>具备多场景商业化云平台与内部数据处理平台的设计与开发经验。</li>
          <li>
            拥抱 LLM；个人规则、Skills、MCP 见{' '}
            <a
              href="https://github.com/AI-skill-mcp"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI-skill-mcp
            </a>
            。
          </li>
          <li>目前从事蛋白酶改造、抗体优化、siRNA 抑制剂设计等工作。</li>
        </ul>
      </section>

      <section className="about-section stack">
        <h2 className="h2">交流联系</h2>
        <ul className="about-list about-contact">
          <li>
            邮箱：{' '}
            <a href="mailto:ben_air@foxmail.com">ben_air@foxmail.com</a>
          </li>
          <li>
            GitHub：{' '}
            <a
              href="https://github.com/Ben-unbelieveable"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/Ben-unbelieveable
            </a>
          </li>
        </ul>
        
      </section>
    </div>
  )
}
