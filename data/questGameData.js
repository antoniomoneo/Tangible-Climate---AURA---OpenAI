// This file is pure JavaScript to be safely imported by the Node.js server.
export const questGameData = {
  es: {
    title: "Misión Climática Tangible",
    intro: "Estás en el año 2150. Te encuentras en un lugar polvoriento, en lo que un día fue el Museo Nacional de Ciencias Naturales. Hay escombros, todo parece desolado. Con tu compañera AURA quitas los escombros y encuentras fragmentos de huesos de los esqueletos que un día estuvieron expuestos en el Museo...",
    finale: {
      good_ending: "Comprendes el mensaje a través del tiempo. Los artistas no predijeron el fin; ofrecieron una elección. Has redescubierto su advertencia y su esperanza. Misión cumplida.",
      bad_ending: "Cansado, abandonas la estructura. Es solo un montón de huesos extraños, un enigma más en un mundo lleno de ellos. El mensaje se pierde de nuevo en el polvo, y la lección sigue sin aprenderse."
    },
    chapters: [
      {
        id: 1,
        name: "El Esqueleto Anómalo",
        description: "...de pronto encuentras un esqueleto completo, pero tiene algo especial. La estructura se asemeja a la espina dorsal de una criatura colosal, con costillas arqueándose hacia el cielo. Pero algo no encaja. La forma es... incorrecta. No se parece a ningún animal que conozcas, ni siquiera de los registros fósiles.",
        choices: [
          {
            action: "EXAMINAR ESTRUCTURA",
            result: "Te acercas. Las 'vértebras' no tienen articulaciones, y las 'costillas' están espaciadas de forma irregular. Esto no es biología; es una construcción deliberada. Has descubierto que no es un fósil.",
            reward: { type: 'clue', value: 'Diseño Artificial' },
            nextChapterId: 2,
          },
          {
            action: "BUSCAR OTROS RESTOS",
            result: "Ignoras la estructura principal y buscas fragmentos más pequeños, pero todo lo que encuentras es polvo y escombros. Has perdido un tiempo valioso.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "La Base del Tiempo",
        description: "Ahora que sabes que es artificial, tu atención se centra en el pedestal de piedra sobre el que se asienta. Está cubierto por una gruesa capa de sedimento solidificado.",
        choices: [
          {
            action: "LIMPIAR BASE",
            result: "Con cuidado, retiras el polvo. Bajo la mugre, aparecen unas inscripciones finamente talladas: una serie de números que comienzan con '1880' en un extremo y terminan con '2024' en el otro. Es una línea de tiempo.",
            reward: { type: 'clue', value: 'Línea de Tiempo 1880-2024' },
            nextChapterId: 3,
          },
          {
            action: "GOLPEAR BASE",
            result: "Impaciente, golpeas la base con una herramienta. Una grieta recorre la piedra, haciendo ilegibles algunas de las inscripciones. Un recordatorio de que la fuerza bruta rara vez revela la verdad.",
            punishment: { type: 'trap', value: 'Inscripción dañada' },
          }
        ]
      },
      {
        id: 3,
        name: "La Curva Ascendente",
        description: "Una línea de tiempo. Las costillas no son aleatorias; cada una debe corresponder a un año. Observas la escultura en su totalidad. Las costillas cerca de 1880 son pequeñas, con altibajos. Hacia el final, cerca de 2024, se vuelven gigantescas, en una curva ascendente y aterradora.",
        choices: [
          {
            action: "PREGUNTAR A AURA",
            result: "Consultas a tu IA de campo, AURA. 'Analizando... La forma coincide con una representación de datos: una serie temporal. Dada la época y el lugar... esto es una escultura de datos de la anomalía de la temperatura global. Un intento desesperado de hacer visible lo invisible. Una advertencia.'",
            reward: { type: 'clue', value: 'Diagnóstico de AURA: Datos Climáticos' },
            nextChapterId: 4,
          },
          {
            action: "MEDIR COSTILLAS",
            result: "Intentas medir las costillas, pero sin las unidades originales, los datos brutos carecen de sentido. La forma es lo importante, pero el significado se te escapa.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 4,
        name: "La Pregunta Abierta",
        description: "Una advertencia... Sigues la curva hasta la última posición, más allá de 2024. El punto final de la escultura. La culminación del mensaje de los artistas.",
        choices: [
          {
            action: "EXAMINAR FINAL",
            result: "Donde debería estar la última y más grande costilla, no hay nada. Solo un soporte vacío. No es que se haya roto; fue dejada así intencionadamente. La respuesta te golpea: los artistas no estaban prediciendo el futuro. Estaban preguntando a su presente qué harían para cambiarlo.",
            endsGame: 'win',
          },
          {
            action: "MARCHARSE",
            result: "Crees que la escultura está inacabada o rota. Es una historia sin final. Das la espalda al artefacto, dejando su pregunta sin respuesta en el silencio de las ruinas.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  },
  en: {
    title: "Tangible Climate Quest",
    intro: "The year is 2150. You are in a dusty place, in what was once the National Museum of Natural Sciences. There is debris everywhere; it all seems desolate. With your companion AURA, you clear away the rubble and find bone fragments from the skeletons that were once on display in the Museum...",
    finale: {
      good_ending: "You understand the message across time. The artists didn't predict an end; they offered a choice. You have rediscovered their warning and their hope. Mission accomplished.",
      bad_ending: "Weary, you abandon the structure. It's just a pile of strange bones, another riddle in a world full of them. The message is lost again to the dust, and the lesson remains unlearned."
    },
    chapters: [
      {
        id: 1,
        name: "The Anomalous Skeleton",
        description: "...suddenly you find a complete skeleton, but there's something special about it. The structure resembles the spine of a colossal creature, with ribs arching towards the sky. But something is wrong. The shape is... incorrect. It doesn't look like any animal you know, not even from the fossil records.",
        choices: [
          {
            action: "EXAMINE STRUCTURE",
            result: "You get closer. The 'vertebrae' have no joints, and the 'ribs' are irregularly spaced. This isn't biology; it's a deliberate construction. You've discovered it's not a fossil.",
            reward: { type: 'clue', value: 'Artificial Design' },
            nextChapterId: 2,
          },
          {
            action: "SEARCH FOR OTHER REMAINS",
            result: "You ignore the main structure and search for smaller fragments, but all you find is dust and debris. You've wasted valuable time.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "The Foundation of Time",
        description: "Now that you know it's artificial, your attention shifts to the stone pedestal it rests on. It's covered by a thick layer of solidified sediment.",
        choices: [
          {
            action: "CLEAN BASE",
            result: "Carefully, you brush away the dust. Beneath the grime, finely carved inscriptions appear: a series of numbers starting with '1880' at one end and ending with '2024' at the other. It's a timeline.",
            reward: { type: 'clue', value: 'Timeline 1880-2024' },
            nextChapterId: 3,
          },
          {
            action: "STRIKE BASE",
            result: "Impatient, you hit the base with a tool. A crack runs through the stone, rendering some of the inscriptions illegible. A reminder that brute force rarely reveals the truth.",
            punishment: { type: 'trap', value: 'Damaged Inscription' },
          }
        ]
      },
      {
        id: 3,
        name: "The Rising Curve",
        description: "A timeline. The ribs aren't random; each must correspond to a year. You observe the sculpture as a whole. The ribs near 1880 are small, with ups and downs. Towards the end, near 2024, they become gigantic, in a terrifying, soaring curve.",
        choices: [
          {
            action: "ASK AURA",
            result: "You consult your field AI, AURA. 'Analyzing... The shape matches a data representation: a time series. Given the era and location... this is a data sculpture of the global temperature anomaly. A desperate attempt to make the invisible visible. A warning.'",
            reward: { type: 'clue', value: 'AURA\'s Diagnosis: Climate Data' },
            nextChapterId: 4,
          },
          {
            action: "MEASURE RIBS",
            result: "You try to measure the ribs, but without the original units, the raw numbers are meaningless. The shape is important, but the significance escapes you.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 4,
        name: "The Open Question",
        description: "A warning... You follow the curve to the final position, beyond 2024. The endpoint of the sculpture. The culmination of the artists' message.",
        choices: [
          {
            action: "EXAMINE END",
            result: "Where the last and largest rib should be, there is nothing. Just an empty mount. It's not broken; it was intentionally left this way. The answer hits you: the artists weren't predicting the future. They were asking their present what they would do to change it.",
            endsGame: 'win',
          },
          {
            action: "WALK AWAY",
            result: "You assume the sculpture is unfinished or broken. A story without an ending. You turn your back on the artifact, leaving its question unanswered in the silence of the ruins.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  }
};