
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { RehabExercise } from '@/types/patient';

interface RehabExerciseCardProps {
  exercise: RehabExercise;
}

// Brand colors
const PRIMARY_COLOR = "#1B677D";

const RehabExerciseCard = ({ exercise }: RehabExerciseCardProps) => {
  // Helper function to get phase badge style
  const getPhaseBadgeClass = (phase: string) => {
    switch (phase) {
      case 'isometric':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'concentric':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'eccentric':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'plyometric':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Helper function to translate phase name
  const translatePhase = (phase: string) => {
    switch (phase) {
      case 'isometric':
        return 'Ισομετρική';
      case 'concentric':
        return 'Ομόκεντρη';
      case 'eccentric':
        return 'Έκκεντρη';
      case 'plyometric':
        return 'Πλειομετρική';
      default:
        return phase;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="bg-gray-50 p-4">
            <h3 className="font-medium mb-3" style={{ color: PRIMARY_COLOR }}>{exercise.name}</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getPhaseBadgeClass(exercise.phase)}>
                {translatePhase(exercise.phase)}
              </Badge>
              <Badge variant="outline">
                {exercise.sets} x {exercise.reps}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                Δυσκολία: {exercise.difficulty}/10
              </Badge>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Πηγή: {exercise.source}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
          
          <div className="col-span-2 aspect-video md:aspect-auto">
            <div className="relative w-full h-full min-h-[200px]">
              <iframe
                src={exercise.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RehabExerciseCard;
