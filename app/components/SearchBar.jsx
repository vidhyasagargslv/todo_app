'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialSearch }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      router.push(`/?search=${searchTerm}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router]);

  return (
    <label className="input border-primary flex items-center gap-2 w-56">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="grow placeholder-inherit font-semibold" placeholder="Search"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 "
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}
