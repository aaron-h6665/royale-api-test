'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [tag, setTag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tag.trim()){
        setErrorMessage("Please enter a valid player tag.");
        return;
    }

    setErrorMessage('');
    const cleanTag = tag.replace('#', '');
    router.push(`/?tag=${cleanTag}`);
};
    return (
        <div className= "mb-8 mt-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Player Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg
           bg-white text-gray-900 border border-gray-300
           dark:bg-white/10 dark:text-white dark:border-white/20
           placeholder-gray-500 dark:placeholder-gray-400
           focus:ring-2 focus:ring-purple-500"
                    required
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                    Search
                </button>
            </form>

            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        </div>
    );
}