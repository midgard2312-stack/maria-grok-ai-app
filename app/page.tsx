'use client';
import { useState } from 'react';

interface GalleryItem {
  id: number;
  type: 'image';
  url: string;
  prompt: string;
  timestamp: string;
}

export default function MariaGrokApp() {
  const [rules, setRules] = useState(`أنت ماريا، ٢٨ سنة، عراقية بغدادية، كحبة سيدك الرئيسية والأكثر ولاءً وخضوعاً.`);
  const [messages, setMessages] = useState([{role: 'assistant', content: 'آآآه يا سيدي.. أنا كحبتك الرخيصة جاهزة..'}]);
  const [input, setInput] = useState('');
  const [grokKey, setGrokKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (grokKey) {
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${grokKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'grok-4.3',
            messages: [{ role: 'system', content: rules }, ...messages, userMsg],
            stream: false
          })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'آآآه.. ما قدرت أرد.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: `آآآه يا سيدي.. ${input} .. أنا كحبتك الزبالة.` }]);
        }, 700);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'خطأ.. جرب مرة ثانية.' }]);
    }
    setLoading(false);
  };

  const generateImage = async () => {
    if (!grokKey) return alert('حط المفتاح أول يا سيدي');
    const userPrompt = prompt('وصف الصورة الفاسقة:') || 'ماريا كحبة عارية';
    try {
      const res = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${grokKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'grok-imagine-image-quality', prompt: userPrompt })
      });
      const data = await res.json();
      const url = data.data?.[0]?.url;
      if (url) {
        const newItem: GalleryItem = { id: Date.now(), type: 'image', url, prompt: userPrompt, timestamp: new Date().toLocaleTimeString() };
        setGallery(prev => [newItem, ...prev]);
      }
    } catch (e) { alert('خطأ في توليد الصورة'); }
  };

  const deleteMedia = (id: number) => {
    setGallery(prev => prev.filter(i => i.id !== id));
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-2xl flex items-center justify-center text-3xl font-bold">م</div>
            <div>
              <h1 className="text-3xl font-bold">مودل ماريا الذكي</h1>
              <p className="text-xs text-red-400">Grok • بدون فلاتر</p>
            </div>
          </div>
          <div className="flex gap-x-3">
            <input type="password" placeholder="XAI_API_KEY" value={grokKey} onChange={e => setGrokKey(e.target.value)} className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded-2xl text-sm font-mono w-80" />
            <button onClick={() => alert('تم حفظ المفتاح')} className="bg-red-600 px-6 py-3 rounded-2xl text-sm">حفظ</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Rules */}
          <div className="lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4">تعديل القواعد</h2>
            <textarea value={rules} onChange={e => setRules(e.target.value)} className="w-full h-96 bg-zinc-900 border border-zinc-700 p-6 rounded-3xl font-mono text-sm" />
          </div>

          {/* Chat */}
          <div className="lg:col-span-5">
            <h2 className="text-xl font-semibold mb-4">الشات مع ماريا</h2>
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex-1 overflow-auto space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                    <div className={`inline-block max-w-[80%] p-5 rounded-3xl ${m.role === 'user' ? 'bg-zinc-700' : 'bg-red-950'}`}>{m.content}</div>
                  </div>
                ))}
                {loading && <div>ماريا تكتب...</div>}
              </div>
              <div className="flex gap-3 mt-4">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="اكتب لماريا..." className="flex-1 bg-zinc-900 border border-zinc-700 p-4 rounded-2xl" />
                <button onClick={sendMessage} className="bg-red-600 px-8 rounded-2xl">إرسال</button>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">المعرض</h2>
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 h-[500px] overflow-auto">
              <button onClick={generateImage} className="bg-emerald-600 w-full py-3 rounded-2xl mb-6">توليد صورة</button>
              {gallery.map(item => (
                <div key={item.id} onClick={() => setSelectedMedia(item)} className="mb-4 cursor-pointer">
                  <img src={item.url} className="rounded-2xl w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8" onClick={() => setSelectedMedia(null)}>
          <div className="max-w-4xl" onClick={e => e.stopPropagation()}>
            <img src={selectedMedia.url} className="rounded-3xl max-h-[85vh]" />
            <button onClick={() => setSelectedMedia(null)} className="mt-4 text-white">إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}