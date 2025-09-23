// This file is pure JavaScript to be safely imported by the Node.js server.
export const questGameData = {
  es: {
    title: "Tangible Climate Quest",
    intro: "Estás en las ruinas polvorientas del antiguo Museo de Ciencias Naturales en Madrid. El aire es espeso. Tu misión: explorar las ruinas, descifrar los huesos del 'Esqueleto del Clima' y descubrir cómo los datos perdidos podían haber cambiado el destino de la humanidad.",
    finale: {
      good_ending: "Reconstruiste la historia climática y redactaste un diagnóstico: 'Hubiéramos cambiado el destino si hubiéramos confiado en los datos'. Has completado la misión y honrado la memoria de los que intentaron advertir al mundo.",
      bad_ending: "Abandonas las ruinas con información incompleta, condenado a repetir los errores del pasado. La historia sigue sin contarse."
    },
    chapters: [
      {
        id: 1,
        name: "El inicio – El hallazgo",
        description: "Dos investigadores entran en las ruinas polvorientas del Museo. El aire es espeso. Encuentran fragmentos de huesos y un extraño símbolo tallado en la piedra.",
        choices: [
          {
            action: "EXAMINAR SIMBOLO",
            result: "Descubres que es un registro de las primeras mediciones de temperatura. ¡Has encontrado una pista clave!",
            reward: { type: 'clue', value: 'Registro de temperatura antiguo' },
            nextChapterId: 2,
          },
          {
            action: "IGNORAR SIMBOLO",
            result: "Mientras avanzas, un techo se derrumba ligeramente, bloqueando el camino por el que viniste. Pierdes tiempo y energía.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "Sombras de la guerra",
        description: "Encuentras un búnker oculto con restos de la Segunda Guerra Mundial. Dentro, hay mapas, armas oxidadas y un diario con gráficos de emisiones.",
        choices: [
          {
            action: "LEER DIARIO",
            result: "El diario detalla cómo la contaminación industrial de la guerra enmascaró temporalmente el calentamiento. Comprendes una parte crucial de la historia.",
            reward: { type: 'clue', value: 'Efecto de los aerosoles de guerra' },
            nextChapterId: 3,
          },
          {
            action: "TOCAR ARMAS",
            result: "Al tocar un rifle oxidado, activas una trampa antigua. Una reja cae, cerrando la salida del búnker. Te llevará un tiempo encontrar una forma de abrirla.",
            punishment: { type: 'trap', value: 'Atrapado en el búnker' },
          }
        ]
      },
      {
        id: 3,
        name: "La era del ascenso",
        description: "En una cámara sellada encuentras gráficas talladas en piedra que muestran el ascenso de las temperaturas desde los años 60. Hay un pedestal con una balanza rota.",
        choices: [
          {
            action: "COLOCAR HUESO EN BALANZA",
            result: "Colocas uno de los fragmentos de hueso en el plato de la balanza. Se equilibra y un compartimento secreto se abre, revelando un disco de datos.",
            reward: { type: 'clue', value: 'Disco de datos de la "Gran Aceleración"' },
            nextChapterId: 4,
          },
          {
            action: "ROMPER BALANZA",
            result: "Frustrado, golpeas la balanza. Se hace añicos y el suelo tiembla. El polvo que cae del techo te hace perder de vista uno de tus objetos.",
            punishment: { type: 'item_loss', value: 'first' },
          }
        ]
      },
      {
        id: 4,
        name: "La vértebra vacía",
        description: "Llegas al final del esqueleto: la última vértebra está hueca. Representa el presente (2024) y el vacío de decisiones humanas. Es el momento de actuar.",
        choices: [
          {
            action: "INSERTAR PISTAS EN VERTEBRA",
            result: "Colocas los registros y el disco de datos dentro de la vértebra hueca. El esqueleto se ilumina, proyectando el diagnóstico final en la pared.",
            endsGame: 'win',
          },
          {
            action: "SALIR SIN COMPLETAR",
            result: "Decides que es demasiado arriesgado y abandonas las ruinas. El misterio del esqueleto quedará sin resolver.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  },
  en: {
    title: "Tangible Climate Quest",
    intro: "You are in the dusty ruins of the former Museum of Natural Sciences in Madrid. The air is thick. Your mission: explore the ruins, decipher the bones of the 'Climate Skeleton', and discover how lost data could have changed humanity's destiny.",
    finale: {
      good_ending: "You have reconstructed the climate history and written a diagnosis: 'We could have changed our destiny if we had trusted the data.' You have completed the mission and honored the memory of those who tried to warn the world.",
      bad_ending: "You leave the ruins with incomplete information, condemned to repeat the mistakes of the past. The story remains untold."
    },
    chapters: [
      {
        id: 1,
        name: "The Beginning – The Find",
        description: "Two researchers enter the dusty ruins of the Museum. The air is thick. They find bone fragments and a strange symbol carved in stone.",
        choices: [
          {
            action: "EXAMINE SYMBOL",
            result: "You discover it's a record of early temperature measurements. You've found a key clue!",
            reward: { type: 'clue', value: 'Ancient Temperature Record' },
            nextChapterId: 2,
          },
          {
            action: "IGNORE SYMBOL",
            result: "As you move on, a ceiling partially collapses, blocking the way you came. You lose time and energy.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "Shadows of War",
        description: "You find a hidden bunker with remnants from World War II. Inside, there are maps, rusty weapons, and a diary with emission graphs.",
        choices: [
          {
            action: "READ DIARY",
            result: "The diary details how industrial pollution from the war temporarily masked warming. You understand a crucial part of the story.",
            reward: { type: 'clue', value: 'Effect of War Aerosols' },
            nextChapterId: 3,
          },
          {
            action: "TOUCH WEAPONS",
            result: "Touching a rusty rifle triggers an old trap. A grate falls, sealing the bunker exit. It will take you some time to find a way to open it.",
            punishment: { type: 'trap', value: 'Trapped in the bunker' },
          }
        ]
      },
      {
        id: 3,
        name: "The Age of Ascent",
        description: "In a sealed chamber, you find graphs carved in stone showing the rise in temperatures since the 60s. There is a pedestal with a broken scale.",
        choices: [
          {
            action: "PLACE BONE ON SCALE",
            result: "You place one of the bone fragments on the scale's plate. It balances, and a secret compartment opens, revealing a data disk.",
            reward: { type: 'clue', value: 'Data Disk of the "Great Acceleration"' },
            nextChapterId: 4,
          },
          {
            action: "BREAK SCALE",
            result: "Frustrated, you strike the scale. It shatters, and the floor trembles. The dust falling from the ceiling makes you lose track of one of your items.",
            punishment: { type: 'item_loss', value: 'first' },
          }
        ]
      },
      {
        id: 4,
        name: "The Empty Vertebra",
        description: "You reach the end of the skeleton: the last vertebra is hollow. It represents the present (2024) and the void of human decisions. It's time to act.",
        choices: [
          {
            action: "INSERT CLUES INTO VERTEBRA",
            result: "You place the records and the data disk inside the hollow vertebra. The skeleton lights up, projecting the final diagnosis on the wall.",
            endsGame: 'win',
          },
          {
            action: "LEAVE WITHOUT COMPLETING",
            result: "You decide it's too risky and leave the ruins. The skeleton's mystery will remain unsolved.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  }
};
