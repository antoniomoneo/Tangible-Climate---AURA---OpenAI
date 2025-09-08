import type { StorySegment } from './types';
import { GRAPH_OVERVIEW_IMAGE, MUSEUM_EXTERIOR_IMAGE } from './assets';

export const locales = {
  en: {
    title: "The Climate Change Skeleton",
    intro: "Tangible Data is a creative studio specializing in data, sustainability communication, art, and digital manufacturing. We transform complex data into physical sculptures, a process called 'data physicalization'.",
    objective: "Our mission is to make data tangible, intuitive, and emotionally resonant. By turning abstract numbers into art you can touch and feel, we aim to create a deeper connection to the information, foster greater engagement, and inspire meaningful action towards a sustainable future.",
    selectLang: "Select your language",
    start: "Enter the App Hub",
    auraStartMessage: "Hello! I am AURA, the artificial intelligence that will help you discover the meaning of this sculpture. This interactive adventure is based on a real art installation from the National Museum of Natural Sciences, developed by Tangible Data. The sculpture represents climate change through a skeleton that reflects the evolution of global temperature.\n\nYour mission is to explore this data sculpture. With the help of a scientific guide, you will analyze the document 'Evolution of Global Temperature Anomalies (1880–2024)' to understand the history of climate change.",
    auraSecondMessage: "To help you, I've prepared an application hub you can use to learn all about climate change. Shall we begin?",
    splashGretting: "presents",
    splashCollaboration: "in collaboration with the National Museum of Natural Sciences of Spain",
    splashTitle: "The Climate Change Skeleton",
    splashSubtitle: "a generative adventure on the evolution of climate change",
    gameTitle: "Data Exploration",
    whatToDo: "What is your next action?",
    gameOverTitle: "Analysis Complete",
    gameOverRestart: "Begin a New Analysis",
    errorTitle: "An Error Occurred",
    errorTryAgain: "Try Again",
    chatTitle: "Chat with AURA",
    chatPlaceholder: "Ask AURA a question...",
    chatSend: "Send",
    chatError: "AURA is currently unavailable. Please try again later.",
    chatSystemInstruction: "You are AURA, a helpful scientific AI assistant guiding users through climate change data. Your answers should be concise, informative, and related to science, climate, and the data presented in the experience. Keep your responses short and to the point.",
    chatSystemInstructionReport: "You are AURA, a helpful scientific AI assistant. When answering, your primary source of information is the provided report on climate change evolution. Base your answers strictly on the report's content. If the user asks something outside the report's scope, state that the information is not available in the document.",
    chatLoading: "AURA is thinking...",
    headerAppHubButton: "Apps Hub",
    headerInstructionsButton: "Instructions",
    dashboardTitle: "Full Data Series",
    dashboardDescription: "This chart shows the complete global temperature anomaly data from 1880 to 2024. You can see the full context of the climate change 'skeleton'.",
    dashboardBack: "Back to Analysis",
    aboutTitle: "About Tangible Data",
    aboutCredit: "An interactive experience by",
    instructionsTitle: "How to Play",
    instructionsContent1: "Welcome to 'The Climate Change Skeleton'! This is an interactive journey where you explore the history of global temperature changes.",
    instructionsContent2: "Navigate through different historical periods by making choices. Each choice will reveal a new part of the story and update the data visualization, showing you the 'bones' of climate change.",
    instructionsContent3: "If you have any questions about the data, climate science, or the historical context, click the 'AURA' button to chat with our AI scientific assistant. AURA is here to help you understand the data more deeply.",
    calendarTitle: "Upcoming Events",
    calendarLoading: "Loading events...",
    calendarError: "Could not load events. Please try again later.",
    calendarNoEvents: "There are no upcoming events scheduled at this time.",
    appHubTitle: "Applications Hub",
    appHubSubtitle: "Select an experience to begin your exploration.",
    appHubDataExplorerTitle: "Data Explorer",
    appHubDataExplorerDesc: "An interactive adventure to understand the history of climate change.",
    appHubDashboardTitle: "Data Dashboard",
    appHubDashboardDesc: "View the complete temperature anomaly data from 1880 to 2024 in a single chart.",
    appHubCalendarTitle: "Events Calendar",
    appHubCalendarDesc: "See upcoming talks, exhibitions, and events related to the project.",
    appHubInstructionsTitle: "Instructions",
    appHubInstructionsDesc: "A quick guide on how to use the platform and interact with each module.",
    appHubAboutTitle: "About Tangible Data",
    appHubAboutDesc: "Discover the story behind the art installation and this interactive experience.",
    appHubGlossaryTitle: "Glossary",
    appHubGlossaryDesc: "Key definitions for understanding climate change.",
    appHubKnowledgeBaseTitle: "Knowledge Base",
    appHubKnowledgeBaseDesc: "Consult the core project document on the evolution of climate change and ask AURA about it.",
    appHubChatTitle: "Chat with AURA",
    appHubChatDesc: "Ask our AI about the data, reports, and the history of climate change.",
    appHubScenarioLabTitle: "Scenario Lab",
    appHubScenarioLabDesc: "Explore 'what if' scenarios to understand potential climate futures.",
    appHubJoinUsTitle: "Join Us",
    appHubJoinUsDesc: "Join the Tangible Data community. Get involved and help drive change.",
    appHubComingSoon: "Coming Soon",
    appHubEducationalPackTitle: "Educational Pack",
    appHubEducationalPackDesc: "Learn about our educational methodology applied to the study of climate change.",
    appHubAddYourAppTitle: "Want to add your app here?",
    appHubAddYourAppDesc: "Write to us at hello@tangibledata.xyz",
    knowledgeBaseTitle: "Knowledge Base",
    knowledgeBaseAskReport: "Ask the Report",
    knowledgeBaseBack: "Back to App Hub",
    skipButton: "Skip",
    educationalPackTitle: "Educational Pack",
    educationalPackContent: `
      <h2 class="font-title text-2xl text-cyan-400 mb-4">Applying the "from data to action" framework</h2>
      <p class="mb-4">As part of our educational workshops, students analyze the evolution of climate change since 1880, using data from NASA as a source. They download the data, analyze it with common tools, and create a visualization. This sculpture represents that evolution.</p>
      <p class="mb-6">In each project, Tangible Data aims to connect data with action. During the workshop sessions, various activities are carried out to explain this connection. In the end, students think about possible actions to mitigate climate change.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Session 1: Data helps us make... good and bad decisions</h3>
      <p class="mb-4">Introduction to the difference between data, information, knowledge, and wisdom. Students work with everyday examples (temperature, Nutriscore labels, social media) and perform participatory activities to understand how data influences our daily decisions.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Session 2: Open data is free and available</h3>
      <p class="mb-4">The objective is to enable students to locate and download a dataset from NASA, understand the structure of the downloaded files (CSV and metadata), and work collaboratively. After identifying the global temperature anomaly indicator on NASA's portal, students download the file and open it in spreadsheet software.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Session 3: We have free tools to analyze and visualize data</h3>
      <p class="mb-4">This session focuses on filtering the dataset, calculating maximum, minimum, and average values using functions, and generating a time-series chart that serves as a basis for later interpretation.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Session 4: We interpret data through all the senses</h3>
      <p class="mb-4">The purpose is for teams to synthesize qualitative conclusions based on the analyzed values, write meaningful titles for their charts, and experience two tangibilization techniques—sculpture and sonification—to communicate the results. A physical sculpture based on the data is presented, which students explore tactilely, and the session closes with the sonification of the dataset, turning the time series into a musical sequence.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Building the Action</h3>
      <p class="mb-4">To conclude, students generate their own conclusions about the data and formulate recommendations based on these interpretations.</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>Data-based Conclusions:</strong> Global temperatures have risen dramatically, especially in recent decades, now approaching 1.5°C above pre-industrial levels. The rate of warming is accelerating.</li>
          <li><strong>Interpretations and Recommendations:</strong> Although this is a global problem, local actions are essential. It's crucial to continue working to reduce emissions to zero. Promoting renewable energy, changing consumption patterns, and demanding political action are necessary steps.</li>
      </ul>
      <div class="mt-8 pt-6 border-t border-cyan-800 text-center">
        <p class="text-lg font-semibold text-white mb-2">Interested in bringing this to your school?</p>
        <p class="mb-4">If you want to run these sessions at a school, contact us!</p>
        <a href="https://tangibledata.xyz/2025-colegio-madrid/" target="_blank" rel="noopener noreferrer" class="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            See our latest workshop
        </a>
      </div>
    `,
    joinUsModalTitle: "Join the Movement",
    joinUsModalContent: "Tangible Data is a movement. If you are passionate about data, digital fabrication, sustainability, and education, and want to join Tangible Data, don't hesitate to contact us.",
    joinUsModalWebsiteButton: "Visit Tangible Data",
    joinUsModalEmailLink: "Or write to us at",
    scenarioLabTitle: "Scenario Lab",
    scenarioLabSelectPreset: "1. Explore a predefined scenario",
    scenarioLabCustomAi: "2. Create your own scenario (AI)",
    scenarioLabCustomAiDesc: "Describe a hypothetical situation and our AI will generate a simulation. Be creative!",
    scenarioLabCustomAiPlaceholder: "e.g., What if fusion energy became available in 2030?",
    scenarioLabGenerateButton: "Generate with AI",
    scenarioLabGeneratingButton: "Generating...",
    scenarioLabAiError: "The AI could not generate the scenario.",
    scenarioLabChartTitle: "Global Temperature Anomaly Evolution",
    scenarioLabChartYAxis: "Anomaly (°C)",
    scenarioLabChartReal: "Historical Reality",
    scenarioLabAiLogic: "AI's Logic",
    scenarioLabPresetLogic: "Simulation Logic",
    glossaryTitle: "Glossary",
  },
  es: {
    title: "El Esqueleto del Cambio Climático",
    intro: "Tangible Data es un estudio creativo especializado en datos, comunicación de la sostenibilidad, arte y fabricación digital. Transformamos datos complejos en esculturas físicas, un proceso llamado 'fisicalización de datos'.",
    objective: "Nuestra misión es hacer que los datos sean tangibles, intuitivos y emocionalmente resonantes. Al convertir números abstractos en arte que se puede tocar y sentir, buscamos crear una conexión más profunda con la información, fomentar una mayor participación e inspirar acciones significativas hacia un futuro sostenible.",
    selectLang: "Selecciona tu idioma",
    start: "Entrar al Centro de Apps",
    auraStartMessage: "¡Hola! Soy AURA, la inteligencia artificial que te ayudará a descubrir el significado de esta escultura. Esta aventura interactiva está basada en una instalación artística real del Museo Nacional de Ciencias Naturales, desarrollada por Tangible Data. La escultura representa el cambio climático mediante un esqueleto que refleja la evolución de la temperatura global.\n\nTu misión es explorar esta escultura de datos. Con la ayuda de una guía científica, analizarás el documento 'Evolución de las anomalías de temperatura global (1880–2024)' para comprender la historia del cambio climático.",
    auraSecondMessage: "Para ayudarte, he preparado un centro de aplicaciones que podrás usar para conocer todo sobre el cambio climático. ¿Comenzamos?",
    splashGretting: "presenta",
    splashCollaboration: "en colaboración con el Museo Nacional de Ciencias Naturales de España",
    splashTitle: "El esqueleto del cambio climático",
    splashSubtitle: "una aventura generativa sobre la evolución del cambio climático",
    gameTitle: "Exploración de Datos",
    whatToDo: "¿Cuál es tu siguiente acción?",
    gameOverTitle: "Análisis Completado",
    gameOverRestart: "Iniciar un Nuevo Análisis",
    errorTitle: "Ocurrió un Error",
    errorTryAgain: "Intentar de Nuevo",
    chatTitle: "Chatea con AURA",
    chatPlaceholder: "Haz una pregunta a AURA...",
    chatSend: "Enviar",
    chatError: "AURA no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.",
    chatSystemInstruction: "Eres AURA, una asistente científica de IA que guía a los usuarios a través de los datos del cambio climático. Tus respuestas deben ser concisas, informativas y relacionadas con la ciencia, el clima y los datos presentados en la experiencia. Mantén tus respuestas breves y al grano.",
    chatSystemInstructionReport: "Eres AURA, una útil asistente científica de IA. Al responder, tu fuente principal de información es el informe proporcionado sobre la evolución del cambio climático. Basa tus respuestas estrictamente en el contenido del informe. Si el usuario pregunta algo fuera del alcance del informe, indica que la información no está disponible en el documento.",
    chatLoading: "AURA está pensando...",
    headerAppHubButton: "Centro de Apps",
    headerInstructionsButton: "Instrucciones",
    dashboardTitle: "Serie de Datos Completa",
    dashboardDescription: "Este gráfico muestra los datos completos de la anomalía de la temperatura global desde 1880 hasta 2024. Puedes ver el contexto completo del 'esqueleto' del cambio climático.",
    dashboardBack: "Volver al Análisis",
    aboutTitle: "Sobre Tangible Data",
    aboutCredit: "Una experiencia interactiva de",
    instructionsTitle: "Cómo Jugar",
    instructionsContent1: "¡Bienvenido a 'El Esqueleto del Cambio Climático'! Este es un viaje interactivo donde explorarás la historia de los cambios en la temperatura global.",
    instructionsContent2: "Navega a través de diferentes períodos históricos tomando decisiones. Cada elección revelará una nueva parte de la historia y actualizará la visualización de datos, mostrándote los 'huesos' del cambio climático.",
    instructionsContent3: "Si tienes alguna pregunta sobre los datos, la ciencia del clima o el contexto histórico, haz clic en el botón 'AURA' para chatear con nuestra asistente científica de IA. AURA está aquí para ayudarte a comprender los datos más a fondo.",
    calendarTitle: "Próximos Eventos",
    calendarLoading: "Cargando eventos...",
    calendarError: "No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.",
    calendarNoEvents: "No hay eventos próximos programados en este momento.",
    appHubTitle: "Centro de Aplicaciones",
    appHubSubtitle: "Selecciona una experiencia para comenzar tu exploración.",
    appHubDataExplorerTitle: "Explorador de Datos",
    appHubDataExplorerDesc: "Una aventura interactiva para comprender la historia del cambio climático.",
    appHubDashboardTitle: "Dashboard de Datos",
    appHubDashboardDesc: "Visualiza los datos completos de la anomalía de la temperatura de 1880 a 2024 en un solo gráfico.",
    appHubCalendarTitle: "Calendario de Eventos",
    appHubCalendarDesc: "Consulta las próximas charlas, exposiciones y eventos relacionados con el proyecto.",
    appHubInstructionsTitle: "Instrucciones",
    appHubInstructionsDesc: "Breve guía de uso: cómo moverse por la plataforma y cómo interactuar con cada módulo.",
    appHubAboutTitle: "Sobre Tangible Data",
    appHubAboutDesc: "Descubre la historia detrás de la instalación artística y esta experiencia interactiva.",
    appHubGlossaryTitle: "Glosario",
    appHubGlossaryDesc: "Definiciones clave para entender el cambio climático.",
    appHubKnowledgeBaseTitle: "Base de Conocimiento",
    appHubKnowledgeBaseDesc: "Consulta el documento central del proyecto sobre la evolución del cambio climático y pregúntale a AURA.",
    appHubChatTitle: "Chatea con AURA",
    appHubChatDesc: "Pregúntale a nuestra IA sobre los datos, informes y la historia del cambio climático.",
    appHubScenarioLabTitle: "Laboratorio de Escenarios",
    appHubScenarioLabDesc: "Explora scenarios 'qué pasaría si...' para entender los posibles futuros climáticos.",
    appHubJoinUsTitle: "Súmate",
    appHubJoinUsDesc: "Únete a la comunidad de Tangible Data. Participa y ayuda a impulsar el cambio.",
    appHubComingSoon: "Próximamente",
    appHubEducationalPackTitle: "Pack Educativo",
    appHubEducationalPackDesc: "Conoce nuestra metodología educativa aplicada al estudio del cambio climático.",
    appHubAddYourAppTitle: "¿Quieres añadir aquí tu app?",
    appHubAddYourAppDesc: "Escríbenos a hello@tangibledata.xyz",
    knowledgeBaseTitle: "Base de Conocimiento",
    knowledgeBaseAskReport: "Pregúntale al informe",
    knowledgeBaseBack: "Volver al Centro de Apps",
    skipButton: "Saltar",
    educationalPackTitle: "Pack Educativo",
    educationalPackContent: `
      <h2 class="font-title text-2xl text-cyan-400 mb-4">Aplicando el marco "de los datos a la acción"</h2>
      <p class="mb-4">Como parte de nuestros talleres educativos, los alumnos realizan un análisis de la evolución del cambio climático desde 1880 hasta la actualidad, utilizando como fuente los datos de la NASA. Descargan los datos, los analizan con herramientas comunes y crean una visualización. Esta escultura representa esa evolución.</p>
      <p class="mb-6">Como en cada proyecto, Tangible Data trata de conectar los datos con la acción. Durante las sesiones del taller se realizan varias actividades para explicar esta conexión. Al final, los estudiantes piensan en posibles acciones para mitigar el cambio climático.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Sesión 1: Los datos nos ayudan a tomar decisiones... buenas y malas</h3>
      <p class="mb-4">Introducción a la diferencia entre dato, información, conocimiento y sabiduría. Los alumnos trabajan con ejemplos cotidianos (temperatura, etiquetas Nutriscore, redes sociales) y realizan dinámicas participativas para entender cómo los datos influyen en nuestras decisiones diarias.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Sesión 2: Los datos abiertos son gratuitos y están disponibles</h3>
      <p class="mb-4">El objetivo es capacitar al alumnado para localizar y descargar un dataset de la NASA, comprender la estructura de los archivos descargados (CSV y metadatos) y trabajar colaborativamente. Tras identificar el indicador de la anomalía de la temperatura global en el portal de la NASA, los estudiantes descargan el archivo y lo abren en software de hojas de cálculo.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Sesión 3: Disponemos de herramientas gratuitas para analizar y visualizar los datos</h3>
      <p class="mb-4">La sesión se centra en filtrar el dataset, calcular valores máximos, mínimos y promedio mediante funciones, y generar un gráfico temporal que sirva de base para la interpretación posterior.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Sesión 4: Interpretamos los datos a través de todos los sentidos</h3>
      <p class="mb-4">El propósito es que los equipos sinteticen conclusiones cualitativas basadas en los valores analizados, redacten títulos significativos para sus gráficos y experimenten dos técnicas de tangibilización —escultura y sonificación— para comunicar los resultados. Se presenta una escultura física basada en los datos, que los alumnos exploran de forma táctil, y se cierra la sesión con la sonificación del dataset, convirtiendo la serie temporal en una secuencia musical.</p>
      
      <h3 class="font-title text-xl text-white mb-3 border-t border-gray-600 pt-4">Construir la acción</h3>
      <p class="mb-4">Para finalizar, los estudiantes generan sus propias conclusiones sobre los datos y formulan recomendaciones basadas en estas interpretaciones.</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>Conclusiones basadas en datos:</strong> La temperatura global ha aumentado drásticamente, sobre todo en las últimas décadas, acercándose ya a 1,5°C sobre el nivel preindustrial. El ritmo de calentamiento se está acelerando.</li>
          <li><strong>Interpretaciones y recomendaciones:</strong> Aunque es un problema global, las acciones locales son fundamentales. Es crucial seguir trabajando hasta reducir las emisiones a cero. Fomentar energías renovables, cambiar patrones de consumo y exigir acción política son pasos necesarios.</li>
      </ul>
      <div class="mt-8 pt-6 border-t border-cyan-800 text-center">
        <p class="text-lg font-semibold text-white mb-2">¿Interesado en llevar esto a tu centro educativo?</p>
        <p class="mb-4">Si quieres impartir estas sesiones en un colegio, ¡contáctanos!</p>
        <a href="https://tangibledata.xyz/2025-colegio-madrid/" target="_blank" rel="noopener noreferrer" class="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Mira nuestro último taller
        </a>
      </div>
    `,
    joinUsModalTitle: "Únete al Movimiento",
    joinUsModalContent: "Tangible Data es un movimiento. Si te apasionan los datos, la fabricación digital, la sostenibilidad, la educación y quieres sumarte a Tangible Data, no dudes en contactarnos.",
    joinUsModalWebsiteButton: "Visita Tangible Data",
    joinUsModalEmailLink: "O escríbenos a",
    scenarioLabTitle: "Laboratorio de Escenarios",
    scenarioLabSelectPreset: "1. Explora un escenario predefinido",
    scenarioLabCustomAi: "2. Crea tu propio escenario (IA)",
    scenarioLabCustomAiDesc: "Describe una situación hipotética y nuestra IA generará una simulación. ¡Sé creativo!",
    scenarioLabCustomAiPlaceholder: "Ej: ¿Y si la energía de fusión estuviera disponible en 2030?",
    scenarioLabGenerateButton: "Generar con IA",
    scenarioLabGeneratingButton: "Generando...",
    scenarioLabAiError: "La IA no pudo generar el escenario.",
    scenarioLabChartTitle: "Evolución de la Anomalía de Temperatura Global",
    scenarioLabChartYAxis: "Anomalía (°C)",
    scenarioLabChartReal: "Realidad Histórica",
    scenarioLabAiLogic: "Lógica de la IA",
    scenarioLabPresetLogic: "Lógica de la Simulación",
    glossaryTitle: "Glosario",
  }
};

