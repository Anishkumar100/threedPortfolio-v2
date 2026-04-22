import { useState, useEffect, useCallback } from 'react';
import { fetchMaintenanceStatus } from '../services/api';

export default function useMaintenanceCheck() {
  const [state, setState] = useState({
    isMaintenanceMode: false,
    maintenanceMessage: '',
    estimatedEnd: null,
    loading: true,
  });

  const check = useCallback(async () => {
    try {
      const { data, error } = await fetchMaintenanceStatus();
      if (!error && data) {
        setState({
          isMaintenanceMode: data.isEnabled || false,
          maintenanceMessage: data.message || '',
          estimatedEnd: data.estimatedEnd || null,
          loading: false,
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    check();

    const interval = setInterval(check, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, [check]);

  return state;
}
