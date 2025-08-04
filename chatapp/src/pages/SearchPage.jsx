import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 10; 

  // 🔥 Fetch data
  const fetchProfiles = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/profiles/search`, {
        params: { q: query, page, limit },
      });
      setResults(res.data.profiles);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page changes
  useEffect(() => {
    if (query.trim()) {
      fetchProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1); // reset to first page
    fetchProfiles();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-4 text-pink-600">🔎 Search Profiles</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username, county, description..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-pink-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">⏳ Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Results */}
      <ul className="space-y-4">
        {results.map((profile) => (
          <li
            key={profile._id}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <h2 className="text-lg font-semibold text-pink-600">
              {profile.personal?.username}
            </h2>
            <p className="text-gray-600">{profile.additional?.description}</p>
            <p className="text-sm text-gray-500">
              {profile.location?.county}, {profile.location?.localArea}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border ${
              page === 1
                ? "text-gray-400 border-gray-300"
                : "text-pink-600 border-pink-400 hover:bg-pink-50"
            }`}
          >
            ◀ Prev
          </button>
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              page === totalPages
                ? "text-gray-400 border-gray-300"
                : "text-pink-600 border-pink-400 hover:bg-pink-50"
            }`}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
