"use client";

import { useState, useEffect } from 'react';
import { templates, TemplateKey } from '../../lib/templates'; 

export default function Home() {
  const [inputs, setInputs] = useState({
    yourName: '山田 太郎',
    catchphrase: '継続的な学習意欲で、新しい価値を創造します。',
    strengthAndWeakness: '長所は目標達成に向けた粘り強さです。短所は時に慎重になりすぎることですが、リスク管理能力として活かせると考えています。',
    mostDevotedThing: '大学時代のハッカソンチームでの経験です。リーダーとしてチームをまとめ、3日間でアプリを開発・発表し、準優勝を果たしました。',
    companyAttraction: '貴社の「テクノロジーで人々の生活を豊かにする」という理念に深く共感しています。特に、〇〇というプロダクトが解決している課題に感銘を受けました。',
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');

  // --- ここからが追加部分 ---
  // プレビューの表示/非表示を管理するState (デフォルトは表示)
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  // --- ここまで ---
// --- ここからが追加部分 ---
  // 選択されているテンプレートのIDを管理するState
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('stylish');
  // --- ここまで ---

  // useEffectの依存配列に selectedTemplate を追加
  useEffect(() => {
    // 選択されたテンプレートの生成関数を取得
    const generateHTML = templates[selectedTemplate].generate;
    const htmlContent = generateHTML(inputs);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newUrl = URL.createObjectURL(blob);
    setPreviewUrl(newUrl);

    return () => {
      URL.revokeObjectURL(newUrl);
    };
  // `inputs` または `selectedTemplate` が変更されたときに再実行
  }, [inputs, selectedTemplate]); 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleDownload = () => {
    // ダウンロード時も選択されたテンプレートを使用
    const generateHTML = templates[selectedTemplate].generate;
    const htmlContent = generateHTML(inputs);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 左側: 入力フォーム */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
        <div style={{ maxWidth: isPreviewVisible ? '600px' : '800px', margin: '0 auto', transition: 'max-width 0.3s' }}>
          <h1>ポートフォリオジェネレーター 🚀</h1>

          {/* --- ここからが追加部分 --- */}
          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)} // クリックで表示状態を反転させる
            style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
          >
            {isPreviewVisible ? 'プレビューを隠す' : 'プレビューを表示'}
          </button>
          
            {/* テンプレート選択ドロップダウン */}
            <div>
              <label htmlFor="template-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>テンプレート:</label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
                style={{ padding: '8px' }}
              >
                {/* templatesオブジェクトから選択肢を動的に生成 */}
                {Object.keys(templates).map((key) => (
                  <option key={key} value={key}>
                    {templates[key as TemplateKey].name}
                  </option>
                ))}
              </select>
            </div>

          <p style={{ marginTop: '0', color: '#666', paddingBottom: '20px' }}>左で編集すると、右のプレビューがリアルタイムで更新されます。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* 氏名 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>氏名</label>
              <input type="text" name="yourName" value={inputs.yourName} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            {/* キャッチフレーズ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>キャッチフレーズ</label>
              <input type="text" name="catchphrase" value={inputs.catchphrase} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '10px 0'}} />
            <h2 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '-10px'}}>よくある質問への回答</h2>

            {/* 各質問 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>あなたの長所と短所を教えてください。</label>
              <textarea name="strengthAndWeakness" value={inputs.strengthAndWeakness} onChange={handleChange} rows={5} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>学生時代に最も打ち込んだことは何ですか？</label>
              <textarea name="mostDevotedThing" value={inputs.mostDevotedThing} onChange={handleChange} rows={5} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>当社のどのような点に魅力を感じましたか？</label>
              <textarea name="companyAttraction" value={inputs.companyAttraction} onChange={handleChange} rows={5} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <button
              onClick={handleDownload}
              style={{ padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}
            >
              ポートフォリオHTMLを生成してダウンロード
            </button>
          </div>
        </div>
      </div>
      
      {/* --- ここからが変更部分 --- */}
      {/* isPreviewVisibleがtrueの時だけ、プレビューエリアを描画する */}
      {isPreviewVisible && (
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#e9ecef' }}>
           <h2 style={{ textAlign: 'center', color: '#495057' }}>プレビュー</h2>
           <iframe
              src={previewUrl}
              title="ポートフォリオプレビュー"
              style={{ width: '100%', height: '85%', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '8px' }}
           />
        </div>
      )}
      {/* --- ここまで --- */}
    </div>
  );
}