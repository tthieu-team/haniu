'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface IframePreviewProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function IframePreview({ children, className, style }: IframePreviewProps) {
  const [iframeHead, setIframeHead] = useState<HTMLHeadElement | null>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    setIframeHead(doc.head);
    setIframeBody(doc.body);

    const copyStyles = () => {
      // Clear existing elements in head
      doc.head.innerHTML = '';
      
      // Inject <base> tag so relative links and images resolve against host domain
      const base = doc.createElement('base');
      base.href = window.location.origin + '/';
      doc.head.appendChild(base);

      // Copy all stylesheet links and style blocks from parent
      const sheets = Array.from(
        parent.document.querySelectorAll('link[rel="stylesheet"], style')
      );
      sheets.forEach((sheet) => {
        doc.head.appendChild(sheet.cloneNode(true));
      });
      
      // Copy class names to match parent body and documentElement theme
      doc.body.className = parent.document.body.className + ' bg-[#FAF5F2] antialiased overflow-x-hidden';
      doc.documentElement.className = parent.document.documentElement.className;

      // Force height 100% on both html and body of the iframe
      doc.documentElement.style.height = '100%';
      doc.body.style.height = '100%';
      doc.body.style.margin = '0';
    };

    // Initial style sync
    copyStyles();

    // Use MutationObserver to watch parent document head for style updates (ideal for HMR)
    const observer = new MutationObserver(() => {
      copyStyles();
    });

    observer.observe(parent.document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      style={{ border: 'none', width: '100%', height: '100%', ...style }}
      title="Preview Device Layout"
    >
      {iframeBody && iframeHead && ReactDOM.createPortal(children, iframeBody)}
    </iframe>
  );
}

