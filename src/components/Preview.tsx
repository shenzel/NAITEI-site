"use client";

interface PreviewProps {
  previewUrl: string | null;
}

const Preview: React.FC<PreviewProps> = ({ previewUrl }) => {
  return (
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
  );
};

export default Preview;
