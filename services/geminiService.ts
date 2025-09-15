import { GoogleGenAI, Type } from "@google/genai";
import type { Mine, MineData, RiskAnalysis, SensorDataPoint, SensorType } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
                        sensorType: { type: Type.STRING, description: "Type of sensor: 'seismic', 'gas', 'temperature', 'air-flow', or 'wind-speed'." },
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
                        type: { type: Type.STRING, description: "The trigger type for the potential rockfall." },
                        volume: { type: Type.NUMBER, description: "Estimated volume of the rockfall in cubic meters." },
                        probability: { type: Type.NUMBER, description: "The probability of the event occurring (0 to 1)." },
                    },
                    required: ["id", "lat", "lng", "type", "volume", "probability"]
                }
            }
        },
        required: ["overallRisk", "sensors", "alerts", "rockfallEvents"]
    };

    // The prompt is now simpler, focusing on the content and context, not the structure.
    const prompt = `
      Generate a realistic, simulated dataset for the "${mine.name}" mining operation, located in ${mine.location} (approx. coordinates: lat ${mine.lat}, lng ${mine.lng}).
      The data should represent a snapshot of current conditions and potential rockfall risks.

      - The 'overallRisk' should reflect a logical assessment of the generated sensor data and active alerts. The possible risk levels are 'Low', 'Medium', 'Hard', and 'Critical'.
      - Generate a time-series of sensor data for the last 12 hours, with readings every 30 minutes for each of the five sensor types (seismic, gas, temperature, air-flow, wind-speed). Ensure the values fluctuate realistically.
        - Seismic data (μm/s): Normal range 0-500. Spikes up to 1500 could indicate instability.
        - Gas levels (ppm): Normal range 0-50. Higher values are dangerous.
        - Temperature (°C): Normal range 15-40. Spikes could indicate equipment failure.
        - Air Flow (m/s): Normal range 2-8. Low values are dangerous.
        - Wind Speed (m/s): Normal range 2-8. High values could affect stability or operations.
      - Create 3-5 alerts based on potential anomalies in the sensor data you generate. For example, a high seismic reading should trigger a 'Hard' or 'Critical' risk alert. Alerts should be sorted with the most recent first.
      - Create 5-10 potential rockfall events. The locations should be geographically plausible, clustered very close to the mine's coordinates (e.g., within +/- 0.01 degrees). The 'probability' for these events must be realistic for a predictive system: most events should have a low probability (less than 0.15), a few may have a moderate probability (between 0.15 and 0.4), and a high-probability event (over 0.4) should be rare and logically linked to a significant anomaly you've generated in the sensor data, which would likely result in a 'Hard' or 'Critical' overall risk level.
      - Ensure all timestamps are recent and in valid ISO 8601 format, sorted chronologically where appropriate (sensor data should be oldest to newest).
      - The suggested actions in alerts should be specific and actionable for mining personnel.
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

    const scenarioPreamble = `
        Analyze the following hypothetical 'what-if' scenario for "${mineData.mine.name}".
        The goal is to understand the potential risk implications of specific sensor readings, assuming all other background factors (DEM, drone imagery, etc.) remain as they are in the baseline real-time data.
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
        
        ${!isScenario ? `In addition to this data, you have also analyzed the latest Digital Elevation Models (DEM), drone imagery, and geotechnical sensor data (strain, pore pressure).` : ''}
        
        Based on your comprehensive analysis of ALL available data (the provided real-time data and the other simulated sources like DEM/imagery), generate an at-a-glance, point-wise risk analysis report for this ${isScenario ? 'scenario' : 'situation'}.
        The report must be extremely concise and easy for a mine manager to understand in seconds.
        
        - **overallAssessment**: Provide a single-sentence overall assessment.
        - **immediateOutlook**: Provide a single-sentence immediate outlook.
        - **keyFactors**: Provide 2-3 key contributing factors.
        - **recommendations**: Provide 2-3 concrete recommendations.
        
        Each factor and recommendation must be a short, direct bullet point.
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