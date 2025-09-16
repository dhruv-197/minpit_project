import { GoogleGenAI, Type } from "@google/genai";
import type { Mine, MineData, RiskAnalysis, SensorDataPoint, SensorType, RockfallEventType } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const validRockfallEventTypes: RockfallEventType[] = [
  'Precipitation',
  'Snowmelt',
  'Rain-on-snow',
  'Crack propagation',
  'Wildfire',
  'Blasting',
  'Ground vibration',
  'Freeze-thaw',
  'Thermal stress',
  'Unknown'
];

export const getMineData = async (mine: Mine): Promise<MineData> => {
    // Define the schema programmatically for the API to enforce valid JSON output
    const schema = {
        type: Type.OBJECT,
        properties: {
            overallRisk: { type: Type.STRING, description: "The overall risk level for the mine. One of 'Low', 'Medium', 'Hard', 'Critical'." },
            sensors: {
                type: Type.ARRAY,
                description: "An array of sensor data points.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING, description: "ISO 8601 timestamp for the reading." },
                        value: { type: Type.NUMBER, description: "The numerical value of the sensor reading." },
                        sensorId: { type: Type.STRING, description: "A unique identifier for the sensor." },
                        sensorType: { type: Type.STRING, description: "Type of sensor: 'seismic', 'gas', 'temperature', 'air-flow', 'wind-speed', 'displacement', or 'pore-pressure'." },
                    },
                    required: ["time", "value", "sensorId", "sensorType"]
                }
            },
            alerts: {
                type: Type.ARRAY,
                description: "An array of rockfall alerts.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: "A unique identifier for the alert." },
                        timestamp: { type: Type.STRING, description: "ISO 8601 timestamp for when the alert was triggered." },
                        zoneName: { type: Type.STRING, description: "The specific zone in the mine where the alert is active." },
                        riskLevel: { type: Type.STRING, description: "The risk level of the alert: 'Low', 'Medium', 'Hard', 'Critical'." },
                        message: { type: Type.STRING, description: "A human-readable message describing the alert." },
                        suggestedAction: { type: Type.STRING, description: "A recommended action for personnel to take." },
                    },
                    required: ["id", "timestamp", "zoneName", "riskLevel", "message", "suggestedAction"]
                }
            },
            rockfallEvents: {
                type: Type.ARRAY,
                description: "An array of potential rockfall events.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: "A unique identifier for the event." },
                        lat: { type: Type.NUMBER, description: "Latitude of the potential event." },
                        lng: { type: Type.NUMBER, description: "Longitude of the potential event." },
                        type: { 
                            type: Type.STRING, 
                            description: "The trigger type for the potential rockfall.",
                            enum: validRockfallEventTypes
                        },
                        volume: { type: Type.NUMBER, description: "Estimated volume of the rockfall in cubic meters." },
                        probability: { type: Type.NUMBER, description: "The probability of the event occurring (0 to 1)." },
                    },
                    required: ["id", "lat", "lng", "type", "volume", "probability"]
                }
            }
        },
        required: ["overallRisk", "sensors", "alerts", "rockfallEvents"]
    };

    const prompt = `
      Generate a realistic, simulated dataset for the "${mine.name}" mining operation, located in ${mine.location} (approx. coordinates: lat ${mine.lat}, lng ${mine.lng}).
      The data should represent a snapshot of current conditions and potential rockfall risks.

      - The 'overallRisk' must be a logical assessment of the data you generate. For most simulations, use 'Low' or 'Medium'.
      - A 'Hard' risk should be used if there are significant sensor anomalies or moderately high-probability events.
      - A 'Critical' risk level is for extreme, life-threatening situations ONLY. To use 'Critical', you must generate at least one rockfall event with a probability greater than 0.75, backed by extreme readings in related sensors (e.g., massive seismic spike, extreme displacement). Suggested actions for 'Critical' alerts must be direct and urgent, like "IMMEDIATE EVACUATION of Zone C required."
      - Generate a time-series of sensor data for the last 12 hours, with readings every 30 minutes for each of the seven sensor types. Ensure values fluctuate realistically.
        - Seismic data (μm/s): Normal 0-500. Spikes up to 1500 (Hard) or >3000 (Critical) indicate instability.
        - Gas levels (ppm): Normal 0-50.
        - Temperature (°C): Normal 15-40.
        - Air Flow (m/s): Normal 2-8.
        - Wind Speed (m/s): Normal 2-8.
        - Displacement (mm): Normal 0-10. Spikes to 50 (Hard) or >100 (Critical) indicate significant ground movement.
        - Pore Pressure (kPa): Normal 0-50. Spikes to 150 (Hard) or >250 (Critical), especially after 'Precipitation' events, indicate high risk.
      - Create 3-5 alerts based on potential anomalies in the sensor data. The risk level must match the severity of the data. Alerts should be sorted with the most recent first.
      - Create 15-25 potential rockfall events, clustered tightly inside the mine area (within +/- 0.005 degrees of the mine's lat/lng).
      - Event probabilities should be realistic: most < 0.15, some between 0.15-0.4 (Medium/Hard risk). A high-probability event (>0.4) should be rare and linked to a significant sensor anomaly. An event with probability > 0.75 is a 'Critical' trigger.
      - Ensure all timestamps are recent and in valid ISO 8601 format, sorted chronologically where appropriate.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonStr = response.text;
        const generatedData = JSON.parse(jsonStr);

        const mineData: MineData = {
            mine: mine,
            ...generatedData
        };

        mineData.sensors.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        mineData.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return mineData;

    } catch (error) {
        console.error("Error fetching or parsing data from Gemini API:", error);
        throw new Error("Failed to generate mine data using Gemini API.");
    }
};

const getLatestSensorValue = (sensors: SensorDataPoint[], type: SensorType): number | undefined => {
    const relevantSensors = sensors.filter(s => s.sensorType === type);
    if (relevantSensors.length === 0) return undefined;
    // The sensors are sorted oldest to newest, so the last one is the latest.
    return relevantSensors[relevantSensors.length - 1].value;
};


export const getRiskAnalysis = async (mineData: MineData, isScenario: boolean = false): Promise<RiskAnalysis> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            overallAssessment: { type: Type.STRING, description: "A single, clear sentence stating the overall risk level and the primary reason." },
            immediateOutlook: { type: Type.STRING, description: "A short, one-sentence prediction of the immediate outlook (e.g., 'Risk of localized rockfalls is increasing')." },
            keyFactors: {
                type: Type.ARRAY,
                description: "A list of 2-3 of the most critical factors influencing the current risk assessment. Each factor should be a concise bullet point.",
                items: { type: Type.STRING }
            },
            recommendations: {
                type: Type.ARRAY,
                description: "A list of 2-3 specific, actionable recommendations for mine personnel. Each recommendation should be a concise bullet point.",
                items: { type: Type.STRING }
            }
        },
        required: ["overallAssessment", "immediateOutlook", "keyFactors", "recommendations"]
    };

    const latestSeismic = getLatestSensorValue(mineData.sensors, 'seismic');
    const latestGas = getLatestSensorValue(mineData.sensors, 'gas');
    const latestTemp = getLatestSensorValue(mineData.sensors, 'temperature');
    const latestDisplacement = getLatestSensorValue(mineData.sensors, 'displacement');
    const latestPorePressure = getLatestSensorValue(mineData.sensors, 'pore-pressure');


    const scenarioPreamble = `
        Analyze the following hypothetical 'what-if' scenario for "${mineData.mine.name}".
        The goal is to understand the potential risk implications of specific sensor readings, assuming all other background factors remain constant.
    `;
    const realTimePreamble = `
        Act as an expert geotechnical engineer and AI risk analyst for the mining industry.
        You have been provided with the following real-time data for "${mineData.mine.name}":
    `;
    
    const prompt = `
        ${isScenario ? scenarioPreamble : realTimePreamble}
        - Overall Risk Level (Baseline): ${mineData.overallRisk}
        - Active Alerts (Baseline): ${mineData.alerts.map(a => a.message).join(', ') || 'None'}
        - ${isScenario ? 'Hypothetical' : 'Key'} Sensor Readings (latest):
          - Seismic: ${latestSeismic?.toFixed(2) ?? 'N/A'} µm/s
          - Gas: ${latestGas?.toFixed(2) ?? 'N/A'} ppm
          - Temperature: ${latestTemp?.toFixed(2) ?? 'N/A'} °C
          - Displacement: ${latestDisplacement?.toFixed(2) ?? 'N/A'} mm
          - Pore Pressure: ${latestPorePressure?.toFixed(2) ?? 'N/A'} kPa
        
        ${!isScenario ? `In addition to this data, you have also analyzed the latest Digital Elevation Models (DEM), drone imagery, and other geotechnical data.` : ''}
        
        Based on your comprehensive analysis of ALL available data, generate an at-a-glance, point-wise risk analysis report.
        The report must be extremely concise and easy for a mine manager to understand in seconds.
        If the risk level is 'Critical', the recommendations MUST be direct commands for ensuring personnel safety (e.g., immediate evacuation).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonStr = response.text;
        return JSON.parse(jsonStr) as RiskAnalysis;
    } catch (error) {
        console.error("Error generating risk analysis from Gemini API:", error);
        throw new Error("Failed to generate AI risk analysis.");
    }
};