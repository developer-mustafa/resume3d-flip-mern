import React, { useEffect, useRef, useState } from 'react';
import useBookStore from '../../stores/bookStore';
import HTMLFlipBook from 'react-pageflip';
import CoverPage from '../pages/CoverPage';
import ProfilePage from '../pages/ProfilePage';
import ExperiencePage from '../pages/ExperiencePage';
import ProjectsPage from '../pages/ProjectsPage';
import ContactPage from '../pages/ContactPage';
import BackCoverPage from '../pages/BackCoverPage';
import BookNavigation from './BookNavigation';
import TableOfContents from './TableOfContents';
import { Helmet } from 'react-helmet-async';
import { LoadingState, ErrorState } from '../ui/States';
import { Menu, X, Loader2 } from 'lucide-react';
import PrintableResume from '../print/PrintableResume';

const pages = [
  { id: 'cover', label: 'Cover', Component: CoverPage },
  { id: 'profile', label: 'Engineering Profile', Component: ProfilePage },
  { id: 'experience', label: 'Experience', Component: ExperiencePage },
  { id: 'projects', label: 'Selected Projects', Component: ProjectsPage },
  { id: 'contact', label: 'Contact', Component: ContactPage },
  { id: 'backcover', label: 'Back Cover', Component: BackCoverPage },
];

const Page = React.forwardRef((props, ref) => {
  const isCover = props.index === 0;
  const isBackCover = props.index === pages.length - 1;
  const isEdgePage = isCover || isBackCover;
  
  return (
    <div 
      className={`page overflow-hidden ${isEdgePage ? '' : 'bg-gradient-to-b from-[#faf9f6] to-[#f5f3ef] dark:from-slate-900 dark:to-slate-800'}`} 
      ref={ref}
    >
      <div className="w-full h-full relative">
        {/* Inner gutter shadow for content pages only */}
        {!isEdgePage && props.index % 2 !== 0 && (
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-black/[0.04] dark:from-black/40 to-transparent pointer-events-none z-20" />
        )}
        {!isEdgePage && props.index % 2 === 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-black/[0.04] dark:from-black/40 to-transparent pointer-events-none z-20" />
        )}

        <div className={`page-content h-full ${isEdgePage ? '' : 'p-5 md:p-8'} overflow-y-auto overflow-x-hidden custom-scrollbar`}>
          {props.children}
        </div>
      </div>
    </div>
  );
});

