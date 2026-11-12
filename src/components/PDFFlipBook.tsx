import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactPageFlip from 'react-pageflip';
import screenfull from 'screenfull';
import { Toaster, toast } from 'sonner';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// Set pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFFlipBookProps {
  pdfUrl: string;
  onBackToHome: () => void;
}

interface ViewerState {
  page: number;
  showShare: boolean;
  isFullscreen: boolean;
}

export default function PDFFlipBook({ pdfUrl, onBackToHome }: PDFFlipBookProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>({
    page: 1,
    showShare: false,
    isFullscreen: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set([1]));

  const containerRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<any>(null);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
      setViewerState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }));
    }
  }, []);

  const handleDocumentLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const goToPage = useCallback((page: number) => {
    if (!numPages) return;
    const validPage = Math.max(1, Math.min(numPages, page));
    setViewerState((prev) => ({ ...prev, page: validPage }));
    // Lazy load adjacent pages
    setRenderedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(validPage);
      if (validPage > 1) newSet.add(validPage - 1);
      if (validPage < numPages) newSet.add(validPage + 1);
      return newSet;
    });
    flipRef.current?.pageFlip?.turnToPage(validPage - 1);
  }, [numPages]);

  const goToPrevPage = useCallback(() => {
    setViewerState((prev) => {
      const newPage = Math.max(1, prev.page - 1);
      // Preload adjacent pages
      setRenderedPages((pages) => {
        const newSet = new Set(pages);
        newSet.add(newPage);
        if (newPage > 1) newSet.add(newPage - 1);
        if (newPage < (numPages || 1)) newSet.add(newPage + 1);
        return newSet;
      });
      return { ...prev, page: newPage };
    });
    flipRef.current?.pageFlip?.flipPrev();
  }, [numPages]);

  const goToNextPage = useCallback(() => {
    if (!numPages) return;
    setViewerState((prev) => {
      const newPage = Math.min(numPages, prev.page + 1);
      // Preload adjacent pages
      setRenderedPages((pages) => {
        const newSet = new Set(pages);
        newSet.add(newPage);
        if (newPage > 1) newSet.add(newPage - 1);
        if (newPage < numPages) newSet.add(newPage + 1);
        return newSet;
      });
      return { ...prev, page: newPage };
    });
    flipRef.current?.pageFlip?.flipNext();
  }, [numPages]);

  const shareUrl = useMemo(
    () => `${window.location.origin}${window.location.pathname}`,
    []
  );

  const toggleShare = useCallback(() => {
    setViewerState((prev) => ({ ...prev, showShare: !prev.showShare }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage();
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'Escape' && viewerState.isFullscreen) toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, viewerState.isFullscreen, toggleFullscreen]);

  if (error) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-serif font-bold text-slate-200 mb-2">PDF লোড ব্যর্থ</h2>
        <p className="text-sm text-slate-400 text-center mb-4 max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#790102] hover:bg-red-800 text-white font-medium px-6 py-2.5 rounded-md transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (isLoading || numPages === null) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-amber-300 animate-spin" />
        </div>
        <h2 className="text-xl font-serif font-bold text-slate-200 mb-2">পৃষ্ঠা লোড হচ্ছে</h2>
        <p className="text-sm text-slate-400 text-center max-w-sm">
          PDF পৃষ্ঠাগুলো প্রস্তুত করা হচ্ছে... অপেক্ষা করুন
        </p>
      </div>
    );
  }

  // Build array of page numbers
  const pageNumbers = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col">
      <Toaster />

      {/* Header */}
      <header className="bg-[#111827] border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToHome}
              className="bg-[#790102] hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded flex items-center transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              মূল পোর্টালে ফিরুন
            </button>
            <div className="border-l border-slate-700 pl-3">
              <span className="font-serif text-lg font-bold text-red-400">সंशপ্তক</span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">ই-ম্যাগাজিন অনলাইন সংস্করণ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={goToPrevPage}
              disabled={viewerState.page === 1}
              className={`px-2.5 py-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                viewerState.page === 1 ? 'text-slate-500 bg-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400 font-mono mr-1">{viewerState.page}</span>
            <span className="text-slate-500 text-[10px] mr-1">/</span>
            <span className="text-slate-400 font-mono">{numPages}</span>
            <button
              onClick={goToNextPage}
              disabled={viewerState.page === numPages}
              className={`px-2.5 py-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                viewerState.page === numPages ? 'text-slate-500 bg-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#790102] hover:bg-red-800 text-white text-xs font-medium"
              title="নতুন ট্যাবে খুলুন"
            >
              <FileText className="w-3 h-3 mr-1" />
              নতুন ট্যাব
            </a>
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 rounded bg-[#790102] hover:bg-red-800 text-white text-xs"
              title={viewerState.isFullscreen ? 'ফুলস্ক্রিন বন্ধ করুন' : 'ফুলস্ক্রিন'}
            >
              {viewerState.isFullscreen ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={toggleShare}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="শেয়ার করুন"
            >
              <BookOpen className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Flip Book Viewer */}
      <main className="flex-1 bg-[#0f172a] flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl h-[85vh] sm:h-[90vh] border border-slate-700 rounded-xl shadow-2xl overflow-hidden bg-white"
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={handleDocumentLoad}
            onLoadError={(err) => setError(err.message)}
            className="w-full h-full"
          >
            <ReactPageFlip
              ref={flipRef}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
              size="fixed"
              width={600}
              height={800}
              minWidth={600}
              maxWidth={600}
              minHeight={800}
              maxHeight={800}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={1}
              showCover={false}
              mobileScrollSupport={true}
              swipeDistance={30}
              clickEventForward={true}
              useMouseEvents={true}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pageNumbers.map((pageNum) => (
                <div
                  key={pageNum}
                  className="w-full h-full overflow-hidden bg-white"
                >
                  {renderedPages.has(pageNum) ? (
                    <Page
                      pageNumber={pageNum}
                      className="w-full h-full object-cover"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      rotate={0}
                    >
                      {(pageProps: any) => (
                        <div
                          className="w-full h-full"
                          style={{ width: pageProps.width, height: pageProps.height }}
                        >
                          {pageProps.render(
                            pageProps.transform,
                            pageProps.getRotation()
                          )}
                        </div>
                      )}
                    </Page>
                  ) : (
                    // Lazy loading placeholder
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <span className="text-xs text-slate-400">পৃষ্ঠা {pageNum} লোড হচ্ছে...</span>
                    </div>
                  )}
                </div>
              ))}
            </ReactPageFlip>
          </Document>
        </div>
      </main>

      {/* Page Navigation Bottom */}
      <div className="bg-[#111827] border-t border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3 text-amber-300" />
            <span className="font-serif font-bold text-sm">সংশপ্তক গঠনতন্ত্র — ফ্লিপ বুক ভিউ</span>
          </div>
          <div className="flex gap-2">
            <a
              href={pdfUrl}
              download
              className="border border-slate-700 hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded transition text-slate-300"
              title="PDF ডাউনলোড করুন"
            >
              <Download className="w-3 h-3 mr-1" />
              ডাউনলোড
            </a>
            <button
              onClick={() => window.location.reload()}
              className="border border-slate-700 hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded transition text-slate-300"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              রিফ্রেশ
            </button>
          </div>
        </div>
      </div>

      {viewerState.showShare && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">ডকুমেন্ট শেয়ার করুন</h3>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#790102]"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('URL কপি করা হয়েছে');
                }}
                className="bg-[#790102] hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-medium"
              >
                কপি
              </button>
            </div>
            <button
              onClick={toggleShare}
              className="border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 px-4 py-1.5 rounded text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
