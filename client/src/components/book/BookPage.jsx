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

      <div
        className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#111] select-none"
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
            if(bookRef.current) bookRef.current.pageFlip().turnToPage(idx);
            closeTOC();
          }}/>}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-4 md:bottom-8 z-50">
          <BookNavigation 
            onNext={() => {
              if(bookRef.current) bookRef.current.pageFlip().flipNext();
            }}
            onPrev={() => {
              if(bookRef.current) bookRef.current.pageFlip().flipPrev();
            }}
          />
        </div>
      </div>
    </>
  );
}
