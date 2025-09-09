import type { QuizQuestion } from '../types';

interface QuizContent {
  [key: string]: {
    title: string;
    questions: QuizQuestion[];
  };
}

export const quizContent: QuizContent = {
  es: {
    title: "Prueba de Conocimiento Climático",
    questions: [
      {
        question: "¿Qué es el 'albedo'?",
        options: [
          "Un tipo de gas de efecto invernadero.",
          "La fracción de luz solar que una superficie refleja.",
          "La medida del calor en el océano.",
          "Un acuerdo climático internacional."
        ],
        correctAnswer: "La fracción de luz solar que una superficie refleja.",
        explanation: "El albedo es clave para el balance energético de la Tierra. Superficies claras como el hielo tienen un albedo alto (reflejan mucho) y enfrían el planeta, mientras que superficies oscuras como el océano tienen un albedo bajo (absorben mucho) y lo calientan."
      },
      {
        question: "¿Cuál es la principal causa del aumento del nivel del mar?",
        options: [
          "El derretimiento de icebergs.",
          "La expansión térmica del agua del océano y el derretimiento de hielos terrestres.",
          "Más lluvias sobre el océano.",
          "Cambios en las corrientes oceánicas."
        ],
        correctAnswer: "La expansión térmica del agua del océano y el derretimiento de hielos terrestres.",
        explanation: "El océano se calienta y sus aguas se expanden. Además, el agua de glaciares y capas de hielo en tierra firme (Groenlandia, Antártida) se derrite y fluye hacia el mar. El derretimiento de hielo que ya flota (icebergs) no eleva el nivel del mar."
      },
      {
        question: "¿Qué organismo científico evalúa la ciencia relacionada con el cambio climático para los gobiernos?",
        options: [
          "NASA",
          "NOAA",
          "IPCC",
          "Copernicus"
        ],
        correctAnswer: "IPCC",
        explanation: "El Panel Intergubernamental sobre Cambio Climático (IPCC) es el organismo de las Naciones Unidas encargado de proporcionar evaluaciones científicas periódicas sobre el cambio climático, sus implicaciones y riesgos."
      },
      {
        question: "El concepto de 'presupuesto de carbono' se refiere a:",
        options: [
          "El costo de las políticas climáticas.",
          "La cantidad de CO₂ que un país puede emitir.",
          "La cantidad total de CO₂ que aún se puede emitir para no superar un límite de calentamiento.",
          "Un impuesto sobre las emisiones de carbono."
        ],
        correctAnswer: "La cantidad total de CO₂ que aún se puede emitir para no superar un límite de calentamiento.",
        explanation: "Es una forma de cuantificar cuánto 'espacio' de emisión nos queda para limitar el calentamiento global a objetivos como 1.5°C o 2°C, según lo establecido en el Acuerdo de París."
      },
       {
        question: "¿Qué es la 'acidificación oceánica'?",
        options: [
          "La contaminación del océano con productos químicos ácidos.",
          "El aumento de la temperatura del océano.",
          "La disminución del pH del océano debido a la absorción de CO₂.",
          "La pérdida de oxígeno en el agua del mar."
        ],
        correctAnswer: "La disminución del pH del océano debido a la absorción de CO₂.",
        explanation: "Alrededor de un cuarto del CO₂ que emitimos es absorbido por el océano. Esto provoca una reacción química que reduce el pH del agua, haciéndola más ácida. Afecta a organismos con conchas o esqueletos de carbonato de calcio, como corales y moluscos."
      },
    ]
  },
  en: {
    title: "Climate Knowledge Quiz",
    questions: [
        {
            question: "What is 'albedo'?",
            options: [
                "A type of greenhouse gas.",
                "The fraction of sunlight that a surface reflects.",
                "The measure of heat in the ocean.",
                "An international climate agreement."
            ],
            correctAnswer: "The fraction of sunlight that a surface reflects.",
            explanation: "Albedo is key to the Earth's energy balance. Light surfaces like ice have a high albedo (reflect a lot) and cool the planet, while dark surfaces like the ocean have a low albedo (absorb a lot) and warm it."
        },
        {
            question: "What is the main cause of sea level rise?",
            options: [
                "Melting icebergs.",
                "Thermal expansion of ocean water and melting of land-based ice.",
                "More rainfall over the ocean.",
                "Changes in ocean currents."
            ],
            correctAnswer: "Thermal expansion of ocean water and melting of land-based ice.",
            explanation: "The ocean warms and its water expands. Additionally, water from glaciers and ice sheets on land (Greenland, Antarctica) melts and flows into the sea. Melting of already floating ice (icebergs) does not raise the sea level."
        },
        {
            question: "Which scientific body assesses the science related to climate change for governments?",
            options: [
                "NASA",
                "NOAA",
                "IPCC",
                "Copernicus"
            ],
            correctAnswer: "IPCC",
            explanation: "The Intergovernmental Panel on Climate Change (IPCC) is the United Nations body responsible for providing periodic scientific assessments on climate change, its implications, and risks."
        },
        {
            question: "The concept of a 'carbon budget' refers to:",
            options: [
                "The cost of climate policies.",
                "The amount of CO₂ a country is allowed to emit.",
                "The total amount of CO₂ that can still be emitted without exceeding a certain warming limit.",
                "A tax on carbon emissions."
            ],
            correctAnswer: "The total amount of CO₂ that can still be emitted without exceeding a certain warming limit.",
            explanation: "It is a way to quantify how much 'emission space' we have left to limit global warming to targets like 1.5°C or 2°C, as established in the Paris Agreement."
        },
        {
            question: "What is 'ocean acidification'?",
            options: [
                "The contamination of the ocean with acidic chemicals.",
                "The increase in ocean temperature.",
                "The decrease in the pH of the ocean due to the absorption of CO₂.",
                "The loss of oxygen in seawater."
            ],
            correctAnswer: "The decrease in the pH of the ocean due to the absorption of CO₂.",
            explanation: "About a quarter of the CO₂ we emit is absorbed by the ocean. This causes a chemical reaction that reduces the water's pH, making it more acidic. It affects organisms with calcium carbonate shells or skeletons, such as corals and mollusks."
        }
    ]
  }
};
