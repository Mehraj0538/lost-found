import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Recycle, Battery } from 'lucide-react';

interface Prediction {
  id: string;
  timestamp: number;
  imageUrl: string;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
}

interface ResultsCardProps {
  prediction: Prediction;
}

export default function ResultsCard({ prediction }: ResultsCardProps) {
  const getWasteIcon = (type: string) => {
    switch (type) {
      case 'E_Waste':
        return <AlertTriangle className="w-8 h-8 text-accent" />;
      case 'Battery':
        return <Battery className="w-8 h-8 text-accent" />;
      case 'General_Recyclable':
        return <Recycle className="w-8 h-8 text-accent" />;
      case 'Non_Recyclable':
        return <CheckCircle2 className="w-8 h-8 text-muted-foreground" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-accent" />;
    }
  };

  const getDamageColor = (level?: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-destructive/10 text-destructive';
      case 'Moderate':
        return 'bg-accent/10 text-accent';
      case 'Slight':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-secondary/10 text-secondary-foreground';
    }
  };

  const confidenceColor =
    prediction.confidence > 0.9
      ? 'bg-primary/10'
      : prediction.confidence > 0.75
        ? 'bg-accent/10'
        : 'bg-secondary/10';

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Classification Results
        </h2>

        {/* Waste Type */}
        <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-lg bg-primary/15 flex-shrink-0">
              {getWasteIcon(prediction.wasteType)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Waste Type
              </p>
              <p className="text-3xl font-bold text-foreground">
                {prediction.wasteType.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-foreground">
              Classification Confidence
            </p>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${confidenceColor}`}>
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-3 overflow-hidden shadow-sm">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${prediction.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Damage Level */}
        {prediction.damageLevel && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-foreground mb-3">
              Damage Assessment
            </p>
            <div className={`px-5 py-3 rounded-lg text-sm font-bold inline-block ${getDamageColor(prediction.damageLevel)}`}>
              {prediction.damageLevel} Damage
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="pt-8 border-t border-border">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Recommended Action
          </h3>
          <div className="p-5 bg-secondary/20 border border-secondary/30 rounded-lg">
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {prediction.recommendation}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-6 font-medium">
          Analyzed on {new Date(prediction.timestamp).toLocaleDateString()} at{' '}
          {new Date(prediction.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
}
