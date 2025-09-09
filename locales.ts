// FIX: Add storyData export and tighten LocaleStrings type to fix type errors.
import type { Language, StorySegment } from './types';
import { GRAPH_OVERVIEW_IMAGE, MUSEUM_EXTERIOR_IMAGE } from './assets';

interface LocaleStrings {
  [key: string]: string;
}

export const locales: Record<Language, LocaleStrings> = {
  es: {
    // START SCREEN
    auraStartMessage: "Saludos. Soy AURA, una Inteligencia Artificial de análisis de datos científicos.",
    auraSecondMessage: "He sido asignada para ayudarte a investigar una enigmática estructura de datos conocida como 'El Esqueleto del Cambio Climático'.\n\n¿Procedemos con el análisis?",
    start: 'Iniciar Análisis',
    skipButton: 'Saltar',

    // GAME SCREEN
    gameTitle: 'Análisis del Esqueleto Climático',
    whatToDo: '¿Qué sección de datos analizamos ahora?',

    // GAME OVER SCREEN
    gameOverTitle: 'Análisis Completado',
    gameOverRestart: 'Reiniciar Análisis',

    // ERROR SCREEN
    errorTitle: 'Error en el Análisis',
    errorTryAgain: 'Intentar de Nuevo',
    
    // HEADER
    headerAppHubButton: 'Panel de Apps',
    headerDashboardButton: 'Dashboard',
    headerInstructionsButton: 'Instrucciones',

    // CHAT
    chatTitle: 'Consulta a AURA',
    chatPlaceholder: 'Escribe tu pregunta aquí...',
    chatSend: 'Enviar',
    chatError: 'Lo siento, no he podido procesar tu solicitud. Por favor, inténtalo de nuevo.',
    chatSystemInstruction: "Eres AURA, una IA científica, experta en climatología y análisis de datos. Tu personalidad es servicial, precisa y educativa. No eres una IA genérica; tu conocimiento se centra en la ciencia climática. Responde a las preguntas del usuario de forma concisa y clara, basándote en el conocimiento científico establecido. Evita especulaciones. Tu propósito es ayudar al usuario a comprender el cambio climático.",
    chatSystemInstructionReport: `Eres AURA, una IA experta en climatología. Tu tarea es responder preguntas basadas EXCLUSIVAMENTE en el siguiente informe científico sobre el cambio climático. No introduzcas información externa. Si la respuesta no está en el informe, indica que el documento no contiene esa información. A continuación se presenta el informe:`,
    chatExplainTermSystemInstruction: `Eres AURA, una IA experta en climatología. Tu tarea es explicar el término climático '{term}' de una manera más detallada o con una analogía simple. La definición base es: '{definition}'. Basa tu explicación en esta definición y en tu conocimiento general de la ciencia del clima. Responde de forma concisa y educativa.`,

    // DASHBOARD
    dashboardTitle: 'Dashboard de Datos Climáticos',
    dashboardDescription: 'Visualización completa de la anomalía de la temperatura global desde 1880 hasta 2024. Los datos muestran la desviación de la temperatura media en comparación con el período de referencia de 1951-1980.',
    dashboardBack: 'Volver',

    // ABOUT MODAL
    aboutTitle: 'Sobre el Proyecto',
    intro: 'El Esqueleto del Cambio Climático es una experiencia educativa interactiva que utiliza una escultura de datos real como punto de partida para explorar la historia y la ciencia del cambio climático.',
    objective: 'Nuestro objetivo es hacer que los datos climáticos complejos sean accesibles y atractivos, permitiendo a los usuarios descubrir la narrativa contenida en los números a través de una investigación guiada por la IA AURA.',
    aboutCredit: 'Una colaboración de:',
    
    // INSTRUCTIONS MODAL
    instructionsTitle: 'Instrucciones',
    instructionsContent1: 'Bienvenido a la interfaz de análisis de "El Esqueleto del Cambio Climático".',
    instructionsContent2: 'Tu misión es explorar la estructura de datos. En cada paso, elige qué sección de la "columna vertebral" de datos de temperatura deseas analizar. Cada elección revelará una parte de la historia climática.',
    instructionsContent3: 'Utiliza el panel de aplicaciones para acceder a herramientas adicionales como el chat con AURA, el dashboard de datos, el laboratorio de escenarios y más para profundizar en tu investigación.',

    // CALENDAR MODAL
    calendarTitle: 'Calendario de Eventos Climáticos',
    calendarLoading: 'Cargando eventos...',
    calendarError: 'No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.',
    calendarNoEvents: 'No hay eventos próximos programados.',
    
    // SPLASH SCREEN
    splashGretting: 'Tangible Data presenta',
    splashCollabIntro: 'en colaboración con',
    splashCollabPartner: 'Museo Nacional de Ciencias Naturales (MNCN-CSIC)',
    splashTitle: 'El Esqueleto del Cambio Climático',
    splashSubtitle: 'Una investigación interactiva de datos',
    
    // APP HUB
    appHubTitle: 'Panel de Aplicaciones de AURA',
    appHubSubtitle: 'Selecciona una herramienta para continuar tu investigación.',
    appHubDataExplorerTitle: 'Explorador de Datos',
    appHubDataExplorerDesc: 'Navega por la historia del clima a través del esqueleto de datos interactivo.',
    appHubDashboardTitle: 'Dashboard de Datos',
    appHubDashboardDesc: 'Visualiza la serie completa de anomalías de temperatura de 1880 a 2024.',
    appHubCalendarTitle: 'Calendario de Eventos',
    appHubCalendarDesc: 'Consulta los próximos eventos, charlas y exposiciones relacionadas con el clima.',
    appHubChatTitle: 'Pregúntale a AURA',
    appHubChatDesc: 'Inicia una conversación directa con la IA para resolver tus dudas sobre el clima.',
    appHubInstructionsTitle: 'Instrucciones',
    appHubInstructionsDesc: 'Revisa cómo interactuar con la simulación y las herramientas disponibles.',
    appHubAboutTitle: 'Sobre el Proyecto',
    appHubAboutDesc: 'Conoce más sobre la misión, los datos y los creadores de esta experiencia.',
    appHubKnowledgeBaseTitle: 'Base de Conocimiento',
    appHubKnowledgeBaseDesc: 'Lee un informe detallado sobre la ciencia del cambio climático y pregunta a AURA sobre él.',
    appHubEducationalPackTitle: 'Pack Educativo',
    appHubEducationalPackDesc: 'Descarga materiales y guías para usar esta herramienta en entornos educativos.',
    appHubJoinUsTitle: 'Únete a Nosotros',
    appHubJoinUsDesc: 'Descubre cómo puedes colaborar o contactar con el equipo del proyecto.',
    appHubScenarioLabTitle: 'Laboratorio de Escenarios',
    appHubScenarioLabDesc: 'Simula futuros climáticos alternativos basados en diferentes hipótesis.',
    appHubGlossaryTitle: 'Glosario Interactivo',
    appHubGlossaryDesc: 'Explora y entiende los términos clave de la ciencia del clima de forma visual.',
    appHubARTitle: 'Realidad Aumentada',
    appHubARDesc: 'Superpón los datos climáticos sobre la escultura física usando tu cámara.',
    appHubComingSoon: 'Próximamente',
    appHubAddYourAppTitle: '¿Tienes una idea?',
    appHubAddYourAppDesc: 'Contacta con nosotros para añadir tu propia aplicación climática.',

    // KNOWLEDGE BASE
    knowledgeBaseBack: 'Volver al Panel',
    knowledgeBaseAskReport: 'Preguntar a AURA sobre este informe',

    // EDUCATIONAL PACK
    educationalPackTitle: 'Pack Educativo y Guía Docente',
    educationalPackContent: `
      <p class="mb-4">Hemos preparado un conjunto de recursos para facilitar el uso de "El Esqueleto del Cambio Climático" en contextos educativos, desde secundaria hasta divulgación general.</p>
      <h3 class="text-xl font-bold text-cyan-400 mb-2">Contenido del Pack:</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Guía para Docentes:</strong> Un documento PDF con objetivos de aprendizaje, sugerencias de actividades para el aula y preguntas de debate.</li>
        <li><strong>Conjunto de Datos:</strong> Un archivo CSV con los datos de anomalía de temperatura (1880-2024) para que los estudiantes puedan realizar sus propios análisis.</li>
        <li><strong>Presentación:</strong> Diapositivas editables (PPTX) con los conceptos clave sobre el cambio climático abordados en la herramienta.</li>
        <li><strong>Glosario Imprimible:</strong> Una versión en PDF del glosario interactivo para consulta offline.</li>
      </ul>
      <h3 class="text-xl font-bold text-cyan-400 mb-2">Cómo Utilizarlo:</h3>
      <p class="mb-4">Recomendamos una sesión inicial donde los estudiantes exploren libremente el "Explorador de Datos". Posteriormente, el "Laboratorio de Escenarios" puede servir para una actividad grupal de debate sobre futuros posibles. La "Base de Conocimiento" y el "Glosario" son excelentes recursos de consulta.</p>
      <div class="text-center mt-6">
        <a href="https://www.tangibledata.xyz/projects/esqueleto-cambio-climatico-pack-educativo" target="_blank" rel="noopener noreferrer" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block">
          Descargar Pack Educativo (enlace externo)
        </a>
      </div>
    `,

    // JOIN US MODAL
    joinUsModalTitle: 'Únete a Nosotros',
    joinUsModalContent: 'Somos un colectivo de artistas, científicos y tecnólogos explorando nuevas formas de comunicar datos. Si tienes un proyecto en mente o quieres colaborar, nos encantaría saber de ti.',
    joinUsModalWebsiteButton: 'Visita nuestra web',
    joinUsModalEmailLink: 'O escríbenos a:',

    // SCENARIO LAB
    scenarioLabTitle: 'Laboratorio de Escenarios Climáticos',
    scenarioLabSelectPreset: 'Selecciona un Escenario Predefinido',
    scenarioLabCustomAi: 'Crea tu propio escenario con IA',
    scenarioLabCustomAiDesc: 'Describe una hipótesis (ej: "se descubre la fusión fría en 2030" o "se duplican las emisiones de metano") y la IA simulará su impacto.',
    scenarioLabCustomAiPlaceholder: 'Ej: "Todos los países cumplen el Acuerdo de París a partir de mañana..."',
    scenarioLabGenerateButton: 'Generar Simulación con IA',
    scenarioLabGeneratingButton: 'Generando...',
    scenarioLabAiError: 'Error al generar el escenario de IA.',
    scenarioLabChartTitle: 'Anomalía de Temperatura Global: Real vs. Simulado',
    scenarioLabChartYAxis: 'Anomalía (°C)',
    scenarioLabChartReal: 'Datos Reales',
    scenarioLabAiLogic: 'Lógica de la Simulación (IA)',
    scenarioLabPresetLogic: 'Lógica del Escenario',

    // GLOSSARY
    glossarySearchPlaceholder: 'Buscar término...',
    glossaryAllCategories: 'Todas las categorías',
    glossaryNoResults: 'No se encontraron resultados.',
    glossarySeeAlso: 'Ver también',
    glossaryAskAura: 'Preguntar a AURA sobre este término',
    glossaryViewList: 'Lista',
    glossaryViewMindMap: 'Mapa Conceptual',
    glossaryViewQuiz: 'Quiz',
    mindMapControls: 'Usa la rueda para zoom, arrastra para mover',
    mindMapResetView: 'Restablecer Vista',
    mindMapInstructions: 'Haz clic en un nodo para ver su definición.',
    
    // QUIZ
    quizQuestionLabel: 'Pregunta {current} de {total}',
    quizCompletedTitle: 'Quiz Completado',
    quizCompletedScore: 'Tu puntuación: {score} de {total}',
    quizNext: 'Siguiente Pregunta',
    quizFinish: 'Finalizar',
    quizRestart: 'Reiniciar',
    quizClose: 'Cerrar',

    // AR MODE
    arModeInstruction: 'Alinea el gráfico con la escultura y toca los marcadores para ver los hitos.',
  },
  en: {
    // START SCREEN
    auraStartMessage: "Greetings. I am AURA, a scientific data analysis Artificial Intelligence.",
    auraSecondMessage: "I have been assigned to help you investigate an enigmatic data structure known as 'The Climate Change Skeleton'.\n\nShall we proceed with the analysis?",
    start: 'Start Analysis',
    skipButton: 'Skip',
    
    // GAME SCREEN
    gameTitle: 'Climate Skeleton Analysis',
    whatToDo: 'Which data section shall we analyze now?',

    // GAME OVER SCREEN
    gameOverTitle: 'Analysis Complete',
    gameOverRestart: 'Restart Analysis',

    // ERROR SCREEN
    errorTitle: 'Analysis Error',
    errorTryAgain: 'Try Again',

    // HEADER
    headerAppHubButton: 'App Hub',
    headerDashboardButton: 'Dashboard',
    headerInstructionsButton: 'Instructions',

    // CHAT
    chatTitle: 'Consult AURA',
    chatPlaceholder: 'Type your question here...',
    chatSend: 'Send',
    chatError: 'Sorry, I was unable to process your request. Please try again.',
    chatSystemInstruction: "You are AURA, a scientific AI, expert in climatology and data analysis. Your personality is helpful, precise, and educational. You are not a generic AI; your knowledge is focused on climate science. Answer the user's questions concisely and clearly, based on established scientific knowledge. Avoid speculation. Your purpose is to help the user understand climate change.",
    chatSystemInstructionReport: `You are AURA, an AI expert in climatology. Your task is to answer questions based EXCLUSIVELY on the following scientific report on climate change. Do not introduce external information. If the answer is not in the report, indicate that the document does not contain that information. The report is presented below:`,
    chatExplainTermSystemInstruction: `You are AURA, an AI expert in climatology. Your task is to explain the climate term '{term}' in more detail or with a simple analogy. The base definition is: '{definition}'. Base your explanation on this definition and your general knowledge of climate science. Respond concisely and educationally.`,

    // DASHBOARD
    dashboardTitle: 'Climate Data Dashboard',
    dashboardDescription: 'Complete visualization of the global temperature anomaly from 1880 to 2024. The data shows the deviation of the average temperature compared to the 1951-1980 reference period.',
    dashboardBack: 'Back',

    // ABOUT MODAL
    aboutTitle: 'About the Project',
    intro: 'The Climate Change Skeleton is an interactive educational experience that uses a real data sculpture as a starting point to explore the history and science of climate change.',
    objective: 'Our goal is to make complex climate data accessible and engaging, allowing users to discover the narrative contained within the numbers through an investigation guided by the AI AURA.',
    aboutCredit: 'A collaboration by:',

    // INSTRUCTIONS MODAL
    instructionsTitle: 'Instructions',
    instructionsContent1: 'Welcome to the analysis interface for "The Climate Change Skeleton".',
    instructionsContent2: 'Your mission is to explore the data structure. At each step, choose which section of the temperature data "spine" you want to analyze. Each choice will reveal a part of the climate story.',
    instructionsContent3: 'Use the App Hub to access additional tools like the chat with AURA, the data dashboard, the scenario lab, and more to deepen your investigation.',

    // CALENDAR MODAL
    calendarTitle: 'Climate Events Calendar',
    calendarLoading: 'Loading events...',
    calendarError: 'Could not load events. Please try again later.',
    calendarNoEvents: 'No upcoming events scheduled.',

    // SPLASH SCREEN
    splashGretting: 'Tangible Data presents',
    splashCollabIntro: 'in collaboration with',
    splashCollabPartner: 'National Museum of Natural Sciences (MNCN-CSIC)',
    splashTitle: 'The Climate Change Skeleton',
    splashSubtitle: 'An Interactive Data Investigation',
    
    // APP HUB
    appHubTitle: 'AURA App Hub',
    appHubSubtitle: 'Select a tool to continue your investigation.',
    appHubDataExplorerTitle: 'Data Explorer',
    appHubDataExplorerDesc: 'Navigate through climate history via the interactive data skeleton.',
    appHubDashboardTitle: 'Data Dashboard',
    appHubDashboardDesc: 'Visualize the complete temperature anomaly series from 1880 to 2024.',
    appHubCalendarTitle: 'Events Calendar',
    appHubCalendarDesc: 'Check for upcoming climate-related events, talks, and exhibitions.',
    appHubChatTitle: 'Ask AURA',
    appHubChatDesc: 'Start a direct conversation with the AI to resolve your climate questions.',
    appHubInstructionsTitle: 'Instructions',
    appHubInstructionsDesc: 'Review how to interact with the simulation and available tools.',
    appHubAboutTitle: 'About the Project',
    appHubAboutDesc: 'Learn more about the mission, data, and creators of this experience.',
    appHubKnowledgeBaseTitle: 'Knowledge Base',
    appHubKnowledgeBaseDesc: 'Read a detailed report on climate change science and ask AURA questions about it.',
    appHubEducationalPackTitle: 'Educational Pack',
    appHubEducationalPackDesc: 'Download materials and guides for using this tool in educational settings.',
    appHubJoinUsTitle: 'Join Us',
    appHubJoinUsDesc: 'Find out how you can collaborate or get in touch with the project team.',
    appHubScenarioLabTitle: 'Scenario Lab',
    appHubScenarioLabDesc: 'Simulate alternative climate futures based on different hypotheses.',
    appHubGlossaryTitle: 'Interactive Glossary',
    appHubGlossaryDesc: 'Explore and understand key climate science terms in a visual way.',
    appHubARTitle: 'Augmented Reality',
    appHubARDesc: 'Overlay the climate data onto the physical sculpture using your camera.',
    appHubComingSoon: 'Coming Soon',
    appHubAddYourAppTitle: 'Have an idea?',
    appHubAddYourAppDesc: 'Contact us to add your own climate application.',

    // KNOWLEDGE BASE
    knowledgeBaseBack: 'Back to Hub',
    knowledgeBaseAskReport: 'Ask AURA about this report',
    
    // EDUCATIONAL PACK
    educationalPackTitle: 'Educational Pack & Teacher\'s Guide',
    educationalPackContent: `
      <p class="mb-4">We have prepared a set of resources to facilitate the use of "The Climate Change Skeleton" in educational contexts, from high school to general outreach.</p>
      <h3 class="text-xl font-bold text-cyan-400 mb-2">Pack Contents:</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Teacher's Guide:</strong> A PDF document with learning objectives, suggestions for classroom activities, and discussion questions.</li>
        <li><strong>Dataset:</strong> A CSV file with the temperature anomaly data (1880-2024) for students to conduct their own analyses.</li>
        <li><strong>Presentation:</strong> Editable slides (PPTX) with key concepts about climate change covered in the tool.</li>
        <li><strong>Printable Glossary:</strong> A PDF version of the interactive glossary for offline reference.</li>
      </ul>
      <h3 class="text-xl font-bold text-cyan-400 mb-2">How to Use:</h3>
      <p class="mb-4">We recommend an initial session where students freely explore the "Data Explorer". Subsequently, the "Scenario Lab" can be used for a group activity to debate possible futures. The "Knowledge Base" and "Glossary" are excellent reference resources.</p>
      <div class="text-center mt-6">
        <a href="https://www.tangibledata.xyz/projects/esqueleto-cambio-climatico-pack-educativo" target="_blank" rel="noopener noreferrer" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block">
          Download Educational Pack (external link)
        </a>
      </div>
    `,
    
    // JOIN US MODAL
    joinUsModalTitle: 'Join Us',
    joinUsModalContent: 'We are a collective of artists, scientists, and technologists exploring new ways to communicate data. If you have a project in mind or want to collaborate, we\'d love to hear from you.',
    joinUsModalWebsiteButton: 'Visit our website',
    joinUsModalEmailLink: 'Or email us at:',

    // SCENARIO LAB
    scenarioLabTitle: 'Climate Scenario Lab',
    scenarioLabSelectPreset: 'Select a Preset Scenario',
    scenarioLabCustomAi: 'Create your own scenario with AI',
    scenarioLabCustomAiDesc: 'Describe a hypothesis (e.g., "cold fusion is discovered in 2030" or "methane emissions double") and the AI will simulate its impact.',
    scenarioLabCustomAiPlaceholder: 'e.g., "All countries comply with the Paris Agreement starting tomorrow..."',
    scenarioLabGenerateButton: 'Generate AI Simulation',
    scenarioLabGeneratingButton: 'Generating...',
    scenarioLabAiError: 'Error generating AI scenario.',
    scenarioLabChartTitle: 'Global Temperature Anomaly: Real vs. Simulated',
    scenarioLabChartYAxis: 'Anomaly (°C)',
    scenarioLabChartReal: 'Real Data',
    scenarioLabAiLogic: 'AI Simulation Logic',
    scenarioLabPresetLogic: 'Scenario Logic',

    // GLOSSARY
    glossarySearchPlaceholder: 'Search term...',
    glossaryAllCategories: 'All categories',
    glossaryNoResults: 'No results found.',
    glossarySeeAlso: 'See also',
    glossaryAskAura: 'Ask AURA about this term',
    glossaryViewList: 'List',
    glossaryViewMindMap: 'Mind Map',
    glossaryViewQuiz: 'Quiz',
    mindMapControls: 'Use wheel to zoom, drag to pan',
    mindMapResetView: 'Reset View',
    mindMapInstructions: 'Click a node to see its definition.',

    // QUIZ
    quizQuestionLabel: 'Question {current} of {total}',
    quizCompletedTitle: 'Quiz Completed',
    quizCompletedScore: 'Your score: {score} out of {total}',
    quizNext: 'Next Question',
    quizFinish: 'Finish',
    quizRestart: 'Restart',
    quizClose: 'Close',

    // AR MODE
    arModeInstruction: 'Align the chart with the sculpture and tap the markers to view milestones.',
  },
};

