import {
  GRAPH_OVERVIEW_IMAGE
} from './assets';
import { StorySegment } from './types';

export const locales = {
  en: {
    title: "The Climate Change Skeleton",
    intro: "This game is based on a real art installation from the National Museum of Natural Sciences in Spain, developed by Tangible Data. The sculpture represents climate change through a skeleton that reflects the evolution of global temperature.",
    objective: "Your mission is to explore this data sculpture. With the help of a scientific guide, you will analyze the document 'Evolution of Global Temperature Anomalies (1880–2024)' to understand the history of climate change.",
    selectLang: "Select your language",
    start: "Begin Analysis",
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
    chatLoading: "AURA is thinking...",
    headerDashboardButton: "Dashboard",
    headerChatButton: "AURA",
    headerAboutButton: "About",
    headerCalendarButton: "Calendar",
    dashboardTitle: "Full Data Series",
    dashboardDescription: "This chart shows the complete global temperature anomaly data from 1880 to 2024. You can see the full context of the climate change 'skeleton'.",
    dashboardBack: "Back to Analysis",
    aboutTitle: "About The Project",
    aboutCredit: "An interactive experience by",
    calendarTitle: "Schedule of Activities",
    calendarDescription: "Explore upcoming events and activities related to the sculpture.",
  },
  es: {
    title: "El Esqueleto del Cambio Climático",
    intro: "Este juego está basado en una instalación artística real del Museo Nacional de Ciencias Naturales, desarrollada por Tangible Data. La escultura representa el cambio climático mediante un esqueleto que refleja la evolución de la temperatura global.",
    objective: "Tu misión es explorar esta escultura de datos. Con la ayuda de una guía científica, analizarás el documento 'Evolución de las anomalías de temperatura global (1880–2024)' para comprender la historia del cambio climático.",
    selectLang: "Selecciona tu idioma",
    start: "Iniciar Análisis",
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
    chatLoading: "AURA está pensando...",
    headerDashboardButton: "Dashboard",
    headerChatButton: "AURA",
    headerAboutButton: "Acerca de",
    headerCalendarButton: "Calendario",
    dashboardTitle: "Serie de Datos Completa",
    dashboardDescription: "Este gráfico muestra los datos completos de la anomalía de la temperatura global desde 1880 hasta 2024. Puedes ver el contexto completo del 'esqueleto' del cambio climático.",
    dashboardBack: "Volver al Análisis",
    aboutTitle: "Sobre el Proyecto",
    aboutCredit: "Una experiencia interactiva de",
    calendarTitle: "Calendario de Actividades",
    calendarDescription: "Explora los próximos eventos y actividades relacionadas con la escultura.",
  }
};

type StoryData = {
  [key: string]: StorySegment;
}

