import { useState, useEffect } from 'react';
import { templates, TemplateKey } from '../../lib/templates';
import { Inputs } from '@/types/portfolio';

export const usePreviewGenerator = (
  inputs: Inputs,
  selectedTemplate: TemplateKey,
  imageFile: File | null,
  imageUrl: string | null,
  cssContents: Record<string, string>
) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const css = cssContents[selectedTemplate] || '';
    if (!css) return;

    const { html, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);
    let previewHtml = html
      .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
      .replace('<script src="script.js"></script>', `<script>${js}</script>`);

    const origin = window.location.origin;
    if (imageFile && imageUrl) {
      previewHtml = previewHtml.replace(`src="img/${imageFile.name}"`, `src="${imageUrl}"`);
    }
    previewHtml = previewHtml.replace(/src="img\//g, `src="${origin}/img/`);

    const blob = new Blob([previewHtml], { type: 'text/html' });
    
    // It's important to revoke the previous URL to avoid memory leaks.
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(blob));

    // Cleanup function to revoke the URL when the component unmounts or dependencies change.
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, selectedTemplate, imageFile, imageUrl, cssContents]);

  return { previewUrl };
};
