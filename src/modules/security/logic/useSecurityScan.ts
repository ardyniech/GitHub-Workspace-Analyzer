import { useState, useEffect } from 'react';
import { securityScanner, ScanReport } from '../storage/securityScanner';

export function useSecurityScan(content: string, filePath: string) {
  const [report, setReport] = useState<ScanReport>(() =>
    securityScanner.scanContent(content, filePath)
  );
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setScanning(true);

    const timer = setTimeout(() => {
      try {
        const result = securityScanner.scanContent(content, filePath);
        if (isMounted) {
          setReport(result);
        }
      } catch (err: any) {
        console.error(`[Module:security] Error in useSecurityScan: ${err.message || err}`);
      } finally {
        if (isMounted) {
          setScanning(false);
        }
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [content, filePath]);

  return { report, scanning };
}
