"use client";
import {useSession} from "next-auth/react"

import { useState, useEffect, ChangeEvent } from 'react';
import { templates, TemplateKey } from '../../lib/templates';
import JSZip from 'jszip';

import LogoutButton from "@/components/LogoutButton"
import { Question } from '@/components/QuestionsManager';
import { Inputs } from '@/types/portfolio';
import RequireLogin from "@/components/RequireLogin";
import ControlPanel from "@/components/ControlPanel";
import Preview from "@/components/Preview";

export default function Home() {

  const { data: session, status} = useSession()

  // ユーザーの入力値を管理するState
  const [inputs, setInputs] = useState<Inputs>({
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
  
  // 読み込んだCSSの中身を保持するState
  const [cssContents, setCssContents] = useState<Record<string, string>>({});
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('first');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
   if (status === 'authenticated' && session) {
    const fetchProfile = async () => {
      try {
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
        } else if (res.status === 404) {
          // データがまだ保存されていない場合は何もしない
          console.log('No profile data found for this user.');
        } else {
          // その他のサーバーエラー
          console.error('Failed to fetch profile data.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }
}, [status, session]); // statusかsessionが変わった時に実行


  useEffect(() => {
    const fetchAllCss = async () => {
      const allCss: Record<string, string> = {};
      for (const key in templates) {
        const path = templates[key as TemplateKey].cssPath;
        try {
          const response = await fetch(path);
          if (response.ok) {
            allCss[key] = await response.text();
          }
        } catch (error) {
          console.error(`Failed to fetch css for ${key}:`, error);
        }
      }
      setCssContents(allCss);
    };
    fetchAllCss();
  }, []); // このuseEffectは最初に1回だけ実行する

  // プレビュー更新用のuseEffect
  useEffect(() => {
    // 選択されているテンプレートのCSSをStateから取得
    const css = cssContents[selectedTemplate] || '';

    // CSSがまだ読み込めていない場合は何もしない
    if (!css) return;

    const { html, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);
    let previewHtml = html
      .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
      .replace('<script src="script.js"></script>', `<script>${js}</script>`);
    
    // 画像パスの置換処理
    const origin = window.location.origin;
    if (imageFile && imageUrl) {
      previewHtml = previewHtml.replace(`src="img/${imageFile.name}"`, `src="${imageUrl}"`);
    }
    previewHtml = previewHtml.replace(/src="img\//g, `src="${origin}/img/`);

    const blob = new Blob([previewHtml], { type: 'text/html' });
    if (previewUrl) { URL.revokeObjectURL(previewUrl); }
    setPreviewUrl(URL.createObjectURL(blob));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, selectedTemplate, imageFile, imageUrl, cssContents]);

  const handleSave = async () => {
  // ログインしていない場合は処理を中断
  if (!session) {
    alert('保存するにはログインが必要です。');
    return;
  }

  const dataToSave = {
    content: inputs,
    templateId: selectedTemplate,
  };

  try {
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
  } catch (error) {
    console.error('Save failed:', error);
    alert('通信エラーにより保存に失敗しました。');
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

  const handleDownload = async () => {
    const zip = new JSZip();
    const css = cssContents[selectedTemplate] || '';

    if (!css) {
      alert('CSSがまだ読み込めていません。少し待ってから再度お試しください。');
      return;
    }

    const { html, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);
    
    // ユーザーがアップロードした画像を追加
    if (imageFile) {
      const imgFolder = zip.folder('img');
      if (imgFolder) { imgFolder.file(imageFile.name, imageFile); }
    }

    // 静的画像を追加
    const staticImagePaths = ['logo.png', 'english-icon.png']; 
    const imgFolder = zip.folder('img');
    if(imgFolder){
      for (const path of staticImagePaths) {
        try {
          const response = await fetch(`/img/${path}`);
          if (response.ok) {
            const blob = await response.blob();
            imgFolder.file(path, blob);
          }
        } catch (error) {
          console.error(`Error fetching static image ${path}:`, error);
        }
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


    if (status === "loading") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <RequireLogin>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <ControlPanel
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          imageUrl={imageUrl}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          inputs={inputs}
          setInputs={setInputs}
          handleChange={handleChange}
          handleSave={handleSave}
          handleDownload={handleDownload}
        />

        <LogoutButton />
        {isPreviewVisible && (
          <Preview previewUrl={previewUrl} />
        )}
      </div>
    </RequireLogin>
  );
}