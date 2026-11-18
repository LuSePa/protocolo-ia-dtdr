(function (global) {
    'use strict';

function escapeHTML(value) {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return String(value ?? '').replace(/[&<>"']/g, character => entities[character]);
}

const PROTOCOL_SCOPE_NOTICE = 'Este protocolo orienta el uso de IA en el centro. La selección de modalidades o servicios no implica que cualquier uso esté aprobado. El documento tampoco determina la base jurídica ni las condiciones de cada tratamiento; valóralas según la actividad, el servicio, los datos tratados y la normativa aplicable.';

const bibliografiaContextualPorTipologia = {
    escuela_infantil: {
        elemento: 'Acompañamiento educativo en el primer ciclo de educación infantil',
        justificacion: 'La guía ofrece orientación general para que el centro valore los usos de IA según las edades, las actividades y el papel del personal educativo.'
    },
    ceip: {
        elemento: 'Madurez, autonomía y acompañamiento del alumnado',
        justificacion: 'La sección 2.1, "Perfil alumnado", aporta al profesorado criterios para graduar el acompañamiento y adecuar las actividades a la madurez y autonomía del alumnado.'
    },
    cee: {
        elemento: 'Personalización y acompañamiento educativo',
        justificacion: 'Las secciones 2.2.1, "La IA como herramienta para la personalización del aprendizaje", y 2.3.1, "Orientar y acompañar al alumnado con apoyo de la IA", ayudan al profesorado a planificar apoyos y adaptar las actividades.'
    },
    ies: {
        elemento: 'Uso crítico y evaluación del aprendizaje',
        justificacion: 'Las secciones 2.1.2, "Aprender con la IA", y 2.2.1, "La IA como herramienta para evaluar", ofrecen ideas para promover el contraste de respuestas y valorar el proceso y las evidencias de aprendizaje.'
    },
    fp: {
        elemento: 'Diseño pedagógico, evaluación y supervisión docente',
        justificacion: 'Las secciones 2.2.1, "Enseñar con la IA", y 2.3.1, "Escenarios y casos prácticos de uso", ofrecen ideas para diseñar actividades, revisar evidencias y mantener la supervisión docente.'
    },
    eoi: {
        elemento: 'Comunicación educativa y diversidad de formatos',
        justificacion: 'La sección 2.3.1, "Fortalecer la comunicación y la participación de la comunidad educativa", aporta ejemplos de comunicación en diferentes idiomas y formatos accesibles que el profesorado puede adaptar a sus actividades.'
    },
    cepa: {
        elemento: 'Autonomía y progresión del aprendizaje',
        justificacion: 'Las secciones 2.1, "Perfil alumnado", y 2.2.1, "La IA como herramienta para la personalización del aprendizaje", ayudan a graduar el acompañamiento y adaptar las propuestas a la autonomía y experiencia del alumnado.'
    },
    esad: {
        elemento: 'Creatividad, autoría y revisión crítica',
        justificacion: 'Las secciones 2.1.2, "Aprender con la IA", y 2.2.1, "La IA como herramienta para diseñar propuestas pedagógicas", aportan ideas para proponer actividades creativas que mantengan el criterio y la autoría del alumnado.'
    },
    easd_ea: {
        elemento: 'Creatividad, autoría y revisión crítica',
        justificacion: 'Las secciones 2.1.2, "Aprender con la IA", y 2.2.1, "La IA como herramienta para diseñar propuestas pedagógicas", ofrecen orientación general para valorar actividades creativas y revisar las propuestas de IA, manteniendo las decisiones del alumnado.'
    },
    edre: {
        elemento: 'Diseño de actividades y contraste de resultados',
        justificacion: 'La sección 2.1.2, "Aprender con la IA", aporta orientación general para diseñar actividades en las que el alumnado interactúe con IA y contraste sus resultados; su adaptación dependerá de la modalidad y de las decisiones del centro.'
    },
    conservatorio: {
        elemento: 'Proceso creativo, autoría y valoración del aprendizaje',
        justificacion: 'Las secciones 2.1.2, "Aprender con la IA", y 2.2.1, "La IA como herramienta para evaluar", ofrecen ideas para diseñar tareas que mantengan la participación, la creatividad y el criterio del alumnado.'
    }
};

const referenciaGuiaINTEF = 'Guía INTEF sobre IA en educación (orientativa).';
const justificacionBibliograficaGeneral = {
    elemento: 'Uso educativo responsable de la IA',
    justificacion: 'La guía ofrece al profesorado ideas para diseñar actividades, acompañar al alumnado y revisar el uso educativo de la IA.'
};

const orientacionesPaso2PorTipologia = {
    escuela_infantil: {
        profesorado: 'Ajusta los materiales y el lenguaje a las edades y grupos presentes. Revisa el contenido y valora si la actividad necesita nombres, imágenes o voces reales; si no, utiliza materiales ficticios. Así se adecua la propuesta al grupo y se limita la información identificable innecesaria.',
        alumnado: 'Prioriza los usos de apoyo al personal. Si se contempla la participación del alumnado, concreta su finalidad, la mediación adulta, la accesibilidad y una alternativa sin IA; no presupongas interacción directa. Estos criterios ayudan a valorar si la participación aporta algo a la actividad y qué apoyos requiere.',
        formacion: 'Aborda la revisión de resultados, el cuidado de la información y los criterios para decidir cuándo la IA aporta valor. Compartir criterios ayuda al personal a revisar las propuestas con coherencia entre grupos.',
        sostenibilidad: 'Valora si la IA mejora una tarea concreta del personal. Esta comprobación ayuda a evitar generaciones repetidas que no aporten valor.'
    },
    ceip: {
        profesorado: 'Ajusta la complejidad, el vocabulario y la explicación a la etapa y al grupo. Esta revisión ayuda a que el material favorezca la comprensión y la participación en cada curso.',
        alumnado: 'Prioriza actividades guiadas y comprueba que el grupo comprende las respuestas. Prevé recursos accesibles y apoyo cuando la actividad lo requiera. Estas comprobaciones ayudan a detectar barreras y ajustar el acompañamiento.',
        formacion: 'Orienta la formación a reconocer errores y sesgos en materiales destinados a las distintas etapas. Revisar ejemplos de varios cursos ayuda a valorar su adecuación antes de utilizarlos.',
        sostenibilidad: 'Relaciona el uso de IA con decisiones sencillas sobre cuándo aporta valor y cuándo basta un recurso disponible. Así se evitan consultas innecesarias cuando otra opción ya responde al objetivo.'
    },
    cee: {
        profesorado: 'Comprueba la accesibilidad de los materiales y los apoyos necesarios, sin compartir informes individuales. Prepara formatos accesibles para distintas formas de participación. Así se pueden detectar barreras sin presuponer las mismas adaptaciones para todo el alumnado.',
        alumnado: 'Adapta la interacción y los apoyos de comunicación; comprueba que la herramienta no añade barreras ni sustituye los sistemas habituales de comunicación. Revisar si la respuesta expresa la intención del alumno ayuda a evitar malentendidos.',
        formacion: 'Prioriza la evaluación de accesibilidad y de apoyos de comunicación, utilizando casos ficticios. Estos casos permiten revisar opciones sin incorporar informes individuales.',
        sostenibilidad: 'Aborda el tema con materiales accesibles y formas diversas de participación, sin exigir una única respuesta. Esto permite que cada persona participe de una manera adecuada a la actividad.'
    },
    ies: {
        profesorado: 'Comprueba la exactitud de los contenidos y su adecuación a la materia, al nivel y a los objetivos de la tarea. Esta revisión ayuda a detectar errores o desajustes antes de utilizar el material.',
        alumnado: 'El acompañamiento puede favorecer que el alumnado contraste las respuestas y explique su razonamiento. Así se valora qué ha comprendido sin sustituir el trabajo propio.',
        formacion: 'Trabaja criterios compartidos para valorar fuentes y evidencias de aprendizaje en las distintas materias. Esto ayuda a distinguir la calidad de una respuesta de lo que demuestra el aprendizaje.',
        sostenibilidad: 'Contrasta la información sobre el impacto ambiental de la IA y valora cuándo su uso aporta valor a la tarea. Así se evitan tanto las cifras no verificadas como las consultas que no mejoran la actividad.'
    },
    fp: {
        profesorado: 'Valora qué competencia profesional y qué criterio de calidad se trabajan en cada actividad. Utiliza casos ficticios o información que pueda compartirse. Así se comprueba que la propuesta sirve al aprendizaje sin sustituir la práctica profesional.',
        alumnado: 'Trabaja con casos simulados y contrasta las propuestas con procedimientos profesionales, sin compartir información confidencial de empresas. Esto permite practicar con criterios del sector sin exponer datos reales.',
        formacion: 'Analiza casos del sector profesional con información ficticia y criterios de confidencialidad. Los casos permiten revisar las respuestas sin utilizar información reservada de empresas.',
        sostenibilidad: 'Analiza en casos del sector cuándo la IA aporta valor y qué alternativas permiten evitar usos innecesarios. Compararla con los recursos disponibles ayuda a elegir la opción adecuada para cada tarea.'
    },
    eoi: {
        profesorado: 'Comprueba el nivel lingüístico, la naturalidad de las expresiones y su adecuación a situaciones comunicativas reales. Una expresión correcta puede no ajustarse al registro o al contexto previsto.',
        alumnado: 'La conversación con IA puede servir como práctica complementaria. Revisar sus errores y mantener oportunidades de interacción entre personas ayuda a trabajar también la comunicación espontánea.',
        formacion: 'Practica la detección de errores lingüísticos y estereotipos culturales en textos y diálogos. La revisión de variantes y acentos ayuda a evitar que una única forma de expresión se presente como válida en todos los contextos.',
        sostenibilidad: 'Trabaja vocabulario y argumentos sobre tecnología y sostenibilidad a partir de fuentes contrastadas. Contrastar la información ayuda a practicar el idioma sin repetir afirmaciones no verificadas.'
    },
    cepa: {
        profesorado: 'Relaciona los materiales con los objetivos formativos y la diversidad de experiencias del alumnado adulto. Esto ayuda a atender distintos puntos de partida sin deducir necesidades solo por la edad.',
        alumnado: 'Gradúa el acompañamiento según la experiencia digital y los objetivos de cada persona, sin presuponer autonomía por la edad. Así el apoyo responde a la actividad y a la experiencia de quien participa.',
        formacion: 'Aborda cómo acompañar distintos niveles de competencia digital mediante actividades accesibles. Esto permite ajustar las orientaciones a los grupos y modalidades del centro.',
        sostenibilidad: 'Conecta el uso eficiente de recursos digitales con situaciones cotidianas y experiencias del grupo. Valorar los recursos disponibles ayuda a elegir una opción útil sin añadir barreras.'
    },
    esad: {
        profesorado: 'Revisa los derechos de uso de obras y materiales y su adecuación a la fase del proceso creativo. Esta revisión ayuda a valorar qué referencias pueden incorporarse y qué propuestas necesitan más comprobación.',
        alumnado: 'Favorece la exploración y la reflexión sobre las propuestas, preservando la autoría y las decisiones creativas del alumnado. Explicar qué decisiones son propias y qué apoyo aportó la IA ayuda a comprender el proceso.',
        formacion: 'Explora la autoría y los derechos de uso en procesos creativos con materiales de práctica. Así se pueden analizar representaciones y usos de voz e imagen sin exponer trabajos inéditos.',
        sostenibilidad: 'Reflexiona sobre cuándo generar propuestas aporta valor y cómo aprovechar los recursos disponibles en el proceso creativo. Esta comparación ayuda a evitar repeticiones sin finalidad.'
    },
    easd_ea: {
        profesorado: 'En los proyectos de arte y diseño, el centro puede valorar en qué fases aporta valor la IA y cómo revisar los textos o imágenes generados. Comprobar su adecuación al objetivo permite mantener visibles las decisiones creativas propias antes de incorporarlos.',
        alumnado: 'Si el centro prevé interacción directa del alumnado con IA, puede concretar el acompañamiento y cómo reconocer qué partes del proceso han recibido apoyo. Reflexionar sobre las decisiones propias ayuda a explicar el proceso y preservar la autoría.',
        formacion: 'La formación puede incluir la revisión de textos e imágenes generados, sus posibles sesgos y representaciones, y el debate sobre autoría y derechos de uso con materiales de práctica. Así se pueden analizar estos aspectos sin exponer proyectos inéditos.',
        sostenibilidad: 'El centro puede valorar si generar propuestas aporta valor al proyecto frente a recursos disponibles y evitar repetir generaciones sin una finalidad clara. Comparar las opciones ayuda a elegir recursos adecuados para cada fase.'
    },
    conservatorio: {
        profesorado: 'Valora que el repertorio, los ejercicios o las propuestas coreográficas se ajusten al nivel, los objetivos y la diversidad del grupo. Así se comprueba que los materiales responden a la disciplina y no sustituyen la práctica que se pretende desarrollar.',
        alumnado: 'Contrasta las propuestas con la práctica, la escucha o el movimiento, según la disciplina. Esta comprobación ayuda a valorar su utilidad sin sustituir la interpretación ni el criterio artístico.',
        formacion: 'Trabaja la valoración crítica de propuestas musicales o dancísticas y de los derechos de uso de partituras, grabaciones y otros materiales. Los casos de práctica permiten revisarlos sin recurrir a obras o grabaciones identificables del alumnado.',
        sostenibilidad: 'Valora cuándo las herramientas digitales aportan valor a la práctica y cuándo bastan recursos disponibles. Comparar las opciones ayuda a evitar generaciones repetidas.'
    },
    edre: {
        profesorado: 'Si el centro prevé estos usos, puede valorar cómo adaptar la planificación de entrenamientos, el análisis de técnicas o situaciones de juego y los materiales a la modalidad y a los objetivos formativos. Revisar las propuestas ayuda a comprobar que se ajustan a la práctica prevista.',
        alumnado: 'Si el centro prevé interacción directa del alumnado con IA, puede concretar su finalidad, el acompañamiento y cómo contrastar las respuestas según la edad y la actividad. Así se mantiene la práctica y la valoración docente como parte del aprendizaje.',
        formacion: 'La formación puede incluir la revisión de respuestas sobre técnicas y situaciones de juego, sus límites y el uso de casos ficticios, sin incorporar información identificable. Esto permite practicar la revisión sin utilizar datos reales de deportistas.',
        sostenibilidad: 'El centro puede valorar cuándo la IA aporta valor frente a la búsqueda u otros recursos disponibles y evitar consultas repetidas que no mejoren la actividad. Comparar opciones ayuda a reservarla para tareas con una finalidad clara.'
    }
};

const aperturaGuiaProfesoradoPorTipologia = {
    escuela_infantil: 'En las escuelas infantiles, ayuda a ajustar materiales, mediación y protección a las edades y grupos presentes.',
    ceip: 'En primaria, ayuda a graduar vocabulario, complejidad y apoyos por etapa, y a orientar la comprensión y participación del alumnado.',
    cee: 'En educación especial, ayuda a revisar accesibilidad, comunicación y apoyos según cada persona, sin presuponer adaptaciones iguales para todo el alumnado.',
    ies: 'En secundaria, estas pautas ayudan a valorar los usos según los objetivos y criterios de cada materia.',
    fp: 'En formación profesional, ayuda a relacionar actividades con competencias y criterios profesionales, y a proteger la información de empresas.',
    eoi: 'En las escuelas oficiales de idiomas, estas pautas se adaptan a los niveles, idiomas y modalidades del centro.',
    cepa: 'En educación de personas adultas, ayuda a adaptar el acompañamiento a objetivos, experiencias previas y competencia digital, sin presuponer autonomía por la edad.',
    esad: 'Según la oferta del centro, las actividades pueden implicar textos, voz, imagen, interpretación y materiales creativos. Estas orientaciones ayudan a valorar los usos según su finalidad y la fase del proceso.',
    easd_ea: 'En enseñanzas de arte y diseño, ayuda a relacionar los posibles usos de IA con los objetivos del proyecto, la autoría y los materiales, sin presuponer prácticas comunes a todos los centros.',
    conservatorio: 'Según la oferta del centro, la práctica puede incluir música o danza y trabajar con partituras, voz, grabaciones o movimiento.',
    edre: 'En enseñanzas deportivas, ayuda a valorar posibles usos según la modalidad y los objetivos formativos, sin presuponer la oferta ni las decisiones del centro.'
};

const orientacionesGuiaAlumnadoPorTipologia = {
    ceip: 'En primaria, realiza las actividades guiadas por el profesorado, explica con tus palabras qué has aprendido y pide apoyo si una respuesta no se entiende. Así compruebas lo que sabes y resuelves tus dudas a tiempo.',
    cee: 'Si necesitas un apoyo o formato accesible, pídelo. Comprueba que la respuesta expresa lo que querías comunicar y consulta al profesorado si no es así. De este modo participas con tus apoyos habituales sin que la herramienta cambie tu mensaje.',
    ies: 'Contrasta las respuestas con los materiales de clase y explica qué has comprobado y qué has decidido por ti mismo. Así distingues el apoyo de la herramienta de tu propio razonamiento.',
    fp: 'Trabaja con los casos y datos de práctica que indique el profesorado; contrasta las propuestas con los procedimientos profesionales. Así practicas con criterios del sector sin compartir información real de empresas.',
    eoi: 'Usa la IA como práctica complementaria de idiomas: revisa si las expresiones son naturales y conversa también con otras personas. Esto te ayuda a detectar errores y a comunicarte en situaciones reales.',
    cepa: 'Relaciona la ayuda de IA con tu objetivo; contrasta las respuestas y pide apoyo si la herramienta o el texto no se ajusta a tu experiencia. Así aprovechas la herramienta según tu punto de partida y lo que necesitas aprender.',
    esad: 'Explora ideas con IA sin ceder tu autoría. Revisa las propuestas y los derechos de uso de los materiales antes de incorporarlos. Así mantienes tus propias decisiones creativas en el proyecto.',
    easd_ea: 'Si el centro prevé que uses IA en un proyecto, revisa los textos o imágenes y explica qué parte del proceso recibió apoyo. Decide qué ideas incorporas y sigue las indicaciones del profesorado; así se reconocen tus decisiones de diseño.',
    conservatorio: 'Contrasta las sugerencias con tu práctica y escucha; la IA no sustituye tu interpretación ni tu criterio artístico. Esta comprobación te ayuda a decidir qué aporta a tu estudio.',
    edre: 'Si el centro prevé que uses IA en una actividad deportiva, contrasta la propuesta con la práctica y las indicaciones del profesorado. La IA no sustituye el entrenamiento ni la valoración docente, y comprobarlo te ayuda a aplicar cada pauta con seguridad.'
};

const orientacionesLenguajeSencilloPorEdad = {
    'CARD_AGE-edad_14_17': 'Haz preguntas claras. Comprueba la respuesta con el material de clase. Cuenta qué hizo la IA y qué hiciste tú.',
    'CARD_AGE-18_mas': 'Piensa qué quieres hacer. Decide si la IA te ayuda. Comprueba la respuesta. Explica qué ideas usas y por qué.'
};

const orientacionesLenguajeSencilloAlumnadoPorTipologia = {
    ceip: 'Haz la actividad con tu profe. Cuenta qué aprendiste. Pide ayuda si algo no está claro. Así aprendes paso a paso.',
    cee: 'Pide el apoyo que necesitas. Comprueba si la respuesta dice tu idea. Si no, cuéntaselo a tu profe. Así expresas bien lo que quieres decir.',
    ies: 'Compara la respuesta con el material de clase. Explica qué comprobaste y qué decidiste tú. Así demuestras lo que has aprendido.',
    fp: 'Practica con casos inventados. No uses datos reales de empresas. Compara la respuesta con los pasos del trabajo. Así practicas de forma segura.',
    eoi: 'Practica idiomas con IA. Comprueba si las frases se usan así. Habla también con otras personas. Así mejoras tu forma de comunicarte.',
    cepa: 'Usa la IA para lo que quieres aprender. Comprueba la respuesta. Pide ayuda si no está clara. Así avanzas a tu ritmo.',
    esad: 'Prueba ideas con IA. Decide cuáles quieres usar. Comprueba si puedes usar los textos y las imágenes. Así la obra sigue siendo tuya.',
    easd_ea: 'Si el centro permite usar IA en un proyecto, revisa el texto o la imagen. Decide qué ideas quieres usar y cuenta cuándo te ayudó la IA. Así muestras tu propio diseño.',
    conservatorio: 'Prueba las ideas con tu instrumento. Escucha cómo suenan. Decide tú cómo tocar. Así mantienes tu forma de interpretar.',
    edre: 'Si el centro permite usar IA, comprueba la respuesta en la práctica. Si tienes dudas, pregunta a tu profe. La IA puede equivocarse. Así entrenas con seguridad.'
};
const aperturaGuiaAlumnadoPorTipologia = {
    ceip: 'En primaria, esta guía te ayuda a seguir actividades acompañadas, explicar qué has aprendido y pedir apoyo cuando lo necesites.',
    cee: 'En educación especial, estas pautas te ayudan a usar los apoyos y formatos que necesitas y a comprobar si la herramienta expresa tu mensaje.',
    ies: 'En secundaria, estas pautas te ayudan a contrastar respuestas con los materiales de clase y a explicar tus decisiones.',
    fp: 'En formación profesional, estas pautas te ayudan a practicar con casos y comparar propuestas con procedimientos profesionales, sin compartir información de empresas.',
    eoi: 'En idiomas, estas pautas te ayudan a practicar y revisar expresiones, sin dejar de conversar con otras personas.',
    cepa: 'En educación de personas adultas, estas pautas te ayudan a relacionar la IA con tus objetivos y experiencia.',
    esad: 'En enseñanzas artísticas, estas pautas te ayudan a explorar ideas con IA sin dejar de tomar tus decisiones creativas.',
    easd_ea: 'En arte y diseño, estas pautas te ayudan a revisar propuestas de IA y a explicar tus decisiones creativas.',
    conservatorio: 'En música, estas pautas te ayudan a contrastar ideas con tu práctica y a mantener tu interpretación y criterio artístico.',
    edre: 'En enseñanzas deportivas, estas pautas te ayudan a contrastar las propuestas con la práctica y los objetivos de la actividad.'
};

const aperturaLenguajeSencilloAlumnadoPorTipologia = {
    ceip: 'En primaria, haz las actividades con ayuda. Cuenta qué aprendiste. Pide que te expliquen lo que no entiendas.',
    cee: 'Pide el apoyo que necesitas. Comprueba si la respuesta dice tu idea. Si no, explícalo a tu profe.',
    ies: 'En secundaria, comprueba las respuestas con los materiales de clase.',
    fp: 'En FP, practica con casos inventados. No uses datos de empresas.',
    eoi: 'En idiomas, practica y revisa las frases. Habla también con otras personas.',
    cepa: 'En educación de personas adultas, usa la IA para lo que quieres aprender. Pide ayuda si no entiendes algo.',
    esad: 'En enseñanzas artísticas, usa la IA para probar ideas. Tú decides cuáles usar.',
    easd_ea: 'En arte y diseño, prueba ideas. Decide tú qué quieres usar.',
    conservatorio: 'En música, prueba las ideas con tu instrumento. Decide tú cómo tocar.',
    edre: 'En deporte, comprueba las respuestas con la práctica. Si tienes dudas, pregunta a tu profe.'
};

const orientacionesPaso2PorEdad = {
    'CARD_AGE-menores_14': {
        profesorado: 'Con alumnado menor de 14 años, plantea actividades adecuadas a su desarrollo para reconocer cuándo interactúa con IA y que sus respuestas pueden equivocarse. Revisa los resultados con el grupo y valora qué mediación requiere la actividad, sin presuponer uso autónomo. Garantiza la equidad en el aula evitando actividades que requieran o premien el uso de versiones comerciales de pago.'
    },
    'CARD_AGE-edad_14_17': {
        profesorado: 'Con alumnado de 14 a 17 años, trabaja cómo formular preguntas claras, contrastar resultados con fuentes fiables e identificar errores, sesgos o falta de contexto. Advierte contra la falsa sensación de aprendizaje y recuerda que debe ejercitar la lectura, la escritura y el razonamiento propio antes de recurrir a la IA, conservando siempre su propio criterio.',
        alumnado: 'Formula preguntas claras, contrasta los resultados con fuentes fiables e identifica errores, sesgos o falta de contexto. No sustituyas tu esfuerzo personal: lee, escribe y razona antes de usar la IA, explica qué incorporas y por qué, y conserva siempre tu propio criterio.'
    },
    'CARD_AGE-18_mas': {
        profesorado: 'Con alumnado de 18 años o más, valora cuándo la IA aporta valor, cómo contrastar sus resultados y cómo justificar lo que se incorpora al trabajo. Ajusta el acompañamiento a la experiencia digital y a la tarea, no solo a la edad.',
        alumnado: 'Valora cuándo la IA aporta valor, contrasta sus resultados y justifica qué incorporas al trabajo. Ajusta el acompañamiento a tu experiencia digital y a la tarea.'
    }
};

const fuentesBibliograficasAPA7 = [
    {
        id: 'intef-2026',
        narrativeName: 'Guía del INTEF sobre inteligencia artificial en educación',
        narrativePurpose: 'una orientación pedagógica para diseñar actividades, acompañar al alumnado y revisar el aprendizaje',
        alias: /^(?:Gu[ií]a(?: del)? INTEF|INTEF,\s*Gu[ií]a)/i,
        author: 'Instituto Nacional de Tecnologías Educativas y de Formación del Profesorado',
        citationAuthor: 'Instituto Nacional de Tecnologías Educativas y de Formación del Profesorado',
        year: 2026,
        title: 'Guía sobre el uso de la inteligencia artificial en el ámbito educativo (versión 2.0; NIPO 164-26-007-9)',
        publisher: 'Ministerio de Educación, Formación Profesional y Deportes',
        url: 'https://intef.es/Noticias/nueva-version-de-la-guia-sobre-el-uso-de-la-inteligencia-artificial-en-el-ambito-educativo/'
    },
    {
        id: 'lopdgdd-2018',
        narrativeName: 'Ley Orgánica 3/2018 (LOPDGDD)',
        narrativePurpose: 'regula la protección de datos personales y los derechos digitales',
        alias: /^(?:LOPDGDD|Ley Orgánica 3\/2018)\b/i,
        author: 'Jefatura del Estado',
        citationAuthor: 'Jefatura del Estado',
        year: 2018,
        title: 'Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales',
        identifier: 'BOE-A-2018-16673',
        publisher: 'Boletín Oficial del Estado, núm. 294',
        url: 'https://www.boe.es/eli/es/lo/2018/12/05/3/con'
    },
    {
        id: 'ley-clm-7-2023',
        narrativeName: 'Ley 7/2023 de atención y protección a la infancia de Castilla-La Mancha',
        narrativePurpose: 'un marco autonómico sobre atención y protección a la infancia y la adolescencia',
        alias: /^Ley 7\/2023\b/i,
        citationAuthor: 'Ley 7/2023',
        year: 2023,
        title: 'Ley 7/2023, de 10 de marzo, de Atención y Protección a la Infancia y la Adolescencia de Castilla-La Mancha',
        identifier: 'BOE-A-2023-8710',
        publisher: 'Boletín Oficial del Estado, núm. 82',
        url: 'https://www.boe.es/eli/es-cm/l/2023/03/10/7/con'
    },
    {
        id: 'rd-1203-1999',
        narrativeName: 'Real Decreto 1203/1999 sobre unidades educativas penitenciarias',
        narrativePurpose: 'regula la organización y coordinación de las unidades educativas en establecimientos penitenciarios',
        alias: /^(?:Real Decreto 1203\/1999|BOE-A-1999-15848)\b/i,
        author: 'Ministerio de la Presidencia',
        citationAuthor: 'Ministerio de la Presidencia',
        year: 1999,
        title: 'Real Decreto 1203/1999, de 9 de julio, por el que se integran en el Cuerpo de Maestros a los funcionarios pertenecientes al Cuerpo de Profesores de Educación General Básica de Instituciones Penitenciarias y se disponen normas de funcionamiento de las unidades educativas de los establecimientos penitenciarios',
        identifier: 'BOE-A-1999-15848',
        publisher: 'Boletín Oficial del Estado, núm. 173',
        url: 'https://www.boe.es/eli/es/rd/1999/07/09/1203/con'
    },
    {
        id: 'rgpd-2016',
        narrativeName: 'Reglamento General de Protección de Datos (RGPD)',
        narrativePurpose: 'un marco general para contextualizar los principios, las bases jurídicas y las garantías del tratamiento de datos personales',
        alias: /^(?:RGPD|Reglamento \(UE\) 2016\/679)\b/i,
        author: 'Parlamento Europeo y Consejo de la Unión Europea',
        citationAuthor: 'Parlamento Europeo y Consejo de la Unión Europea',
        year: 2016,
        title: 'Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos)',
        publisher: 'Diario Oficial de la Unión Europea',
        url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es'
    },
    {
        id: 'reglamento-ue-2024-1689',
        narrativeName: 'Reglamento (UE) 2024/1689 sobre inteligencia artificial (Ley de IA)',
        narrativePurpose: 'establece el marco jurídico armonizado y las obligaciones aplicables a los sistemas de inteligencia artificial según su nivel de riesgo',
        alias: /^(?:Reglamento \(UE\) 2024\/1689|Ley de IA|AI Act)\b/i,
        author: 'Parlamento Europeo y Consejo de la Unión Europea',
        citationAuthor: 'Parlamento Europeo y Consejo de la Unión Europea',
        year: 2024,
        title: 'Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo, de 13 de junio de 2024, por el que se establecen normas armonizadas en materia de inteligencia artificial y por el que se modifican los Reglamentos (CE) n.º 300/2008, (UE) n.º 167/2013, (UE) n.º 168/2013, (UE) 2018/858, (UE) 2018/1139 y (UE) 2019/2144 y las Directivas 2014/90/UE, (UE) 2016/797 y (UE) 2020/1828 (Reglamento de Inteligencia Artificial)',
        publisher: 'Diario Oficial de la Unión Europea',
        url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'
    }
];

const inicioFuenteBibliografica = '(?:RGPD|LOPDGDD|Ley 7/2023|Ley Orgánica 3/2018|Reglamento \\(UE\\) 2016/679|Real Decreto 1203/1999|BOE-A-1999-15848|Guía(?: del)? INTEF|INTEF,\\s*Guía|Plan Digital de Centro)';

function separarMencionesBibliograficas(referencias) {
    const separador = new RegExp(`;\\s*(?=${inicioFuenteBibliografica})|\\.\\s+(?=${inicioFuenteBibliografica})|,\\s*y\\s+(?=${inicioFuenteBibliografica})`, 'i');
    return (referencias || [])
        .flatMap(referencia => String(referencia || '').split(separador))
        .map(referencia => referencia.trim().replace(/[.;]+$/, ''))
        .filter(Boolean);
}

function resolverFuenteBibliografica(mencion) {
    return fuentesBibliograficasAPA7.find(fuente => fuente.alias.test(mencion)) || null;
}

function construirCitaAPA(mencion) {
    if (/^Plan Digital de Centro\b/i.test(mencion)) return null;
    const fuente = resolverFuenteBibliografica(mencion);
    if (!fuente) return null;

    const localizadores = [...mencion.matchAll(/\bart[ií]culos?\s+[\d]+(?:\s*(?:,|–|-|y|a)\s*[\d]+)*/gi)]
        .map(match => match[0]);
    return `(${fuente.citationAuthor}, ${fuente.year}${localizadores.length ? `, ${localizadores.join(', ')}` : ''})`;
}

function ordenarReferenciasAPA(referencias) {
    const referenciasPorId = new Map();
    const pendientes = new Set();
    const menciones = separarMencionesBibliograficas(referencias);

    menciones.forEach(mencion => {
        if (/^Plan Digital de Centro\b/i.test(mencion)) return;
        const fuente = resolverFuenteBibliografica(mencion);
        if (fuente) referenciasPorId.set(fuente.id, fuente);
        else pendientes.add(mencion);
    });

    const lista = [...referenciasPorId.values()].sort((a, b) => {
        const autorA = (a.author || a.title).toLocaleLowerCase('es');
        const autorB = (b.author || b.title).toLocaleLowerCase('es');
        return autorA.localeCompare(autorB, 'es') || a.year - b.year || a.title.localeCompare(b.title, 'es');
    });

    return { lista, pendientes: [...pendientes] };
}

function construirAnexoBibliografia(diagnostico) {
    const { lista, pendientes } = ordenarReferenciasAPA(diagnostico.bibliografia);
    const menciones = separarMencionesBibliograficas(diagnostico.bibliografia);

    return {
        tipo: 'bibliografia',
        titulo: 'Fuentes de referencia',
        introduccion: 'Este anexo reúne fuentes normativas y orientativas para consulta, con una descripción breve de su contenido y utilidad.',
        referenciasAPA: lista,
        referenciasPendientes: pendientes
    };
}

function construirNarrativaBibliografia(anexo) {
    const parrafos = (anexo.referenciasAPA || []).map(fuente => {
        const identificador = fuente.identifier ? `; ${fuente.identifier}` : '';
        return [
            { text: `${fuente.narrativeName} (${fuente.year}${identificador})`, bold: true, color: '#305ADA', link: fuente.url },
            { text: `: ${fuente.narrativePurpose}.` }
        ];
    });

    if ((anexo.referenciasPendientes || []).length) {
        parrafos.push([{
            text: 'Hay referencias pendientes de normalizar antes de cerrar el documento.'
        }]);
    }
    if (!parrafos.length) {
        parrafos.push([{ text: 'No hay fuentes adicionales de referencia para incluir en este anexo.' }]);
    }

    return parrafos;
}

function construirBibliografiaPDF(anexo) {
    return construirNarrativaBibliografia(anexo).map((segmentos, index) => ({
        text: segmentos,
        style: 'p',
        margin: [0, 0, 0, index === 0 ? 10 : 12]
    }));
}

function construirBibliografiaHTML(anexo) {
    return construirNarrativaBibliografia(anexo).map(segmentos => {
        const texto = segmentos.map(segmento => {
            let contenido = escapeHTML(segmento.text);
            if (segmento.bold) contenido = `<strong>${contenido}</strong>`;
            if (segmento.link) contenido = `<a href="${escapeHTML(segmento.link)}">${contenido}</a>`;
            return contenido;
        }).join('');
        return `<p style="margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">${texto}</p>`;
    }).join('');
}

let logoExportPromise = null;

function obtenerTipoCentroNormalizado() {
    const rawValue = state.tipoCentro || state.tipo || document?.getElementById?.('tipo-centro')?.value || '';
    return String(rawValue).trim().toLowerCase();
}

function obtenerBibliografiaContextualPorTipologia() {
    const tipo = obtenerTipoCentroNormalizado();
    if (!tipo) return [];
    return [referenciaGuiaINTEF];
}

function obtenerJustificacionBibliograficaPorTipologia() {
    const tipo = obtenerTipoCentroNormalizado();
    return bibliografiaContextualPorTipologia[tipo] || justificacionBibliograficaGeneral;
}

function prepararLogoExportacion() {
    if (state.base64Logo) return Promise.resolve(state.base64Logo);
    if (logoExportPromise) return logoExportPromise;

    const usarLogoDeRespaldo = () => {
        state.base64Logo = window.logoJccmData || null;
        return state.base64Logo;
    };
    const logo = document.getElementById('logo-img');
    if (!logo) return Promise.resolve(usarLogoDeRespaldo());

    const convertirLogo = () => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = logo.naturalWidth;
            canvas.height = logo.naturalHeight;
            const context = canvas.getContext('2d');
            if (!context) throw new Error('No se pudo crear el contexto del logo.');
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(logo, 0, 0);
            state.base64Logo = canvas.toDataURL('image/jpeg');
        } catch (error) {
            console.warn('No se pudo preparar el logo para exportación.', error);
        }
        return state.base64Logo || usarLogoDeRespaldo();
    };

    if (logo.complete) {
        return Promise.resolve(logo.naturalWidth > 0 ? convertirLogo() : usarLogoDeRespaldo());
    }

    logoExportPromise = new Promise(resolve => {
        logo.addEventListener('load', () => resolve(convertirLogo()), { once: true });
        logo.addEventListener('error', () => resolve(usarLogoDeRespaldo()), { once: true });
    });
    return logoExportPromise;
}

function construirCabeceraPDF(logoDataUrl, nombreCentro, localidad, tipoCentro, fecha) {
    const datoPortada = (etiqueta, valor) => ({
        stack: [
            { text: etiqueta, fontSize: 9, bold: true, color: '#183452', margin: [0, 0, 0, 4] },
            { text: valor, fontSize: 11, color: '#183452', decoration: 'underline' }
        ],
        margin: [0, 0, 0, 12]
    });

    return {
        stack: [
            ...(logoDataUrl ? [{ image: logoDataUrl, width: 92, alignment: 'left', margin: [0, 0, 0, 52] }] : []),
            {
                columns: [
                    {
                        width: 88,
                        canvas: [
                            { type: 'line', x1: 41, y1: 14, x2: 41, y2: 38, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'line', x1: 29, y1: 26, x2: 53, y2: 26, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'ellipse', x: 40, y: 83, r1: 9, r2: 9, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'line', x1: 40, y1: 116, x2: 50, y2: 126, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'line', x1: 50, y1: 126, x2: 40, y2: 136, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'line', x1: 40, y1: 136, x2: 30, y2: 126, lineColor: '#C8D1FA', lineWidth: 1.5 },
                            { type: 'line', x1: 30, y1: 126, x2: 40, y2: 116, lineColor: '#C8D1FA', lineWidth: 1.5 }
                        ]
                    },
                    {
                        width: '*',
                        stack: [
                            {
                                table: {
                                    widths: ['*'],
                                    body: [[{
                                        text: 'Guías de ayuda y fuentes de referencia',
                                        fontSize: 21,
                                        bold: true,
                                        color: '#FFFFFF',
                                        margin: [20, 22, 20, 22],
                                        fillColor: '#305ADA'
                                    }]]
                                },
                                layout: 'noBorders',
                                margin: [0, 0, 0, 46]
                            },
                            {
                                stack: [
                                    datoPortada('Nombre del centro', nombreCentro),
                                    datoPortada('Localidad', localidad),
                                    datoPortada('Tipo de centro', tipoCentro),
                                    datoPortada('Fecha de emisión', fecha)
                                ]
                            }
                        ]
                    }
                ],
                columnGap: 0,
                margin: [0, 42, 0, 0]
            }
        ],
        pageBreak: 'after',
        margin: [0, 22, 0, 0]
    };
}

function construirCabeceraWord(logoDataUrl, nombreCentro, localidad, tipoCentro, fecha, tituloPortada = 'Protocolo para el uso educativo de la inteligencia artificial') {
    const logo = document.getElementById?.('logo-img');
    const ratio = logo?.naturalWidth > 0 ? logo.naturalHeight / logo.naturalWidth : 1;
    const logoWidth = 110;
    const logoHeight = Math.max(1, Math.round(logoWidth * ratio));
    const logoMarkup = logoDataUrl
        ? `<img src="${escapeHTML(logoDataUrl)}" width="${logoWidth}" height="${logoHeight}" style="display: block; width: ${logoWidth}px; height: ${logoHeight}px;" />`
        : '';

    return `
        <div style="page-break-after: always;">
            <table style="width: 100%; height: 640pt; border-collapse: collapse; border: none; table-layout: fixed;">
                <tr><td style="height: 640pt; vertical-align: top; padding: 0; border: none;">
                    <div style="height: 72pt;">${logoMarkup}</div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 90pt; border: none;">
                        <tr>
                            <td style="width: 24%; vertical-align: top; padding: 0 10px 0 0; border: none;">
                                <p style="margin: 28px 0 34px 18px; color: #C8D1FA; font-size: 28pt;">+</p>
                                <div style="width: 16px; height: 16px; margin: 0 0 32px 32px; background-color: #DDE3FC;"></div>
                                <div style="width: 18px; height: 18px; margin-left: 22px; border: 2px solid #C8D1FA; border-radius: 50%;"></div>
                                <p style="margin: 24px 0 0 32px; color: #C8D1FA; font-size: 20pt;">+</p>
                            </td>
                            <td style="width: 76%; vertical-align: top; padding: 0; border: none;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 72pt; border: none;">
                                    <tr><td style="height: 120pt; vertical-align: middle; background-color: #305ADA; padding: 24pt 26pt; border: none;">
                                        <h1 style="margin: 0; color: #FFFFFF; font-family: 'Montserrat', Arial, sans-serif; font-size: 22pt; line-height: 1.2;">${escapeHTML(tituloPortada)}</h1>
                                    </td></tr>
                                </table>
                                <table style="width: 100%; border-collapse: collapse; border: none;">
                                    <tr><td style="height: 60pt; vertical-align: middle; padding: 10pt 0; border: none;">
                                        <p style="margin: 0 0 4px; color: #183452; font-size: 9pt; font-weight: bold;">Nombre del centro</p>
                                        <p style="margin: 0; padding-bottom: 4px; color: #183452; font-size: 11pt; border-bottom: 1px solid #183452;">${escapeHTML(nombreCentro)}</p>
                                    </td></tr>
                                    <tr><td style="height: 60pt; vertical-align: middle; padding: 10pt 0; border: none;">
                                        <p style="margin: 0 0 4px; color: #183452; font-size: 9pt; font-weight: bold;">Localidad</p>
                                        <p style="margin: 0; padding-bottom: 4px; color: #183452; font-size: 11pt; border-bottom: 1px solid #183452;">${escapeHTML(localidad)}</p>
                                    </td></tr>
                                    <tr><td style="height: 60pt; vertical-align: middle; padding: 10pt 0; border: none;">
                                        <p style="margin: 0 0 4px; color: #183452; font-size: 9pt; font-weight: bold;">Tipo de centro</p>
                                        <p style="margin: 0; padding-bottom: 4px; color: #183452; font-size: 11pt; border-bottom: 1px solid #183452;">${escapeHTML(tipoCentro)}</p>
                                    </td></tr>
                                    <tr><td style="height: 60pt; vertical-align: middle; padding: 10pt 0; border: none;">
                                        <p style="margin: 0 0 4px; color: #183452; font-size: 9pt; font-weight: bold;">Fecha de emisión</p>
                                        <p style="margin: 0; padding-bottom: 4px; color: #183452; font-size: 11pt; border-bottom: 1px solid #183452;">${escapeHTML(fecha)}</p>
                                    </td></tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </div>
    `;
}

function construirEncabezadoPDF(nombreCentro, pagina) {
    if (pagina === 1) return { text: '', margin: [40, 20, 40, 0] };

    return {
        columns: [
            { text: nombreCentro, alignment: 'left', fontSize: 8, color: '#183452', width: '*' },
            { text: 'Guías de ayuda y fuentes de referencia', alignment: 'right', fontSize: 8, color: '#183452', width: 'auto' }
        ],
        margin: [40, 20, 40, 0]
    };
}

function construirPiePDF(pagina, totalPaginas) {
    if (pagina === 1) {
        return {
            text: 'Anexos elaborados con el Asistente de protocolo de IA (Castilla-La Mancha) · Licencia CC BY-NC-SA 4.0 Internacional',
            alignment: 'center',
            fontSize: 7.5,
            color: '#888888',
            margin: [40, 20, 40, 0]
        };
    }

    return {
        columns: [
            {
                text: 'Anexos elaborados con el Asistente de protocolo de IA (Castilla-La Mancha) · Licencia CC BY-NC-SA 4.0 Internacional',
                alignment: 'left',
                fontSize: 7.5,
                color: '#888888',
                width: '*'
            },
            {
                text: `Página ${pagina} de ${totalPaginas}`,
                alignment: 'right',
                fontSize: 7.5,
                color: '#888888',
                width: 'auto'
            }
        ],
        margin: [40, 20, 40, 0]
    };
}

function construirDisclaimerWord(incluirProtocolo = true) {
    const texto = incluirProtocolo
        ? 'Borrador elaborado con el Asistente de protocolo de IA (Castilla-La Mancha) &middot; Licencia CC BY-NC-SA 4.0 Internacional'
        : 'Anexos elaborados con el Asistente de protocolo de IA (Castilla-La Mancha) &middot; Licencia CC BY-NC-SA 4.0 Internacional';
    return `
        <div style="margin-top: 28pt; padding-top: 10pt; border-top: 1px solid #D1D5DB; text-align: center;">
            <p style="margin: 0; font-size: 8.5pt; color: #6B7280; font-family: 'Open Sans', Arial, sans-serif;">${texto}</p>
        </div>
    `;
}

function crearBlobPDF(docDefinition) {
    return new Promise((resolve, reject) => {
        try {
            pdfMake.createPdf(docDefinition).getBlob(resolve);
        } catch (error) {
            reject(error);
        }
    });
}

async function crearBlobDocxConBloqueProtegido(htmlCompleto, marcador, htmlProtegido, opciones) {
    const htmlDocx = window.htmlDocx;
    if (!htmlDocx || !htmlDocx.JSZip) throw new Error('No está disponible el procesador de paquetes DOCX.');

    const bodyStart = htmlCompleto.indexOf('<body>');
    const bodyEnd = htmlCompleto.lastIndexOf('</body>');
    const markerIndex = htmlCompleto.indexOf(marcador);
    if (bodyStart < 0 || bodyEnd < 0 || markerIndex < bodyStart || markerIndex > bodyEnd) {
        throw new Error('No se encontró el marcador del bloque normativo en el documento Word.');
    }

    const opening = htmlCompleto.slice(0, bodyStart + '<body>'.length);
    const closing = htmlCompleto.slice(bodyEnd);
    const before = htmlCompleto.slice(bodyStart + '<body>'.length, markerIndex);
    const after = htmlCompleto.slice(markerIndex + marcador.length, bodyEnd);
    const htmlParts = [before, htmlProtegido, after].map(part => `${opening}${part}${closing}`);
    const zip = new htmlDocx.JSZip();
    zip.load(await htmlDocx.asBlob(htmlParts[0], opciones).arrayBuffer());

    const relationships = [];
    const chunks = [];
    for (let index = 0; index < htmlParts.length; index++) {
        const partZip = index === 0 ? zip : new htmlDocx.JSZip();
        if (index > 0) partZip.load(await htmlDocx.asBlob(htmlParts[index], opciones).arrayBuffer());

        const fileName = index === 0 ? 'afchunk.mht' : `afchunk-${index + 1}.mht`;
        if (index > 0) zip.file(`word/${fileName}`, partZip.file('word/afchunk.mht').asText());
        const relationshipId = index === 0 ? 'htmlChunk' : `htmlChunk${index + 1}`;
        relationships.push(`<Relationship Id="${relationshipId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk" Target="/word/${fileName}" />`);

        const altChunk = `<w:altChunk r:id="${relationshipId}" />`;
        chunks.push(index === 1
            ? `<w:sdt><w:sdtPr><w:alias w:val="Contenido normativo fijo"/><w:lock w:val="sdtContentLocked"/><w:tag w:val="jccm-fixed-legal-text"/></w:sdtPr><w:sdtContent>${altChunk}</w:sdtContent></w:sdt>`
            : altChunk);
    }

    const documentXml = zip.file('word/document.xml').asText();
    const originalChunk = '<w:altChunk r:id="htmlChunk" />';
    if (!documentXml.includes(originalChunk)) throw new Error('No se encontró el bloque HTML original del documento Word.');
    zip.file('word/document.xml', documentXml.replace(originalChunk, chunks.join('')));
    const contentTypes = zip.file('[Content_Types].xml').asText();
    const extraContentTypes = htmlParts.slice(1).map((part, index) =>
        `<Override PartName="/word/afchunk-${index + 2}.mht" ContentType="message/rfc822"/>`
    ).join('');
    zip.file('[Content_Types].xml', contentTypes.replace('</Types>', `${extraContentTypes}</Types>`));
    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships.join('')}</Relationships>`);

    return new Blob([zip.generate({ type: 'arraybuffer' })], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
}

const REGLAS_LEGALES_PRIVACIDAD = new Set([
    'sub-priv-1-1',
    'sub-priv-1-2',
    'sub-priv-1-4',
    'sub-priv-2-1',
    'sub-priv-2-2',
    'sub-priv-min-1',
    'sub-priv-min-3'
]);

// Función auxiliar para extraer datos del DOM en el momento de generar
function recopilarSeccion(selectorWrapper) {
    const elementos = [];
    document.querySelectorAll(selectorWrapper).forEach(wrapper => {
        const mainChk = wrapper.querySelector('.main-checkbox');
        if (mainChk && mainChk.checked) {
            // Extraer el texto principal, limpiando botones de ayuda si existen
            let cloneLabel = wrapper.querySelector('label').cloneNode(true);
            cloneLabel.querySelectorAll('.info-icon, .info-icon-inline').forEach(e => e.remove());
            const titulo = mainChk.getAttribute?.('data-export-label') || cloneLabel.textContent.trim();
            
            const item = {
                titulo: titulo,
                subItems: [],
                subItemIds: [],
                extraText: []
            };
            
            const subCont = wrapper.querySelector('.sub-options-container');
            if (subCont) {
                const subs = subCont.querySelectorAll('.sub-checkbox:checked');
                subs.forEach(c => {
                    const checkboxItem = typeof c.closest === 'function' ? c.closest('.checkbox-item') : null;
                    const label = checkboxItem?.querySelector('label') || c.nextElementSibling;
                    if (label) {
                        item.subItems.push(label.textContent.trim());
                        item.subItemIds.push(c.id);
                    }
                });
                
                const textareas =
    subCont.querySelectorAll('.ideas-textarea');

            textareas.forEach(ta => {

        if (ta.value.trim()) {

        item.extraText.push(
            ta.value.trim()
        );

    }

});

                if (mainChk.id === 'priv-3') {
                    subCont.querySelectorAll('.institutional-modality-choice').forEach(modality => {
                        item.extraText.push(modality.textContent.trim());
                    });
                }

                if (mainChk.id === 'priv-4') {
                    const servicios = [];
                    if (state.serviciosGestionadosCentro) {
                        const lineasCentro = String(state.serviciosGestionadosCentro).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                        servicios.push(...lineasCentro);
                    }
                    if (state.otrosEntornosInstitucionales) {
                        const lineasOtros = String(state.otrosEntornosInstitucionales).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                        servicios.push(...lineasOtros);
                    }
                    if (servicios.length > 0) {
                        const yaMencionado = item.extraText.some(t => servicios.some(s => t.toLowerCase().includes(s.toLowerCase())));
                        if (!yaMencionado) {
                            item.extraText.unshift(`Servicios o herramientas identificados en el centro sujetos a control de registro: ${servicios.join(', ')}.`);
                        }
                    }
                }
            }
            elementos.push(item);
        }
    });
    return elementos;
}

function separarReglasLegalesPrivacidad(secciones) {
    const fijas = [];
    const editables = [];

    secciones.forEach(seccion => {
        const subItemsFijos = [];
        const subItemIdsFijos = [];
        const subItemsEditables = [];
        const subItemIdsEditables = [];

        seccion.subItems.forEach((texto, index) => {
            const id = seccion.subItemIds?.[index];
            if (REGLAS_LEGALES_PRIVACIDAD.has(id)) {
                subItemsFijos.push(texto);
                subItemIdsFijos.push(id);
            } else {
                subItemsEditables.push(texto);
                subItemIdsEditables.push(id);
            }
        });

        if (subItemsFijos.length) {
            fijas.push({ ...seccion, subItems: subItemsFijos, subItemIds: subItemIdsFijos, extraText: [] });
        }
        if (subItemsEditables.length || seccion.extraText.length || !subItemsFijos.length) {
            editables.push({ ...seccion, subItems: subItemsEditables, subItemIds: subItemIdsEditables });
        }
    });

    return { fijas, editables };
}

function listarModalidadesInstitucionales() {
    const labels = {
        consejeria: 'Copilot con cuenta institucional @educastillalamancha.es (docentes)',
        centro: 'Licencias o contratos gestionados por el centro',
        otro: 'Herramientas propias y locales'
    };
    const selectedModalities = [...new Set(state.modalidadesInstitucionales || [])];
    if (state.iaSinConexion && !selectedModalities.includes('otro')) selectedModalities.push('otro');
    const modalities = selectedModalities
        .filter(modality => labels[modality])
        .map(modality => {
            const details = modality === 'centro'
                ? state.serviciosGestionadosCentro
                : modality === 'otro' ? state.otrosEntornosInstitucionales : '';
            const entries = String(details || '').split(/\r?\n/).map(entry => entry.trim()).filter(Boolean);
            let summary = entries.length ? `${labels[modality]}: ${entries.join(', ')}` : labels[modality];
            return summary;
        });
    return modalities;
}

function construirModalidadesInstitucionalesPDF() {
    const modalities = listarModalidadesInstitucionales();
    return {
        stack: [
            { text: 'El centro señala las modalidades institucionales que prevé priorizar. Estas preferencias no autorizan por sí solas cualquier servicio, dato o actividad.' },
            modalities.length
                ? { ul: modalities }
                : { text: 'No se han señalado modalidades institucionales prioritarias.', italics: true, color: '#666666' },
            { text: 'La adecuación de cada uso se valora conforme a los criterios comunes del protocolo y a las decisiones docentes para cada actividad.' }
        ]
    };
}

function construirModalidadesInstitucionalesHTML() {
    const modalities = listarModalidadesInstitucionales();
    const choices = modalities.length
        ? `<ul>${modalities.map(modality => `<li>${escapeHTML(modality)}</li>`).join('')}</ul>`
        : '<p><em>No se han señalado modalidades institucionales prioritarias.</em></p>';
    return `<p>El centro señala las modalidades institucionales que prevé priorizar. Estas preferencias no autorizan por sí solas cualquier servicio, dato o actividad.</p>${choices}<p>La adecuación de cada uso se valora conforme a los criterios comunes del protocolo y a las decisiones docentes para cada actividad.</p>`;
}

function incorporarContextoPenitenciario(diagnostico) {
    const resumenes = [...diagnostico.resumenes];
    const bibliografia = [...diagnostico.bibliografia];
    const justificacionesBibliografia = [...(diagnostico.justificacionesBibliografia || [])];

    if (state.aulaPenitenciaria) {
        const justificacionPenitenciaria = 'El personal docente respetará las normas de control y seguridad aplicables al establecimiento. La actividad educativa se coordinará por los cauces correspondientes; antes de introducir equipos o programas se comprobarán los permisos aplicables. No se presupone ausencia de Internet ni autorización de IA local. Como orientación, se recomienda preparar materiales y alternativas accesibles sin IA cuando no haya una herramienta adecuada o autorizada.';
        resumenes.push({
            titulo: 'Actividad educativa en un establecimiento penitenciario',
            justificaciones: [justificacionPenitenciaria]
        });
        const referenciaPenitenciaria = 'Real Decreto 1203/1999, de 9 de julio, BOE-A-1999-15848, artículos 5–7 y 11: servicio educativo, instalaciones, normas de control y seguridad y coordinación en establecimientos penitenciarios. https://www.boe.es/eli/es/rd/1999/07/09/1203/con';
        bibliografia.push(referenciaPenitenciaria);
        justificacionesBibliografia.push({
            apartado: 'Contexto institucional — Actividad educativa en un establecimiento penitenciario',
            elemento: 'Normas de control, seguridad y coordinación',
            justificacion: justificacionPenitenciaria,
            menciones: [referenciaPenitenciaria]
        });
    }

    const referenciasTipologia = obtenerBibliografiaContextualPorTipologia();
    const justificacionTipologia = obtenerJustificacionBibliograficaPorTipologia();
    bibliografia.push(...referenciasTipologia);
    if (referenciasTipologia.length) {
        justificacionesBibliografia.push({
            apartado: 'Guía relacionada — Buenas prácticas para el profesorado',
            elemento: justificacionTipologia.elemento,
            justificacion: justificacionTipologia.justificacion,
            menciones: referenciasTipologia
        });
    }

    return {
        ...diagnostico,
        resumenes,
        bibliografia: [...new Set(bibliografia)],
        justificacionesBibliografia
    };
}

function obtenerDiagnosticoContextualSeleccionado() {
    const engine = window.consequenceEngine;
    if (!engine) return incorporarContextoPenitenciario({ resumenes: [], anexos: [], bibliografia: [], justificacionesBibliografia: [] });

    const contenidosAnexos = {
        ANEXO_CONSENTIMIENTO_FAMILIAR: [
            {
                tipo: 'operativo',
                titulo: 'Plantilla opcional de información a familias',
                introduccion: 'Recurso para adaptar únicamente si, tras analizar la actividad, procede informar a las familias o solicitar autorización. Su inclusión como anexo no implica que el consentimiento o la autorización sean necesarios por razón de edad.',
                secciones: [{
                    titulo: 'Información de la actividad',
                    elementos: [
                        'Actividad y finalidad educativa: ______________________________________',
                        'Herramienta de IA y proveedor: ______________________________________',
                        'Modalidad de acceso y registro: [ ] Sin registro previo / [ ] Cuenta institucional corporativa / [ ] Mediación proyectada del docente (sin cuentas del alumnado)',
                        'Qué hará el alumnado y cómo lo acompañará el profesorado: ______________________________________',
                        'Qué datos se tratarán y qué medidas de privacidad se aplicarán: ______________________________________',
                        'Alternativa pedagógica prevista (actividad equivalente sin uso de IA): ______________________________________',
                        'Persona de contacto del centro: ______________________________________'
                    ]
                }]
            },
            {
                tipo: 'operativo',
                titulo: 'Lista interna para valorar información y autorización',
                introduccion: 'Herramienta de revisión interna. La necesidad de informar o solicitar autorización se determina para cada actividad y herramienta; no se presume únicamente por la edad.',
                secciones: [{
                    titulo: 'Comprobaciones',
                    elementos: [
                        'Describir la actividad, la herramienta y su finalidad concreta.',
                        'Comprobar qué datos se tratarán, quién los recibe y durante cuánto tiempo.',
                        'Revisar las condiciones de uso y las opciones de privacidad de la herramienta.',
                        'Verificar la edad mínima exigida en las condiciones del servicio frente a la edad del alumnado y la modalidad prevista (uso directo o mediado).',
                        'Comprobar que el servicio de IA no utilice las consultas, textos o producciones del alumnado para el reentrenamiento de modelos comerciales de uso general.',
                        'Consultar con la dirección y la persona delegada de protección de datos cuando corresponda.',
                        'Registrar la decisión, la persona responsable y las medidas de supervisión.'
                    ]
                }]
            }
        ],
        ANEXO_PROTECCION_DATOS_ESPECIAL: {
            tipo: 'operativo',
            titulo: 'Medidas de protección y apoyo individualizado',
            introduccion: 'Ficha interna para planificar apoyos sin incluir aquí datos identificativos ni detalles de salud, protección u otra información confidencial del alumnado.',
            secciones: [{
                titulo: 'Lista de revisión',
                elementos: [
                    'Definir el objetivo educativo y comprobar que la herramienta es adecuada.',
                    'Limitar la información a lo estrictamente necesario y no introducir nunca en las consultas a la IA datos de salud, informes psicopedagógicos ni circunstancias judiciales o de protección.',
                    'Utilizar únicamente herramientas y cuentas aprobadas por el centro.',
                    'Acordar quién supervisa la actividad y qué apoyos de accesibilidad se necesitan.',
                    'Revisar la medida con los profesionales responsables antes de aplicarla.'
                ]
            }]
        },
        ANEXO_EQUIDAD_DIGITAL: {
            tipo: 'operativo',
            titulo: 'Equidad digital y alternativas de acceso',
            introduccion: 'Plan de apoyo para que las limitaciones de conexión, dispositivos o accesibilidad no impidan participar en la actividad.',
            secciones: [{
                titulo: 'Lista de revisión',
                elementos: [
                    'Comprobar la conexión y los dispositivos disponibles en el centro y fuera de él.',
                    'Verificar que la actividad no exija ni premie el uso de versiones comerciales de pago o modelos avanzados no accesibles para todo el grupo.',
                    'Ofrecer una alternativa equivalente y accesible, sin penalizar al alumnado que no disponga de conexión o dispositivo o no pueda usar la herramienta.',
                    'Acordar cómo se prestará apoyo a quien no pueda completar la actividad en línea.',
                    'Revisar la accesibilidad de los materiales y de la alternativa propuesta.'
                ]
            }]
        },
        ANEXO_GOBERNANZA_DIGITAL: {
            tipo: 'operativo',
            titulo: 'Responsabilidades y revisión de herramientas',
            introduccion: 'Completa una ficha por cada actividad o herramienta institucional que se valore incorporar.',
            secciones: [{
                titulo: 'Registro de responsabilidades',
                elementos: [
                    'Actividad o herramienta que se revisa: ______________________________________',
                    'Persona o equipo responsable de la propuesta: ______________________________________',
                    'Revisión de seguridad, privacidad y condiciones de uso: ______________________________________',
                    'Responsable de supervisar la actividad: ______________________________________',
                    'Fecha de revisión y próxima comprobación: ______________________________________',
                    'Validación institucional (V.º B.º de Dirección o Coordinación de Transformación Digital): ______________________________________'
                ]
            }]
        }
    };

    const profile = engine.buildContextProfile(
        cardCatalog,
        engine.makeConditionSet(obtenerSeleccionesContextoDisponibles())
    );

    const resumenes = Object.values(cardCatalog).map(card => {
        const condiciones = profile.conditions.filter(condition => condition.cardId === card.id);
        if (!condiciones.length) return null;

        return {
            titulo: card.title,
            justificaciones: [...new Set(condiciones.map(condition => condition.justification).filter(Boolean))]
        };
    }).filter(Boolean);
    const justificacionesBibliografia = Object.values(cardCatalog).flatMap(card =>
        profile.conditions
            .filter(condition => condition.cardId === card.id && condition.bibliography)
            .map(condition => ({
                apartado: `Condición contextual — ${card.title}`,
                elemento: condition.label,
                justificacion: condition.justification,
                menciones: [condition.bibliography]
            }))
    );

    const annexIds = [...new Set(profile.conditions.map(condition => condition.annex).filter(Boolean))];
    const anexos = annexIds.flatMap(id => {
        const contenido = contenidosAnexos[id];
        if (!contenido) return [];
        return (Array.isArray(contenido) ? contenido : [contenido])
            .map(anexo => ({ id, ...anexo }))
            .filter(anexo => anexo.tipo === 'informativo');
    });
    const bibliografia = [...new Set([
        ...profile.conditions
            .flatMap(condition => (condition.bibliography || '').split(';'))
            .map(reference => reference.trim().replace(/[.;,]+$/, ''))
            .filter(Boolean),
        ...obtenerBibliografiaContextualPorTipologia()
    ])];

    return incorporarContextoPenitenciario({ resumenes, anexos, bibliografia, justificacionesBibliografia });
}

function obtenerAnexosDocumento(diagnostico) {
    const tipo = obtenerTipoCentroNormalizado();
    const orientacionesTipo = orientacionesPaso2PorTipologia[tipo];
    const edadesSeleccionadas = Object.entries(orientacionesPaso2PorEdad)
        .filter(([id]) => state.contextoSeleccionado?.[id]);
    const guiaProfesorado = {
        tipo: 'informativo',
        titulo: 'Guía de buenas prácticas para el profesorado',
        introduccion: `Estas orientaciones son informativas. Ayudan a valorar los usos previstos y no sustituyen las decisiones que adopte el centro. ${aperturaGuiaProfesoradoPorTipologia[tipo] || ''}`.trim(),
        secciones: [{
            titulo: 'Criterios generales',
            elementos: [
                'La IA es un asistente, no un sustituto: mantén la supervisión y la decisión profesional.',
                'La evaluación mide el aprendizaje real: no delegues la calificación en sistemas automáticos ni fundamentes decisiones disciplinarias en detectores de IA (por su falta de fiabilidad y riesgo de sesgo). Ante dudas sobre la autoría, recurre a evidencias del proceso de trabajo, borradores intermedios y diálogo formativo con el alumnado.',
                'Garantiza la equidad en el diseño de actividades: no propongas tareas que exijan o premien el uso de versiones comerciales de pago o modelos avanzados no accesibles para todo el alumnado.',
                'Contrasta siempre el rigor conceptual de los contenidos generados antes de llevarlos al aula: verifica fechas, datos y fuentes para descartar imprecisiones, invenciones algorítmicas («alucinaciones») o sesgos discriminatorios.',
                'Respeta la propiedad intelectual: no introduzcas en herramientas externas de IA libros de texto completos, materiales editoriales con derechos reservados ni obras de terceros sin la debida licencia o autorización.',
                'Protección de la convivencia y ciberseguridad: ante la sospecha o detección de usos perjudiciales de IA (como deepfakes, suplantación o difusión no consentida de imágenes o audios), activa los protocolos de convivencia del centro y orienta a las familias hacia la Línea de Ayuda en Ciberseguridad del INCIBE (teléfono gratuito y confidencial 017).',
                'Utiliza datos personales o de salud solo en herramientas autorizadas por el centro y con garantías adecuadas para la actividad.',
                'Comparte solo la información necesaria. Cuando resulte adecuado, sustituye identificadores directos por seudónimos; los datos seudonimizados siguen siendo personales.',
                'Ejemplo funcional: pide una rúbrica indicando nivel y criterios, sin adjuntar notas ni trabajos. Si necesitas un caso, usa un perfil sintético. Sustituir un nombre por "Persona A" no anonimiza si el contexto permite identificar a la persona.',
                ...(document.getElementById('tool-prof-1').checked ? ['Informa al alumnado cuándo y cómo se puede usar la IA en la actividad.'] : []),
                ...(document.getElementById('tool-prof-4').checked ? ['Mantén actualizadas tus competencias digitales y revisa las respuestas antes de utilizarlas.'] : []),
                ...(document.getElementById('norma-1')?.checked ? ['Declara con naturalidad el uso de IA al diseñar situaciones de aprendizaje, rúbricas o recursos de aula, indicando la herramienta empleada y la revisión docente aplicada.'] : ['Elemento para la reflexión docente: Valorar en departamento o ciclo la conveniencia de documentar de forma transparente el uso de IA en la preparación de situaciones de aprendizaje y materiales, acordando criterios comunes de centro.'])
            ]
        }]
    };

    if (orientacionesTipo) {
        guiaProfesorado.secciones.push(
            { titulo: 'Preparación de materiales', elementos: [orientacionesTipo.profesorado] },
            { titulo: 'Acompañamiento del alumnado', elementos: [orientacionesTipo.alumnado] },
            { titulo: 'Formación docente', elementos: [orientacionesTipo.formacion] },
            { titulo: 'Uso eficiente de recursos', elementos: [orientacionesTipo.sostenibilidad] }
        );
    }

    if (edadesSeleccionadas.length) {
        guiaProfesorado.secciones.push({
            titulo: 'Acompañamiento según la edad',
            elementos: edadesSeleccionadas.map(([, orientacion]) => orientacion.profesorado)
        });
    }

    const anexos = [guiaProfesorado];

    if (tipo !== 'escuela_infantil' && (state.contextoSeleccionado?.['CARD_AGE-edad_14_17'] || state.contextoSeleccionado?.['CARD_AGE-18_mas'])) {
        const guiaAlumnado = {
            tipo: 'informativo',
            titulo: 'Guía de buen uso para el alumnado',
            introduccion: `Estas recomendaciones solo se aplican cuando el centro prevea que el alumnado utilice IA. Sigue las indicaciones del profesorado para cada actividad. ${aperturaGuiaAlumnadoPorTipologia[tipo] || ''}`.trim(),
            secciones: [{
                titulo: 'Criterios generales',
                elementos: [
                    'Utiliza la IA como apoyo para aprender y escribe con tus propias palabras lo que entiendas.',
                    'Honestidad académica: no utilices la IA en exámenes o pruebas donde no esté autorizada, ni entregues trabajos generados íntegramente por la máquina haciéndolos pasar por tuyos. La evaluación sirve para comprobar lo que tú has aprendido.',
                    'Respeta la intimidad y la convivencia: está terminantemente prohibido utilizar la IA para generar, manipular o difundir imágenes, vídeos o grabaciones de voz de compañeros, compañeras o docentes, o cualquier contenido que pueda herir o acosar a otras personas. Si detectas estas conductas o sufres acoso digital, acude de inmediato al profesorado o llama de forma gratuita y confidencial a la Línea de Ayuda en Ciberseguridad del INCIBE (teléfono 017).',
                    'Sigue las indicaciones del profesorado antes de compartir datos personales propios o ajenos. Comparte solo lo necesario y, si no sabes qué información puede usarse, pregunta antes.',
                    'Comprueba las respuestas con los materiales de clase o con fuentes fiables; la IA puede equivocarse.',
                    ...(document.getElementById('norma-1').checked ? ['Declara cuándo has utilizado IA y describe cómo te ayudó.'] : []),
                    ...(document.getElementById('norma-4').checked ? ['Utiliza tu dispositivo personal para una actividad con IA solo si el centro lo permite. Sigue las indicaciones del profesorado sobre cuándo y cómo utilizarlo.'] : [])
                ]
            }]
        };
        const orientacionTipoAlumnado = orientacionesGuiaAlumnadoPorTipologia[tipo];
        if (orientacionTipoAlumnado) {
            guiaAlumnado.secciones.push({ titulo: 'Orientaciones para tu contexto', elementos: [orientacionTipoAlumnado] });
        }
        const etiquetasEdadAlumnado = {
            'CARD_AGE-edad_14_17': 'Si tienes entre 14 y 17 años',
            'CARD_AGE-18_mas': 'Si tienes 18 años o más'
        };
        const orientacionesEdadAlumnado = edadesSeleccionadas
            .filter(([id, orientacion]) => etiquetasEdadAlumnado[id] && orientacion.alumnado)
            .map(([id, orientacion]) => `${etiquetasEdadAlumnado[id]}: ${orientacion.alumnado}`)
            .filter(Boolean);
        if (orientacionesEdadAlumnado.length) {
            guiaAlumnado.secciones.push({ titulo: 'Pautas para tu tramo de edad', elementos: orientacionesEdadAlumnado });
        }
        anexos.push(guiaAlumnado);

        const guiaAlumnadoLecturaFacil = {
            tipo: 'informativo',
            titulo: 'Guía de buen uso para el alumnado (lenguaje claro)',
            introduccion: `${aperturaLenguajeSencilloAlumnadoPorTipologia[tipo] || ''} Esta guía usa palabras sencillas. Si no entiendes algo, pide ayuda a tu profe.`.trim(),
            secciones: [{
                titulo: 'Ideas importantes',
                elementos: [
                    'IA significa inteligencia artificial. Es una herramienta que responde a preguntas. Puede equivocarse.',
                    'Piensa y escribe primero por ti mismo. La IA te puede dar ideas, pero no aprende por ti.',
                    'Haz tus tareas y exámenes tú. No entregues trabajos hechos por la máquina.',
                    'No uses la IA para cambiar fotos o voces de otras personas. No te burles de nadie. Si alguien te molesta, avisa a tu profe. También puedes llamar gratis al 017.',
                    'Usa tus propias palabras para contar lo que aprendiste.',
                    'Comprueba las respuestas con los materiales de clase.',
                    'Haz la actividad como te explique tu profe.',
                    'No escribas datos que digan quién eres. Por ejemplo: tu nombre, tu dirección o una foto. Antes de compartir datos de otra persona, pregunta a tu profe.',
                    ...(document.getElementById('norma-1').checked ? ['Si usas IA en una tarea, dilo. Cuenta qué te ayudó a hacer.'] : []),
                    ...(document.getElementById('norma-4').checked ? ['Usa tu móvil, tableta u ordenador solo si el centro lo permite. Haz lo que te indique tu profe.'] : [])
                ]
            }]
        };
        const orientacionLenguajeSencilloTipo = orientacionesLenguajeSencilloAlumnadoPorTipologia[tipo];
        if (orientacionLenguajeSencilloTipo) {
            guiaAlumnadoLecturaFacil.secciones.push({ titulo: 'En tu centro', elementos: [orientacionLenguajeSencilloTipo] });
        }
        const orientacionesEdadLenguajeSencillo = edadesSeleccionadas
            .filter(([id]) => orientacionesLenguajeSencilloPorEdad[id])
            .map(([id]) => `${etiquetasEdadAlumnado[id]}: ${orientacionesLenguajeSencilloPorEdad[id]}`);
        if (orientacionesEdadLenguajeSencillo.length) {
            guiaAlumnadoLecturaFacil.secciones.push({ titulo: 'Para tu edad', elementos: orientacionesEdadLenguajeSencillo });
        }
        anexos.push(guiaAlumnadoLecturaFacil);
    }

    anexos.push(...diagnostico.anexos);
    anexos.push(construirAnexoBibliografia(diagnostico));

    return anexos.filter(anexo => anexo.tipo === 'informativo' || anexo.tipo === 'bibliografia');
}

function numeroRomano(numero) {
    const valores = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let resultado = '';

    valores.forEach(([valor, simbolo]) => {
        while (numero >= valor) {
            resultado += simbolo;
            numero -= valor;
        }
    });

    return resultado;
}

function construirAnexosPDF(anexos) {
    return anexos.flatMap((anexo, index) => {
        const empiezaPaginaNueva = index > 0;
        const contenido = [{
            text: `Anexo ${numeroRomano(index + 1)}. ${anexo.titulo}`,
            style: 'h2',
            ...(empiezaPaginaNueva ? { pageBreak: 'before' } : {})
        }];
        if (anexo.introduccion) contenido.push({ text: anexo.introduccion, style: 'p', margin: [0, 0, 0, 10] });
        if (anexo.tipo === 'bibliografia') return [...contenido, ...construirBibliografiaPDF(anexo)];
        return [...contenido, ...anexo.secciones.flatMap(seccion => [
            { text: seccion.titulo, style: 'h3' },
            { ul: seccion.elementos, style: 'p', margin: [0, 0, 0, 12] }
        ])];
    });
}

function construirAnexosHTML(anexos) {
    return anexos.map((anexo, index) => {
        const empiezaPaginaNueva = index > 0;
        const cuerpo = anexo.tipo === 'bibliografia'
            ? construirBibliografiaHTML(anexo)
            : anexo.secciones.map(seccion => `
            <h3>${escapeHTML(seccion.titulo)}</h3>
            <ul>${seccion.elementos.map(elemento => `<li>${escapeHTML(elemento)}</li>`).join('')}</ul>
        `).join('');
        return `
        <h2 style="${empiezaPaginaNueva ? 'page-break-before: always;' : ''}">Anexo ${numeroRomano(index + 1)}. ${escapeHTML(anexo.titulo)}</h2>
        ${anexo.introduccion ? `<p>${escapeHTML(anexo.introduccion)}</p>` : ''}
        ${cuerpo}
    `;
    }).join('');
}

// -------------------------------------------------------------
// GENERACIÓN DE PDF (pdfmake nativo)
// -------------------------------------------------------------
// -------------------------------------------------------------
// GENERACIÓN DE PDF (pdfmake)
// -------------------------------------------------------------
async function generarPDF() {
    const confirmarGeneracionPDF = async () => {
    const nombreCentro = document.getElementById('nombre-centro').value || 'No especificado';
    const nombreArchivo = obtenerNombreArchivoProtocolo(nombreCentro, 'pdf');
    let destino;
    try {
        destino = await solicitarDestinoGuardado(nombreArchivo, 'application/pdf', '.pdf', 'Documento PDF');
    } catch (error) {
        console.error(error);
        showModal('Error al guardar', 'No se pudo abrir el selector de destino para el PDF.');
        return;
    }
    if (!destino) return;

    const logoDataUrl = await prepararLogoExportacion();
    if (!logoDataUrl) {
        showModal('Error', 'No se pudo cargar el logo de cabecera. Comprueba que logo-jccm.png esté disponible.');
        return;
    }

    const localidad = document.getElementById('localidad').value || 'No especificada';
    const comboTipo = document.getElementById('tipo-centro');
    const tipoCentro = comboTipo.options[comboTipo.selectedIndex]?.text || '';
    const fecha = new Date().toLocaleDateString('es-ES');

    const diagnosticoContextual = obtenerDiagnosticoContextualSeleccionado();
    const anexosDocumento = obtenerAnexosDocumento(diagnosticoContextual);

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: (pagina) => construirEncabezadoPDF(nombreCentro, pagina),
        footer: function(currentPage, pageCount) {
            return construirPiePDF(currentPage, pageCount);
            // Paginación institucional: Página ${currentPage} de ${pageCount}
        },
content: [
            construirCabeceraPDF(logoDataUrl, nombreCentro, localidad, tipoCentro, fecha),
            ...construirAnexosPDF(anexosDocumento)
        ],
        styles: {
            h1: { fontSize: 22, bold: true, color: '#183452', margin: [0, 0, 0, 4] },
            h2: { fontSize: 16, bold: true, color: '#305ADA', margin: [0, 15, 0, 8] },
            h3: { fontSize: 12, bold: true, color: '#183452', margin: [0, 10, 0, 4] },
            p: { fontSize: 10, color: '#45464A', lineHeight: 1.3 }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };
    try {
        const pdfBlob = await crearBlobPDF(docDefinition);
        const resultado = await guardarBlobArchivo(pdfBlob, nombreArchivo, destino);
        if (resultado.estado === 'guardado') {
            showModal('Guardado completado', `PDF guardado como "${resultado.nombre}".`);
        }
    } catch(e) {
        console.error(e);
        showModal("Error", "No se pudo generar el PDF.");
    }
    };

    await confirmarGeneracionPDF();
}

// -------------------------------------------------------------
// GENERACIÓN DE WORD (htmlDocx)
// -------------------------------------------------------------
// -------------------------------------------------------------
// GENERACIÓN DE WORD (htmlDocx)
// -------------------------------------------------------------
function obtenerTextoRecomendacionRevisionProtocolo() {
    const opcionSeleccionada = document.getElementById('audit-review-protocol')?.checked;
    return opcionSeleccionada
        ? ' Se recomienda revisarlo al menos una vez por curso y cuando cambien las herramientas, actividades o normativa aplicable.'
        : '';
}

async function generarDocumentoWord(incluirProtocolo = true) {
    const confirmarGeneracionWord = async () => {
    const nombreCentro = document.getElementById('nombre-centro').value || 'No especificado';
    const nombreArchivoProtocolo = obtenerNombreArchivoProtocolo(nombreCentro, 'docx');
    const nombreArchivo = incluirProtocolo
        ? nombreArchivoProtocolo
        : nombreArchivoProtocolo.replace(/^Protocolo de IA /, 'Anexos de ayuda IA ');
    let destino;
    try {
        destino = await solicitarDestinoGuardado(
            nombreArchivo,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.docx',
            incluirProtocolo ? 'Protocolo de Word' : 'Anexos de ayuda en Word'
        );
    } catch (error) {
        console.error(error);
        showModal('Error al guardar', 'No se pudo abrir el selector de destino para Word.');
        return;
    }
    if (!destino) return;

    const localidad = document.getElementById('localidad').value || 'No especificada';
    const comboTipo = document.getElementById('tipo-centro');
    const tipoCentro = comboTipo.options[comboTipo.selectedIndex]?.text || '';
    const fecha = new Date().toLocaleDateString('es-ES');

    const buildHTMLList = (dataArray) => {
        if (dataArray.length === 0) return '<p><em>No se han seleccionado opciones para este apartado.</em></p>';
        let html = '<ul>';
        dataArray.forEach(item => {
            html += `<li><strong>${escapeHTML(item.titulo)}</strong>`;
            if (
    item.subItems.length > 0 ||
    item.extraText.length > 0
) {

    html += `<ul>`;

    item.subItems.forEach(sub =>
        html += `<li>${escapeHTML(sub)}</li>`
    );

item.extraText.forEach(texto =>
    html += `<li>${escapeHTML(texto)}</li>`
);

    html += `</ul>`;
}
            html += `</li>`;
        });
        html += '</ul>';
        return html;
    };

    const diagnosticoContextual = obtenerDiagnosticoContextualSeleccionado();
    const anexosDocumento = obtenerAnexosDocumento(diagnosticoContextual);
    const diagnosticoContextualHTML = incluirProtocolo && diagnosticoContextual.resumenes.length
        ? diagnosticoContextual.resumenes.map(item => `
            <h3>${escapeHTML(item.titulo)}</h3>
            ${item.justificaciones.map(justificacion => `<p>${escapeHTML(justificacion)}</p>`).join('')}
        `).join('')
        : incluirProtocolo ? '<p><em>No se han seleccionado condiciones contextuales.</em></p>' : '';
    const anexosHTML = construirAnexosHTML(anexosDocumento);

    const logoDataUrl = await prepararLogoExportacion();
    if (!logoDataUrl) {
        showModal('Error', 'No se pudo cargar el logo de cabecera. Comprueba que logo-jccm.png esté disponible.');
        return;
    }
    const tituloPortada = incluirProtocolo
        ? 'Protocolo para el uso educativo de la inteligencia artificial'
        : 'Anexos de ayuda y fuentes de referencia';
    const imgTag = construirCabeceraWord(logoDataUrl, nombreCentro, localidad, tipoCentro, fecha, tituloPortada);
    const marcadorBloqueLegal = '<!--JCCM_FIXED_LEGAL_CONTENT-->';
    const privacidadSeparada = separarReglasLegalesPrivacidad(recopilarSeccion('.priv-wrapper'));
    const contenidoLegalProtegido = `
        <div>
            <h3>Síntesis normativas fijas y aclaraciones de alcance</h3>
            <p>Este bloque resume obligaciones y aclaraciones normativas; no reproduce literalmente los textos legales. Se conserva sin edición para evitar cambios accidentales. El resto del documento permanece editable.</p>
            ${buildHTMLList(privacidadSeparada.fijas)}
        </div>
    `;

    // Definición de estilos CSS para el documento Word
    const styles = `<style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #45464A; }
        h1 { font-family: 'Montserrat', Arial, sans-serif; color: #183452; font-size: 24px; font-weight: bold; margin-bottom: 5px; font-variant: small-caps; }
        h2 { font-family: 'Montserrat', Arial, sans-serif; color: #305ADA; font-size: 18px; font-weight: bold; border-bottom: 1px solid #E9E9E9; padding-bottom: 4px; margin-bottom: 12px; margin-top: 25px; }
        h3 { font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; font-weight: bold; color: #183452; margin-top: 15px; margin-bottom: 5px; }
        p, div, li { line-height: 1.5; font-size: 11pt; }
        ul { margin-bottom: 10px; margin-top: 5px; }
        strong { font-weight: bold; color: #183452; }
    </style>`;

    const protocoloHTML = `
        <h2>1. Justificación y marco normativo</h2>
        <p>Este documento recoge los criterios del centro para orientar el uso educativo de la inteligencia artificial en sus actividades.</p>

        <h2>2. Diagnóstico contextual</h2>
        ${diagnosticoContextualHTML}
        
        <h2>3. Entornos institucionales y ámbitos de uso</h2>
        <h3>3.1. Modalidades institucionales previstas</h3>
        ${construirModalidadesInstitucionalesHTML()}
        <h3>3.2. Usos por parte del profesorado</h3>
        ${buildHTMLList(recopilarSeccion('.prof-wrapper'))}
        
        <h3>3.3. Usos por parte del alumnado</h3>
        ${buildHTMLList(recopilarSeccion('.alum-wrapper'))}
        
        <h2>4. Normas de uso de IA e integridad académica</h2>
        ${buildHTMLList(recopilarSeccion('.norma-wrapper'))}
        
        <h2>5. Privacidad, seguridad y líneas rojas</h2>
        ${marcadorBloqueLegal}
        <h3>Decisiones y criterios del centro</h3>
        ${buildHTMLList(privacidadSeparada.editables)}
        
        <p style="margin-top:40px;"><strong>Cláusula de revisión:</strong> el centro establecerá la periodicidad y el órgano responsable de revisar este documento conforme a sus normas de organización y competencias.${obtenerTextoRecomendacionRevisionProtocolo()}</p>
        
        <table style="width: 100%; text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <tr>
                <td style="width: 50%;"><strong>V.º B.º La dirección del centro</strong></td>
                <td style="width: 50%;"><strong>Coordinación de formación y transformación digital</strong></td>
            </tr>
            <tr>
                <td style="height: 70px; vertical-align: bottom;">Fdo: _________________________</td>
                <td style="height: 70px; vertical-align: bottom;">Fdo: _________________________</td>
            </tr>
        </table>
        
        <p style="text-align: center;"><em>Órgano competente y fecha de aprobación (cuando corresponda): ____________________  ____/____/202__</em></p>
        <p style="text-align: center;">[Sello del centro]</p>

        <p style="margin-top: 20px;">${escapeHTML(PROTOCOL_SCOPE_NOTICE)}</p>
    `;
    const docHTML = incluirProtocolo ? protocoloHTML : anexosHTML;

    const tituloDocumento = incluirProtocolo ? 'Protocolo IA' : 'Anexos de ayuda IA';
    const finalHtml = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>${tituloDocumento}</title>${styles}</head><body>${imgTag}${docHTML}${construirDisclaimerWord(incluirProtocolo)}</body></html>`;
    
    try {
        const opcionesDocx = { orientation: 'portrait', margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 } };
        const converted = incluirProtocolo
            ? await crearBlobDocxConBloqueProtegido(finalHtml, marcadorBloqueLegal, contenidoLegalProtegido, opcionesDocx)
            : htmlDocx.asBlob(finalHtml, opcionesDocx);
        const resultado = await guardarBlobArchivo(converted, nombreArchivo, destino);
        if (resultado.estado === 'guardado') {
            const tipoGuardado = incluirProtocolo ? 'Protocolo Word' : 'Anexos de ayuda en Word';
            showModal('Guardado completado', `${tipoGuardado} guardado como "${resultado.nombre}".`);
        }
    } catch(e) {
        console.error(e);
        showModal('Error', incluirProtocolo ? 'No se pudo generar el protocolo Word.' : 'No se pudieron generar los anexos en Word.');
    }
    };

    await confirmarGeneracionWord();
}

async function generarAnexosDocumentoWord() {
    await generarDocumentoWord(false);
}

const exportModule = {
    bibliografiaContextualPorTipologia,
    referenciaGuiaINTEF,
    justificacionBibliograficaGeneral,
    orientacionesPaso2PorTipologia,
    aperturaGuiaProfesoradoPorTipologia,
    orientacionesGuiaAlumnadoPorTipologia,
    orientacionesLenguajeSencilloPorEdad,
    orientacionesLenguajeSencilloAlumnadoPorTipologia,
    aperturaGuiaAlumnadoPorTipologia,
    aperturaLenguajeSencilloAlumnadoPorTipologia,
    orientacionesPaso2PorEdad,
    fuentesBibliograficasAPA7,
    inicioFuenteBibliografica,
    REGLAS_LEGALES_PRIVACIDAD,
    escapeHTML,
    separarMencionesBibliograficas,
    resolverFuenteBibliografica,
    construirCitaAPA,
    ordenarReferenciasAPA,
    construirAnexoBibliografia,
    construirNarrativaBibliografia,
    construirBibliografiaPDF,
    construirBibliografiaHTML,
    obtenerTipoCentroNormalizado,
    obtenerBibliografiaContextualPorTipologia,
    obtenerJustificacionBibliograficaPorTipologia,
    prepararLogoExportacion,
    construirCabeceraPDF,
    construirCabeceraWord,
    construirEncabezadoPDF,
    construirPiePDF,
    construirDisclaimerWord,
    crearBlobPDF,
    crearBlobDocxConBloqueProtegido,
    recopilarSeccion,
    separarReglasLegalesPrivacidad,
    listarModalidadesInstitucionales,
    construirModalidadesInstitucionalesPDF,
    construirModalidadesInstitucionalesHTML,
    incorporarContextoPenitenciario,
    obtenerDiagnosticoContextualSeleccionado,
    obtenerAnexosDocumento,
    numeroRomano,
    construirAnexosPDF,
    construirAnexosHTML,
    generarPDF,
    obtenerTextoRecomendacionRevisionProtocolo,
    generarDocumentoWord,
    generarAnexosDocumentoWord
};

global.JCCM_ProtocoloIA = global.JCCM_ProtocoloIA || {};
global.JCCM_ProtocoloIA.export = exportModule;
const scopeNoticeKey = 'PROTOCOL_' + 'SCOPE_NOTICE';
exportModule[scopeNoticeKey] = PROTOCOL_SCOPE_NOTICE;
Object.assign(global, exportModule);

if (typeof window !== 'undefined' && window !== global) {
    window.JCCM_ProtocoloIA = window.JCCM_ProtocoloIA || {};
    window.JCCM_ProtocoloIA.export = exportModule;
    Object.assign(window, exportModule);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportModule;
}
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this)));
