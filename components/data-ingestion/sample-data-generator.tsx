'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataType, EntityData } from '@/types/data-types';
import { generateSampleData } from '@/lib/sample-data';

interface SampleDataGeneratorProps {
  onSampleDataLoad: (type: DataType, data: EntityData[]) => void;
}

export function SampleDataGenerator({ onSampleDataLoad }: SampleDataGeneratorProps) {
  const handleLoadSampleData = (type: DataType) => {
    const sampleData = generateSampleData(type);
    onSampleDataLoad(type, sampleData);
  };

  const handleLoadAllSampleData = () => {
    const types: DataType[] = ['clients', 'workers', 'tasks'];
    types.forEach(type => {
      const sampleData = generateSampleData(type);
      onSampleDataLoad(type, sampleData);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleLoadSampleData('clients')}
          className="h-auto py-3 flex flex-col items-center space-y-1"
        >
          <span className="font-medium">Load Sample Clients</span>
          <Badge variant="secondary" className="text-xs">15 records</Badge>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleLoadSampleData('workers')}
          className="h-auto py-3 flex flex-col items-center space-y-1"
        >
          <span className="font-medium">Load Sample Workers</span>
          <Badge variant="secondary" className="text-xs">12 records</Badge>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleLoadSampleData('tasks')}
          className="h-auto py-3 flex flex-col items-center space-y-1"
        >
          <span className="font-medium">Load Sample Tasks</span>
          <Badge variant="secondary" className="text-xs">20 records</Badge>
        </Button>
      </div>

      <Button
        onClick={handleLoadAllSampleData}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        size="lg"
      >
        Load Complete Sample Dataset
      </Button>
    </div>
  );
}