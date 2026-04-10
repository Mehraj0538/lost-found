'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Prediction {
  id: string;
  timestamp: number;
  imageUrl: string;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
}

const STORAGE_KEY = 'ecosort-history';
const MAX_HISTORY = 20;

/**
 * Custom hook for managing prediction history with localStorage
 */
export function usePredictionHistory() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('[useHistory] Error loading history:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Add a prediction to history
  const addPrediction = useCallback((prediction: Prediction) => {
    setHistory((prev) => {
      const updated = [prediction, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useHistory] Error saving history:', error);
      }
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[useHistory] Error clearing history:', error);
    }
  }, []);

  // Remove a specific prediction from history
  const removePrediction = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useHistory] Error updating history:', error);
      }
      return updated;
    });
  }, []);

  // Get a prediction by ID
  const getPredictionById = useCallback(
    (id: string) => {
      return history.find((p) => p.id === id);
    },
    [history]
  );

  return {
    history,
    isLoaded,
    addPrediction,
    clearHistory,
    removePrediction,
    getPredictionById,
  };
}