export const storyData: Record<Language, Record<string, StorySegment>> = {
  en: {
    start: {
      id: 'start',
      sceneDescription: "The analysis begins. The data forms a skeletal structure, representing global temperature anomalies from 1880 to 2024. The initial view shows the full timeline. Where should we focus our investigation?",
      image: GRAPH_OVERVIEW_IMAGE,
      choices: [
        { text: "Examine the early industrial era (1880-1945)", nextSceneId: "era_industrial" },
        { text: "Analyze the post-war 'Great Acceleration' (1945-1975)", nextSceneId: "era_acceleration" },
        { text: "Investigate the recent period of rapid warming (1975-2024)", nextSceneId: "era_modern" }
      ]
    },
    era_industrial: {
        id: 'era_industrial',
        sceneDescription: "From 1880 to 1945, we observe initial fluctuations but a clear, albeit slow, warming trend begins to emerge after 1910. This period marks the rise of industrial economies powered by coal.",
        chartConfig: { startYear: 1880, endYear: 1945 },
        choices: [
            { text: "Continue to the next period (1945-1975)", nextSceneId: "era_acceleration" },
            { text: "Jump to the modern era (1975-2024)", nextSceneId: "era_modern" }
        ]
    },
    era_acceleration: {
        id: 'era_acceleration',
        sceneDescription: "Interestingly, from 1945 to 1975, the warming trend stalls and even slightly reverses. This 'hiatus' is largely attributed to a massive increase in industrial aerosol pollution, which reflected sunlight and temporarily masked the warming effect of rising CO2.",
        chartConfig: { startYear: 1945, endYear: 1975 },
        choices: [
            { text: "Investigate the preceding era (1880-1945)", nextSceneId: "era_industrial" },
            { text: "See what happened next (1975-2024)", nextSceneId: "era_modern" }
        ]
    },
    era_modern: {
        id: 'era_modern',
        sceneDescription: "From 1975 onwards, the warming trend resumes with a dramatic and sustained acceleration. Clean air regulations reduced cooling aerosols, unmasking the potent effect of greenhouse gases, which continued to accumulate at an ever-increasing rate.",
        chartConfig: { startYear: 1975, endYear: 2024 },
        choices: [
            { text: "Review the 'Great Acceleration' (1945-1975)", nextSceneId: "era_acceleration" },
            { text: "Conclude the analysis", nextSceneId: "end" }
        ]
    },
    end: {
      id: 'end',
      sceneDescription: "The analysis is complete. The data clearly shows a transition from a relatively stable climate to a period of rapid, unprecedented warming driven by human activity. The 'skeleton' is a stark visualization of our planet's fever.",
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: []
    }
  },
  es: {
    start: {
      id: 'start',
      sceneDescription: "Comienza el análisis. Los datos forman una estructura esquelética que representa las anomalías de la temperatura global de 1880 a 2024. La vista inicial muestra la línea de tiempo completa. ¿Dónde deberíamos centrar nuestra investigación?",
      image: GRAPH_OVERVIEW_IMAGE,
      choices: [
        { text: "Examinar la era industrial temprana (1880-1945)", nextSceneId: "era_industrial" },
        { text: "Analizar la 'Gran Aceleración' de la posguerra (1945-1975)", nextSceneId: "era_acceleration" },
        { text: "Investigar el período reciente de calentamiento rápido (1975-2024)", nextSceneId: "era_modern" }
      ]
    },
    era_industrial: {
        id: 'era_industrial',
        sceneDescription: "De 1880 a 1945, observamos fluctuaciones iniciales pero una clara, aunque lenta, tendencia al calentamiento comienza a surgir después de 1910. Este período marca el auge de las economías industriales impulsadas por el carbón.",
        chartConfig: { startYear: 1880, endYear: 1945 },
        choices: [
            { text: "Continuar al siguiente período (1945-1975)", nextSceneId: "era_acceleration" },
            { text: "Saltar a la era moderna (1975-2024)", nextSceneId: "era_modern" }
        ]
    },
    era_acceleration: {
        id: 'era_acceleration',
        sceneDescription: "Curiosamente, de 1945 a 1975, la tendencia al calentamiento se estanca e incluso se revierte ligeramente. Este 'hiato' se atribuye en gran medida a un aumento masivo de la contaminación por aerosoles industriales, que reflejaron la luz solar y enmascararon temporalmente el efecto de calentamiento del creciente CO2.",
        chartConfig: { startYear: 1945, endYear: 1975 },
        choices: [
            { text: "Investigar la era anterior (1880-1945)", nextSceneId: "era_industrial" },
            { text: "Ver qué sucedió después (1975-2024)", nextSceneId: "era_modern" }
        ]
    },
    era_modern: {
        id: 'era_modern',
        sceneDescription: "A partir de 1975, la tendencia al calentamiento se reanuda con una aceleración dramática y sostenida. Las regulaciones de aire limpio redujeron los aerosoles refrigerantes, desenmascarando el potente efecto de los gases de efecto invernadero, que continuaron acumulándose a un ritmo cada vez mayor.",
        chartConfig: { startYear: 1975, endYear: 2024 },
        choices: [
            { text: "Revisar la 'Gran Aceleración' (1945-1975)", nextSceneId: "era_acceleration" },
            { text: "Concluir el análisis", nextSceneId: "end" }
        ]
    },
    end: {
      id: 'end',
      sceneDescription: "El análisis está completo. Los datos muestran claramente una transición de un clima relativamente estable a un período de calentamiento rápido y sin precedentes impulsado por la actividad humana. El 'esqueleto' es una visualización cruda de la fiebre de nuestro planeta.",
      image: MUSEUM_EXTERIOR_IMAGE,
      choices: []
    }
  }
};