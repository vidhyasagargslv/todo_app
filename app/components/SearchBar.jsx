'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ initialSearch, onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    onSearchChange(searchTerm);
  }, [searchTerm, onSearchChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="input border-primary flex items-center gap-2 w-56">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="grow placeholder-inherit font-semibold"
        placeholder="Search"
      />
      
    </form>
  );
}