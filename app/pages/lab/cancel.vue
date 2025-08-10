<script setup lang="ts">
definePageMeta({ layout: "lab" });

type SearchResult = {
    id: string;
    title: string;
    summary: string;
    coverUrl: string;
};

const results = ref<SearchResult[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const appliedQuery = ref("");

// 进入页面时, 若存在 ?q= 则初始化搜索框框
const route = useRoute();
const query = (route.query.q as string | undefined) ?? "";

let controller: AbortController | null = null;

async function onSearch(q: string) {
    console.log("[cancel] onSearch", { q });

    // 开始搜索先清空已应用搜索词, 避免展示上一次的高亮
    appliedQuery.value = "";

    // 空查询直接返回
    if (!q) {
        results.value = [];
        error.value = null;
        return;
    }

    // 取消上一次请求, 确保只有最后一次有效
    if (controller) {
        controller.abort("replaced-by-new-search");
    }
    const current = (controller = new AbortController());

    // 开始搜索
    loading.value = true;
    error.value = null;
    try {
        const res = await $fetch<SearchResult[]>("/api/search", { query: { q }, signal: controller.signal });
        if (controller === current) {
            results.value = res ?? [];
            // 搜索成功后再应用当前搜索词用于高亮
            appliedQuery.value = q;
        }
    } catch (_e) {
        if (controller === current) {
            error.value = "请求失败";
        }
    } finally {
        if (controller === current) {
            loading.value = false;
            controller = null;
        }
    }
}
</script>

<template>
    <main class="container">
        <SearchBox @search="onSearch" :initial="query" />
        <div class="status" v-if="loading">正在搜索...</div>
        <div class="status error" v-else-if="error">{{ error }}</div>
        <SearchResults v-else :results="results" :query="appliedQuery" />
    </main>
</template>

<style scoped>
.container {
    max-width: 720px;
    margin: 40px auto;
    padding: 0 16px;
}
.status {
    margin-top: 12px;
    color: #666;
}
.status.error {
    color: #c00;
}
</style>
