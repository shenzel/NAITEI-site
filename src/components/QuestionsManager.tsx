'use client'

import React, { useState } from 'react';
import ProofreadingButton from './ProofreadingButton';

// 質問の型定義
export interface Question {
  id: string;
  question: string;
  answer: string;
}

// QuestionsManagerコンポーネントのProps型定義
interface QuestionsManagerProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  selfPR?: string; // 自己PRテキスト（質問生成用）
}

// 質問を動的に管理するコンポーネント
const QuestionsManager: React.FC<QuestionsManagerProps> = ({ questions, onChange, selfPR }) => {
  
  // 質問生成のローディング状態
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 新しい質問を追加する関数
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(), // 簡易的なIDとして現在時刻を使用
      question: '',
      answer: ''
    };
    onChange([...questions, newQuestion]);
  };

  // AI質問生成API呼び出し関数（10秒タイムアウト付き）
  const generateQuestionsFromAPI = async () => {
    if (!selfPR || !selfPR.trim()) {
      alert('自己PRが入力されていません。まず自己PRを入力してください。');
      return;
    }

    setIsGenerating(true);
    
    // 10秒タイムアウトの設定
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 10秒
    
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selfPR }),
        signal: controller.signal, // タイムアウト用のシグナル
      });

      // タイムアウトをクリア
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedQuestions: Question[] = data.questions.map((q: string, index: number) => ({
        id: `generated_${Date.now()}_${index}`,
        question: q,
        answer: ''
      }));

      // 生成された質問を既存の質問に追加
      onChange([...questions, ...generatedQuestions]);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('質問生成エラー:', error);
      
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      
      // エラーの種類に応じてメッセージを変更
      if (error instanceof Error && error.name === 'AbortError') {
        alert('質問生成処理がタイムアウトしました（10秒）。しばらく待ってから再試行してください。');
      } else if (errorMessage.includes('タイムアウト')) {
        alert('質問生成処理がタイムアウトしました（10秒）。');
      } else {
        alert(`質問生成に失敗しました: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // 質問を削除する関数
  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    onChange(updatedQuestions);
  };

  // 質問または回答を更新する関数
  const updateQuestion = (id: string, field: 'question' | 'answer', value: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    );
    onChange(updatedQuestions);
  };

  // 質問全体のテキストを校正した場合の処理
  const handleProofreadComplete = (id: string, field: 'question' | 'answer', correctedText: string) => {
    updateQuestion(id, field, correctedText);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex justify-content-between align-items-center">
        <label className="fw-bold">質問（設問）</label>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={generateQuestionsFromAPI}
            disabled={isGenerating || !selfPR?.trim()}
            className={`btn btn-info btn-sm ${isGenerating || !selfPR?.trim() ? 'disabled' : ''}`}
          >
            {isGenerating ? (
              <>
                <i className="bi bi-robot me-1"></i>
                生成中... (最大10秒)
              </>
            ) : (
              <>
                <i className="bi bi-robot me-1"></i>
                AI質問生成
              </>
            )}
          </button>
          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-success btn-sm"
          >
            <i className="bi bi-plus-lg me-1"></i>
            手動追加
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="border border-2 border-secondary border-opacity-50 rounded p-4 text-center text-muted">
          質問がありません。<br />
          「AI質問生成」で自己PRから質問を自動生成するか、「手動追加」で質問を追加してください。
        </div>
      ) : (
        questions.map((question, index) => (
          <div key={question.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0 text-dark">質問 {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash me-1"></i>
                  削除
                </button>
              </div>

              {/* 質問入力フィールド */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">質問内容</label>
                  <ProofreadingButton
                    text={question.question}
                    onProofreadComplete={(correctedText) => {
                      handleProofreadComplete(question.id, 'question', correctedText);
                    }}
                    className="btn-sm"
                    buttonText="質問を校正"
                  />
                </div>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  placeholder="質問を入力してください（例: チームワークで重視することは何ですか？）"
                  rows={2}
                  className="form-control"
                />
              </div>

              {/* 回答入力フィールド */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">回答内容</label>
                  <ProofreadingButton
                    text={question.answer}
                    onProofreadComplete={(correctedText) => {
                      handleProofreadComplete(question.id, 'answer', correctedText);
                    }}
                    className="btn-sm"
                    buttonText="回答を校正"
                  />
                </div>
                <textarea
                  value={question.answer}
                  onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
                  placeholder="回答を入力してください"
                  rows={3}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionsManager;
