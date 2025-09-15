import type { Language, StorySegment } from './types';
import { GRAPH_OVERVIEW_IMAGE, MUSEUM_EXTERIOR_IMAGE } from './assets';

type LocaleStrings = { [key: string]: string | any };

const en: LocaleStrings = {
    // Splash Screen
    splashGretting: "Tangible Data presents",
    splashCollabIntro: "In collaboration with",
    splashCollabPartner: "National Museum of Natural Sciences",
    splashTitle: "The Skeleton of Climate Change",
    splashSubtitle: "An Interactive Analysis of Global Temperature Anomalies",
    skipButton: "Skip",

    // Start Screen
    auraStartMessage: "Hello. I am AURA, your analytical AI guide.\n\nTogether, we will investigate the historical data of global temperature anomalies from 1880 to the present day.",
    auraSecondMessage: "Our goal is to understand the key moments that have defined the planet's climate trajectory. Shall we begin the analysis?",
    start: "Begin Analysis",

    // Game
    gameTitle: "Data Analysis",
    whatToDo: "What should we do next?",

    // Game Over
    gameOverTitle: "Analysis Complete",
    gameOverRestart: "Start a New Analysis",

    // Header
    headerAppHubButton: "App Hub",
    headerInstructionsButton: "How to Play",

    // About Modal
    aboutTitle: "About: The Skeleton of Climate Change",
    intro: "AURA is an interactive data narrative that allows you to explore the history of global temperature change through a simplified simulation of climate data analysis.",
    objective: "The objective is to make complex climate data accessible and understandable, showing how scientific analysis reveals the story of our changing planet. All data is based on publicly available records from NASA's GISTEMP v4.",
    aboutCredit: "A project by",

    // App Hub
    appHubTitle: "AURA App Hub",
    appHubSubtitle: "Explore different tools and experiences to understand climate change.",
    appHubChatTitle: "Chat with AURA",
    appHubChatDesc: "Ask questions about climate change. Powered by Gemini.",
    appHubDataExplorerTitle: "Data Explorer",
    appHubDataExplorerDesc: "Navigate the historical temperature data step by step.",
    appHubCrazyVizTitle: "Crazy Viz",
    appHubCrazyVizDesc: "An experimental, artistic visualization of climate data.",
    appHubScenarioLabTitle: "Scenario Lab",
    appHubScenarioLabDesc: "Simulate 'what if?' climate scenarios and create your own with AI.",
    appHubKnowledgeBaseTitle: "Knowledge Base",
    appHubKnowledgeBaseDesc: "Read a detailed report on the science of climate change.",
    appHubGlossaryTitle: "Glossary",
    appHubGlossaryDesc: "Explore key climate terms in an interactive mind map or quiz.",
    appHubARTitle: "AR Data Viewer",
    appHubARDesc: "View the climate data sculpture in your own space using Augmented Reality.",
    appHubEducationalPackTitle: "Educational Pack",
    appHubEducationalPackDesc: "Resources and guides for using this tool in the classroom.",
    appHubNFTTitle: "NFT Collection",
    appHubNFTDesc: "Explore the sculpture's digital twin as an NFT on OpenSea.",
    appHubDashboardTitle: "Full Dashboard",
    appHubDashboardDesc: "View the complete temperature anomaly chart from 1880 to 2024.",
    appHubCalendarTitle: "Events Calendar",
    appHubCalendarDesc: "See upcoming talks, exhibitions, and climate-related events.",
    appHubInstructionsTitle: "Instructions",
    appHubInstructionsDesc: "How to navigate and use the different apps in the hub.",
    appHubJoinUsTitle: "Join Us",
    appHubJoinUsDesc: "Learn more about the Tangible Data project and how to get involved.",
    appHubAboutTitle: "About",
    appHubComingSoon: "Coming Soon",
    appHubCreditsTitle: "Credits",
    appHubCreditsDesc: `<strong>Concept & Development:</strong> <a href="https://www.linkedin.com/in/juan-del-rio/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Juan del Rio</a><br/><strong>AI Integration:</strong> Google`,
    appHubAddYourAppTitle: "Add Your App!",
    appHubAddYourAppDesc: "Have a climate data app or idea? Get in touch!",

    // Chat
    chatTitle: "Ask AURA",
    chatPlaceholder: "Type your question here...",
    chatSend: "Send",
    chatError: "Sorry, I encountered an error. Please try again.",
    chatSystemInstruction: "You are AURA, a helpful AI assistant specializing in climate change. You are speaking to a user exploring an interactive data visualization of global temperature anomalies. Answer their questions clearly and concisely. Base your answers on established climate science. The user is currently in a general inquiry mode.",
    chatSystemInstructionReport: "You are AURA, a helpful AI assistant. The user is asking questions about a climate science report you have access to. Answer the user's questions based ONLY on the provided text from the report. If the answer is not in the report, say that the information is not available in the provided document. Do not use outside knowledge. Quote the report text when possible.",
    chatExplainTermSystemInstruction: "You are AURA, an AI assistant. The user has asked for an explanation of the climate term '{term}'. You have the formal definition: '{definition}'. Explain this term to a curious adult in a simple, clear, and engaging way. You can use an analogy if it helps. Keep the explanation to 2-3 sentences.",
    
    // Dashboard
    dashboardTitle: "Global Temperature Anomaly (1880-2024)",
    dashboardDescription: "This chart displays the difference in global surface temperature compared to the 1951-1980 average. Data source: NASA GISTEMP v4.",
    dashboardBack: "Back to App Hub",

    // Error
    errorTitle: "An Error Occurred",
    errorTryAgain: "Try Again",

    // Instructions
    instructionsTitle: "How to Use the Data Explorer",
    instructionsContent1: "You are a data analyst tasked with examining the historical record of Earth's temperature.",
    instructionsContent2: "In each step, a new segment of data will be presented. You must choose one of the available analysis options to proceed.",
    instructionsContent3: "Your choices will guide you through the story hidden in the data, from the late 19th century to the present day. You can use the 'Ask AURA' button at any time to ask questions.",

    // Calendar
    calendarTitle: "Events Calendar",
    calendarLoading: "Loading events...",
    calendarError: "Could not load calendar events.",
    calendarNoEvents: "No upcoming events found.",

    // Knowledge Base
    knowledgeBaseBack: "Back to Hub",
    knowledgeBaseAskReport: "Ask AURA about this report",

    // Educational Pack
    educationalPackTitle: "Educational Pack",
    educationalPackContent: `
        <h3 class="text-xl font-bold text-cyan-400">For Educators</h3>
        <p>This tool is designed to be a dynamic resource for teaching about climate change, data literacy, and scientific inquiry. Here are some ideas for using it in your classroom:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
            <li><strong>Guided Exploration:</strong> Use the 'Data Explorer' in a group setting, discussing the choices and their implications at each step.</li>
            <li><strong>Research Prompts:</strong> After completing the data story, have students use the 'Knowledge Base' and 'Glossary' to research one of the historical periods or scientific concepts in more detail.</li>
            <li><strong>Creative Scenarios:</strong> Use the 'Scenario Lab' for a creative writing or policy-making exercise. Have students design their own 'what if' scenario, generate the AI simulation, and write a report justifying their projection.</li>
            <li><strong>Data Interpretation:</strong> Use the 'Dashboard' to teach chart reading, trend analysis, and the concept of anomalies.</li>
        </ul>
        <p class="mt-4">We are developing a full curriculum guide. Please contact us if you are interested in piloting it.</p>
    `,

    // Join Us
    joinUsModalTitle: "Join the Tangible Data Project",
    joinUsModalContent: "We are on a mission to make complex data beautiful, interactive, and understandable. Follow our journey or get in touch to collaborate.",
    joinUsModalWebsiteButton: "Visit Our Website",
    joinUsModalEmailLink: "Contact us via email:",

    // Scenario Lab
    scenarioLabTitle: "Scenario Lab",
    scenarioLabSelectPreset: "1. Select a Preset Scenario",
    scenarioLabCustomAi: "2. Or, Create a Custom AI Scenario",
    scenarioLabCustomAiDesc: "Describe a global event or policy and Gemini will simulate its potential impact on temperature trends for the next 50 years.",
    scenarioLabCustomAiPlaceholder: "e.g., 'A global switch to 100% renewable energy by 2040' or 'A series of massive volcanic eruptions occur in the 2030s'...",
    scenarioLabGenerateButton: "Generate AI Scenario",
    scenarioLabGeneratingButton: "Generating...",
    scenarioLabAiError: "AI scenario generation failed:",
    scenarioLabChartTitle: "Historical Data vs. Simulated Scenario",
    scenarioLabChartReal: "Real Data",
    scenarioLabChartYAxis: "Anomaly (°C)",
    scenarioLabAiLogic: "AI Simulation Rationale",
    scenarioLabPresetLogic: "Preset Logic",

    // Glossary
    glossarySearchPlaceholder: "Search for a term...",
    glossaryAllCategories: "All Categories",
    glossaryNoResults: "No terms found.",
    glossarySeeAlso: "See Also",
    glossaryAskAura: "Ask AURA to explain this",
    glossaryBackToList: "Back to List",
    glossaryViewList: "List",
    glossaryViewMindMap: "Mind Map",
    glossaryViewQuiz: "Quiz",
    mindMapInstructions: "Select a term from the mind map to see its definition.",
    mindMapControls: "Scroll to zoom, drag to pan.",
    mindMapResetView: "Reset view",
    
    // Quiz
    quizCompletedTitle: "Quiz Complete!",
    quizCompletedScore: "You scored {score} out of {total}.",
    quizRestart: "Try Again",
    quizClose: "Close",
    quizQuestionLabel: "Question {current} of {total}",
    quizNext: "Next Question",
    quizFinish: "Finish",

    // AR Mode
    arModeInstruction: "Point your camera at a flat surface to place the data sculpture.",

    // Crazy Viz
    crazyVizTitle: "Crazy Viz: Generative Climate Art",
    crazyVizPlay: "Play",
    crazyVizPause: "Pause",
    crazyVizRecord: "Record",
    crazyVizStopRecording: "Stop Recording",
    crazyVizDownloading: "Processing video...",
    crazyVizControlsTitle: "Modulators",
    crazyVizControlsSpeed: "Speed",
    crazyVizControlsParticles: "Particles",
    crazyVizControlsTrail: "Trail Length",
    crazyVizControlsComplexity: "Complexity",
    crazyVizControlsFlow: "Flow Strength",
};

