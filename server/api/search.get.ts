import { DATASET } from "../utils/searchData";

export default defineEventHandler(async (event) => {
    // sleep
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 仅接受 string[] 形式的去重列表
    const { q, seen } = getQuery(event) as { q?: string; seen?: string[] };
    // 空查询直接返回
    const query = (q ?? "").toString().trim();
    if (!query) return [];

    // 去重列表: 仅处理数组形态, 非数组视为未提供
    const seenList = Array.isArray(seen) ? seen : [];
    const seenSet = new Set<string>(seenList.map((s) => s.toString()));

    const lowered = query.toLowerCase();
    // 大小写不敏感的包含匹配 (MVP)
    const results = DATASET.filter((item) => {
        const matched = item.title.toLowerCase().includes(lowered) || item.summary.toLowerCase().includes(lowered);
        if (!matched) return false;
        // 先去重: 已见过的 ID 直接跳过
        if (seenSet.has(item.id)) return false;
        return matched;
    })
        // 限制返回 5 条
        .slice(0, 5);

    return results;
});
