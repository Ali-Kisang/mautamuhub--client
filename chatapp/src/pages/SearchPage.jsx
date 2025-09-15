import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProfiles } from "../components/utils/searchApi";


export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const query = params.get("q") || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProfiles(query, page);
        setResults(data.profiles);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, page]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul>
          {results.map((p) => (
            <li key={p._id}>
              {p.personal.username} - {p.location.ward}
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              disabled={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
