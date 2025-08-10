export interface SearchResult {
    id: string;
    title: string;
    summary: string;
    coverUrl: string;
}

export const DATASET: SearchResult[] = [
    {
        id: "1",
        title: "Nuxt 4 搜索功能与渲染性能实践指南：从页面结构到交互细节的完整示例，与可观测性(I11y)/国际化(I18n)/可访问性(A11y)的深度实践与落地",
        summary:
            "通过基于文件的路由、Nitro API 与组合式组件，演示如何实现稳定可扩展的搜索体验，并兼顾首屏性能与可维护性；同时覆盖渐进增强、错误治理、降级回退、灰度发布、观测指标与容量规划，在真实复杂场景下保持可维护与可演进。",
        coverUrl: "https://picsum.photos/seed/nuxt4/80/80",
    },
    {
        id: "2",
        title: "关键词高亮与可访问性：在复杂文本中准确标注并保持语义结构，兼容中英混排、Emoji 与 RTL 文本、读屏与键盘导航",
        summary:
            "使用安全转义与最小化标记策略避免破坏结构；在移动端与桌面端提供一致反馈与可读性，并兼容读屏朗读顺序、焦点管理与缩放模式的视觉一致性。",
        coverUrl: "https://picsum.photos/seed/highlight/80/80",
    },
    {
        id: "3",
        title: "服务端过滤与限流策略：基于包含匹配的轻量实现与可扩展架构设计指南",
        summary:
            "采用大小写不敏感的包含匹配与结果数限制，确保接口返回可控且稳定；后续可平滑升级为分页与排序，并逐步引入缓存与熔断以提升弹性与可用性。",
        coverUrl: "https://picsum.photos/seed/api/80/80",
    },
    {
        id: "4",
        title: "Composition API 组件化拆分：输入框、结果列表与状态管理",
        summary: "通过 defineModel 与分层组件，减少耦合与重复逻辑，使得功能演进与复用更加轻松，测试编写也更简单。",
        coverUrl: "https://picsum.photos/seed/vue/80/80",
    },
    {
        id: "5",
        title: "路由",
        summary: "清晰导航。",
        coverUrl: "https://picsum.photos/seed/router/80/80",
    },
    {
        id: "6",
        title: "Nitro API",
        summary: "内存数据源。",
        coverUrl: "https://picsum.photos/seed/nitro/80/80",
    },
    {
        id: "7",
        title: "Vite",
        summary: "开发体验。",
        coverUrl: "https://picsum.photos/seed/vite/80/80",
    },
    {
        id: "8",
        title: "SSR 与客户端导航：保持路由一致性的工程要点与边界处理策略，覆盖权限控制与动态资源加载、错误边界与兜底页面",
        summary:
            "通过 SSR 输出与客户端路由统一处理，避免不一致导致的视觉抖动与状态丢失；在多语言、权限路由与动态导入场景下保持一致体验，引入错误边界与兜底页面、懒加载与预取策略提升鲁棒性与感知速度。",
        coverUrl: "https://picsum.photos/seed/ssr/80/80",
    },
    {
        id: "9",
        title: "可访问性",
        summary: "键盘交互。",
        coverUrl: "https://picsum.photos/seed/islands/80/80",
    },
    {
        id: "10",
        title: "样式与排版：单行与多行打点、缩略图对齐与可读性的平衡与主题适配，覆盖暗黑模式与高对比度方案",
        summary:
            "通过 nowrap 与 line-clamp 结合控制标题与摘要长度，同时保持缩略图对齐与可读性；在暗黑模式与高对比度主题下保持一致的层次感，并兼顾不同字重/字距/行高设置的可读性与可维护性。",
        coverUrl: "https://picsum.photos/seed/components/80/80",
    },
    {
        id: "11",
        title: "类型定义",
        summary: "结构一致的价值。",
        coverUrl: "https://picsum.photos/seed/types/80/80",
    },
    {
        id: "12",
        title: "可演进的搜索策略：从包含匹配到多关键词与分页，再到排序与权重模型，接入召回/精排与日志回放的闭环优化",
        summary:
            "先确保可用再逐步增强，优先交付可验证价值，同时预留扩展空间与清晰迁移路径；逐步引入分页、排序、字段权重与召回/精排策略提升体验，并结合埋点与日志回放验证用户行为与转化路径，形成数据驱动的持续优化闭环。",
        coverUrl: "https://picsum.photos/seed/tooling/80/80",
    },
    // XSS test cases
    {
        id: "13",
        title: "<script>alert(1)</script>",
        summary: "IMG onerror test: <img src=x onerror=alert(1) />.",
        coverUrl: "https://picsum.photos/seed/xss1/80/80",
    },
    {
        id: "14",
        title: "javascript:alert(1) link",
        summary: 'Anchor with javascript protocol: <a href="javascript:alert(1)">click</a>.',
        coverUrl: "https://picsum.photos/seed/xss2/80/80",
    },
    {
        id: "15",
        title: "Break out mark: </mark><img src=x onerror=alert(2)>",
        summary: "Attempt to break highlighter wrapper and inject tag.",
        coverUrl: "https://picsum.photos/seed/xss3/80/80",
    },
    {
        id: "16",
        title: "Angle brackets <> & quotes ' \"",
        summary: "Contains <b>bold</b> and &lt;escaped&gt; tags to test double-encoding.",
        coverUrl: "https://picsum.photos/seed/xss4/80/80",
    },
    {
        id: "17",
        title: "SVG onload",
        summary: "<svg onload=alert(3)></svg> should be rendered as text.",
        coverUrl: "https://picsum.photos/seed/xss5/80/80",
    },
    {
        id: "18",
        title: "Template interpolation {{7*7}}",
        summary: "Vue interpolation {{ alert(1) }} should not execute.",
        coverUrl: "https://picsum.photos/seed/xss6/80/80",
    },
];
