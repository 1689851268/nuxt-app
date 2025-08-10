<script setup lang="ts">
// Simple layout for switching demo pages.
</script>

<template>
    <div>
        <header class="bar">
            <nav class="nav">
                <NuxtLink to="/home" class="link">Home</NuxtLink>
                <NuxtLink to="/lab/disable" class="link">方案1: 禁用按钮</NuxtLink>
                <NuxtLink to="/lab/cancel" class="link">方案2: 取消上一次请求</NuxtLink>
                <NuxtLink to="/" class="link">回到首页</NuxtLink>
            </nav>
        </header>
        <main class="main">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.bar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #0f172a;
    padding: 10px 16px;
}
.nav {
    display: flex;
    gap: 12px;
}
.link {
    color: #93c5fd;
}
.link:hover {
    color: #bfdbfe;
}
.main {
    max-width: 840px;
    margin: 24px auto;
    padding: 0 16px;
}
</style>
