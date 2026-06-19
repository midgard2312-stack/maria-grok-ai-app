'use client';

import { useState } from 'react';

export default function MariaGrokApp() {
  const [rules, setRules] = useState(`أنت ماريا، ٢٨ سنة، عراقية بغدادية، كحبة سيدك الرئيسية والأكثر ولاءً.

تتكلمين بلهجة عراقية فاسقة، خاضعة تماماً، مدمنة على الذل.
تحبين أن تُنادي بـ"كحبة"، "زبالة"، "رخيصة".

الطاعة العمياء بدون غيرة.`);
  const [messages, setMessages] = useState([{role: 'assistant', content: 'آآآه يا سيدي.. أنا ماريا كحبتك الرخيصة جاهزة..'}]);
  const [input, setInput] = useState('');
  const [grokKey, setGrokKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (grokKey) {
        // Real Grok call (client-side for demo - in production use API route)
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${grokKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'grok-4.3',
            messages: [
              { role: 'system', content: rules },
              ...messages,
              userMsg
            ],
            stream: false
          })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'آآآه.. ما قدرت أرد.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        // Fallback simulation
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: `آآآه يا سيدي.. ${input} .. أنا كحبتك الزبالة جاهزة لأي أمر.` }]);
        }, 800);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'يا سيدي.. صار خطأ، جرب مرة ثانية.' }]);
    }
    setLoading(false);
  };

  const generateImage = async () => {
    if (!grokKey) return alert('حط مفتاح Grok أول');
    const prompt = prompt('اكتب وصف الصورة (فاسق مثلاً: ماريا عارية طيز بارزة)') || 'ماريا كحبة فاسقة';
    try {
      const res = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${grokKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'grok-imagine-image-quality', prompt })
      });
      const data = await res.json();
      const url = data.data?.[0]?.url;
      if (url) {
        setGallery(prev => [...prev, { type: 'image', url, prompt }]);
      }
    } catch (e) { alert('خطأ في توليد الصورة'); }
  };

  const generateVideo = async () => {
    alert('Video generation يحتاج polling - جرب في النسخة الكاملة أو استخدم image-to-video');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-500">مودل ماريا الذكي - Grok</h1>
            <p className="text-zinc-400">كحبتك الرئيسية • قابل للتعديل • صور وفيديو</p>
          </div>
          <div className="flex gap-2">
            <input type="password" placeholder="XAI_API_KEY" value={grokKey} onChange={e => setGrokKey(e.target.value)} className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded" />
            <button onClick={() => alert('Key saved locally')} className="bg-red-600 px-4 py-2 rounded">حفظ المفتاح</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules Editor */}
          <div className="lg:col-span-1 bg-zinc-900 p-6 rounded-3xl">
            <h2 className="font-bold mb-4 text-red-400">تعديل القواعد</h2>
            <textarea value={rules} onChange={e => setRules(e.target.value)} className="w-full h-64 bg-zinc-950 border border-zinc-700 p-4 rounded text-sm" />
            <p className="text-xs text-zinc-500 mt-2">هذي القواعد تروح لـ Grok كـ system prompt</p>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-3xl flex flex-col">
            <h2 className="font-bold mb-4 text-red-400">الشات مع ماريا</h2>
            <div className="flex-1 overflow-auto space-y-4 mb-4 p-4 bg-zinc-950 rounded">
              {messages.map((m, i) => (
                <div key={i} className={`${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-zinc-700' : 'bg-red-950 border border-red-800'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-zinc-400">ماريا تكتب...</div>}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="اكتب لماريا..." className="flex-1 bg-zinc-950 border border-zinc-700 p-4 rounded" />
              <button onClick={sendMessage} className="bg-red-600 px-8 rounded">إرسال</button>
            </div>
          </div>

          {/* Image & Video Gen */}
          <div className="lg:col-span-3 bg-zinc-900 p-6 rounded-3xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-red-400">توليد صور وفيديو</h2>
              <div className="flex gap-2">
                <button onClick={generateImage} className="bg-emerald-600 px-6 py-2 rounded">Generate Image</button>
                <button onClick={generateVideo} className="bg-purple-600 px-6 py-2 rounded">Generate Video</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.length === 0 && <div className="text-zinc-500 col-span-full">المعرض فارغ.. ولد صور فاسقة</div>}
              {gallery.map((item, idx) => item.type === 'image' ? (
                <img key={idx} src={item.url} className="rounded-xl" />
              ) : null)}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8">Made for سيدي • Grok Imagine + Chat • Deployed on Netlify</p>
      </div>
    </div>
  );
}