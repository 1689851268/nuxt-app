<script setup lang="ts">
/**
 * 轻量搜索输入组件:
 * - 在回车/点击时向父级发出 'search' 事件.
 * - 内置同词去重: 连续提交相同规范化查询不会重复触发.
 * - 支持禁用态: 当为 true 时禁止提交与输入.
 */

const props = defineProps<{ disabled?: boolean }>();

const emit = defineEmits<{ (e: "search", q: string): void }>();

// 输入框的值
const query = ref("");
// 记录上一次触发的查询词 (规范化后)
let lastEmittedQuery = "";

function triggerSearch() {
    // 禁用态直接返回
    if (props.disabled) return;

    // 规范化查询词
    const normalized = query.value.trim();

    // 若与上次一致则忽略
    if (normalized === lastEmittedQuery) return;

    // 发出搜索事件
    emit("search", normalized);

    // 记录最近一次的查询
    lastEmittedQuery = normalized;
}
</script>

<template>
    <div class="search-box">
        <input
            v-model="query"
            @keyup.enter="triggerSearch"
            placeholder="输入搜索关键词"
            class="input"
            :disabled="props.disabled"
        />
        <button class="btn" @click="triggerSearch" :disabled="props.disabled">搜索</button>
    </div>
</template>

<style scoped>
.search-box {
    display: flex;
    gap: 8px;
}
.input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
}
.input:disabled {
    background: #f6f6f6;
    color: #999;
}
.btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #0ea5e9;
    background: #0ea5e9;
    color: #fff;
}
.btn:hover {
    background: #0284c7;
    border-color: #0284c7;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
