function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTag(tag) {
  return String(tag || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function getItemTags(item) {
  const rawTags = item && item.data ? item.data.tags : [];
  return Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [];
}

function buildAliasEntries(collectionApi) {
  const aliases = [];
  const items = collectionApi.getAll();
  for (const item of items) {
    const itemAliases = Array.isArray(item.data.aliases) ? item.data.aliases : [];
    for (const alias of itemAliases) {
      aliases.push({ item, alias });
    }
  }
  return aliases;
}

function buildNormalizedTagMap(collectionApi, ignoredTags) {
  const tagMap = new Map();
  const ignored = new Set(Array.from(ignoredTags || []).map((tag) => normalizeTag(tag)));

  for (const item of collectionApi.getAll()) {
    const tags = getItemTags(item);
    if (!tags.length) {
      continue;
    }

    const seenForItem = new Set();
    for (const tag of tags) {
      const normalized = normalizeTag(tag);
      if (!normalized || ignored.has(normalized) || seenForItem.has(normalized)) {
        continue;
      }
      seenForItem.add(normalized);
      if (!tagMap.has(normalized)) {
        tagMap.set(normalized, []);
      }
      tagMap.get(normalized).push(item);
    }
  }

  for (const posts of tagMap.values()) {
    posts.sort((a, b) => b.date - a.date);
  }

  return tagMap;
}

module.exports = {
  escapeHtml,
  normalizeTag,
  getItemTags,
  buildAliasEntries,
  buildNormalizedTagMap,
};
