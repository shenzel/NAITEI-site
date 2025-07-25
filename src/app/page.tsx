"use client";

import { useState, useEffect } from 'react';
import { templates, TemplateKey } from '../../lib/templates'; // パスはご自身の環境に合わせてください
import JSZip from 'jszip'; // JSZipをインポート

export default function Home() {
  // ユーザーの入力値を管理するState
  const [inputs, setInputs] = useState({
    yourName: '山田 太郎',
    catchphrase: '継続的な学習意欲で、新しい価値を創造します。',
    strengthAndWeakness: '長所は目標達成に向けた粘り強さです。短所は時に慎重になりすぎることですが、リスク管理能力として活かせると考えています。',
    mostDevotedThing: '大学時代のハッカソンチームでの経験です。リーダーとしてチームをまとめ、3日間でアプリを開発・発表し、準優勝を果たしました。',
    companyAttraction: '貴社の「テクノロジーで人々の生活を豊かにする」という理念に深く共感しています。特に、〇〇というプロダクトが解決している課題に感銘を受けました。',
  });
  
  // プレビュー用のURLを管理するState
  const [previewUrl, setPreviewUrl] = useState<string>('');
  // プレビューの表示/非表示を管理するState
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  // 選択されているテンプレートのIDを管理するState
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('stylish');

  // 入力内容やテンプレートの変更を監視してプレビューを更新する
  useEffect(() => {
    // 選択されたテンプレートのコンテンツを生成
    const { html, css, js } = templates[selectedTemplate].generate(inputs);

    // --- プレビュー用に一つのHTMLに結合 ---
    // scriptとstyleタグを動的に埋め込む
    const previewHtml = html
      .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
      .replace('<script src="script.js"></script>', `<script>${js}</script>`);

    const blob = new Blob([previewHtml], { type: 'text/html' });

    // 以前のURLがあれば、メモリリークを防ぐために解放する
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Blobから新しいURLを生成し、Stateを更新
    const newUrl = URL.createObjectURL(blob);
    setPreviewUrl(newUrl);

    // コンポーネントがアンマウントされるときに最終的なURLを解放する
    return () => {
      URL.revokeObjectURL(newUrl);
    };
  // `inputs` または `selectedTemplate` が変更されたときに再実行
  }, [inputs, selectedTemplate]); 


  // テキスト入力が変更されたときの処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // ZIPダウンロード処理
  const handleDownload = async () => {
    const zip = new JSZip();
    
    // 選択されたテンプレートのコンテンツを取得
    const { html, css, js } = templates[selectedTemplate].generate(inputs);

    // ZIPにファイルを追加
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);
    
    // ZIPファイルをBlobとして生成
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // ダウンロードリンクを作成してクリック
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-site.zip'; // ファイル名を.zipに変更
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 画面の描画
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 左側: 入力フォーム */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
        <div style={{ maxWidth: isPreviewVisible ? '600px' : '800px', margin: '0 auto', transition: 'max-width 0.3s' }}>
          <h1>ポートフォリオジェネレーター 🚀</h1>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setIsPreviewVisible(!isPreviewVisible)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              {isPreviewVisible ? 'プレビューを隠す' : 'プレビューを表示'}
            </button>
            
            <div>
              <label htmlFor="template-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>テンプレート:</label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
                style={{ padding: '8px' }}
              >
                {Object.keys(templates).map((key) => (
                  <option key={key} value={key}>
                    {templates[key as TemplateKey].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p style={{ marginTop: '0', color: '#666', paddingBottom: '20px' }}>左で編集すると、右のプレビューがリアルタイムで更新されます。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>氏名</label>
              <input type="text" name="yourName" value={inputs.yourName} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>キャッチフレーズ</label>
              <input type="text" name="catchphrase" value={inputs.catchphrase} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '10px 0'}} />
            <h2 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '-10px'}}>よくある質問への回答</h2>

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
              style={{ padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}
            >
              ZIPファイルで一括ダウンロード 📁
            </button>
          </div>
        </div>
      </div>
      
      {/* 右側: プレビュー */}
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
    </div>
  );
}