<script setup lang="ts">
definePageMeta({ layout: "lab" });

type SearchResult = {
    id: string;
    title: string;
    summary: string;
    coverUrl: string;
};

class SearchState {
    results: SearchResult[] = [];
    loading = false;
    error = "";
    hasMore = true;
    loadingMore = false;
    seenIds = new Set<string>();
    appliedQuery = "";
}

class RelatedState {
    results: SearchResult[] = [];
    loading = false;
    hasMore = true;
    loadingMore = false;
    seenIds = new Set<string>();
}

// 进入页面时, 若存在 ?q= 则初始化搜索框框
const route = useRoute();
const query = (route.query.q as string | undefined) ?? "";

const searchState = ref(new SearchState());

const relatedState = ref(new RelatedState());

let controller: AbortController | null = null;

async function onSearch(q: string) {
    console.log("[cancel] onSearch", { q });

    // 重置状态
    searchState.value = new SearchState();

    // 取消上一次请求, 确保只有最后一次有效
    if (controller) {
        controller.abort("replaced-by-new-search");
    }
    const current = (controller = new AbortController());

    // 无搜索词: 直接进入相关推荐流程
    if (!q) {
        searchState.value.hasMore = false;
        fetchRelatedInit();
        return;
    }

    // 开始搜索
    try {
        searchState.value.loading = true;
        const res = await $fetch<SearchResult[]>("/api/search", {
            query: { q, seen: [] },
            signal: controller.signal,
        });
        if (controller === current) {
            // 搜索成功后再应用当前搜索词用于高亮
            searchState.value.appliedQuery = q;
            // 更新结果
            searchState.value.results = res;
            // 合并已见 ID
            for (const item of res) searchState.value.seenIds.add(item.id);
            // 判断是否还有更多: 若本次返回已达上限 5, 可能仍有剩余
            searchState.value.hasMore = res.length === 5;
            // 仅当无更多结果时再请求相关推荐
            if (!searchState.value.hasMore) {
                fetchRelatedInit();
            }
        }
    } catch (_e) {
        if (controller === current) {
            searchState.value.error = "请求失败";
        }
    } finally {
        if (controller === current) {
            searchState.value.loading = false;
            controller = null;
        }
    }
}

async function loadMore() {
    if (searchState.value.loadingMore) return;

    try {
        searchState.value.loadingMore = true;
        const res = await $fetch<SearchResult[]>("/api/search", {
            query: { q: searchState.value.appliedQuery, seen: Array.from(searchState.value.seenIds) },
        });
        // 合并结果
        searchState.value.results = [...searchState.value.results, ...res];
        // 合并已见 ID
        for (const item of res) searchState.value.seenIds.add(item.id);
        // 如果返回结果刚好 5 个, 则认为还有更多
        searchState.value.hasMore = res.length === 5;
        // 如果没有更多, 则请求相关推荐
        if (!searchState.value.hasMore) {
            fetchRelatedInit();
        }
    } catch (_e) {
        // 报错了就当加载完了
        searchState.value.hasMore = false;
    } finally {
        searchState.value.loadingMore = false;
    }
}

async function fetchRelatedInit() {
    // 重置状态
    relatedState.value = new RelatedState();

    try {
        relatedState.value.loading = true;
        const rec = await $fetch<SearchResult[]>("/api/recommend", {
            query: { seen: Array.from(relatedState.value.seenIds) },
        });
        relatedState.value.results = rec;
        for (const item of rec) relatedState.value.seenIds.add(item.id);
        relatedState.value.hasMore = rec.length === 5;
    } catch (_e) {
        relatedState.value.hasMore = false;
    } finally {
        relatedState.value.loading = false;
    }
}

async function fetchRelatedMore() {
    if (relatedState.value.loadingMore) return;

    try {
        relatedState.value.loadingMore = true;
        const rec = await $fetch<SearchResult[]>("/api/recommend", {
            query: { seen: Array.from(relatedState.value.seenIds) },
        });
        relatedState.value.results = [...relatedState.value.results, ...rec];
        for (const item of rec) relatedState.value.seenIds.add(item.id);
        relatedState.value.hasMore = rec.length === 5;
    } catch (_e) {
        // 报错了就当加载完了
        relatedState.value.hasMore = false;
    } finally {
        relatedState.value.loadingMore = false;
    }
}
</script>

<template>
    <main class="container">
        <SearchBox @search="onSearch" :initial="query" />
        <div class="status" v-if="searchState.loading">正在搜索...</div>
        <div class="status error" v-else-if="searchState.error">{{ searchState.error }}</div>
        <SearchResults
            v-else
            :results="searchState.results"
            :query="searchState.appliedQuery"
            :has-more="searchState.hasMore"
            :loading-more="searchState.loadingMore"
            @load-more="loadMore"
        />
        <RelatedList
            v-if="!searchState.hasMore"
            :items="relatedState.results"
            :loading="relatedState.loading"
            :loading-more="relatedState.loadingMore"
            :has-more="relatedState.hasMore"
            @load-more="fetchRelatedMore"
        />
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
