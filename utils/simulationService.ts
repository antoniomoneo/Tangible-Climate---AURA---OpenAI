import { temperatureData } from '../data/temperatureData';
import type { DataPoint } from '../types';

export type ScenarioId = 'NO_AEROSOL_COOLING' | 'EARLY_ACTION' | 'ACCELERATED_WARMING';

type ScenarioInfo = {
  name: string;
  description: string;
  startYear: number;
};

// Helper for linear regression
const linearRegression = (data: DataPoint[]) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const sumX = data.reduce((acc, p) => acc + p.year, 0);
  const sumY = data.reduce((acc, p) => acc + p.anomaly, 0);
  const sumXY = data.reduce((acc, p) => acc + p.year * p.anomaly, 0);
  const sumXX = data.reduce((acc, p) => acc + p.year * p.year, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
};

export const getScenarios = (language: 'en' | 'es'): Record<ScenarioId, ScenarioInfo> => ({
  NO_AEROSOL_COOLING: {
    name: language === 'es' ? '¿Y si... no hubiera habido enfriamiento por aerosoles?' : 'What if... there was no aerosol cooling?',
    description: language === 'es' ? 'Simula un mundo donde la contaminación por aerosoles posterior a la Segunda Guerra Mundial no ocurrió, continuando la tendencia de calentamiento de principios del siglo XX.' : 'Simulates a world where post-WWII aerosol pollution didn\'t happen, continuing the warming trend from the early 20th century.',
    startYear: 1945,
  },
  EARLY_ACTION: {
    name: language === 'es' ? '¿Y si... hubiéramos actuado sobre el clima en 1990?' : 'What if... we took climate action in 1990?',
    description: language === 'es' ? 'Modela un escenario donde se promulgaron políticas globales efectivas en 1990, doblando gradualmente la curva de temperatura hacia abajo.' : 'Models a scenario where effective global policies were enacted in 1990, gradually bending the temperature curve downwards.',
    startYear: 1990,
  },
  ACCELERATED_WARMING: {
    name: language === 'es' ? '¿Y si... el calentamiento continuara sin control?' : 'What if... warming continued unchecked?',
    description: language === 'es' ? 'Proyecta la agresiva tasa de calentamiento de finales del siglo XX hacia el futuro, representando un escenario pesimista.' : 'Projects the aggressive warming rate of the late 20th century into the future, representing a worst-case scenario.',
    startYear: 2000,
  },
});

export const SCENARIO_JUSTIFICATIONS: Record<ScenarioId, { en: string; es: string }> = {
  NO_AEROSOL_COOLING: {
    en: 'This simulation calculates the warming trend from 1910-1945. From 1945 onwards, it replaces the real data (which shows a plateau) with a projection of that earlier warming trend, showing what might have happened without the cooling effect of industrial aerosols.',
    es: 'Esta simulación calcula la tendencia de calentamiento de 1910-1945. A partir de 1945, reemplaza los datos reales (que muestran una meseta) con una proyección de esa tendencia de calentamiento anterior, mostrando lo que podría haber sucedido sin el efecto enfriador de los aerosoles industriales.',
  },
  EARLY_ACTION: {
    en: 'Starting from 1990, this scenario applies a progressively stronger cooling factor to the actual data, simulating the cumulative effect of policies like a global carbon tax and rapid renewable energy adoption, bending the curve towards stabilization.',
    es: 'A partir de 1990, este escenario aplica un factor de enfriamiento progresivamente más fuerte a los datos reales, simulando el efecto acumulativo de políticas como un impuesto global al carbono y la adopción rápida de energías renovables, doblando la curva hacia la estabilización.',
  },
  ACCELERATED_WARMING: {
    en: 'This scenario calculates the rapid warming rate observed between 1975 and 2000. It then projects this aggressive, unchecked trend forward from 2000, illustrating a "business-as-usual" future without significant climate mitigation efforts.',
    es: 'Este escenario calcula la rápida tasa de calentamiento observada entre 1975 y 2000. Luego, proyecta esta tendencia agresiva y sin control hacia adelante desde el año 2000, ilustrando un futuro de "seguir como hasta ahora" sin esfuerzos significativos de mitigación climática.',
  },
};

export const generateSimulation = (historicalData: DataPoint[], scenarioId: ScenarioId): DataPoint[] => {
  const scenario = getScenarios('en')[scenarioId]; // language doesn't matter for logic
  const simulatedData: DataPoint[] = [];

  switch (scenarioId) {
    case 'NO_AEROSOL_COOLING': {
      const trendData = historicalData.filter(d => d.year >= 1910 && d.year <= 1945);
      const { slope, intercept } = linearRegression(trendData);
      for (let year = scenario.startYear; year <= 2024; year++) {
        simulatedData.push({ year, anomaly: slope * year + intercept });
      }
      break;
    }
    case 'EARLY_ACTION': {
      let reductionFactor = 0;
      for (let year = scenario.startYear; year <= 2024; year++) {
        const baseAnomaly = historicalData.find(d => d.year === year)?.anomaly || 0;
        reductionFactor += 0.0003; // Cumulative effect of policies
        simulatedData.push({ year, anomaly: baseAnomaly - reductionFactor * (year - scenario.startYear) });
      }
      break;
    }
    case 'ACCELERATED_WARMING': {
      const trendData = historicalData.filter(d => d.year >= 1975 && d.year <= 2000);
      const { slope, intercept } = linearRegression(trendData);
       const lastHistoricalYear = historicalData[historicalData.length-1].year;
      for (let year = scenario.startYear; year <= lastHistoricalYear + 50; year++) {
        simulatedData.push({ year, anomaly: slope * year + intercept });
      }
      break;
    }
  }
  return simulatedData;
};