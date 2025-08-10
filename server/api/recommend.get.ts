import { DATASET } from "../utils/searchData";

export default defineEventHandler(async (event) => {
    await new Promise((r) => setTimeout(r, 300));

    const { seen } = getQuery(event) as { seen?: string[] };
    const seenSet = new Set<string>((Array.isArray(seen) ? seen : []).map((s) => s.toString()));

    const results = DATASET.filter((item) => !seenSet.has(item.id)).slice(0, 5);

    return results;
});
