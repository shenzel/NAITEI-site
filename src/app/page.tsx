"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { templates, TemplateKey } from '../../lib/templates';
import JSZip from 'jszip';

export default function Home() {
  // ユーザーの入力値を管理するState
  const [inputs, setInputs] = useState({
    yourName: '山田 太郎',
    catchphrase: '継続的な学習意欲で、新しい価値を創造します。',
    strengthAndWeakness: '長所は目標達成に向けた粘り強さです。短所は時に慎重になりすぎることですが、リスク管理能力として活かせると考えています。',
    mostDevotedThing: '大学時代のハッカソンチームでの経験です。リーダーとしてチームをまとめ、3日間でアプリを開発・発表し、準優勝を果たしました。',
    companyAttraction: '貴社の「テクノロジーで人々の生活を豊かにする」という理念に深く共感しています。特に、〇〇というプロダクトが解決している課題に感銘を受けました。',
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('stylish');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const { html, css, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);

    let previewHtml = html
      .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
      .replace('<script src="script.js"></script>', `<script>${js}</script>`);

    if (imageFile && imageUrl) {
      previewHtml = previewHtml.replace(`src="img/${imageFile.name}"`, `src="${imageUrl}"`);
    }

    const blob = new Blob([previewHtml], { type: 'text/html' });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    const newUrl = URL.createObjectURL(blob);
    setPreviewUrl(newUrl);

    // コンポーネントがアンマウントされるときに最終的なURLを解放する
    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [inputs, selectedTemplate, imageFile, imageUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

    // 画像を削除する関数
  const handleImageDelete = () => {
    // プレビュー用URLをメモリから解放
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    // Stateをリセット
    setImageFile(null);
    setImageUrl(null);

    // file inputの値をリセットして、同じファイルを再度選択できるようにする
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    
    const { html, css, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);

    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);

    if (imageFile) {
      const imgFolder = zip.folder('img');
      if (imgFolder) {
        imgFolder.file(imageFile.name, imageFile);
      }
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-site.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 画面の描画
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
        <div style={{ maxWidth: isPreviewVisible ? '600px' : '800px', margin: '0 auto', transition: 'max-width 0.3s' }}>
          <h1>ポートフォリオジェネレーター 🚀</h1>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
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
            <hr style={{border: 'none', borderTop: '1px solid #eee'}} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
            <label style={{fontWeight: 'bold'}}>プロフィール画像</label>
            <input
              id="image-upload-input" // リセット用にIDを追加
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={imageUrl} alt="選択した画像" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <button
                  onClick={handleImageDelete}
                  style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  画像を削除
                </button>
              </div>
            )}
          </div>
            <h2 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '-15px'}}>プロフィール情報</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>氏名</label>
              <input type="text" name="yourName" value={inputs.yourName} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>キャッチフレーズ</label>
              <input type="text" name="catchphrase" value={inputs.catchphrase} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
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
      
      {isPreviewVisible && (
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#e9ecef' }}>
           <h2 style={{ textAlign: 'center', color: '#495057' }}>プレビュー</h2>
           {previewUrl && (
            <iframe
              src={previewUrl}
              title="ポートフォリオプレビュー"
              style={{ width: '100%', height: '85%', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '8px' }}
            />
                          )}
        </div>
      )}
    </div>
  );
}