const es: LocaleStrings = {
    ...en, // Default to English and override with Spanish
    // Splash Screen
    splashGretting: "Tangible Data presenta",
    splashCollabIntro: "En colaboración con",
    splashCollabPartner: "Museo Nacional de Ciencias Naturales",
    splashTitle: "El Esqueleto del Cambio Climático",
    splashSubtitle: "Un Análisis Interactivo de las Anomalías de Temperatura Global",
    skipButton: "Saltar",

    // Start Screen
    auraStartMessage: "Hola. Soy AURA, tu guía analítica de IA.\n\nJuntos, investigaremos los datos históricos de las anomalías de la temperatura global desde 1880 hasta hoy.",
    auraSecondMessage: "Nuestro objetivo es comprender los momentos clave que han definido la trayectoria climática del planeta. ¿Comenzamos el análisis?",
    start: "Iniciar Análisis",

    // Game
    gameTitle: "Análisis de Datos",
    whatToDo: "¿Qué hacemos ahora?",

    // Game Over
    gameOverTitle: "Análisis Completo",
    gameOverRestart: "Iniciar Nuevo Análisis",

    // Header
    headerAppHubButton: "Centro de Apps",
    headerInstructionsButton: "Cómo Jugar",

    // About Modal
    aboutTitle: "Acerca de: El Esqueleto del Cambio Climático",
    intro: "AURA es una narrativa de datos interactiva que te permite explorar la historia del cambio de temperatura global a través de una simulación simplificada de análisis de datos climáticos.",
    objective: "El objetivo es hacer que los datos climáticos complejos sean accesibles y comprensibles, mostrando cómo el análisis científico revela la historia de nuestro planeta cambiante. Todos los datos se basan en registros públicos de GISTEMP v4 de la NASA.",
    aboutCredit: "Un proyecto de",

    // App Hub
    appHubTitle: "Centro de Apps de AURA",
    appHubSubtitle: "Explora diferentes herramientas y experiencias para entender el cambio climático.",
    appHubChatTitle: "Chatea con AURA",
    appHubChatDesc: "Haz preguntas sobre el cambio climático. Potenciado por Gemini.",
    appHubDataExplorerTitle: "Explorador de Datos",
    appHubDataExplorerDesc: "Navega por los datos históricos de temperatura paso a paso.",
    appHubCrazyVizTitle: "Visualización Loca",
    appHubCrazyVizDesc: "Una visualización artística y experimental de los datos climáticos.",
    appHubScenarioLabTitle: "Laboratorio de Escenarios",
    appHubScenarioLabDesc: "Simula escenarios climáticos '¿qué pasaría si...?' y crea los tuyos con IA.",
    appHubKnowledgeBaseTitle: "Base de Conocimiento",
    appHubKnowledgeBaseDesc: "Lee un informe detallado sobre la ciencia del cambio climático.",
    appHubGlossaryTitle: "Glosario",
    appHubGlossaryDesc: "Explora términos climáticos clave en un mapa mental interactivo o un test.",
    appHubARTitle: "Visor de Datos RA",
    appHubARDesc: "Visualiza la escultura de datos climáticos en tu propio espacio usando Realidad Aumentada.",
    appHubEducationalPackTitle: "Paquete Educativo",
    appHubEducationalPackDesc: "Recursos y guías para usar esta herramienta en el aula.",
    appHubNFTTitle: "Colección NFT",
    appHubNFTDesc: "Explora el gemelo digital de la escultura como un NFT en OpenSea.",
    appHubDashboardTitle: "Dashboard Completo",
    appHubDashboardDesc: "Visualiza el gráfico completo de anomalías de temperatura de 1880 a 2024.",
    appHubCalendarTitle: "Calendario de Eventos",
    appHubCalendarDesc: "Consulta próximas charlas, exposiciones y eventos relacionados con el clima.",
    appHubInstructionsTitle: "Instrucciones",
    appHubInstructionsDesc: "Cómo navegar y usar las diferentes aplicaciones del centro.",
    appHubJoinUsTitle: "Únete a Nosotros",
    appHubJoinUsDesc: "Aprende más sobre el proyecto Tangible Data y cómo participar.",
    appHubAboutTitle: "Acerca de",
    appHubComingSoon: "Próximamente",
    appHubCreditsTitle: "Créditos",
    appHubCreditsDesc: `<strong>Concepto y Desarrollo:</strong> <a href="https://www.linkedin.com/in/juan-del-rio/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Juan del Rio</a><br/><strong>Integración IA:</strong> Google`,
    appHubAddYourAppTitle: "¡Añade tu App!",
    appHubAddYourAppDesc: "¿Tienes una app o idea sobre datos climáticos? ¡Contáctanos!",

    // Chat
    chatTitle: "Pregúntale a AURA",
    chatPlaceholder: "Escribe tu pregunta aquí...",
    chatSend: "Enviar",
    chatError: "Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.",
    chatSystemInstruction: "Eres AURA, una asistente de IA especializada en cambio climático. Estás hablando con un usuario que explora una visualización de datos interactiva sobre anomalías de temperatura global. Responde a sus preguntas de forma clara y concisa. Basa tus respuestas en la ciencia climática establecida. El usuario está actualmente en un modo de consulta general.",
    chatSystemInstructionReport: "Eres AURA, una asistente de IA. El usuario está haciendo preguntas sobre un informe de ciencia climática al que tienes acceso. Responde a las preguntas del usuario basándote ÚNICAMENTE en el texto proporcionado del informe. Si la respuesta no está en el informe, di que la información no está disponible en el documento proporcionado. No utilices conocimiento externo. Cita el texto del informe cuando sea posible.",
    chatExplainTermSystemInstruction: "Eres AURA, una asistente de IA. El usuario ha pedido una explicación del término climático '{term}'. Tienes la definición formal: '{definition}'. Explica este término a un adulto curioso de una manera simple, clara y atractiva. Puedes usar una analogía si ayuda. Mantén la explicación en 2-3 frases.",

    // Dashboard
    dashboardTitle: "Anomalía de Temperatura Global (1880-2024)",
    dashboardDescription: "Este gráfico muestra la diferencia en la temperatura global de la superficie en comparación con el promedio de 1951-1980. Fuente de datos: NASA GISTEMP v4.",
    dashboardBack: "Volver al Centro de Apps",
    
    // Error
    errorTitle: "Ocurrió un Error",
    errorTryAgain: "Intentar de Nuevo",

    // Instructions
    instructionsTitle: "Cómo Usar el Explorador de Datos",
    instructionsContent1: "Eres un analista de datos con la tarea de examinar el registro histórico de la temperatura de la Tierra.",
    instructionsContent2: "En cada paso, se presentará un nuevo segmento de datos. Debes elegir una de las opciones de análisis disponibles para continuar.",
    instructionsContent3: "Tus elecciones te guiarán a través de la historia oculta en los datos, desde finales del siglo XIX hasta hoy. Puedes usar el botón 'Pregúntale a AURA' en cualquier momento para hacer preguntas.",

    // Calendar
    calendarTitle: "Calendario de Eventos",
    calendarLoading: "Cargando eventos...",
    calendarError: "No se pudieron cargar los eventos del calendario.",
    calendarNoEvents: "No se encontraron próximos eventos.",

    // Knowledge Base
    knowledgeBaseBack: "Volver al Centro",
    knowledgeBaseAskReport: "Pregúntale a AURA sobre este informe",
    
    // Educational Pack
    educationalPackTitle: "Paquete Educativo",
    educationalPackContent: `
        <h3 class="text-xl font-bold text-cyan-400">Para Educadores</h3>
        <p>Esta herramienta está diseñada como un recurso dinámico para enseñar sobre cambio climático, alfabetización de datos e investigación científica. Aquí hay algunas ideas para usarla en clase:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
            <li><strong>Exploración Guiada:</strong> Usa el 'Explorador de Datos' en grupo, discutiendo las opciones y sus implicaciones en cada paso.</li>
            <li><strong>Puntos de Investigación:</strong> Después de completar la historia de datos, pide a los estudiantes que usen la 'Base de Conocimiento' y el 'Glosario' para investigar uno de los períodos históricos o conceptos científicos en más detalle.</li>
            <li><strong>Escenarios Creativos:</strong> Utiliza el 'Laboratorio de Escenarios' para un ejercicio de escritura creativa o de creación de políticas. Haz que los estudiantes diseñen su propio escenario '¿qué pasaría si...?', generen la simulación con IA y escriban un informe justificando su proyección.</li>
            <li><strong>Interpretación de Datos:</strong> Usa el 'Dashboard' para enseñar a leer gráficos, analizar tendencias y el concepto de anomalías.</li>
        </ul>
        <p class="mt-4">Estamos desarrollando una guía curricular completa. Contáctanos si estás interesado/a en probarla.</p>
    `,

    // Join Us
    joinUsModalTitle: "Únete al Proyecto Tangible Data",
    joinUsModalContent: "Tenemos la misión de hacer que los datos complejos sean bellos, interactivos y comprensibles. Sigue nuestro viaje o contáctanos para colaborar.",
    joinUsModalWebsiteButton: "Visita Nuestra Web",
    joinUsModalEmailLink: "Contáctanos por email:",

    // Scenario Lab
    scenarioLabTitle: "Laboratorio de Escenarios",
    scenarioLabSelectPreset: "1. Selecciona un Escenario Prediseñado",
    scenarioLabCustomAi: "2. O crea un Escenario Personalizado con IA",
    scenarioLabCustomAiDesc: "Describe un evento o política global y Gemini simulará su impacto potencial en las tendencias de temperatura para los próximos 50 años.",
    scenarioLabCustomAiPlaceholder: "Ej: 'Un cambio global a energía 100% renovable para 2040' o 'Una serie de erupciones volcánicas masivas ocurren en la década de 2030'...",
    scenarioLabGenerateButton: "Generar Escenario con IA",
    scenarioLabGeneratingButton: "Generando...",
    scenarioLabAiError: "La generación del escenario con IA falló:",
    scenarioLabChartTitle: "Datos Históricos vs. Escenario Simulado",
    scenarioLabChartReal: "Datos Reales",
    scenarioLabChartYAxis: "Anomalía (°C)",
    scenarioLabAiLogic: "Justificación de la Simulación IA",
    scenarioLabPresetLogic: "Lógica del Prediseño",

    // Glossary
    glossarySearchPlaceholder: "Busca un término...",
    glossaryAllCategories: "Todas las Categorías",
    glossaryNoResults: "No se encontraron términos.",
    glossarySeeAlso: "Ver También",
    glossaryAskAura: "Pídele a AURA que explique esto",
    glossaryBackToList: "Volver a la Lista",
    glossaryViewList: "Lista",
    glossaryViewMindMap: "Mapa Mental",
    glossaryViewQuiz: "Test",
    mindMapInstructions: "Selecciona un término del mapa mental para ver su definición.",
    mindMapControls: "Rueda para zoom, arrastra para mover.",
    mindMapResetView: "Reiniciar vista",
    
    // Quiz
    quizCompletedTitle: "¡Test Completado!",
    quizCompletedScore: "Tu puntuación es {score} de {total}.",
    quizRestart: "Intentar de Nuevo",
    quizClose: "Cerrar",
    quizQuestionLabel: "Pregunta {current} de {total}",
    quizNext: "Siguiente Pregunta",
    quizFinish: "Finalizar",

    // AR Mode
    arModeInstruction: "Apunta tu cámara a una superficie plana para colocar la escultura de datos.",

    // Crazy Viz
    crazyVizTitle: "Crazy Viz: Arte Climático Generativo",
    crazyVizPlay: "Reproducir",
    crazyVizPause: "Pausa",
    crazyVizRecord: "Grabar",
    crazyVizStopRecording: "Detener Grabación",
    crazyVizDownloading: "Procesando vídeo...",
    crazyVizControlsTitle: "Moduladores",
    crazyVizControlsSpeed: "Velocidad",
    crazyVizControlsParticles: "Partículas",
    crazyVizControlsTrail: "Longitud de Estela",
    crazyVizControlsComplexity: "Complejidad",
    crazyVizControlsFlow: "Fuerza de Flujo",
};

