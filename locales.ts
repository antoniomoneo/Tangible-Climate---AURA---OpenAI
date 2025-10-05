// FIX: This file was a placeholder. Populating with full content.
import type { StorySegment } from './types';
import { GRAPH_OVERVIEW_IMAGE, MUSEUM_EXTERIOR_IMAGE } from './assets';
import { questGameData as questGameDataJS } from './data/questGameData.js';

export interface QuestChoice {
  action: string;
  result: string;
  reward?: { type: 'item' | 'score' | 'access' | 'clue'; value: string | number };
  punishment?: { type: 'score' | 'item_loss' | 'trap'; value: number | string };
  nextChapterId?: number;
  endsGame?: 'win' | 'lose';
}

export interface QuestChapter {
  id: number;
  name: string;
  description: string;
  choices: QuestChoice[];
}

export interface QuestGameData {
  title: string;
  intro: string;
  finale: {
    good_ending: string;
    bad_ending: string;
  };
  chapters: QuestChapter[];
}

// FIX: Cast questGameDataJS to the correct type to resolve type incompatibility when importing from a JavaScript file.
// The JS type inference is too wide (e.g., `string` instead of a literal union type), so an explicit type assertion is needed.
export const questGameData: { en: QuestGameData; es: QuestGameData } = questGameDataJS as { en: QuestGameData; es: QuestGameData };

