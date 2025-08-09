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

async function onSearch(qRaw: string) {
    // 开始搜索先清空已应用搜索词, 避免展示上一次的高亮
    appliedQuery.value = "";

    // 空查询直接返回
    const q = (qRaw ?? "").trim();
    if (!q) {
        results.value = [];
        error.value = null;
        return;
    }

    // 开始搜索
    loading.value = true;
    error.value = null;
    try {
        const res = await $fetch<SearchResult[]>("/api/search", { query: { q } });
        results.value = res ?? [];
        // 搜索成功后再应用当前搜索词用于高亮
        appliedQuery.value = q;
    } catch (_e) {
        error.value = "请求失败";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <main class="container">
        <SearchBox @search="onSearch" :disabled="loading" />
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
