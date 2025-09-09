// FIX: Fix import paths to be relative.
import type { GlossaryTerm } from '../types';

interface GlossaryContent {
  title: string;
  categories: string[];
  terms: GlossaryTerm[];
}

const glossaryContentEs: GlossaryContent = {
  title: 'Glosario Climático Interactivo',
  categories: [
    "Conceptos Fundamentales",
    "Medición y Modelos",
    "Impactos y Riesgos",
    "Soluciones y Políticas",
    "Actores y Acuerdos",
  ],
  terms: [
      { name: "Acidificación oceánica", definition: "Disminución del pH del océano por absorción de CO₂ atmosférico; afecta corales, moluscos y redes tróficas.", category: "Impactos y Riesgos", relatedTerms: ["Sumideros de carbono", "Contenido de calor oceánico"] },
      { name: "Adaptación (climática)", definition: "Ajustes en sistemas humanos o naturales para reducir daños o aprovechar oportunidades derivadas del clima cambiante.", category: "Soluciones y Políticas", relatedTerms: ["Resiliencia", "Vulnerabilidad"] },
      { name: "Albedo", definition: "Fracción de radiación solar reflejada por una superficie (hielo alto, océano bajo); un albedo menor favorece el calentamiento.", category: "Conceptos Fundamentales", relatedTerms: ["Forzamiento radiativo", "Retroalimentación"] },
      { name: "AMOC (Circulación de vuelco del Atlántico)", definition: "Sistema de corrientes (incl. Corriente del Golfo) que redistribuye calor; su debilitamiento altera climas regionales.", category: "Conceptos Fundamentales", relatedTerms: ["Variabilidad interna"] },
      { name: "Anomalía de temperatura", definition: "Diferencia entre la temperatura observada y una línea base (periodo de referencia).", category: "Medición y Modelos", relatedTerms: ["Línea base", "GISTEMP"] },
      { name: "Atribución", definition: "Estimación de cuánto contribuyen causas humanas o naturales a un cambio observado (p. ej., una ola de calor).", category: "Medición y Modelos", relatedTerms: ["Detección", "Modelos climáticos"] },
      { name: "Balance radiativo terrestre", definition: "Igualdad (o no) entre energía solar entrante y energía infrarroja saliente; su ruptura implica cambio climático.", category: "Conceptos Fundamentales", relatedTerms: ["Forzamiento radiativo", "Efecto invernadero"] },
      { name: "BECCS", definition: "Bioenergía con Captura y Almacenamiento de Carbono; potencial de “emisiones negativas”.", category: "Soluciones y Políticas", relatedTerms: ["CAC / CCUS", "Mitigación"] },
      { name: "CAC / CCUS", definition: "Captura, uso y almacenamiento de CO₂ de fuentes puntuales o del aire (DAC).", category: "Soluciones y Políticas", relatedTerms: ["BECCS", "DAC"] },
      { name: "Carbono azul", definition: "CO₂ capturado por ecosistemas costeros (manglares, marismas, pastos marinos).", category: "Conceptos Fundamentales", relatedTerms: ["Sumideros de carbono"] },
      { name: "Cero neto (Net Zero)", definition: "Balance entre GEI emitidos y removidos de la atmósfera.", category: "Soluciones y Políticas", relatedTerms: ["Presupuesto de carbono", "Descarbonización"] },
      { name: "Clima vs. tiempo", definition: "El tiempo es el estado atmosférico a corto plazo; el clima son promedios y extremos a largo plazo (≥30 años).", category: "Conceptos Fundamentales" },
      { name: "Contenido de calor oceánico (OHC)", definition: "Energía térmica acumulada en el océano; absorbe >90% del exceso de calor del sistema climático.", category: "Impactos y Riesgos", relatedTerms: ["Acidificación oceánica", "Nivel del mar"] },
      { name: "Copernicus / C3S", definition: "Programa de la Unión Europea que provee datos y servicios climáticos de referencia.", category: "Actores y Acuerdos" },
      { name: "DAC (Captura Directa del Aire)", definition: "Tecnologías que extraen CO₂ directamente del aire ambiental.", category: "Soluciones y Políticas", relatedTerms: ["CAC / CCUS"] },
      { name: "Descarbonización", definition: "Proceso de reducción de emisiones de gases de efecto invernadero, especialmente CO₂, en la economía.", category: "Soluciones y Políticas", relatedTerms: ["Cero neto", "Transición energética"] },
      { name: "Efecto invernadero", definition: "Calentamiento natural de la Tierra por gases que atrapan el calor. Su intensificación por la actividad humana causa el calentamiento global.", category: "Conceptos Fundamentales", relatedTerms: ["GEI", "Forzamiento radiativo"] },
      { name: "El Niño / La Niña (ENSO)", definition: "Variabilidad natural del Pacífico tropical que modula temporalmente la temperatura global.", category: "Conceptos Fundamentales", relatedTerms: ["Variabilidad interna"] },
      { name: "Escenarios RCP/SSP", definition: "Trayectorias futuras de emisiones y desarrollo socioeconómico usadas por el IPCC para proyecciones climáticas.", category: "Medición y Modelos", relatedTerms: ["Modelos climáticos", "IPCC"] },
      { name: "Forzamiento radiativo (W/m²)", definition: "Cambio en el balance energético de la Tierra por una perturbación (CO₂, aerosoles, Sol). Un valor positivo calienta, uno negativo enfría.", category: "Conceptos Fundamentales", relatedTerms: ["Balance radiativo terrestre", "Albedo"] },
      { name: "GEI (Gases de Efecto Invernadero)", definition: "Gases como CO₂, CH₄, N₂O que atrapan calor en la atmósfera.", category: "Conceptos Fundamentales", relatedTerms: ["Efecto invernadero"] },
      { name: "GISTEMP", definition: "Conjunto de datos de temperatura global mantenido por el Instituto Goddard de Estudios Espaciales (GISS) de la NASA.", category: "Medición y Modelos", relatedTerms: ["Anomalía de temperatura", "NOAA"] },
      { name: "IPCC", definition: "Panel Intergubernamental sobre Cambio Climático; organismo de la ONU que evalúa la ciencia del clima para los gobiernos.", category: "Actores y Acuerdos" },
      { name: "Línea base", definition: "Periodo de referencia usado para calcular anomalías (p. ej., 1951–1980 en GISTEMP de NASA).", category: "Medición y Modelos", relatedTerms: ["Anomalía de temperatura"] },
      { name: "Mitigación", definition: "Acciones para reducir las fuentes de gases de efecto invernadero o aumentar sus sumideros.", category: "Soluciones y Políticas", relatedTerms: ["Adaptación", "Cero neto"] },
      { name: "Modelos climáticos (GCM/ESM)", definition: "Simulaciones por ordenador del sistema climático de la Tierra usadas para entender el pasado y proyectar el futuro.", category: "Medición y Modelos", relatedTerms: ["Escenarios RCP/SSP", "Atribución"] },
      { name: "NDC", definition: "Contribuciones Determinadas a Nivel Nacional; los compromisos de cada país bajo el Acuerdo de París.", category: "Actores y Acuerdos" },
      { name: "Nivel del mar (SLR)", definition: "Aumento del nivel medio del mar global debido a la expansión térmica del océano y la fusión de hielos terrestres.", category: "Impactos y Riesgos", relatedTerms: ["Contenido de calor oceánico"] },
      { name: "NOAA", definition: "Administración Nacional Oceánica y Atmosférica de EE. UU.; una fuente clave de datos climáticos.", category: "Actores y Acuerdos", relatedTerms: ["GISTEMP"] },
      { name: "Permafrost", definition: "Suelo que permanece congelado por dos o más años consecutivos; al derretirse puede liberar grandes cantidades de CO₂ y metano.", category: "Impactos y Riesgos", relatedTerms: ["Retroalimentación"] },
      { name: "Pérdidas y daños", definition: "Impactos climáticos que van más allá de lo que se puede adaptar, como la pérdida de tierras o cultura.", category: "Impactos y Riesgos", relatedTerms: ["Vulnerabilidad"] },
      { name: "Presupuesto de carbono", definition: "Cantidad total de CO₂ que aún se puede emitir para mantener el calentamiento por debajo de un límite (p. ej., 1.5°C).", category: "Soluciones y Políticas", relatedTerms: ["Cero neto"] },
      { name: "Resiliencia", definition: "Capacidad de un sistema para anticipar, absorber, adaptarse o recuperarse de impactos climáticos.", category: "Soluciones y Políticas", relatedTerms: ["Adaptación"] },
      { name: "Retroalimentación (feedback)", definition: "Proceso en el que un cambio inicial desencadena otro que a su vez influye en el primero (p. ej., el derretimiento del hielo reduce el albedo, lo que causa más calentamiento).", category: "Conceptos Fundamentales", relatedTerms: ["Albedo", "Permafrost"] },
      { name: "Sensibilidad climática (ECS)", definition: "Calentamiento estimado en equilibrio si se duplica la concentración de CO₂ en la atmósfera (mejor estimación del IPCC ~3 °C).", category: "Medición y Modelos", relatedTerms: ["Modelos climáticos"] },
      { name: "Sumideros de carbono", definition: "Sistemas naturales (océanos, bosques) que absorben y almacenan CO₂ de la atmósfera.", category: "Conceptos Fundamentales", relatedTerms: ["Acidificación oceánica", "Carbono azul"] },
      { name: "Transición energética", definition: "Cambio estructural del sistema energético, pasando de combustibles fósiles a fuentes de bajas o nulas emisiones de carbono.", category: "Soluciones y Políticas", relatedTerms: ["Descarbonización", "Mitigación"] },
      { name: "Variabilidad interna", definition: "Fluctuaciones naturales del sistema climático no forzadas por factores externos (p. ej., ENSO, AMOC).", category: "Conceptos Fundamentales" },
      { name: "Vulnerabilidad", definition: "Propensión o predisposición de un sistema a ser afectado negativamente por los peligros climáticos.", category: "Impactos y Riesgos", relatedTerms: ["Adaptación", "Resiliencia"] },
  ]
};

const glossaryContentEn: GlossaryContent = {
  title: 'Interactive Climate Glossary',
  categories: [],
  terms: [
      { name: 'Content unavailable', definition: 'This interactive glossary is currently only available in Spanish. Please switch the language to view the content.', category: 'Info' }
  ]
};

export const glossaryContent = {
  es: glossaryContentEs,
  en: glossaryContentEn,
};