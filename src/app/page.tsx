'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ProcessedImage {
  original: string;
  processed: string | null;
  fileName: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 处理文件上传
  const handleFile = useCallback(async (file: File) => {
    // 验证文件类型
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      setError('只支持 PNG、JPG、JPEG 格式的图片');
      return;
    }

    // 验证文件大小 (12MB)
    if (file.size > 12 * 1024 * 1024) {
      setError('文件大小不能超过 12MB');
      return;
    }

    setError(null);
    
    // 读取文件预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage({
        original: e.target?.result as string,
        processed: null,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image_file', file);

      // 调用本地 API
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '处理失败');
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      
      setImage(prev => prev ? { ...prev, processed: processedUrl } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // 下载处理后的图片
  const handleDownload = () => {
    if (image?.processed) {
      const link = document.createElement('a');
      link.href = image.processed;
      link.download = `removed-bg-${image.fileName}`;
      link.click();
    }
  };

  // 重置
  const handleReset = () => {
    setImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🖼️ Background Remover
          </h1>
          <p className="text-lg text-white/80">
            3 秒去除图片背景，无需设计技能
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6 text-red-100">
            {error}
          </div>
        )}

        {/* Main Content */}
        {!image ? (
          /* Upload Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-300
              ${isDragging 
                ? 'border-green-400 bg-green-400/20 scale-105' 
                : 'border-white/50 bg-white/5 hover:bg-white/10 hover:border-white/70'
              }
            `}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="pointer-events-none">
              <svg 
                className="w-20 h-20 mx-auto mb-6 text-white/70" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              
              <p className="text-xl text-white font-medium mb-2">
                拖拽图片到此处，或点击上传
              </p>
              <p className="text-white/60">
                支持 PNG, JPG, JPEG 格式（最大 12MB）
              </p>
            </div>
          </div>
        ) : (
          /* Result Area */
          <div className="space-y-6">
            {/* Image Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-medium mb-3 text-center">原图</h3>
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={image.original}
                    alt="Original"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-medium mb-3 text-center">
                  {isProcessing ? '处理中...' : '去背景后'}
                </h3>
                <div 
                  className="relative aspect-square rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundColor: '#fff'
                  }}
                >
                  {isProcessing ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : image.processed ? (
                    <Image
                      src={image.processed}
                      alt="Processed"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      等待处理
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleDownload}
                disabled={!image.processed || isProcessing}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载结果
              </button>
              
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="px-8 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                处理新图片
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-white/50 text-sm">
          <p>Powered by Remove.bg API • 图片仅在本地处理，保护隐私</p>
        </footer>
      </div>
    </div>
  );
}
