import  { useState, useEffect } from 'react';
import { server } from "../../server";
import axios from 'axios';

const UserSearchBar = () => {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('');
  const [county, setCounty] = useState('');
  const [accountType, setAccountType] = useState('');
  const [services, setServices] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const fetchResults = async () => {
    try {
      const res = await axios.get(`${server}/search/search-query`, {
        params: {
          query,
          gender,
          county,
          accountType,
          services,
          sortBy,
          order,
          page,
          limit: 10,
        },
      });
      setResults(res.data.results);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, gender, county, accountType, services, sortBy, order, page]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by name, phone..."
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="County"
          className="input input-bordered"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        />
        <input
          type="text"
          placeholder="Service (e.g. Massage)"
          className="input input-bordered"
          value={services}
          onChange={(e) => setServices(e.target.value)}
        />
        <select className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select className="select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="">All Accounts</option>
          <option value="Regular">Regular</option>
          <option value="Premium">Premium</option>
        </select>
        <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="age">Age</option>
          <option value="amount">Amount</option>
        </select>
        <select className="select" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
      </div>

      {/* Results */}
      <div className="grid gap-2">
        {results.map((user) => (
          <div key={user._id} className="card shadow p-4">
            <p><strong>{user.personalInfo.username}</strong></p>
            <p>Phone: {user.personalInfo.phoneNumber}</p>
            <p>County: {user.breadcrumbLocation.county}</p>
            <p>Services: {user.services.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSearchBar;
