# 智营 AI · 官网静态站点

面向中小企业的 **AI 营销代运营 + GEO 优化** 服务官网。纯静态、零构建、零外部依赖，已部署在 GitHub Pages。

**公网地址**：<https://fengchao8181-ctrl.github.io/ai-marketing-agency/>

---

## ⚠️ 一、待用户确认项（上线后请尽快替换）

以下字段目前填的是**中性默认值**，页面上显示为「待补充」。全局搜索 **`待补充`** 即可定位所有待填位置（覆盖可见文本、表单 `action`、`data-mailto`，以及 JSON-LD 内部）。

| 字段名 | 当前默认值 | 出现位置 | 应改成什么 |
|---|---|---|---|
| 微信 | `待补充` | 5 个页面 footer + `contact.html` 联系区 | 真实微信号 |
| 邮箱 | `待补充` | 5 个页面 footer + `contact.html` 联系区 + 表单 `data-mailto` / `action` | 真实接收邮箱；定下后还需按下面「为什么邮箱字段被删掉了」补回 JSON-LD 的 email 字段 |
| 品牌名 | `智营 AI` | 全部页面（title / header / footer / JSON-LD） | 正式注册的品牌名或个体工商户主体名 |
| 版权主体 | `© 2026 智营 AI` | 6 个页面 footer | 正式主体名 + 年份 |
| 服务区域 | `中国（远程交付为主，可协商线下）` | `contact.html` 联系区 | 你的实际服务区域（如「武汉本地 + 远程」） |
| 域名 | `https://fengchao8181-ctrl.github.io/ai-marketing-agency` | `sitemap.xml`、`robots.txt` 的 Sitemap 行、6 页 `<link rel="canonical">`、JSON-LD 的 `url` | 换成自定义域名后**必须**全局替换（页面链接本身是相对路径，换域名不用改） |
| JSON-LD email | 已删除（无此字段） | `contact.html` 的 `ContactPage` JSON-LD | 定下真实邮箱后，在 `mainEntity.Organization` 与 `mainEntity.contactPoint` 各补一行 `"email": "你的邮箱",`（注意逗号） |

### 为什么邮箱字段被删掉了

本站在 `robots.txt` 中主动放行了 GPTBot / PerplexityBot / ClaudeBot / Google-Extended 等 AI 抓取方，而 JSON-LD 是爬虫**优先读取**的机器可读内容。在真实邮箱确定前，若把占位邮箱写进 `ContactPoint.email`，AI 引擎可能在回答里直接输出这个假地址。因此采取「先删字段、后补回」的做法——schema.org 的 `ContactPage` / `ContactPoint` 不强制 `email`，删除不影响结构化数据合法性。

### 留资表单的当前行为

表单为纯前端实现，提交时用 `mailto:` 生成邮件草稿交给本机邮件客户端，**不向任何服务器发送数据**。
当前 `data-mailto` 仍是「待补充」，脚本会**主动拦截并提示**「联系方式尚未配置」，不会静默丢单。填入真实邮箱后恢复正常工作：提交 → 提示「已收到」并禁用按钮 → 打开邮件客户端。

---

## 二、目录结构

```
ai-marketing-agency/
├── index.html        首页：定位 / 价值主张 / 8 工位工作台 / 对比表 / 服务入口
├── pricing.html      服务与报价：3 档套餐 + GEO 增值（Service + Offer JSON-LD）
├── method.html       交付方法论：内容生产 SOP / GEO 做法 / 分发策略 / 数据周报（Article + BreadcrumbList JSON-LD）
├── faq.html          常见问题：14 条问答（FAQPage JSON-LD）
├── contact.html      联系与免费诊断：纯前端留资表单（ContactPage JSON-LD）
├── 404.html          友好 404
├── robots.txt        放行常规搜索引擎 + AI 抓取方
├── sitemap.xml       5 个页面
├── README.md         本文件
├── .nojekyll         空文件，阻止 GitHub 用 Jekyll 处理
└── assets/
    ├── site.css      全站共用样式（深色专业风，系统字体栈）
    └── site.js       全站共用脚本（导航折叠 / 当前页高亮 / 平滑滚动 / 表单转 mailto）
```

---

## 三、本地预览

站点全部使用**相对路径**，直接双击 `index.html` 也能看，推荐起本地服务：

```bash
cd ai-marketing-agency
python -m http.server 8080     # 然后访问 http://localhost:8080
# 或：npx serve .
```

建议按 **375px（手机）** 与 **1280px（桌面）** 两个宽度各检查一遍。

---

## 四、更新与重新部署

站点已关联远端仓库 `git@github.com:fengchao8181-ctrl/ai-marketing-agency.git`（分支 `main`）。

```bash
git add .
git commit -m "说明本次改动"
git push origin main
```

GitHub Pages 会在 1–3 分钟内自动重新构建。可在仓库 **Actions** 页查看 `pages build and deployment` 的运行状态。

> `.nojekyll` 必须保留，否则 GitHub 会用 Jekyll 重新处理静态文件。

如需手动开启 Pages：
`gh api -X POST repos/fengchao8181-ctrl/ai-marketing-agency/pages -f source[branch]=main -f source[path]=/`

---

## 五、GEO 相关说明（这个站为什么这么写）

1. **结构化数据**：`pricing.html` 有 `Service + Offer`（4 个），`faq.html` 有 `FAQPage`（14 条，与正文逐字一致），`index.html` 有 `Organization + WebSite`，`method.html` 有 `Article + BreadcrumbList`，`contact.html` 有 `ContactPage`。全部为合法 JSON，无注释、无未转义字符。
2. **抓取放行**：`robots.txt` 显式放行 GPTBot / OAI-SearchBot / ChatGPT-User / PerplexityBot / ClaudeBot / Claude-User / anthropic-ai / Google-Extended / Bingbot / Bytespider。
3. **内容结构**：页面采用「定义前置 + 分点 + FAQ + 对比表」写法，便于生成式引擎摘取。
4. **诚实标注**：所有价格、周期、倍率均带「参考区间，待核」，不虚构客户名、案例数据、成交金额与客户评价。
5. **见效周期**：GEO 通常 4–8 周（参考区间，待核），不是即时排名，不做命中承诺。

---

## 六、技术约束（改动时请遵守）

- **纯静态**：不引入 React / Vue / 打包器；不引任何 CDN 字体或 JS 库。
- **相对路径**：链接一律写 `pricing.html`、`assets/site.css`，不要写 `/pricing.html`，否则部署到 `*.github.io/<repo>/` 子路径会 404。
- **零后端**：联系表单为纯前端，提交时生成 `mailto:` 草稿，不上传任何数据。
- **移动端**：375px 下不横向溢出；宽表格用 `.table-scroll` 横向滚动包裹。
- **JSON-LD**：修改后请重新校验能否被 `JSON.parse`（脚本块内不要写注释、不要有多余逗号）。
- **合规红线**：不得删除各页 footer 的「按服务收费，不承诺获客或成交结果」声明；不使用绝对化用语；不虚构案例与数据。
