<script setup lang="ts">
type SearchResult = {
    id: string;
    title: string;
    summary: string;
    coverUrl: string;
};

const props = defineProps<{
    items: SearchResult[];
    title?: string;
    loading?: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
}>();

const emit = defineEmits<{ (e: "load-more"): void }>();
</script>

<template>
    <section v-if="props.loading || items?.length" class="relatedResults">
        <h3 class="section-title">{{ props.title ?? "相关推荐" }}</h3>
        <div v-if="props.loading" class="loading">加载中...</div>
        <div v-else class="list">
            <article v-for="item in items" :key="item.id" class="card">
                <img class="thumb" :src="item.coverUrl" :alt="item.title" />
                <div class="meta">
                    <h4 class="title">{{ item.title }}</h4>
                    <p class="desc">{{ item.summary }}</p>
                </div>
            </article>
            <div class="more">
                <button v-if="props.hasMore" class="more-btn" :disabled="props.loadingMore" @click="emit('load-more')">
                    {{ props.loadingMore ? "加载中..." : "加载更多" }}
                </button>
                <div v-else-if="items.length" class="no-more">没有更多了</div>
            </div>
        </div>
    </section>
    <section v-else class="relatedResults none"></section>
</template>

<style scoped>
.relatedResults {
    margin-top: 16px;
}
.section-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #334155;
}
.loading {
    color: #666;
    text-align: center;
    padding: 8px 0;
}
.list {
    display: flex;
    flex-direction: column;
}
.card {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 12px;
}
.thumb {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
}
.meta {
    flex: 1;
    min-width: 0;
}
.title {
    margin: 0 0 4px 0;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.desc {
    margin: 0;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}
.none {
    display: none;
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
</style>