export default function BookPage({ initialPage = 0 }) {
  const {
    currentPage, showTOC,
    goToPage, closeTOC,
    fetchAllData, isLoading, error, profile, seo,
  } = useBookStore();

  const bookRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scale, setScale] = useState(1);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Initial fetch and layout
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Responsive scale
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      const vh = window.innerHeight * 0.96; // 96% of screen height
      const vw = window.innerWidth * 0.96; // 96% of screen width
      
      const bookWidth = mobile ? 400 : 1100;
      const bookHeight = mobile ? 560 : 750;
      
      const scaleHeight = vh / bookHeight;
      const scaleWidth = vw / bookWidth;
      
      setScale(Math.min(scaleHeight, scaleWidth, 1.5)); // Allow scaling up if screen is huge
    };

    handleResize(); // initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (initialPage > 0 && bookRef.current) {
      // For initial direct navigation, jump directly
      bookRef.current.pageFlip().turnToPage(initialPage);
    }
  }, [initialPage, bookRef]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea (e.g. contact form)
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;
      
      if (e.key === 'ArrowRight') {
        if (bookRef.current) bookRef.current.pageFlip().flipNext();
      } else if (e.key === 'ArrowLeft') {
        if (bookRef.current) bookRef.current.pageFlip().flipPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ref to hold the flip interval so we can clear it if clicked multiple times
  const flipIntervalRef = useRef(null);

  // Sequential flipping logic
  const flipToPageSequentially = (targetIdx) => {
    if (!bookRef.current) return;
    const book = bookRef.current.pageFlip();
    
    // Clear any existing flip sequence
    if (flipIntervalRef.current) {
      clearInterval(flipIntervalRef.current);
    }
    
    flipIntervalRef.current = setInterval(() => {
      const current = book.getCurrentPageIndex();
      const isPortrait = book.getOrientation() === 'portrait';
      
      // Determine if the target page is currently visible on screen
      let isVisible = false;
      if (isPortrait) {
        isVisible = current === targetIdx;
      } else {
        // In landscape (2-page mode), cover is [0]. Spreads are [1,2], [3,4]. Back is [5].
        if (current === targetIdx) {
          isVisible = true;
        } else if (current % 2 !== 0 && targetIdx === current + 1) {
          // If current is an odd number (left page), then current + 1 is the right page
          isVisible = true;
        }
      }

      // If we reached the target, stop the sequence
      if (isVisible) {
        clearInterval(flipIntervalRef.current);
        flipIntervalRef.current = null;
        return;
      }
      
      // Otherwise, flip in the correct direction
      if (targetIdx > current) {
        book.flipNext();
      } else {
        book.flipPrev();
      }
    }, 700); // Wait 700ms between flips for a nice continuous animation
  };

  // Play page flip sound using provided mp3
  const playFlipSound = () => {
    try {
      const audio = new Audio('/page-flip-4.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log('Audio play failed (maybe no interaction yet)', e));
    } catch (e) {
      console.error(e);
    }
  };

  const onFlip = (e) => {
    useBookStore.setState({ currentPage: e.data });
    playFlipSound();
  };

  // Generate professional PDF via backend (Puppeteer)
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBase}/resume/pdf`);
      
      if (!response.ok) throw new Error('PDF generation failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(profile?.name || 'Mustafa_Rahman').replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <LoadingState message="Loading resume..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <ErrorState message={error} onRetry={fetchAllData} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || 'Mustafa Rahman — Full Stack Software Engineer'}</title>
        <meta name="description" content={seo?.metaDescription || ''} />
        {seo?.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      </Helmet>

      {/* Screen View (Interactive Book) */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#111] select-none print:hidden"
      >
        <div 
          className="relative flex items-center justify-center z-10 transition-transform duration-500"
          style={{ 
            width: isMobile ? '400px' : '1100px',
            height: isMobile ? '560px' : '750px',
            transform: `scale(${scale}) ${currentPage === 0 && !isMobile ? 'translateX(-25%)' : (currentPage === pages.length - 1 && !isMobile ? 'translateX(25%)' : 'translateX(0)')}` 
          }}
        >
          
          <HTMLFlipBook
            width={isMobile ? 400 : 550}
            height={isMobile ? 560 : 750}
            size="fixed"
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="book-flip drop-shadow-2xl"
            ref={bookRef}
            flippingTime={1000}
            usePortrait={isMobile}
          >
            {pages.map((page, index) => {
              const PageComponent = page.Component;
              return (
                <Page key={page.id} index={index}>
                  <PageComponent />
                </Page>
              );
            })}
          </HTMLFlipBook>

          {/* Table of Contents */}
          {showTOC && <TableOfContents pages={pages} onPageSelect={(idx) => {
            flipToPageSequentially(idx);
            closeTOC();
          }}/>}
        </div>

        {/* Toggle Nav Button (Bottom Left) */}
        <button
          onClick={() => setIsNavVisible(!isNavVisible)}
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all shadow-lg"
          aria-label="Toggle Navigation"
          title="Toggle Navigation Menu"
        >
          {isNavVisible ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation Controls */}
        <div className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-in-out ${isNavVisible ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0 pointer-events-none'}`}>
          <BookNavigation 
            onNext={() => {
               if(bookRef.current) bookRef.current.pageFlip().flipNext();
            }}
            onPrev={() => {
               if(bookRef.current) bookRef.current.pageFlip().flipPrev();
            }}
            onPrint={generatePDF}
          />
        </div>
      </div>

      {/* PDF Generation Loading Overlay */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
          <p className="text-white font-semibold text-lg">Generating PDF...</p>
          <p className="text-white/60 text-sm mt-1">Please wait a moment</p>
        </div>
      )}
    </>
  );
}
