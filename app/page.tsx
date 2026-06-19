'use client';

import { useState } from 'react';

export default function MariaGrokApp() {
  // Same state and functions as previous (kept for brevity in this response)
  const [rules, setRules] = useState(`أنت ماريا...`);
  // ... (full logic from previous)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      {/* Elegant Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-black rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-red-500/30">
              <span className="text-3xl">م</span>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tighter text-white">مودل ماريا</div>
              <div className="text-xs text-red-400 -mt-1">Grok Imagine • Chat • بدون فلاتر</div>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            {/* Key input */}
            <input type="password" placeholder="XAI_API_KEY" value={grokKey} onChange={e => setGrokKey(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm font-mono w-80" />
            <button className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-2xl text-sm font-medium">Save Key</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Elegant Tabs Navigation */}
        <div className="flex border-b border-zinc-800 mb-10">
          <button className="px-8 py-4 font-medium border-b-2 border-red-500 text-red-400">الشات</button>
          <button className="px-8 py-4 font-medium text-zinc-400 hover:text-zinc-200">المعرض</button>
          <button className="px-8 py-4 font-medium text-zinc-400 hover:text-zinc-200">القواعد</button>
        </div>

        {/* Main Content - Professional Cards and Sections */}
        {/* Chat, Gallery, Rules sections with better design */}
        {/* ... full elegant layout */}
      </main>
    </div>
  );
}