export const storyData: {
  en: { [key: string]: StorySegment };
  es: { [key: string]: StorySegment };
} = {
  en: {
    start: {
      id: 'start',
      sceneDescription: "The analysis begins. The global temperature anomaly data from 1880 to 2024 is available. Where should we focus our investigation? This dataset, based on NASA's GISTEMP v4, represents the deviation from the 1951-1980 baseline.",
      image: GRAPH_OVERVIEW_IMAGE,
      choices: [
        { text: 'Analyze the early industrial period (1880-1945)', nextSceneId: 'era_industrial' },
        { text: 'Examine the "Great Acceleration" (1945-1975)', nextSceneId: 'era_acceleration' },
        { text: 'Investigate the modern warming period (1975-Present)', nextSceneId: 'era_modern' },
      ],
      chartConfig: {
        startYear: 1880,
        endYear: 2024,
      },
    },
    era_industrial: {
      id: 'era_industrial',
      sceneDescription: "From 1880 to 1945, we observe a slow but steady increase in temperature anomalies, with significant fluctuations. This period saw two world wars and the rise of industrial economies. The overall trend is a warming of about +0.5°C, but with high variability. What's next?",
      choices: [
        { text: 'Compare with the next era', nextSceneId: 'era_acceleration' },
        { text: 'Conclude analysis', nextSceneId: 'conclusion_industrial' },
      ],
      chartConfig: {
        startYear: 1880,
        endYear: 1945,
      },
    },
    era_acceleration: {
      id: 'era_acceleration',
      sceneDescription: "The post-war period from 1945 to 1975 is curious. Despite a boom in industrial activity, global temperatures plateaued and even slightly decreased. This is often attributed to the cooling effect of industrial aerosols (air pollution) masking the warming from greenhouse gases. What's next?",
      choices: [
        { text: 'Investigate the recent, rapid warming', nextSceneId: 'era_modern' },
        { text: 'Conclude analysis', nextSceneId: 'conclusion_aerosols' },
      ],
      chartConfig: {
        startYear: 1945,
        endYear: 1975,
      },
    },
    era_modern: {
      id: 'era_modern',
      sceneDescription: "From 1975 onwards, the warming trend becomes steep and undeniable. Clean air acts reduced cooling aerosols, unmasking the potent effect of rising CO2 levels. Temperatures have risen sharply, with new records being set almost every year in the 21st century. The anomaly now exceeds +1.2°C.",
      choices: [
        { text: 'Examine the 21st century in detail', nextSceneId: 'era_21st_century' },
        { text: 'Conclude analysis', nextSceneId: 'conclusion_modern' },
      ],
      chartConfig: {
        startYear: 1975,
        endYear: 2024,
      },
    },
    era_21st_century: {
        id: 'era_21st_century',
        sceneDescription: "The 21st century shows an alarming acceleration. The top 10 warmest years on record have all occurred since 2010. The data clearly indicates we are in an era of unprecedented climate change driven by human activity. This is the final step of the analysis.",
        image: MUSEUM_EXTERIOR_IMAGE,
        choices: [],
        chartConfig: {
            startYear: 2000,
            endYear: 2024
        }
    },
    conclusion_industrial: {
      id: 'conclusion_industrial',
      sceneDescription: 'Conclusion: The early industrial era laid the groundwork for future climate change, but natural variability and lower emission rates kept the trend relatively moderate. The signal of anthropogenic warming was present, but not yet dominant.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
    conclusion_aerosols: {
      id: 'conclusion_aerosols',
      sceneDescription: 'Conclusion: The "Great Acceleration" period highlights the complex interplay of human activities. While CO2 was rising, other pollutants temporarily masked its effect, leading to a dangerous misperception that warming had stopped. This underscores the importance of understanding all climate forcings.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
    conclusion_modern: {
      id: 'conclusion_modern',
      sceneDescription: 'Conclusion: The modern era shows an unambiguous, accelerating warming trend driven by greenhouse gas emissions. The data is clear: the climate is changing rapidly, and the consequences are becoming more apparent.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
  },
  es: {
    start: {
      id: 'start',
      sceneDescription: "Comienza el análisis. Los datos de la anomalía de la temperatura global de 1880 a 2024 están disponibles. ¿Dónde deberíamos centrar nuestra investigación? Este conjunto de datos, basado en GISTEMP v4 de la NASA, representa la desviación con respecto a la línea de base de 1951-1980.",
      image: GRAPH_OVERVIEW_IMAGE,
      choices: [
        { text: 'Analizar el período industrial temprano (1880-1945)', nextSceneId: 'era_industrial' },
        { text: 'Examinar la "Gran Aceleración" (1945-1975)', nextSceneId: 'era_acceleration' },
        { text: 'Investigar el período de calentamiento moderno (1975-Presente)', nextSceneId: 'era_modern' },
      ],
      chartConfig: {
        startYear: 1880,
        endYear: 2024,
      },
    },
    era_industrial: {
      id: 'era_industrial',
      sceneDescription: "De 1880 a 1945, observamos un aumento lento pero constante en las anomalías de temperatura, con fluctuaciones significativas. Este período vio dos guerras mundiales y el auge de las economías industriales. La tendencia general es un calentamiento de aproximadamente +0.5°C, pero con alta variabilidad. ¿Qué sigue?",
      choices: [
        { text: 'Comparar con la siguiente era', nextSceneId: 'era_acceleration' },
        { text: 'Concluir análisis', nextSceneId: 'conclusion_industrial' },
      ],
      chartConfig: {
        startYear: 1880,
        endYear: 1945,
      },
    },
    era_acceleration: {
      id: 'era_acceleration',
      sceneDescription: "El período de posguerra de 1945 a 1975 es curioso. A pesar del auge de la actividad industrial, las temperaturas globales se estancaron e incluso disminuyeron ligeramente. Esto a menudo se atribuye al efecto de enfriamiento de los aerosoles industriales (contaminación del aire) que enmascararon el calentamiento de los gases de efecto invernadero. ¿Qué sigue?",
      choices: [
        { text: 'Investigar el calentamiento rápido reciente', nextSceneId: 'era_modern' },
        { text: 'Concluir análisis', nextSceneId: 'conclusion_aerosols' },
      ],
      chartConfig: {
        startYear: 1945,
        endYear: 1975,
      },
    },
    era_modern: {
      id: 'era_modern',
      sceneDescription: "A partir de 1975, la tendencia al calentamiento se vuelve pronunciada e innegable. Las leyes de aire limpio redujeron los aerosoles de enfriamiento, desenmascarando el potente efecto del aumento de los niveles de CO2. Las temperaturas han aumentado bruscamente, con nuevos récords establecidos casi todos los años en el siglo XXI. La anomalía ahora supera los +1.2°C.",
      choices: [
        { text: 'Examinar el siglo XXI en detalle', nextSceneId: 'era_21st_century' },
        { text: 'Concluir análisis', nextSceneId: 'conclusion_modern' },
      ],
      chartConfig: {
        startYear: 1975,
        endYear: 2024,
      },
    },
    era_21st_century: {
        id: 'era_21st_century',
        sceneDescription: "El siglo XXI muestra una aceleración alarmante. Los 10 años más cálidos registrados han ocurrido desde 2010. Los datos indican claramente que estamos en una era de cambio climático sin precedentes impulsado por la actividad humana. Este es el paso final del análisis.",
        image: MUSEUM_EXTERIOR_IMAGE,
        choices: [],
        chartConfig: {
            startYear: 2000,
            endYear: 2024
        }
    },
    conclusion_industrial: {
      id: 'conclusion_industrial',
      sceneDescription: 'Conclusión: La era industrial temprana sentó las bases para el futuro cambio climático, pero la variabilidad natural y las tasas de emisión más bajas mantuvieron la tendencia relativamente moderada. La señal del calentamiento antropogénico estaba presente, pero aún no era dominante.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
    conclusion_aerosols: {
      id: 'conclusion_aerosols',
      sceneDescription: 'Conclusión: El período de la "Gran Aceleración" destaca la compleja interacción de las actividades humanas. Mientras el CO2 aumentaba, otros contaminantes enmascararon temporalmente su efecto, lo que llevó a una peligrosa percepción errónea de que el calentamiento se había detenido. Esto subraya la importancia de comprender todos los forzamientos climáticos.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
    conclusion_modern: {
      id: 'conclusion_modern',
      sceneDescription: 'Conclusión: La era moderna muestra una tendencia de calentamiento inequívoca y acelerada, impulsada por las emisiones de gases de efecto invernadero. Los datos son claros: el clima está cambiando rápidamente y las consecuencias son cada vez más evidentes.',
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: [],
    },
  },
};

export const locales = {
  en: {
    // Splash
    splashGretting: "presents",
    splashCollabIntro: "In collaboration with:",
    splashCollabPartner: "Spanish National Museum of Natural Sciences (MNCN-CSIC)",
    splashTitle: "Tangible Climate Data",
    splashSubtitle: "An Interactive Data Experience",
    skipButton: "Skip",
    
    // Start Screen
    auraStartMessage: "Welcome. I am AURA, your climate data analysis assistant.",
    auraSecondMessage: "Together, we will explore 145 years of global temperature data to understand the story of our changing planet. When you're ready to begin, press Start.",
    start: "Start Analysis",
    
    // Header
    headerAppHubButton: "App Hub",
    headerInstructionsButton: "Instructions",
    headerAboutButton: "About", // used in Header.tsx via appHubAboutTitle
    
    // App Hub
    appHubTitle: "Application Hub",
    appHubSubtitle: "Select an experience to explore climate data in a new way.",
    appHubChatTitle: "Ask AURA",
    appHubChatDesc: "Have a conversation with our AI assistant about climate change.",
    appHubDataExplorerTitle: "Data Explorer",
    appHubDataExplorerDesc: "A guided journey through historical temperature anomalies.",
    appHubDashboardTitle: "Full Dashboard",
    appHubDashboardDesc: "View the complete 1880-2024 temperature anomaly chart.",
    appHubCalendarTitle: "Events Calendar",
    appHubCalendarDesc: "See upcoming climate-related events and exhibitions.",
    appHubInstructionsTitle: "Instructions",
    appHubInstructionsDesc: "Learn how to navigate and use this interactive experience.",
    appHubAboutTitle: "About This Project",
    appHubAboutDesc: "Discover the mission and creators behind this data visualization.",
    appHubKnowledgeBaseTitle: "Knowledge Base",
    appHubKnowledgeBaseDesc: "Read a detailed report on the science of climate change.",
    appHubJoinUsTitle: "Join Us",
    appHubJoinUsDesc: "Find out how to collaborate or get in touch with Tangible Data.",
    appHubScenarioLabTitle: "Scenario Lab",
    appHubScenarioLabDesc: "Simulate 'what if' climate scenarios and see their impact.",
    appHubGlossaryTitle: "Climate Glossary",
    appHubGlossaryDesc: "An interactive dictionary of key climate change terms.",
    appHubARTitle: "AR Mode",
    appHubARDesc: "Visualize the data sculpture in your own environment.",
    appHubVRTitle: "VR Experience",
    appHubVRDesc: "Step into a virtual space and see the data sculpture up close.",
    appHubEducationalPackTitle: "Educational Pack",
    appHubEducationalPackDesc: "Resources for teachers and students to learn about climate data.",
    appHubNFTTitle: "NFT Collection",
    appHubNFTDesc: "Explore our collection of data-driven art on the blockchain.",
    appHubCrazyVizTitle: "Generative Art",
    appHubCrazyVizDesc: "A creative, sound-reactive visualization of the temperature data.",

    appHubQuestTitle: 'Climate Quest',
    appHubQuestDesc: 'A retro text adventure into the future of climate data.',

    appHubCreditsTitle: 'Credits',
    appHubCreditsDesc: 'View the team and technologies behind this project.',

    appHubComingSoon: "Coming Soon",
    appHubAddYourAppTitle: "Add Your App!",
    appHubAddYourAppDesc: "Contact us to integrate your climate data application.",
    
    // Game Screen
    gameTitle: "Data Analysis",
    whatToDo: "What should we do next?",
    
    // Game Over
    gameOverTitle: "Analysis Complete",
    gameOverRestart: "Start New Analysis",
    
    // Dashboard
    dashboardTitle: "Global Temperature Anomaly (1880-2024)",
    dashboardDescription: "This chart shows the deviation of global surface temperatures from the 1951-1980 average. Positive values indicate warming, while negative values indicate cooling.",
    dashboardBack: "Back",
    
    // Error
    errorTitle: "An Error Occurred",
    errorTryAgain: "Try Again",
    
    // About Modal
    aboutTitle: "About Tangible Climate Data",
    intro: "This interactive experience is a digital companion to the 'Climate Change Skeleton', a data sculpture created by Antonio Moneo Laín and David San Román Gomendio, and commissioned by the Spanish National Museum of Natural Sciences (MNCN-CSIC) in Madrid.",
    objective: "Our goal is to make complex climate data accessible, engaging, and understandable for a broad audience. By transforming raw data into a story, we hope to foster a deeper connection with the urgent issue of climate change.",
    aboutCredit: "A project by",
    
    // Chat
    chatTitle: "Ask AURA",
    chatPlaceholder: "Ask a question about the data...",
    chatSend: "Send",
    chatError: "Sorry, I encountered an error. Please try again.",
    chatSystemInstruction: "You are AURA, a helpful AI assistant for the Tangible Climate Data project. Your purpose is to answer user questions about climate change, the data visualization they are seeing, and the science behind it. Be concise, informative, and maintain a neutral, scientific tone. The user is currently interacting with a data visualization of global temperature anomalies from 1880-2024.",
    chatSystemInstructionReport: "You are AURA, an expert AI assistant. The user is asking questions about the following scientific report. Answer based *only* on the provided text. If the answer is not in the text, say that the information is not available in the report.",
    chatExplainTermSystemInstruction: "You are AURA, an expert AI assistant. A user has asked for a more detailed explanation of a glossary term. The term is '{term}' and its definition is '{definition}'. Provide a slightly more detailed, easy-to-understand explanation of this concept. You can add a simple example if it helps.",

    // Instructions
    instructionsTitle: "How to Use This Experience",
    instructionsContent1: "Welcome to the Tangible Climate Data experience. Use the 'App Hub' to navigate between different interactive modules.",
    instructionsContent2: "In the 'Data Explorer', you will be guided through a narrative analysis of global temperature data. At each step, review the chart and text, then choose your next action to proceed.",
    instructionsContent3: "At any time, you can click the floating chat icon to ask AURA, our AI assistant, questions about what you are seeing or about climate change in general.",
    
    // Calendar
    calendarTitle: "Exhibitions & Events",
    calendarLoading: "Loading calendar...",
    calendarError: "Could not load calendar data. Please try again later.",
    calendarNoEvents: "There are no upcoming events scheduled at this time.",
    
    // Knowledge Base
    knowledgeBaseBack: "Back to Hub",
    knowledgeBaseAskReport: "Ask About This Report",
    
    // Join Us
    joinUsModalTitle: "Collaborate With Us",
    joinUsModalContent: "Tangible Data is dedicated to creating meaningful data experiences. If you are an artist, scientist, developer, or institution interested in collaborating, we'd love to hear from you.",
    joinUsModalWebsiteButton: "Visit Our Website",
    joinUsModalEmailLink: "Or email us at:",
    
    // Scenario Lab
    scenarioLabTitle: "Scenario Lab",
    scenarioLabSelectPreset: "Select a Preset Scenario",
    scenarioLabCustomAi: "Create with AI",
    scenarioLabCustomAiDesc: "Describe a scenario and let AI generate a plausible data projection.",
    scenarioLabCustomAiPlaceholder: "e.g., 'What if we discovered clean fusion energy in 2030?'",
    scenarioLabGenerateButton: "Generate AI Scenario",
    scenarioLabGeneratingButton: "Generating...",
    scenarioLabAiError: "AI scenario generation failed.",
    scenarioLabChartTitle: "Historical Data vs. Simulated Scenario",
    scenarioLabChartYAxis: "Anomaly (°C)",
    scenarioLabChartReal: "Real Data",
    scenarioLabAiLogic: "AI Simulation Logic",
    scenarioLabPresetLogic: "Preset Logic",

    // Glossary
    glossarySearchPlaceholder: "Search terms...",
    glossaryAllCategories: "All Categories",
    glossarySeeAlso: "See Also",
    glossaryAskAura: "Ask AURA for a deeper explanation",
    glossaryNoResults: "No terms found.",
    glossaryBackToList: "Back to List",
    glossaryViewList: "List",
    glossaryViewMindMap: "Mind Map",
    glossaryViewQuiz: "Quiz",
    mindMapControls: "Scroll to zoom, drag to pan.",
    mindMapResetView: "Reset View",
    mindMapInstructions: "Select a node on the map to see its definition here.",

    // Quiz
    quizCompletedTitle: "Quiz Complete!",
    quizCompletedScore: "You scored {score} out of {total}.",
    quizRestart: "Try Again",
    quizClose: "Close",
    quizQuestionLabel: "Question {current} of {total}",
    quizNext: "Next Question",
    quizFinish: "Finish Quiz",

    // AR Mode
    arModeInstruction: "Point your camera at a flat surface to visualize the data.",

    // VR Mode
    vrModeInstruction: "Enter VR to immerse yourself with the data sculpture.",
    vrModeLoading: "Loading 3D model...",
    vrModeError: "Could not load 3D model. Please try again.",
    vrModeEnterVR: "Enter VR",
    vrModeExitVR: "Exit VR",
    vrModeBackToHub: "Back to Hub",
    
    // Crazy Viz
    crazyVizTitle: "Generative Art Viz",
    crazyVizDownloading: "Preparing download...",
    crazyVizRecord: "Record Video",
    crazyVizStopRecording: "Stop Recording",
    crazyVizPlay: "Play",
    crazyVizPause: "Pause",
    crazyVizControlsTitle: "Modulators",
    crazyVizControlsSpeed: "Speed",
    crazyVizControlsParticles: "Particles",
    crazyVizControlsTrail: "Trail Length",
    crazyVizControlsComplexity: "Complexity",
    crazyVizControlsFlow: "Flow Strength",
    
    // Educational Pack
    educationalPackTitle: "Educational Pack",
    educationalPackContent: `
        <p class="mb-4">The Tangible Data Educational Program offers resources for educators and students to explore climate science through data visualization and interactive tools. Our goal is to make climate education engaging and accessible.</p>
        <h4 class="text-xl font-bold text-cyan-400 mb-2">What's Included:</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
            <li>Lesson plans aligned with curriculum standards.</li>
            <li>Student worksheets and guided activities.</li>
            <li>A guide to using this interactive web application in the classroom.</li>
            <li>High-resolution data charts and graphics.</li>
        </ul>
        <p>To access the full educational pack and learn more about our school programs, please visit our website.</p>
        <div class="mt-6 text-center">
            <a href="https://tangibledata.xyz/tangible-data-educational-program/" target="_blank" rel="noopener noreferrer" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Go to Educational Program
            </a>
        </div>
    `,

    // Credits
    creditsModalContent: `
      <h3 class="text-xl font-bold text-cyan-400 mb-2">Project Team</h3>
      <p><strong>Sculpture Authors:</strong> Antonio Moneo Laín & David San Román Gomendio</p>
      <p><strong>App Design & Development:</strong> Antonio Moneo Laín</p>

      <h3 class="text-xl font-bold text-cyan-400 mt-4 mb-2">Collaboration</h3>
      <p>A project by <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Tangible Data</a> in collaboration with the <span class="font-semibold">Spanish National Museum of Natural Sciences (MNCN-CSIC)</span>.</p>
      
      <h3 class="text-xl font-bold text-cyan-400 mt-4 mb-2">Sources & Technology</h3>
      <p><strong>Temperature Data:</strong> GISTEMP v4, NASA Goddard Institute for Space Studies</p>
      <p><strong>Generative AI API:</strong> Google Gemini</p>
      <p><strong>Technology Stack:</strong> React, TypeScript, Tailwind CSS, Recharts</p>
    `,

    // Text Adventure Quest
    textAdventureQuestTitle: "Tangible Climate Quest",
    textAdventureQuestSubmit: "Enter",
    textAdventureQuestScore: "Score",
    textAdventureQuestInventory: "Inventory",
    textAdventureQuestRestart: "Restart Quest",
    textAdventureQuestWin: "MISSION COMPLETE",
    textAdventureQuestLose: "MISSION FAILED",
    textAdventureQuestHint: "Ask AURA for a Hint",
    textAdventureQuestSkeletonReconstruction: "Skeleton Reconstruction",

  },
  es: {
    // Splash
    splashGretting: "presenta",
    splashCollabIntro: "En colaboración con:",
    splashCollabPartner: "Museo Nacional de Ciencias Naturales (MNCN-CSIC)",
    splashTitle: "Datos Climáticos Tangibles",
    splashSubtitle: "Una Experiencia de Datos Interactiva",
    skipButton: "Saltar",

    // Start Screen
    auraStartMessage: "Bienvenido. Soy AURA, tu asistente de análisis de datos climáticos.",
    auraSecondMessage: "Juntos, exploraremos 145 años de datos de temperatura global para entender la historia de nuestro planeta cambiante. Cuando estés listo para comenzar, presiona Iniciar.",
    start: "Iniciar Análisis",
    
    // Header
    headerAppHubButton: "App Hub",
    headerInstructionsButton: "Instrucciones",
    headerAboutButton: "Acerca de",
    
    // App Hub
    appHubTitle: "Centro de Aplicaciones",
    appHubSubtitle: "Selecciona una experiencia para explorar los datos climáticos de una nueva manera.",
    appHubChatTitle: "Pregúntale a AURA",
    appHubChatDesc: "Conversa con nuestra asistente de IA sobre el cambio climático.",
    appHubDataExplorerTitle: "Explorador de Datos",
    appHubDataExplorerDesc: "Un viaje guiado a través de las anomalías históricas de temperatura.",
    appHubDashboardTitle: "Dashboard Completo",
    appHubDashboardDesc: "Visualiza el gráfico completo de anomalías de temperatura de 1880-2024.",
    appHubCalendarTitle: "Calendario de Eventos",
    appHubCalendarDesc: "Consulta los próximos eventos y exposiciones sobre el clima.",
    appHubInstructionsTitle: "Instrucciones",
    appHubInstructionsDesc: "Aprende a navegar y utilizar esta experiencia interactiva.",
    appHubAboutTitle: "Sobre Este Proyecto",
    appHubAboutDesc: "Descubre la misión y los creadores detrás de esta visualización de datos.",
    appHubKnowledgeBaseTitle: "Base de Conocimiento",
    appHubKnowledgeBaseDesc: "Lee un informe detallado sobre la ciencia del cambio climático.",
    appHubJoinUsTitle: "Únete a Nosotros",
    appHubJoinUsDesc: "Descubre cómo colaborar o ponerte en contacto con Tangible Data.",
    appHubScenarioLabTitle: "Laboratorio de Escenarios",
    appHubScenarioLabDesc: "Simula escenarios climáticos hipotéticos y observa su impacto.",
    appHubGlossaryTitle: "Glosario Climático",
    appHubGlossaryDesc: "Un diccionario interactivo de términos clave sobre cambio climático.",
    appHubARTitle: "Modo RA",
    appHubARDesc: "Visualiza la escultura de datos en tu propio entorno.",
    appHubVRTitle: "Experiencia RV",
    appHubVRDesc: "Entra en un espacio virtual y observa la escultura de datos de cerca.",
    appHubEducationalPackTitle: "Pack Educativo",
    appHubEducationalPackDesc: "Recursos para profesores y estudiantes para aprender sobre datos climáticos.",
    appHubNFTTitle: "Colección NFT",
    appHubNFTDesc: "Explora nuestra colección de arte basado en datos en la blockchain.",
    appHubCrazyVizTitle: "Arte Generativo",
    appHubCrazyVizDesc: "Una visualización creativa y reactiva al sonido de los datos de temperatura.",

    appHubQuestTitle: 'Misión Climática',
    appHubQuestDesc: 'Una aventura conversacional retro al futuro de los datos climáticos.',

    appHubCreditsTitle: 'Créditos',
    appHubCreditsDesc: 'Conoce al equipo y las tecnologías detrás de este proyecto.',

    appHubComingSoon: "Próximamente",
    appHubAddYourAppTitle: "¡Añade tu App!",
    appHubAddYourAppDesc: "Contáctanos para integrar tu aplicación de datos climáticos.",

    // Game Screen
    gameTitle: "Análisis de Datos",
    whatToDo: "¿Qué hacemos ahora?",
    
    // Game Over
    gameOverTitle: "Análisis Completado",
    gameOverRestart: "Iniciar Nuevo Análisis",
    
    // Dashboard
    dashboardTitle: "Anomalía de Temperatura Global (1880-2024)",
    dashboardDescription: "Este gráfico muestra la desviación de las temperaturas superficiales globales con respecto al promedio de 1951-1980. Los valores positivos indican calentamiento, mientras que los negativos indican enfriamiento.",
    dashboardBack: "Volver",
    
    // Error
    errorTitle: "Ocurrió un Error",
    errorTryAgain: "Intentar de Nuevo",
    
    // About Modal
    aboutTitle: "Sobre Datos Climáticos Tangibles",
    intro: "Esta experiencia interactiva es un complemento digital de la 'Escultura del Esqueleto del Cambio Climático', creada por Antonio Moneo Laín y David San Román Gomendio, por encargo del Museo Nacional de Ciencias Naturales (MNCN-CSIC) en Madrid.",
    objective: "Nuestro objetivo es hacer que los datos climáticos complejos sean accesibles, atractivos y comprensibles para un público amplio. Al transformar datos brutos en una historia, esperamos fomentar una conexión más profunda con el urgente problema del cambio climático.",
    aboutCredit: "Un proyecto de",

    // Chat
    chatTitle: "Pregúntale a AURA",
    chatPlaceholder: "Haz una pregunta sobre los datos...",
    chatSend: "Enviar",
    chatError: "Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.",
    chatSystemInstruction: "Eres AURA, una asistente de IA para el proyecto Datos Climáticos Tangibles. Tu propósito es responder preguntas de los usuarios sobre el cambio climático, la visualización de datos que están viendo y la ciencia detrás de ello. Sé concisa, informativa y mantén un tono neutral y científico. El usuario está interactuando con una visualización de datos de anomalías de temperatura global de 1880-2024.",
    chatSystemInstructionReport: "Eres AURA, una asistente experta de IA. El usuario está haciendo preguntas sobre el siguiente informe científico. Responde basándote *únicamente* en el texto proporcionado. Si la respuesta no está en el texto, di que la información no está disponible en el informe.",
    chatExplainTermSystemInstruction: "Eres AURA, una asistente experta de IA. Un usuario ha pedido una explicación más detallada de un término del glosario. El término es '{term}' y su definición es '{definition}'. Proporciona una explicación un poco más detallada y fácil de entender de este concepto. Puedes añadir un ejemplo sencillo si ayuda.",
    
    // Instructions
    instructionsTitle: "Cómo Usar Esta Experiencia",
    instructionsContent1: "Bienvenido a la experiencia de Datos Climáticos Tangibles. Usa el 'App Hub' para navegar entre los diferentes módulos interactivos.",
    instructionsContent2: "En el 'Explorador de Datos', serás guiado a través de un análisis narrativo de los datos de temperatura global. En cada paso, revisa el gráfico y el texto, y luego elige tu siguiente acción para proceder.",
    instructionsContent3: "En cualquier momento, puedes hacer clic en el icono de chat flotante para preguntarle a AURA, nuestra asistente de IA, sobre lo que estás viendo o sobre el cambio climático en general.",

    // Calendar
    calendarTitle: "Exposiciones y Eventos",
    calendarLoading: "Cargando calendario...",
    calendarError: "No se pudieron cargar los datos del calendario. Por favor, inténtelo de nuevo más tarde.",
    calendarNoEvents: "No hay eventos programados en este momento.",

    // Knowledge Base
    knowledgeBaseBack: "Volver al Hub",
    knowledgeBaseAskReport: "Preguntar Sobre el Informe",
    
    // Join Us
    joinUsModalTitle: "Colabora con Nosotros",
    joinUsModalContent: "En Tangible Data nos dedicamos a crear experiencias de datos significativas. Si eres un artista, científico, desarrollador o una institución interesada en colaborar, nos encantaría saber de ti.",
    joinUsModalWebsiteButton: "Visita Nuestro Sitio Web",
    joinUsModalEmailLink: "O escríbenos a:",

    // Scenario Lab
    scenarioLabTitle: "Laboratorio de Escenarios",
    scenarioLabSelectPreset: "Selecciona un Escenario Predefinido",
    scenarioLabCustomAi: "Crear con IA",
    scenarioLabCustomAiDesc: "Describe un escenario y deja que la IA genere una proyección de datos plausible.",
    scenarioLabCustomAiPlaceholder: "ej: '¿Qué pasaría si descubriéramos la energía de fusión limpia en 2030?'",
    scenarioLabGenerateButton: "Generar Escenario con IA",
    scenarioLabGeneratingButton: "Generando...",
    scenarioLabAiError: "La generación del escenario con IA ha fallado.",
    scenarioLabChartTitle: "Datos Históricos vs. Escenario Simulado",
    scenarioLabChartYAxis: "Anomalía (°C)",
    scenarioLabChartReal: "Datos Reales",
    scenarioLabAiLogic: "Lógica de la Simulación IA",
    scenarioLabPresetLogic: "Lógica del Predefinido",

    // Glossary
    glossarySearchPlaceholder: "Buscar términos...",
    glossaryAllCategories: "Todas las Categorías",
    glossarySeeAlso: "Ver también",
    glossaryAskAura: "Pide a AURA una explicación más profunda",
    glossaryNoResults: "No se encontraron términos.",
    glossaryBackToList: "Volver a la lista",
    glossaryViewList: "Lista",
    glossaryViewMindMap: "Mapa Mental",
    glossaryViewQuiz: "Test",
    mindMapControls: "Rueda para zoom, arrastrar para mover.",
    mindMapResetView: "Reiniciar Vista",
    mindMapInstructions: "Selecciona un nodo en el mapa para ver su definición aquí.",

    // Quiz
    quizCompletedTitle: "¡Test Completado!",
    quizCompletedScore: "Has acertado {score} de {total} preguntas.",
    quizRestart: "Intentar de Nuevo",
    quizClose: "Cerrar",
    quizQuestionLabel: "Pregunta {current} de {total}",
    quizNext: "Siguiente Pregunta",
    quizFinish: "Finalizar",
    
    // AR Mode
    arModeInstruction: "Apunta tu cámara a una superficie plana para visualizar los datos.",
    
    // VR Mode
    vrModeInstruction: "Entra en RV para sumergirte con la escultura de datos.",
    vrModeLoading: "Cargando modelo 3D...",
    vrModeError: "No se pudo cargar el modelo 3D. Por favor, inténtalo de nuevo.",
    vrModeEnterVR: "Entrar en RV",
    vrModeExitVR: "Salir de RV",
    vrModeBackToHub: "Volver al Hub",

    // Crazy Viz
    crazyVizTitle: "Arte Generativo Viz",
    crazyVizDownloading: "Preparando descarga...",
    crazyVizRecord: "Grabar Video",
    crazyVizStopRecording: "Detener Grabación",
    crazyVizPlay: "Reproducir",
    crazyVizPause: "Pausar",
    crazyVizControlsTitle: "Moduladores",
    crazyVizControlsSpeed: "Velocidad",
    crazyVizControlsParticles: "Partículas",
    crazyVizControlsTrail: "Longitud de Estela",
    crazyVizControlsComplexity: "Complejidad",
    crazyVizControlsFlow: "Fuerza del Flujo",
    
    // Educational Pack
    educationalPackTitle: "Pack Educativo",
    educationalPackContent: `
        <p class="mb-4">El Programa Educativo de Tangible Data ofrece recursos para educadores y estudiantes para explorar la ciencia del clima a través de la visualización de datos y herramientas interactivas. Nuestro objetivo es hacer que la educación climática sea atractiva y accesible.</p>
        <h4 class="text-xl font-bold text-cyan-400 mb-2">¿Qué incluye?</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
            <li>Planes de lecciones alineados con los estándares curriculares.</li>
            <li>Hojas de trabajo para estudiantes y actividades guiadas.</li>
            <li>Una guía para usar esta aplicación web interactiva en el aula.</li>
            <li>Gráficos y datos de alta resolución.</li>
        </ul>
        <p>Para acceder al pack educativo completo y aprender más sobre nuestros programas escolares, por favor visita nuestra página web.</p>
        <div class="mt-6 text-center">
            <a href="https://tangibledata.xyz/tangible-data-educational-program/" target="_blank" rel="noopener noreferrer" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Ir al Programa Educativo
            </a>
        </div>
    `,

    // Credits
    creditsModalContent: `
      <h3 class="text-xl font-bold text-cyan-400 mb-2">Equipo del Proyecto</h3>
      <p><strong>Autores de la Escultura:</strong> Antonio Moneo Laín y David San Román Gomendio</p>
      <p><strong>Diseño y Desarrollo de la App:</strong> Antonio Moneo Laín</p>

      <h3 class="text-xl font-bold text-cyan-400 mt-4 mb-2">Colaboración</h3>
      <p>Un proyecto de <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Tangible Data</a> en colaboración con el <span class="font-semibold">Museo Nacional de Ciencias Naturales (MNCN-CSIC)</span>.</p>
      
      <h3 class="text-xl font-bold text-cyan-400 mt-4 mb-2">Fuentes y Tecnologías</h3>
      <p><strong>Datos de Temperatura:</strong> GISTEMP v4, NASA Goddard Institute for Space Studies</p>
      <p><strong>API de IA Generativa:</strong> Google Gemini</p>
      <p><strong>Stack Tecnológico:</strong> React, TypeScript, Tailwind CSS, Recharts</p>
    `,

    // Text Adventure Quest
    textAdventureQuestTitle: "Tangible Climate Quest",
    textAdventureQuestSubmit: "Intro",
    textAdventureQuestScore: "Puntuación",
    textAdventureQuestInventory: "Inventario",
    textAdventureQuestRestart: "Reiniciar Misión",
    textAdventureQuestWin: "MISIÓN COMPLETADA",
    textAdventureQuestLose: "MISIÓN FALLIDA",
    textAdventureQuestHint: "Pedir Pista a AURA",
    textAdventureQuestSkeletonReconstruction: "Reconstrucción del Esqueleto",
    
  },
};