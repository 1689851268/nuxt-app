<script setup lang="ts">
definePageMeta({ layout: "lab" });

/**
 * Home 页: 仅展示标题与 SearchBox.
 * 行为: 无论是否输入关键词, 触发搜索即导航到 /lab/cancel?q=...
 */

const router = useRouter();

function onSearch(q: string) {
    console.log("[home] onSearch", { q });
    router.push({ path: "/lab/cancel", query: { q } });
}
</script>

<template>
    <main class="container">
        <h1 class="title">Search Demo</h1>
        <SearchBox @search="onSearch" />
    </main>
</template>

<style scoped>
.container {
    max-width: 720px;
    margin: 40px auto;
    padding: 0 16px;
}
.title {
    margin: 0 0 16px 0;
    font-size: 28px;
    font-weight: 700;
}
</style>
