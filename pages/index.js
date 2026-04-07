import { useState, useEffect } from 'react';
import BalochistanDashboard from '../src/components/BalochistanDashboard';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return <BalochistanDashboard />;
}
