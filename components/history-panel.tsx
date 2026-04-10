import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Trash2, History } from 'lucide-react';

interface Prediction {
  id: string;
  timestamp: number;
  imageUrl: string;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
}

interface HistoryPanelProps {
  history: Prediction[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectPrediction: (prediction: Prediction) => void;
  onClearHistory: () => void;
}

export default function HistoryPanel({
  history,
  isOpen,
  onToggle,
  onSelectPrediction,
  onClearHistory,
}: HistoryPanelProps) {
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('ecosort-history');
      onClearHistory();
    }
  };

  return (
    <Card className="sticky top-8 shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-all duration-200 bg-gradient-to-r from-primary/5 to-accent/5"
      >
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-lg">Recent Analyses</h3>
          {history.length > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
              {history.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {history.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No history yet</p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto divide-y divide-border">
                {history.map((prediction, index) => (
                  <button
                    key={prediction.id}
                    onClick={() => onSelectPrediction(prediction)}
                    className="w-full p-4 text-left hover:bg-secondary/30 transition-all duration-200 flex gap-3 active:bg-secondary/40"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden ring-1 ring-border">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${prediction.imageUrl})`,
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {prediction.wasteType.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prediction.timestamp).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-full"
                            style={{
                              width: `${prediction.confidence * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {history.length > 0 && (
                <div className="p-4 border-t border-border">
                  <Button
                    onClick={handleClearHistory}
                    variant="outline"
                    className="w-full text-sm text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
