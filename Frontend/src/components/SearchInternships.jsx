import React, { useState } from "react";

function SearchInternships() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = e => {
    e.preventDefault();
    // Mock results; replace with API call
    const mockResults = [
      { id: 1, title: "Frontend Developer Intern", company: "TechCorp" },
      { id: 2, title: "AI/ML Intern", company: "DataWorld" },
    ];
    setResults(mockResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <div className="search-internships mb-4">
      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input type="text" className="form-control me-2" placeholder="Search internships..." value={query} onChange={e => setQuery(e.target.value)} />
        <button className="btn btn-success" type="submit">Search</button>
      </form>

      {results.length > 0 && (
        <div className="results">
          {results.map(r => (
            <div key={r.id} className="card p-3 mb-2 shadow-sm">
              <h5>{r.title}</h5>
              <p><strong>Company:</strong> {r.company}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchInternships;
