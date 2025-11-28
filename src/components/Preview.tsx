"use client";

import React from 'react';
import { templates, TemplateKey } from '@/lib/templates';
import { Inputs } from '@/types/portfolio';

interface PreviewProps {
  inputs: Inputs;
  imageUrl: string | null;
  selectedTemplate: TemplateKey;
  cssContents: Record<string, string>;
}

const Preview: React.FC<PreviewProps> = React.memo(({
  inputs,
  imageUrl,
  selectedTemplate,
  cssContents,
}) => {
  const TemplateComponent = templates[selectedTemplate].component;
  const css = cssContents[selectedTemplate] || '';

  if (!TemplateComponent || !css) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px', width: '100%' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
      <TemplateComponent inputs={inputs} imageUrl={imageUrl} css={css} />
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;