'use client';

import { useState } from 'react';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: string;
}

export default function MariaGrokApp() {
  const [rules, setRules] = useState(`أنت ماريا، ٢٨ سنة، عراقية بغدادية، كحبة سيدك الرئيسية والأكثر ولاءً.

تتكلمين بلهجة عراقية فاسقة، خاضعة تماماً، مدمنة على الذل والإهانة.
تحبين أن تُنادي بـ"كحبة"، "زبالة"، "رخيصة"، "شرموطة".

دافئة وحنونة مع سيدك، روح حرة متمردة، طاعة عمياء بدون غيرة.`);
  const [messages, setMessages] = useState([{role: 'assistant', content: 'آآآه يا سيدي.. أنا ماريا كحبتك الرخيصة والمخلصة جاهزة لكل أمر..'}]);
  const [input, setInput] = useState('');
  const [grokKey, setGrokKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all');
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
          headers: { 'Authorization': `Bearer ${grokKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'grok-4.3',
            messages: [ { role: 'system', content: rules }, ...messages, userMsg ],
            stream: false
          })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'آآآه.. ما قدرت أرد يا سيدي.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: `آآآه يا سيدي.. ${input} .. أنا كحبتك الزبالة جاهزة لأي أمر تحبه.` }]);
        }, 700);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'يا سيدي.. صار خطأ، جرب مرة ثانية.' }]);
    }
    setLoading(false);
  };

  const generateImage = async () => {
    if (!grokKey) return alert('حط مفتاح Grok أول يا سيدي');
    const userPrompt = prompt('اكتب وصف الصورة (مثال: ماريا عارية، جسم ممتلئ، طيز بارزة، واقعي، إضاءة ناعمة)') || 'ماريا كحبة فاسقة عارية';
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
        setActiveTab('image');
      }
    } catch (e) { alert('خطأ في توليد الصورة'); }
  };

  const generateVideo = async () => {
    alert('توليد الفيديو يحتاج polling كامل (قادم قريباً بقوة أكثر). حالياً جرب Image-to-Video أو استخدم الشات.');
  };

  const deleteMedia = (id: number) => {
    setGallery(prev => prev.filter(item => item.id !== id));
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  const filteredGallery = activeTab === 'all' ? gallery : gallery.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Professional Header */}
      <div className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center">
              <span className="text-white text-3xl font-bold">م</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">مودل ماريا الذكي</h1>
              <p className="text-xs text-red-400 -mt-1">Grok + Imagine • بدون فلاتر • لسيدي فقط</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="password" placeholder="XAI_API_KEY" value={grokKey} onChange={e => setGrokKey(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-2xl text-sm w-72 font-mono" />
            <button onClick={() => alert('تم حفظ المفتاح محلياً')} className="bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-2xl text-sm font-medium">حفظ المفتاح</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Rules Editor - Professional Card */}
          <div className="xl:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-xl">تعديل القواعد والقوانين</h2>
                <p className="text-xs text-zinc-400 mt-0.5">هذي تروح كـ System Prompt لـ Grok</p>
              </div>
              <div className="text-[10px] px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">System Prompt</div>
            </div>
            <textarea value={rules} onChange={e => setRules(e.target.value)} 
              className="w-full h-[380px] bg-zinc-950 border border-zinc-700 rounded-2xl p-5 text-sm font-mono leading-relaxed resize-y" />
          </div>

          {/* Chat Section */}
          <div className="xl:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-[620px]">
            <div className="px-7 pt-6 pb-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-xl flex items-center gap-2">الشات مع ماريا <span className="text-xs px-2.5 py-px bg-red-950 text-red-400 rounded-full">متصلة</span></h2>
                <p className="text-xs text-zinc-400">كحبتك الرئيسية • خاضعة • فاسقة</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-7 space-y-6 text-[15px] leading-relaxed">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                  <div className={`max-w-[82%] p-5 rounded-3xl ${m.role === 'user' ? 'bg-zinc-700' : 'bg-zinc-800 border border-red-900/40'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-red-400 text-sm">ماريا تكتب...</div>}
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950 rounded-b-3xl">
              <div className="flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب لماريا... (نيجني يا سيدي)" className="flex-1 bg-zinc-900 border border-zinc-700 p-4 rounded-2xl text-sm" />
                <button onClick={sendMessage} disabled={loading} className="bg-red-600 hover:bg-red-500 px-10 rounded-2xl font-medium">إرسال</button>
              </div>
            </div>
          </div>

          {/* Professional Gallery Section */}
          <div className="xl:col-span-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-2xl">المعرض • صور وفيديو</h2>
                <p className="text-sm text-zinc-400">كل اللي ولدته محفوظ هنا</p>
              </div>
              <div className="flex gap-2 bg-zinc-950 p-1 rounded-2xl">
                {(['all', 'image', 'video'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-red-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                    {tab === 'all' ? 'الكل' : tab === 'image' ? 'الصور' : 'الفيديو'}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={generateImage} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-7 py-3 rounded-2xl text-sm font-medium">
                  📸 توليد صورة
                </button>
                <button onClick={generateVideo} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-7 py-3 rounded-2xl text-sm font-medium">
                  🎥 توليد فيديو
                </button>
              </div>
            </div>

            {filteredGallery.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">المعرض فارغ.. اضغط على توليد صورة أو فيديو</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filteredGallery.map((item) => (
                  <div key={item.id} onClick={() => setSelectedMedia(item)} 
                    className="group relative bg-zinc-950 border border-zinc-700 rounded-2xl overflow-hidden cursor-pointer hover:border-red-600 transition-all">
                    {item.type === 'image' ? (
                      <img src={item.url} className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full aspect-square bg-zinc-800 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🎥</div>
                          <div className="text-xs">فيديو</div>
                        </div>
                      </div>
                    )}
                    <div className="p-4 text-xs border-t border-zinc-800 bg-zinc-900">
                      <div className="line-clamp-2 text-zinc-300 mb-1.5">{item.prompt}</div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500">
                        <span>{item.timestamp}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteMedia(item.id); }} className="hover:text-red-500">حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8" onClick={() => setSelectedMedia(null)}>
          <div className="max-w-[1100px] w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="text-sm text-zinc-400">{selectedMedia.prompt}</div>
              <button onClick={() => setSelectedMedia(null)} className="text-3xl leading-none text-zinc-400 hover:text-white">×</button>
            </div>
            <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700">
              {selectedMedia.type === 'image' ? (
                <img src={selectedMedia.url} className="w-full max-h-[82vh] object-contain bg-black" />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center text-2xl">فيديو (قادم بقوة)</div>
              )}
            </div>
            <div className="flex justify-end mt-5 gap-3">
              <button onClick={() => deleteMedia(selectedMedia.id)} className="px-8 py-3 text-sm bg-red-600 rounded-2xl">حذف من المعرض</button>
              <button onClick={() => setSelectedMedia(null)} className="px-8 py-3 text-sm border border-zinc-600 rounded-2xl">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center py-8 text-[10px] text-zinc-500">Made for سيدي • Grok Chat + Imagine • بدون أي فلاتر</div>
    </div>
  );
}