import React, { useEffect, useRef } from 'react';
import type { MineData, RockfallEventType } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

// @ts-ignore - Leaflet is loaded from CDN
const L = window.L;

interface RiskMapViewProps {
    data: MineData | null;
}

const eventColors: Record<RockfallEventType, string> = {
    'Precipitation': '#3B82F6',
    'Snowmelt': '#06B6D4',
    'Rain-on-snow': '#06B6D4',
    'Crack propagation': '#F97316',
    'Wildfire': '#EF4444',
    'Blasting': '#8B5CF6',
    'Ground vibration': '#6366F1',
    'Freeze-thaw': '#EAB308',
    'Thermal stress': '#EC4899',
    'Unknown': '#6B7280',
};

const getRadiusFromVolume = (volume: number) => {
    if (volume < 5) return 6;
    if (volume < 50) return 8;
    if (volume < 500) return 12;
    if (volume < 5000) return 18;
    if (volume < 50000) return 26;
    return 34;
};


const TriggerLegend = () => (
    <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20">
        <h4 className="font-bold mb-2 text-sm text-text-primary">Trigger Legend</h4>
        <ul className="space-y-1.5">
            {Object.entries(eventColors).map(([type, color]) => (
                <li key={type} className="flex items-center text-xs text-text-secondary">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color, border: '1px solid #F9FAFB' }}></span>
                    <span>{type}</span>
                </li>
            ))}
        </ul>
    </div>
);

const VolumeScale = () => {
    const volumes = [0.5, 5, 50, 500, 5000, 50000];
    return (
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20">
            <h4 className="font-bold mb-2 text-sm text-text-primary">Volume (cubic meters)</h4>
            <ul className="space-y-2.5">
                {volumes.map((vol, i) => (
                    <li key={vol} className="flex items-center text-xs text-text-secondary">
                        <span className="rounded-full mr-2.5" style={{ 
                            width: getRadiusFromVolume(vol) * 1.5, 
                            height: getRadiusFromVolume(vol) * 1.5, 
                            backgroundColor: '#9CA3AF',
                            display: 'inline-block'
                        }}></span>
                        <span>{vol.toLocaleString()} {volumes[i+1] ? `- ${volumes[i+1].toLocaleString()}`: '+'}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const RiskMapView: React.FC<RiskMapViewProps> = ({ data }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const eventsLayerRef = useRef<any>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current && data) {
            mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([data.mine.lat, data.mine.lng], 15);
            L.control.zoom({ position: 'topleft' }).addTo(mapRef.current);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(mapRef.current);

            eventsLayerRef.current = L.layerGroup().addTo(mapRef.current);
        }

        if (mapRef.current && eventsLayerRef.current && data) {
            mapRef.current.flyTo([data.mine.lat, data.mine.lng], 15);
            eventsLayerRef.current.clearLayers();

            data.rockfallEvents.forEach(event => {
                const circle = L.circleMarker([event.lat, event.lng], {
                    radius: getRadiusFromVolume(event.volume),
                    color: '#F9FAFB', // white border
                    weight: 1,
                    fillColor: eventColors[event.type] || eventColors['Unknown'],
                    fillOpacity: 0.85,
                }).addTo(eventsLayerRef.current);

                circle.bindTooltip(`
                    <div style="font-family: Inter, sans-serif; font-size: 13px;">
                      <b>Trigger: ${event.type}</b><br/>
                      Volume: ${event.volume.toFixed(2)} m³<br/>
                      Probability: ${(event.probability * 100).toFixed(1)}%
                    </div>
                `, {
                    className: 'map-tooltip',
                    sticky: true
                });
            });
        }
        
        // Add a style block for custom tooltip appearance
        const style = document.createElement('style');
        style.innerHTML = `
          .leaflet-tooltip.map-tooltip {
            background-color: rgba(31, 41, 55, 0.8);
            border: 1px solid #374151;
            color: #F9FAFB;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          }
        `;
        document.head.appendChild(style);


        setTimeout(() => {
            mapRef.current?.invalidateSize();
        }, 100);

    }, [data]);

    if (!data) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="h-full w-full relative rounded-lg overflow-hidden">
            <div ref={mapContainerRef} className="h-full w-full z-0" />
            <div className="absolute top-4 left-14 flex flex-col space-y-4 z-10">
                <TriggerLegend />
            </div>
             <div className="absolute bottom-4 right-4 flex flex-col space-y-4 z-10">
                <VolumeScale />
            </div>
        </div>
    );
};