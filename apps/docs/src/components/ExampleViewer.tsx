import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

type Tab = 'preview' | 'code';

interface ExampleViewerProps {
  children: React.ReactNode;
  code: string;
  title: string;
  description: string;
}

export function ExampleViewer({ children, code, title, description }: ExampleViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0f172a' }}>
          {title}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          {description}
        </p>
      </div>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 4px',
            background: '#fafbfc',
          }}
        >
          <TabButton
            active={activeTab === 'preview'}
            onClick={() => setActiveTab('preview')}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          >
            Preview
          </TabButton>
          <TabButton
            active={activeTab === 'code'}
            onClick={() => setActiveTab('code')}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            }
          >
            Code
          </TabButton>
        </div>

        {/* Content */}
        <div style={{ minHeight: 400 }}>
          {activeTab === 'preview' ? (
            <div style={{ padding: 16 }}>{children}</div>
          ) : (
            <CodeBlock code={code} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 14px',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#3b82f6' : '#64748b',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? '#3b82f6' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 150ms',
        marginBottom: -1,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
