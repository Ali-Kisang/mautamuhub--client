// frontend/src/utils/searchApi.js
export async function fetchProfiles(query, page = 1, limit = 10) {
  if (!query.trim()) {
    return { profiles: [], total: 0, page: 1, totalPages: 0 };
  }

  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}
