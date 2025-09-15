import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SensorDataPoint } from '../types';

interface MultiSensorChartProps {
    data: SensorDataPoint[];
}

const SENSOR_COLORS: Record<SensorDataPoint['sensorType'], string> = {
    seismic: '#22C55E', // green-500
    gas: '#F97316',   // orange-500
    temperature: '#EF4444', // red-500
    'air-flow': '#14B8A6', // teal-500
    'wind-speed': '#F59E0B' // amber-500
};

export const MultiSensorChart: React.FC<MultiSensorChartProps> = ({ data }) => {
    const formattedData = React.useMemo(() => {
        const dataByTime: { [time: string]: { time: string;[key: string]: any } } = {};

        data.forEach(d => {
            const time = new Date(d.time).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (!dataByTime[time]) {
                dataByTime[time] = { time };
            }
            dataByTime[time][d.sensorType] = d.value;
        });

        return Object.values(dataByTime);
    }, [data]);


    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  />
                <YAxis stroke="#9CA3AF" fontSize={12} yAxisId="left" orientation="left" />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#374151',
                        borderRadius: '0.5rem' 
                    }} 
                    labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }}/>
                {Object.entries(SENSOR_COLORS).map(([type, color]) => (
                    <Line key={type} yAxisId="left" type="monotone" dataKey={type} stroke={color} strokeWidth={2} dot={false} name={type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};