import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SensorDataPoint } from '../types';

interface SensorChartProps {
    data: SensorDataPoint[];
    color: string;
    legendName: string;
    unit: string;
}

export const SensorChart: React.FC<SensorChartProps> = ({ data, color, legendName, unit }) => {
    const formattedData = data.map(d => ({
        ...d,
        time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#111827', 
                        borderColor: '#374151',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                    labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
                    itemStyle={{ color: color }}
                    formatter={(value: number) => [`${value} ${unit}`, legendName]}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }}/>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2, fill: color }} activeDot={{ r: 6 }} name={legendName} />
            </LineChart>
        </ResponsiveContainer>
    );
};