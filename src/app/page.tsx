"use client";
import {useSession, signIn, signOut} from "next-auth/react"

import { useState, useEffect, ChangeEvent } from 'react';
import { templates, TemplateKey } from '../../lib/templates';
import JSZip from 'jszip';
import Link from "next/link";
import ProofreadingButton from '../components/ProofreadingButton';
import QuestionsManager, { Question } from '../components/QuestionsManager';

export default function Home() {

  const { data: session, status} = useSession()

  // ユーザーの入力値を管理するState
  const [inputs, setInputs] = useState({
    yourName: '山田 太郎',
    hometown: '東京都',
    university: '東京大学', 
    faculty: '理科一類',
    dream: 'データサイエンティスト',
    hobby: ['競技プログラミング', '釣り'],
    skill: ['Python', 'HTML', 'CSS', 'JavaScript'],
    self_pr: '投資プログラムを開発し、コンテストで入賞したことです。\n開発期間は6か月、Pythonを使って個人で開発しました。',
    questions: [
      {
        id: '1',
        question: 'チームワークで重視することは何ですか？',
        answer: '相互尊重とオープンなコミュニケーションを重視します。チームメンバーそれぞれの意見を聞き、建設的な議論を通じて最適な解決策を見つけることが大切だと考えています。'
      },
    ] as Question[]
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('stylish');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(()=> {
    if (status === "authenticated"){
      const fetchProfile = async () => {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          //取得したデータでstateを更新
          const content = data.content;
          
          // 古い形式（string）から新しい形式（Question[]）への変換
          if (typeof content.questions === 'string') {
            // 古い形式の文字列を解析して配列に変換
            const questionsText = content.questions;
            const questions: Question[] = [];
            
            if (questionsText && questionsText.trim()) {
              // Q1/A1, Q2/A2 パターンで分割
              const lines = questionsText.split('\n\n');
              let currentQuestion: Partial<Question> = {};
              
              lines.forEach((line: string, index: number) => {
                if (line.startsWith('Q')) {
                  currentQuestion = {
                    id: (index + 1).toString(),
                    question: line.replace(/^Q\d+\.\s*/, ''),
                    answer: ''
                  };
                } else if (line.startsWith('A') && currentQuestion.id) {
                  currentQuestion.answer = line.replace(/^A\d+\.\s*/, '');
                  questions.push(currentQuestion as Question);
                  currentQuestion = {};
                }
              });
            }
            
            content.questions = questions;
          }
          
          setInputs(content);
          setSelectedTemplate(data.templateId);
          //todo 画像を復元できるようにする
        }
      };
      fetchProfile();
    }
  },[status]); 

useEffect(() => {
  const { html, css, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);

  let previewHtml = html
    .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
    .replace('<script src="script.js"></script>', `<script>${js}</script>`);

  // ▼▼▼ ここからが修正部分 ▼▼▼
  // 現在のサイトのオリジン（http://localhost:3000 など）を取得
  const origin = window.location.origin;

  // 1. ユーザーがアップロードした画像のパスを、プレビュー用の一時URLに置換
  if (imageFile && imageUrl) {
    previewHtml = previewHtml.replace(`src="img/${imageFile.name}"`, `src="${imageUrl}"`);
  }

  // 2. テンプレート内の静的画像（ロゴなど）のパスを、完全なURLに置換
  //    "img/..." を "http://localhost:3000/img/..." のように書き換える
  previewHtml = previewHtml.replace(/src="img\//g, `src="${origin}/img/`);
  // ▲▲▲ ここまで ▲▲▲

  const blob = new Blob([previewHtml], { type: 'text/html' });
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  setPreviewUrl(URL.createObjectURL(blob));
}, [inputs, selectedTemplate, imageFile, imageUrl]);


  // ▼▼▼ ここに handleSave 関数を移動させる ▼▼▼
  const handleSave = async () => {
    const dataToSave = {
      content: inputs,
      templateId: selectedTemplate,
    };

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave),
    });

    if (res.ok) {
      alert('保存しました！');
    } else {
      alert('保存に失敗しました。');
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageUrl) { URL.revokeObjectURL(imageUrl); }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    if (imageUrl) { URL.revokeObjectURL(imageUrl); }
    setImageFile(null);
    setImageUrl(null);
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
    if (fileInput) { fileInput.value = ''; }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleHobbyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputs(prev => ({ ...prev, hobby: value.split(',').map(item => item.trim()) }));
  };

  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputs(prev => ({ ...prev, skill: value.split(',').map(item => item.trim()) }));
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    
    // 1. HTML, CSS, JSを生成してZIPに追加 
    const { html, css, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);

    // 2. imgフォルダを取得または作成
    const imgFolder = zip.folder('img');
    if (!imgFolder) return; // 安全のためのチェック

    // 3. ユーザーがアップロードした画像を追加 (変更なし)
    if (imageFile) {
      imgFolder.file(imageFile.name, imageFile);
    }

    // ▼▼▼ ここからが追加部分 ▼▼▼
    // 4. publicフォルダにある静的画像を取得して追加
    const staticImagePaths = ['logo.png', 'english-icon.png']; // ZIPに含めたい画像リスト

    for (const path of staticImagePaths) {
      try {
        const response = await fetch(`/img/${path}`); // public/img/から画像を取得
        if (response.ok) {
          const blob = await response.blob(); // データをBlob形式に変換
          imgFolder.file(path, blob); // imgフォルダにファイルを追加
        } else {
          console.error(`Failed to fetch static image: ${path}`);
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
    }
    // ▲▲▲ ここまで ▲▲▲

    // 5. ZIPを生成してダウンロード (変更なし)
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


    if (status === "loading") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

 


  // ログインしていない場合の表示
  if (!session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>このアプリを利用するにはログインが必要です。</p>
        <button onClick={() => signIn("github")} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Sign in with GitHub
        </button>

        <button onClick={() => signIn("google")} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Sign in with Google
      </button>
      <hr />

      <h3>Emailとパスワードでログイン</h3>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        await signIn('credentials', { email, password, redirect: false });
      }}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Sign in</button>
      </form>
       <p style={{marginTop: '20px'}}><Link href="/register">アカウントをお持ちでないですか？ 新規登録</Link></p>
      </div>
    );
  }

  
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#fdfdfd', color: '#000000' }}>
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

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
            <label style={{fontWeight: 'bold'}}>プロフィール画像</label>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <img src={imageUrl} alt="選択した画像" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <button
                  onClick={handleImageDelete}
                  style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  画像を削除
                </button>
              </div>
            )}
          </div>

          <h2 style={{borderBottom: '1px solid #eee', paddingBottom: '10px'}}>プロフィール情報</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>氏名</label>
              <input type="text" name="yourName" value={inputs.yourName} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>出身地</label>
              <input type="text" name="hometown" value={inputs.hometown} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>大学</label>
              <input type="text" name="university" value={inputs.university} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>学部・学科</label>
              <input type="text" name="faculty" value={inputs.faculty} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>将来の夢</label>
              <input type="text" name="dream" value={inputs.dream} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>趣味 (カンマ区切りで入力)</label>
              <input type="text" name="hobby" value={inputs.hobby.join(', ')} onChange={handleHobbyChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>スキル (カンマ区切りで入力)</label>
              <input type="text" name="skill" value={inputs.skill.join(', ')} onChange={handleSkillChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{fontWeight: 'bold'}}>自己PR</label>
              <textarea name="self_pr" value={inputs.self_pr} onChange={handleChange} rows={8} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                <ProofreadingButton
                  text={inputs.self_pr}
                  onProofreadComplete={(correctedText) => {
                    setInputs(prev => ({
                      ...prev,
                      self_pr: correctedText
                    }));
                  }}
                  className="btn-sm"
                />
              </div>
            </div>
            <QuestionsManager
              questions={inputs.questions}
              onChange={(questions) => {
                setInputs(prev => ({
                  ...prev,
                  questions
                }));
              }}
              selfPR={inputs.self_pr}
            />
          </div>


          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={handleSave}
              style={{ flex: 1, padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              💾 内容を保存
            </button>
            <button
              onClick={handleDownload}
              style={{ padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', width: '100%' }}
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
              style={{ width: '100%', height: 'calc(100% - 50px)', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '8px' }}
            />
          )}
        </div>
      )}
    </div>
  );
}


 