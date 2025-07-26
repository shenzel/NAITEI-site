// Next.jsのClient Componentとして動作させるためのディレクティブ
'use client'

import React, { useState } from 'react';
import ProofreadingPopUp from './ProofreadingPopUp';

// ProofreadingButtonコンポーネントのProps型定義
interface ProofreadingButtonProps {
  text: string; // 校正対象のテキスト
  onProofreadComplete?: (correctedText: string) => void; // 校正完了時のコールバック関数（オプション）
  className?: string; // 追加のCSSクラス（オプション）
  disabled?: boolean; // ボタンの無効化フラグ（オプション）
  buttonText?: string; // ボタンに表示するテキスト（オプション）
}

// ProofreadingButtonコンポーネントの定義
const ProofreadingButton: React.FC<ProofreadingButtonProps> = ({
  text,
  onProofreadComplete,
  className = '', // デフォルト値: 空文字
  disabled = false, // デフォルト値: false（有効）
  buttonText = '校正' // デフォルト値: '校正'
}) => {
  // ポップアップの表示状態を管理するstate
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(false);
  // 校正済みテキストを保存するstate
  const [correctedText, setCorrectedText] = useState('');
  // 元のテキストを保存するstate
  const [originalText, setOriginalText] = useState('');

  // ボタンクリック時の処理を行う非同期関数
  const handleButtonClick = async () => {
    // テキストが空の場合はアラートを表示して処理を中断
    if (!text.trim()) {
      alert('校正するテキストを入力してください。');
      return;
    }

    // ローディング状態を開始し、元のテキストを保存
    setIsLoading(true);
    setOriginalText(text);

    try {
      // 校正APIに POST リクエストを送信
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      // レスポンスが正常でない場合はエラーをスロー
      if (!response.ok) {
        throw new Error('校正に失敗しました');
      }

      // レスポンスからJSONデータを取得
      const data = await response.json();
      // 校正済みテキストをstateに保存し、ポップアップを表示
      setCorrectedText(data.correctedText);
      setIsPopupOpen(true);
    } catch (error) {
      // エラーが発生した場合はコンソールログとアラートで通知
      console.error('校正エラー:', error);
      alert('校正中にエラーが発生しました。もう一度お試しください。');
    } finally {
      // 処理完了後、必ずローディング状態を解除
      setIsLoading(false);
    }
  };

  // ポップアップで「確定」ボタンがクリックされた時の処理
  const handleConfirm = () => {
    // 親コンポーネントにコールバック関数が渡されている場合は実行
    if (onProofreadComplete) {
      onProofreadComplete(correctedText);
    }
    // ポップアップを閉じる
    setIsPopupOpen(false);
  };

  // ポップアップで「キャンセル」ボタンがクリックされた時の処理
  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  // ポップアップの「×」ボタンがクリックされた時の処理
  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* 校正ボタン */}
      <button
        onClick={handleButtonClick}
        // ボタンの無効化条件: disabled props、ローディング中、テキストが空
        disabled={disabled || isLoading || !text.trim()}
        // Bootstrap CSSクラスと追加のclassNameを結合
        className={`btn btn-primary d-flex align-items-center ${className}`}
        type="button"
      >
        {/* ローディング中は spinner を表示、通常時はアイコンとテキストを表示 */}
        {isLoading ? (
          <>
            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
            校正中...
          </>
        ) : (
          <>
            <i className="bi bi-check2-circle me-2"></i>
            {buttonText}
          </>
        )}
      </button>

      {/* 校正結果を表示するポップアップコンポーネント */}
      <ProofreadingPopUp
        isOpen={isPopupOpen}
        originalText={originalText}
        correctedText={correctedText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    </>
  );
};

// コンポーネントをエクスポート
export default ProofreadingButton;
