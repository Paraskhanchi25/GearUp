import React, { useState } from 'react';
import { MotorcycleViewer3D } from './MotorcycleViewer3D';
import { VehicleListing } from '../../types';
import { Vehicle3DMetadata } from '../../services/vehicle3DRegistry';

export interface Vehicle3DViewerProps {
  vehicle?: VehicleListing | null;
  modelMetadata?: Vehicle3DMetadata;
  modelPath?: string;
  modelScale?: number;
  cameraPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  background?: 'studio' | 'dark' | 'light' | 'outdoor';
  lightingPreset?: 'showroom' | 'dramatic' | 'daylight' | 'minimal';
  enableRotation?: boolean;
  enableZoom?: boolean;
  enableComponentInspection?: boolean;
  enableExplodedView?: boolean;
  enableColorCustomization?: boolean;
  inspectionOverlay?: boolean;
  selectedComponentId?: string | null;
  onComponentSelect?: (componentId: string | null) => void;
  onLoadingProgress?: (progress: number) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicle,
  selectedComponentId = null,
  onComponentSelect,
  enableExplodedView = true,
  className = '',
  height = '520px',
  showControls = true
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedComponentId);
  const [exploded, setExploded] = useState<boolean>(false);

  const activeSelectedId = selectedComponentId !== undefined ? selectedComponentId : internalSelectedId;

  const handleSelect = (id: string | null) => {
    setInternalSelectedId(id);
    onComponentSelect?.(id);
  };

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <MotorcycleViewer3D
        vehicle={vehicle || undefined}
        selectedComponentId={activeSelectedId}
        onSelectComponent={handleSelect}
        exploded={exploded}
        onToggleExploded={enableExplodedView ? () => setExploded(!exploded) : undefined}
        showStudioControls={showControls}
        className="w-full h-full"
      />
    </div>
  );
};
