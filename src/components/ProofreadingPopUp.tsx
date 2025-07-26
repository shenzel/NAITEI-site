import React from 'react';

// 文章校正ポップアップコンポーネントのプロパティ型定義
type ProofreadingPopUpProps = {
    isOpen: boolean;           // モーダルの表示状態
    originalText: string;      // 元の文章
    correctedText: string;     // 校正後の文章
    onConfirm: () => void;     // 「はい（変更する）」ボタンのコールバック
    onCancel: () => void;      // 「いいえ（変更しない）」ボタンのコールバック
    onClose: () => void;       // モーダルを閉じるコールバック
};

// 文章校正の結果を表示するモーダルポップアップコンポーネント
const ProofreadingPopUp = ({
    isOpen,
    originalText,
    correctedText,
    onConfirm,
    onCancel,
    onClose,
}: ProofreadingPopUpProps) => {
    // モーダルが非表示の場合は何も描画しない
    if (!isOpen) return null;

  return (
    <>
      {/* Bootstrap Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>
      
      {/* Bootstrap Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ zIndex: 1050 }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold text-dark">
                <i className="bi bi-check2-circle me-2 text-primary"></i>
                文章校正の確認
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            
            {/* Modal Body */}
            <div className="modal-body p-4">
              <div className="row g-4">
                {/* 変更前 */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="fw-bold text-muted text-uppercase small mb-2">
                      <i className="bi bi-file-text me-1"></i>
                      変更前
                    </h6>
                    <div className="card">
                      <div className="card-body bg-light border-start border-4 border-secondary">
                        <p className="card-text text-dark mb-0" style={{ 
                          minHeight: '120px',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}>
                          {originalText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 変更後 */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary text-uppercase small mb-2">
                      <i className="bi bi-file-earmark-check me-1"></i>
                      変更後
                    </h6>
                    <div className="card">
                      <div className="card-body bg-primary bg-opacity-10 border-start border-4 border-primary">
                        <p className="card-text text-primary mb-0" style={{ 
                          minHeight: '120px',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}>
                          {correctedText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer bg-light d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={onCancel}
              >
                <i className="bi bi-x-circle me-2"></i>
                いいえ（変更しない）
              </button>
              <button 
                type="button" 
                className="btn btn-primary d-flex align-items-center"
                onClick={onConfirm}
              >
                <i className="bi bi-check-circle me-2"></i>
                はい（変更する）
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProofreadingPopUp;
