
import React, { useState, useRef, useCallback, lazy, Suspense } from 'react';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import RefreshIndicator from './components/RefreshIndicator';
import NotificationContainer from './components/NotificationContainer';
import { Screen, NavItem } from './types';
import { HomeIcon, ZapIcon, RecipeIcon, FileTextIcon, UserIcon } from './components/icons/Icons';

// Lazy-loaded screen components
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const DetectionScreen = lazy(() => import('./screens/DetectionScreen'));
const RecipesScreen = lazy(() => import('./screens/RecipesScreen'));
const BlogScreen = lazy(() => import('./screens/BlogScreen'));
const NotificationsScreen = lazy(() => import('./screens/NotificationsScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullPosition, setPullPosition] = useState(0);

  const lastScrollTop = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      // In a real app, you would re-fetch data here.
      // For now, we'll just simulate a refresh.
      // A key change on the content can trigger a re-render/re-fetch.
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
    } else {
      touchStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current !== null) {
      const pullDistance = e.touches[0].clientY - touchStartRef.current;
      if (pullDistance > 0) {
        e.preventDefault(); // Prevent scrolling while pulling
        setPullPosition(Math.min(pullDistance, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullPosition > 80) {
      handleRefresh();
    }
    setPullPosition(0);
    touchStartRef.current = null;
  };

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop: currentScrollTop } = mainRef.current;
    
    setScrollTop(currentScrollTop);
    
    const scrollDelta = currentScrollTop - lastScrollTop.current;

    if (scrollDelta > 5 && currentScrollTop > 50) {
      setIsHeaderVisible(false);
    } else if (scrollDelta < -5 || currentScrollTop <= 50) {
      setIsHeaderVisible(true);
    }
    lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }, []);
  
  const renderScreen = () => {
    const key = `${activeScreen}-${isRefreshing}`;
    switch (activeScreen) {
      case 'home': return <HomeScreen key={key} />;
      case 'detection': return <DetectionScreen scrollTop={scrollTop} />;
      case 'recipes': return <RecipesScreen key={key} />;
      case 'notifications': return <NotificationsScreen key={key} />;
      case 'blog': return <BlogScreen key={key} />;
      case 'profile': return <ProfileScreen key={key} />;
      default: return <HomeScreen key={key} />;
    }
  };
  
  const navItems: NavItem[] = [
    { name: 'home', label: 'Home', icon: HomeIcon },
    { name: 'detection', label: 'Detect', icon: ZapIcon },
    { name: 'recipes', label: 'Recipes', icon: RecipeIcon },
    { name: 'blog', label: 'Blog', icon: FileTextIcon },
    { name: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-white overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-yellow-200 opacity-60 dark:from-emerald-500 dark:to-yellow-500 dark:opacity-80"></div>
      <Header setActiveScreen={setActiveScreen} isHeaderVisible={isHeaderVisible} />
      <main 
        ref={mainRef} 
        onScroll={handleScroll} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto relative z-10"
      >
        <RefreshIndicator pullPosition={pullPosition} isRefreshing={isRefreshing} />
        <div className="container mx-auto max-w-lg px-4 pt-8">
           <ErrorBoundary>
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader /></div>}>
              {renderScreen()}
            </Suspense>
           </ErrorBoundary>
        </div>
      </main>
      <NotificationContainer />
      <div className="relative z-20">
        <BottomNav items={navItems} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </div>
  );
};

export default App;
