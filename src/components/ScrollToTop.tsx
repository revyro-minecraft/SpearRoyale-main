import { useEffect } from 'react';

/** Scrolls to top on every route change. */
export default function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