const storyDataEn: StoryData = {
  'start': {
    id: 'start',
    sceneDescription: "Welcome to the analysis. The document outlines five major historical phases in global temperature change, plus sections on data reliability and conclusions. Which period would you like to explore first?",
    image: GRAPH_OVERVIEW_IMAGE,
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
    sceneDescription: "Bienvenido al análisis. El documento describe cinco grandes fases históricas en el cambio de la temperatura global, además de secciones sobre la fiabilidad de los datos y conclusiones. ¿Qué período te gustaría explorar primero?",
    image: GRAPH_OVERVIEW_IMAGE,
    choices: [
      { text: "1880–1910: Estabilidad inicial en la era preindustrial tardía", nextSceneId: "period_1880" },
      { text: "1910–1945: Primer calentamiento del siglo XX", nextSceneId: "period_1910" },
      { text: "1945–1975: Meseta de mediados de siglo y ligero enfriamiento", nextSceneId: "period_1945" },
      { text: "1975–2000: Reanudación del calentamiento global moderno", nextSceneId: "period_1975" },
      { text: "2000–2024: El calentamiento del siglo XXI y récords contemporáneos", nextSceneId: "period_2000" },
    ],
  },
  'period_1880': {
    id: 'period_1880',
    sceneDescription: "Esta era mostró temperaturas relativamente estables o en ligero descenso. Los factores naturales tuvieron una influencia notable, especialmente grandes erupciones volcánicas como la del Krakatoa (1883), que causaron un enfriamiento temporal al reflejar la radiación solar. El calentamiento inducido por el hombre era aún incipiente.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
      { text: "Cuéntame más sobre los volcanes.", nextSceneId: "period_1880_volcanoes" },
      { text: "¿Son fiables los datos de este período inicial?", nextSceneId: "data_reliability" },
      { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1880_volcanoes': {
    id: 'period_1880_volcanoes',
    sceneDescription: "Volcanes como el Krakatoa (1883) y Santa María (1902) inyectaron enormes cantidades de aerosoles de sulfato en la estratosfera. Estas partículas crean una neblina reflectante que puede enfriar el planeta durante 1-3 años al bloquear la luz solar, lo que explica las anomalías frías vistas en años como 1884–1888.",
    chartConfig: { startYear: 1880, endYear: 1910 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1910': {
    id: 'period_1910',
    sceneDescription: "Desde aproximadamente 1910 hasta 1945, el planeta se calentó unos 0,3-0,4°C. Este 'calentamiento de principios del siglo XX' fue impulsado por una combinación de crecientes emisiones de gases de efecto invernadero por la industrialización, una actividad solar ligeramente mayor y una relativa falta de grandes erupciones volcánicas.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
      { text: "¿Afectaron la I Guerra Mundial o la Gran Depresión?", nextSceneId: "period_1910_events" },
      { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1910_events': {
    id: 'period_1910_events',
    sceneDescription: "Aunque eventos históricos importantes como la Primera Guerra Mundial y la Gran Depresión causaron caídas temporales en la actividad industrial y las emisiones en algunas regions, no fueron lo suficientemente significativos como para detener la tendencia general de calentamiento impulsada por el crecimiento industrial a largo plazo.",
    chartConfig: { startYear: 1910, endYear: 1945 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1945': {
    id: 'period_1945',
    sceneDescription: "Entre 1945 y 1975, la tendencia de calentamiento se detuvo, e incluso hubo un ligero enfriamiento. La causa principal fue un aumento masivo de la contaminación industrial por aerosoles (como los sulfatos) debido al auge económico de la posguerra. Estas partículas reflejaban la luz solar, contrarrestando temporalmente el efecto de calentamiento del aumento de los niveles de CO2.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "¿Entonces, la contaminación causó enfriamiento?", nextSceneId: "period_1945_aerosols" },
       { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
   'period_1945_aerosols': {
    id: 'period_1945_aerosols',
    sceneDescription: "Exacto. El efecto de 'oscurecimiento global' de los aerosoles enmascaró el calentamiento subyacente de los gases de efecto invernadero. Sin embargo, a medida que los países aprobaron leyes de 'Aire Limpio' para reducir el smog y la lluvia ácida, el efecto de enfriamiento de los aerosoles disminuyó, permitiendo que el calentamiento impulsado por los gases de efecto invernadero volviera a ser dominante después de la década de 1970.",
    chartConfig: { startYear: 1945, endYear: 1975 },
    choices: [
       { text: "Explorar otro período.", nextSceneId: "start" },
       { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'period_1975': {
    id: 'period_1975',
    sceneDescription: "A partir de 1975 aproximadamente, comenzó un período de calentamiento rápido y sostenido, a un ritmo aproximadamente el doble que el de principios del siglo XX. Esto se atribuye al efecto dominante del aumento de los gases de efecto invernadero, ya que el efecto de enfriamiento de los aerosoles se redujo gracias a las regulaciones medioambientales en muchas naciones industrializadas.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "¿Qué pasa con el agujero de ozono?", nextSceneId: "period_1975_ozone" },
       { text: "¿Cómo saben los científicos que no son ciclos naturales?", nextSceneId: "data_reliability" },
       { text: "Volver a los temas principales.", nextSceneId: "start" },
    ],
  },
  'period_1975_ozone': {
    id: 'period_1975_ozone',
    sceneDescription: "El agujero de la capa de ozono y el calentamiento global son cuestiones relacionadas pero distintas. Los CFC que destruyeron el ozono también son potentes gases de efecto invernadero. El Protocolo de Montreal (1987) eliminó con éxito los CFC para sanar la capa de ozono, lo que también tuvo un efecto secundario positivo, aunque menor, de mitigar parte del calentamiento.",
    chartConfig: { startYear: 1975, endYear: 2000 },
    choices: [
       { text: "Explore another period.", nextSceneId: "start" },
       { text: "End the analysis.", nextSceneId: "conclusion" },
    ],
  },
  'period_2000': {
    id: 'period_2000',
    sceneDescription: "El siglo XXI ha visto una aceleración del calentamiento. Los 10 años más recientes son los 10 más cálidos registrados. Para 2024, la temperatura global estaba aproximadamente 1.47°C por encima del promedio preindustrial, impulsada por concentraciones récord de CO2. Este período está marcado por un aumento en la frecuencia e intensidad de los eventos climáticos extremos.",
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
    sceneDescription: "Los científicos utilizan múltiples conjuntos de datos independientes (de la NASA, NOAA, etc.) que muestran una tendencia de calentamiento constante. Los primeros datos de 1880 tenían menos cobertura geográfica, pero los investigadores aplican correcciones estadísticas rigurosas para cosas como cambios en las técnicas de medición y el efecto de 'isla de calor urbana' para garantizar que los datos sean fiables.",
    chartConfig: { startYear: 1880, endYear: 2024 },
    choices: [
      { text: "Volver a los temas principales.", nextSceneId: "start" },
      { text: "Finalizar el análisis.", nextSceneId: "conclusion" },
    ],
  },
  'conclusion': {
    id: 'conclusion',
    sceneDescription: "Los datos muestran una tendencia innegable de calentamiento desde 1880, que se ha acelerado significativamente después de 1975. Este análisis científico, basado en una gran cantidad de evidencia, forma la base para comprender el clima cambiante de nuestro planeta y la necesidad urgente de actuar. Tu exploración ha finalizado.",
    image: GRAPH_OVERVIEW_IMAGE,
    choices: [],
  },
};

export const storyData = {
  en: storyDataEn,
  es: storyDataEs,
};