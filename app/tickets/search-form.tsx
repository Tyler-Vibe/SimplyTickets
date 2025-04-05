'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchForm({ initialSearch = '' }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) {
      params.set('q', search);
    }
    router.push(`/tickets${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tickets..."
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
      >
        Search
      </button>
      {initialSearch && (
        <button
          type="button"
          onClick={() => {
            setSearch('');
            router.push('/tickets');
          }}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition"
        >
          Clear
        </button>
      )}
    </form>
  );
} 