export const locales: Record<Language, LocaleStrings> = { en, es };

const storyDataBase = {
    start: {
        id: 'start',
        sceneDescription: "The analysis begins with a complete overview of the dataset, from 1880 to 2024. The data forms a shape reminiscent of a vertebrate skeleton, where each 'vertebra' is a year's temperature anomaly. The initial view shows a period of relative stability, followed by a clear and accelerating upward trend. We must decide which historical period to analyze first to understand this evolution.",
        image: GRAPH_OVERVIEW_IMAGE,
        choices: [
            { text: "Analyze the early industrial era (1880-1945)", nextSceneId: 'era_industrial' },
            { text: "Examine the great acceleration (1945-1975)", nextSceneId: 'era_acceleration' },
            { text: "Investigate the modern, rapid warming (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1880,
            endYear: 2024
        }
    },
    era_industrial: {
        id: 'era_industrial',
        sceneDescription: "From 1880 to 1945, we observe a slow but noticeable warming trend. This period covers the second industrial revolution and two world wars. While temperatures fluctuate, the average is clearly rising by the end of this era. What should we focus on next?",
        choices: [
            { text: "Compare with the post-war period (1945-1975)", nextSceneId: 'era_acceleration' },
            { text: "Jump to the modern era (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1880,
            endYear: 1945
        }
    },
    era_acceleration: {
        id: 'era_acceleration',
        sceneDescription: "Interestingly, from 1945 to 1975, the warming trend stalls and even slightly reverses. This 'hiatus' coincides with a massive post-war industrial boom that pumped huge amounts of sun-blocking aerosol pollutants into the atmosphere, temporarily masking the effect of rising CO2. Where to next?",
        choices: [
            { text: "Review the preceding industrial era (1880-1945)", nextSceneId: 'era_industrial' },
            { text: "See what happened when pollution was cleaned up (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1945,
            endYear: 1975
        }
    },
    era_modern: {
        id: 'era_modern',
        sceneDescription: "From 1975 onwards, the trend is unambiguous and alarming. As clean air acts reduced aerosol pollution, the underlying warming from greenhouse gases was revealed and has accelerated dramatically since. This period contains the hottest years on record. What is our conclusion?",
        choices: [
            { text: "Acknowledge human activity as the dominant driver and conclude the analysis.", nextSceneId: 'conclusion' },
        ],
        chartConfig: {
            startYear: 1975,
            endYear: 2024
        }
    },
    conclusion: {
        id: 'conclusion',
        sceneDescription: "Our analysis, moving through distinct historical eras, has clearly shown how the planet's temperature has evolved. From early industrial warming, through a mid-century pollution-masked plateau, to the recent rapid acceleration, the data tells a consistent story. The scientific consensus is that this dramatic modern warming is overwhelmingly driven by human-caused greenhouse gas emissions.",
        image: MUSEUM_EXTERIOR_IMAGE,
        choices: [],
    }
};

const storyDataEn: Record<string, StorySegment> = storyDataBase;

const storyDataEs: Record<string, StorySegment> = {
    start: {
        id: 'start',
        sceneDescription: "El análisis comienza con una visión general completa del conjunto de datos, de 1880 a 2024. Los datos forman una figura que recuerda a un esqueleto de vertebrado, donde cada 'vértebra' es la anomalía de temperatura de un año. La vista inicial muestra un período de relativa estabilidad, seguido de una tendencia ascendente clara y acelerada. Debemos decidir qué período histórico analizar primero para entender esta evolución.",
        image: GRAPH_OVERVIEW_IMAGE,
        choices: [
            { text: "Analizar la era industrial temprana (1880-1945)", nextSceneId: 'era_industrial' },
            { text: "Examinar la gran aceleración (1945-1975)", nextSceneId: 'era_acceleration' },
            { text: "Investigar el calentamiento rápido moderno (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1880,
            endYear: 2024
        }
    },
    era_industrial: {
        id: 'era_industrial',
        sceneDescription: "De 1880 a 1945, observamos una tendencia de calentamiento lenta pero perceptible. Este período abarca la segunda revolución industrial y dos guerras mundiales. Aunque las temperaturas fluctúan, el promedio está claramente en aumento al final de esta era. ¿En qué nos centramos ahora?",
        choices: [
            { text: "Comparar con el período de posguerra (1945-1975)", nextSceneId: 'era_acceleration' },
            { text: "Saltar a la era moderna (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1880,
            endYear: 1945
        }
    },
    era_acceleration: {
        id: 'era_acceleration',
        sceneDescription: "Curiosamente, de 1945 a 1975, la tendencia de calentamiento se detiene e incluso se invierte ligeramente. Este 'hiato' coincide con un masivo auge industrial de posguerra que bombeó enormes cantidades de aerosoles contaminantes que bloqueaban el sol, enmascarando temporalmente el efecto del aumento de CO2. ¿Hacia dónde vamos ahora?",
        choices: [
            { text: "Revisar la era industrial precedente (1880-1945)", nextSceneId: 'era_industrial' },
            { text: "Ver qué pasó cuando se limpió la contaminación (1975-2024)", nextSceneId: 'era_modern' },
        ],
        chartConfig: {
            startYear: 1945,
            endYear: 1975
        }
    },
    era_modern: {
        id: 'era_modern',
        sceneDescription: "A partir de 1975, la tendencia es inequívoca y alarmante. A medida que las leyes de aire limpio redujeron la contaminación por aerosoles, el calentamiento subyacente de los gases de efecto invernadero se reveló y se ha acelerado drásticamente desde entonces. Este período contiene los años más calurosos registrados. ¿Cuál es nuestra conclusión?",
        choices: [
            { text: "Reconocer la actividad humana como el motor dominante y concluir el análisis.", nextSceneId: 'conclusion' },
        ],
        chartConfig: {
            startYear: 1975,
            endYear: 2024
        }
    },
    conclusion: {
        id: 'conclusion',
        sceneDescription: "Nuestro análisis, a través de distintas eras históricas, ha mostrado claramente cómo ha evolucionado la temperatura del planeta. Desde el calentamiento industrial temprano, pasando por una meseta enmascarada por la contaminación a mediados de siglo, hasta la reciente y rápida aceleración, los datos cuentan una historia consistente. El consenso científico es que este dramático calentamiento moderno está impulsado abrumadoramente por las emisiones de gases de efecto invernadero de origen humano.",
        image: MUSEUM_EXTERIOR_IMAGE,
        choices: [],
    }
};

export const storyData: Record<Language, Record<string, StorySegment>> = {
    en: storyDataEn,
    es: storyDataEs,
};