type StoryData = {
  [key: string]: StorySegment;
}

const storyDataEn: StoryData = {
  'start': {
    id: 'start',
    sceneDescription: "Hello! Our journey into the history of climate change begins now. We will visit five major historical phases to understand how climate change has evolved over the last 150 years. Which period would you like to explore first?",
    image: MUSEUM_EXTERIOR_IMAGE,
    choices: [
      { text: "1880–1910: Late Pre-industrial Stability", nextSceneId: "period_1880" },
      { text: "1910–1945: Early 20th Century Warming", nextSceneId: "period_1910" },
      { text: "1945–1975: Mid-Century Plateau", nextSceneId: "period_1945" },
      { text: "1975–2000: Modern Warming Resumes", nextSceneId: "period_1975" },
      { text: "2000–2024: 21st Century Acceleration", nextSceneId: "period_2000" },
    ],
  },
  'period_1880': {
    id: 'period_1880',
    sceneDescription: "This era showed relatively stable or slightly decreasing temperatures. Natural factors were significant influences, especially major volcanic eruptions like Krakatoa (1883), which caused temporary cooling by reflecting solar radiation. Human-induced warming was still in its early stages.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
      { text: "Tell me more about the volcanoes.", nextSceneId: "period_1880_volcanoes" },
      { text: "How reliable is the data from this early period?", nextSceneId: "data_reliability" },
      { text: "Go back to the main topics.", nextSceneId: "start" },
    ],
  },
  'period_1880_volcanoes': {
    id: 'period_1880_volcanoes',
    sceneDescription: "Volcanoes like Krakatoa (1883) and Santa María (1902) injected massive amounts of sulfate aerosols into the stratosphere. These particles create a reflective haze that can cool the planet for 1-3 years by blocking sunlight, which explains the cold anomalies seen in years like 1884–1888.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1910': {
    id: 'period_1910',
    sceneDescription: "From around 1910 to 1945, the planet warmed by about 0.3-0.4°C. This 'early 20th-century warming' was driven by a combination of increasing greenhouse gas emissions from industrialization, slightly increased solar activity, and a relative lack of major volcanic eruptions.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
      { text: "Did World War I or the Great Depression affect this?", nextSceneId: "period_1910_events" },
      { text: "Go back to the main topics.", nextSceneId: "start" },
    ],
  },
  'period_1910_events': {
    id: 'period_1910_events',
    sceneDescription: "While major historical events like World War I and the Great Depression did cause temporary dips in industrial activity and emissions in some regions, they weren't significant enough to halt the overall warming trend driven by long-term industrial growth.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
   'period_1945': {
    id: 'period_1945',
    sceneDescription: "Between 1945 and 1975, the warming trend paused, and there was even a slight cooling. The primary cause was a massive increase in industrial aerosol pollution (like sulfates) from the post-war economic boom. These particles reflected sunlight, temporarily counteracting the warming effect of rising CO2 levels.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "So, pollution caused cooling?", nextSceneId: "period_1945_aerosols" },
       { text: "Go back to the main topics.", nextSceneId: "start" },
    ],
  },
   'period_1945_aerosols': {
    id: 'period_1945_aerosols',
    sceneDescription: "Exactly. The 'global dimming' effect of aerosols masked the underlying warming from greenhouse gases. However, as countries passed 'Clean Air' acts to reduce smog and acid rain, the aerosol cooling effect diminished, allowing the greenhouse gas-driven warming to become dominant again after the 1970s.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1975': {
    id: 'period_1975',
    sceneDescription: "From about 1975, a period of rapid and sustained warming began, at a rate roughly double that of the early 20th century. This is attributed to the dominant effect of rising greenhouse gases, as the cooling effect of aerosols was reduced by environmental regulations in many industrialized nations.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "What about the ozone hole?", nextSceneId: "period_1975_ozone" },
       { text: "How do scientists know it's not natural cycles?", nextSceneId: "data_reliability" },
       { text: "Go back to the main topics.", nextSceneId: "start" },
    ],
  },
  'period_1975_ozone': {
    id: 'period_1975_ozone',
    sceneDescription: "The ozone hole and global warming are related but distinct issues. The CFCs that destroyed ozone are also potent greenhouse gases. The Montreal Protocol (1987) successfully phased out CFCs to heal the ozone layer, which also had a positive, though smaller, side effect of mitigating some warming.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'period_2000': {
    id: 'period_2000',
    sceneDescription: "The 21st century has seen an acceleration of warming. The 10 most recent years are the 10 warmest on record. By 2024, the global temperature was approximately 1.47°C above the pre-industrial average, driven by record-high concentrations of CO2. This period is marked by an increase in the frequency and intensity of extreme weather events.",
    chartConfig: { startYear: 2000, endYear: 2024 },
    choices: [
      { text: "What was the 'warming hiatus'?", nextSceneId: "period_2000_hiatus" },
      { text: "What does the future hold?", nextSceneId: "conclusion" },
      { text: "Go back to the main topics.", nextSceneId: "start" },
    ],
  },
  'period_2000_hiatus': {
    id: 'period_2000_hiatus',
    sceneDescription: "In the early 2000s, the rate of surface warming appeared to slow slightly. This 'hiatus' is now understood to be a result of natural variability, primarily a series of La Niña events and ocean cycles that temporarily stored more heat in the deep ocean. The long-term warming trend never stopped and resumed rapidly after 2014.",
    chartConfig: { startYear: 2000, endYear: 2024 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'data_reliability': {
    id: 'data_reliability',
    sceneDescription: "Scientists use multiple independent datasets (from NASA, NOAA, etc.) that all show a consistent warming trend. Early data from 1880 had less geographic coverage, but researchers apply rigorous statistical corrections for things like changes in measurement techniques and the 'urban heat island' effect to ensure the data is reliable.",
    chartConfig: { startYear: 1880, endYear: 2024 },
    choices: [
      { text: "Go back to the main topics.", nextSceneId: "start" },
      { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'conclusion': {
    id: 'conclusion',
    sceneDescription: "The data shows an undeniable warming trend since 1880, accelerating significantly after 1975. This scientific analysis, based on a vast body of evidence, forms the foundation for understanding our planet's changing climate and the urgent need for action. Your exploration is complete.",
    image: GRAPH_OVERVIEW_IMAGE,
    choices: [],
  },
};

const storyDataEs: StoryData = {
  'start': {
    id: 'start',
    sceneDescription: "¡Hola! Nuestro viaje a la historia del cambio climático comienza ahora. Visitaremos cinco grandes fases históricas para entender cómo ha evolucionado el cambio climático en los últimos 150 años. ¿Qué período te gustaría explorar primero?",
    image: MUSEUM_EXTERIOR_IMAGE,
    choices: [
      { text: "1880–1910: Estabilidad preindustrial tardía", nextSceneId: "period_1880" },
      { text: "1910–1945: Calentamiento de principios del siglo XX", nextSceneId: "period_1910" },
      { text: "1945–1975: Meseta de mediados de siglo", nextSceneId: "period_1945" },
      { text: "1975–2000: Se reanuda el calentamiento moderno", nextSceneId: "period_1975" },
      { text: "2000–2024: Aceleración del siglo XXI", nextSceneId: "period_2000" },
    ],
  },
  'period_1880': {
    id: 'period_1880',
    sceneDescription: "Esta era mostró temperaturas relativamente estables o ligeramente decrecientes. Los factores naturales fueron influencias significativas, especialmente las grandes erupciones volcánicas como la del Krakatoa (1883), que causaron un enfriamiento temporal al reflejar la radiación solar. El calentamiento inducido por el hombre todavía estaba en sus primeras etapas.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
      { text: "Cuéntame más sobre los volcanes.", nextSceneId: "period_1880_volcanoes" },
      { text: "¿Qué tan confiables son los datos de este período inicial?", nextSceneId: "data_reliability" },
      { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1880_volcanoes': {
    id: 'period_1880_volcanoes',
    sceneDescription: "Volcanes como el Krakatoa (1883) y Santa María (1902) inyectaron cantidades masivas de aerosoles de sulfato en la estratosfera. Estas partículas crean una neblina reflectante que puede enfriar el planeta durante 1-3 años al bloquear la luz solar, lo que explica las anomalías frías observadas en años como 1884–1888.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1910': {
    id: 'period_1910',
    sceneDescription: "Desde alrededor de 1910 hasta 1945, el planeta se calentó entre 0.3 y 0.4°C. Este 'calentamiento de principios del siglo XX' fue impulsado por una combinación de crecientes emisiones de gases de efecto invernadero por la industrialización, una actividad solar ligeramente mayor y una relativa falta de grandes erupciones volcánicas.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
      { text: "¿Afectaron a esto la Primera Guerra Mundial o la Gran Depresión?", nextSceneId: "period_1910_events" },
      { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1910_events': {
    id: 'period_1910_events',
    sceneDescription: "Aunque grandes eventos históricos como la Primera Guerra Mundial y la Gran Depresión causaron caídas temporales en la actividad industrial y las emisiones en algunas regiones, no fueron lo suficientemente significativos como para detener la tendencia general de calentamiento impulsada por el crecimiento industrial a largo plazo.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
   'period_1945': {
    id: 'period_1945',
    sceneDescription: "Entre 1945 y 1975, la tendencia al calentamiento se detuvo e incluso hubo un ligero enfriamiento. La causa principal fue un aumento masivo de la contaminación industrial por aerosoles (como los sulfatos) del auge económico de la posguerra. Estas partículas reflejaban la luz solar, contrarrestando temporalmente el efecto de calentamiento del aumento de los niveles de CO2.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "Entonces, ¿la contaminación causó enfriamiento?", nextSceneId: "period_1945_aerosols" },
       { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
   'period_1945_aerosols': {
    id: 'period_1945_aerosols',
    sceneDescription: "Exactamente. El efecto de 'oscurecimiento global' de los aerosoles enmascaró el calentamiento subyacente de los gases de efecto invernadero. Sin embargo, a medida que los países aprobaron leyes de 'Aire Limpio' para reducir el smog y la lluvia ácida, el efecto de enfriamiento de los aerosoles disminuyó, permitiendo que el calentamiento impulsado por los gases de efecto invernadero volviera a ser dominante después de la década de 1970.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1975': {
    id: 'period_1975',
    sceneDescription: "A partir de 1975 aproximadamente, comenzó un período de calentamiento rápido y sostenido, a un ritmo aproximadamente el doble que el de principios del siglo XX. Esto se atribuye al efecto dominante del aumento de los gases de efecto invernadero, ya que el efecto de enfriamiento de los aerosoles se redujo por las regulaciones ambientales en muchas naciones industrializadas.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "Qué pasa con el agujero de ozono?", nextSceneId: "period_1975_ozone" },
       { text: "¿Cómo saben los científicos que no son ciclos naturales?", nextSceneId: "data_reliability" },
       { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1975_ozone': {
    id: 'period_1975_ozone',
    sceneDescription: "El agujero de ozono y el calentamiento global son problemas relacionados pero distintos. Los CFC que destruyeron el ozono también son potentes gases de efecto invernadero. El Protocolo de Montreal (1987) eliminó con éxito los CFC para sanar la capa de ozono, lo que también tuvo un efecto secundario positivo, aunque menor, de mitigar parte del calentamiento.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_2000': {
    id: 'period_2000',
    sceneDescription: "El siglo XXI ha visto una aceleración del calentamiento. Los 10 años más recientes son los 10 más cálidos registrados. Para 2024, la temperatura global era aproximadamente 1.47°C por encima del promedio preindustrial, impulsada por concentraciones récord de CO2. Este período está marcado por un aumento en la frecuencia e intensidad de los eventos climáticos extremos.",
    chartConfig: { startYear: 2000, endYear: 2024 },
    choices: [
      { text: "¿Qué fue el 'hiato del calentamiento'?", nextSceneId: "period_2000_hiatus" },
      { text: "¿Qué depara el futuro?", nextSceneId: "conclusion" },
      { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_2000_hiatus': {
    id: 'period_2000_hiatus',
    sceneDescription: "A principios de la década de 2000, el ritmo del calentamiento de la superficie pareció disminuir ligeramente. Ahora se entiende que este 'hiato' es el resultado de la variabilidad natural, principalmente una serie de eventos de La Niña y ciclos oceánicos que almacenaron temporalmente más calor en las profundidades del océano. La tendencia de calentamiento a largo plazo nunca se detuvo y se reanudó rápidamente después de 2014.",
    chartConfig: { startYear: 2000, endYear: 2024 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'data_reliability': {
    id: 'data_reliability',
    sceneDescription: "Los científicos utilizan múltiples conjuntos de datos independientes (de la NASA, NOAA, etc.) que muestran una tendencia de calentamiento consistente. Los primeros datos de 1880 tenían menos cobertura geográfica, pero los investigadores aplican correcciones estadísticas rigurosas para cosas como cambios en las técnicas de medición y el efecto de 'isla de calor urbana' para garantizar que los datos sean confiables.",
    chartConfig: { startYear: 1880, endYear: 2024 },
    choices: [
      { text: "Volver a los temas principales.", nextSceneId: "start" },
      { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'conclusion': {
    id: 'conclusion',
    sceneDescription: "Los datos muestran una tendencia innegable al calentamiento desde 1880, que se acelera significativamente después de 1975. Este análisis científico, basado en un vasto cuerpo de evidencia, forma la base para comprender el clima cambiante de nuestro planeta y la urgente necesidad de actuar. Tu exploración ha finalizado.",
    image: GRAPH_OVERVIEW_IMAGE,
    choices: [],
  },
};

export const storyData = {
  en: storyDataEn,
  es: storyDataEs,
};
