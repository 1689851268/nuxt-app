<script setup lang="ts">
type SearchResult = {
    id: string;
    title: string;
    summary: string;
    coverUrl: string;
};

const props = defineProps<{
    results: SearchResult[];
    query: string;
    hasMore?: boolean;
    loadingMore?: boolean;
}>();

const emit = defineEmits<{ (e: "load-more"): void }>();

/**
 * HTML-escape 可见文本 (defensive encoding).
 * 目的: 在使用 v-html 时确保非高亮片段安全.
 * 范围: & < > " '.
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * 将用户输入转为正则字面量.
 * 目的: 规避元字符 (.,*,+,?,^,$,{,},(,),|,[,],\\) 造成的模式扩展与 ReDoS.
 * 实现: 使用 $& 回溯为元字符加反斜杠.
 */
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 在纯文本中用 <mark> 高亮 query, 并保持可插入 DOM 的安全性.
 */
function highlight(text: string): string {
    // 1) 规范化查询词; 为空则直接返回转义后的原文.
    const q = (props.query ?? "").trim();
    if (!q) return escapeHtml(text ?? "");

    // 2) 转义查询词并构造 /.../gi.
    const pattern = new RegExp(escapeRegExp(q), "gi");

    // 3) 初始化输出缓冲与游标.
    let out = "";
    let lastIndex = 0;

    // 4) exec 逐次匹配.
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
        // 4.1) 追加非命中片段 (转义).
        out += escapeHtml(text.slice(lastIndex, match.index));
        // 4.2) 追加命中片段 (转义后包 <mark>).
        out += "<mark>" + escapeHtml(match[0]) + "</mark>";
        // 4.3) 推进游标.
        lastIndex = match.index + match[0].length;
    }

    // 5) 追加尾部片段.
    out += escapeHtml(text.slice(lastIndex));

    // 6) 返回可安全用于 v-html 的字符串.
    return out;
}
</script>

<template>
    <div class="results">
        <div v-if="!results?.length" class="empty">没有结果</div>
        <div v-else class="list">
            <article v-for="item in results" :key="item.id" class="card">
                <img class="thumb" :src="item.coverUrl" :alt="item.title" />
                <div class="meta">
                    <h3 v-html="highlight(item.title)"></h3>
                    <p v-html="highlight(item.summary)"></p>
                </div>
            </article>
            <div class="more">
                <button v-if="props.hasMore" class="more-btn" :disabled="props.loadingMore" @click="emit('load-more')">
                    {{ props.loadingMore ? "加载中..." : "加载更多" }}
                </button>
                <div v-else-if="results.length" class="no-more">没有更多了</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.results {
    margin-top: 16px;
}
.card {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 12px;
}
.card h3 {
    margin: 0 0 6px 0;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.card p {
    margin: 0;
    color: #555;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}
.thumb {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
}
.meta {
    flex: 1;
    min-width: 0;
}
.empty {
    color: #888;
}
.more {
    padding: 12px 0 4px;
    display: flex;
    justify-content: center;
}
.more-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #0ea5e9;
    background: #0ea5e9;
    color: #fff;
}
.more-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.no-more {
    color: #888;
}
mark {
    background: #fde68a;
    padding: 0 2px;
}
</style>
