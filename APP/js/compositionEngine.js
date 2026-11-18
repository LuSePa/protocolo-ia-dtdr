(function (global) {
    'use strict';

    // =========================================================================
    // Catálogo de Protocolos Base por Tipología de Centro (11 tipologías activas)
    // =========================================================================
    const PROTOCOLOS_BASE_TIPOLOGIA = {
        escuela_infantil: {
            id: 'escuela_infantil',
            nombre: 'Escuela Infantil (0-3 años)',
            etapa: 'primer ciclo de educación infantil',
            permiteUsoAlumnado: false,
            enfoquePedagogico: 'La inteligencia artificial no se utiliza directamente con el alumnado de 0 a 3 años. Su aplicación se circunscribe en exclusiva a la labor preparatoria, organizativa y de diseño pedagógico del equipo docente, así como a la comunicación periódica y contextualizada con las familias.',
            justificacionBase: 'En el primer ciclo de educación infantil, el protagonismo recae en la experiencia sensible, el apego, el juego y la interacción personal. Las herramientas digitales y de IA actúan como soporte técnico para la planificación docente y la gestión de recursos visuales, respetando de manera absoluta la imagen, intimidad y datos personales de los niños y niñas.',
            orientacionProfesorado: 'El personal docente emplea la IA para generar propuestas de actividades sensoriales, organizar rutinas del aula y redactar comunicaciones claras a las familias. En ningún caso se introducen nombres reales, fotografías, informes de desarrollo ni datos de salud o alimentación en herramientas externas de IA.',
            orientacionAlumnado: null,
            criteriosEvaluacionEIntegridad: 'La evaluación en este ciclo es formativa, cualitativa y continua, basada en la observación directa y el seguimiento de hitos madurativos por parte del equipo educativo. La IA no interviene en la valoración del desarrollo del menor.',
            salvaguardasEspecificas: [
                'Prohibición expresa de subir o procesar imágenes, vídeos o audios de menores de tres años en servicios de IA.',
                'Los informes pedagógicos y hojas de seguimiento evolutivo se elaboran íntegramente por las educadoras y educadores del centro.',
                'La información y orientación a las familias se canaliza a través de los medios habituales del centro, con transparencia sobre el carácter auxiliar de cualquier material diseñado con apoyo tecnológico.'
            ]
        },
        ceip: {
            id: 'ceip',
            nombre: 'Colegio de Educación Infantil y Primaria (CEIP / CRA)',
            etapa: 'segundo ciclo de educación infantil y educación primaria',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'La IA se introduce como objeto de comprensión y con mediación docente permanente. Se prioriza el desarrollo del pensamiento crítico, la alfabetización digital básica y la comprensión guiada de cómo funcionan los sistemas computacionales, evitando el uso autónomo no tutelado.',
            justificacionBase: 'En las etapas de infantil y primaria, la integración de la IA acompaña el desarrollo madurativo del alumnado. La mediación docente es preceptiva en toda experiencia de aula: las herramientas se emplean bajo supervisión directa para favorecer la curiosidad, la creatividad guiada y la resolución colectiva de problemas.',
            orientacionProfesorado: 'El profesorado selecciona recursos adaptados al nivel del grupo y diseña situaciones de aprendizaje donde la IA asiste en la explicación o dinamización, sin reemplazar las destrezas de lectoescritura, cálculo, investigación y expresión personal.',
            orientacionAlumnado: 'El alumnado utiliza herramientas de IA siempre siguiendo las indicaciones del profesorado, sin crear cuentas individuales y aprendiendo a contrastar cualquier respuesta antes de darla por válida.',
            criteriosEvaluacionEIntegridad: 'La evaluación valora el proceso de aprendizaje, las explicaciones orales y las producciones auténticas en el aula. Si una actividad incluye apoyo de IA, se incentiva que el alumnado cuente en qué le ha ayudado la herramienta con sus propias palabras.',
            salvaguardasEspecificas: [
                'Supervisión docente presencial en todas las actividades que utilicen entornos de IA.',
                'No se exige ni promueve el registro individual en plataformas comerciales a menores de 14 años sin la habilitación legal o mediación del centro.',
                'Información clara a las familias sobre las actividades programadas y los criterios pedagógicos aplicados.'
            ]
        },
        cee: {
            id: 'cee',
            nombre: 'Centro de Educación Especial (CEE)',
            etapa: 'educación especial y programas de transición a la vida adulta',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'La inteligencia artificial se concibe como tecnología de apoyo a la inclusión, la comunicación aumentativa y alternativa (CAA), la estimulación multisensorial y la adaptación de materiales para responder a necesidades educativas de apoyo intensivo.',
            justificacionBase: 'En los centros de educación especial, la IA se orienta a eliminar barreras de aprendizaje y comunicación. Cada intervención se personaliza en el marco del Diseño Universal para el Aprendizaje (DUA) y de los planes de trabajo individuales, salvaguardando de forma estricta la intimidad del alumnado.',
            orientacionProfesorado: 'Los equipos multidisciplinares emplean la IA para adaptar pictogramas, generar narraciones accesibles en lectura fácil, modelar apoyos comunicativos y preparar materiales multisensoriales, sin alimentar herramientas con diagnósticos clínicos o informes psicopedagógicos.',
            orientacionAlumnado: 'El alumnado interactúa con aplicaciones adaptadas a sus necesidades motoras, cognitivas o sensoriales, como facilitadoras de la comunicación, la autonomía y la participación activa.',
            criteriosEvaluacionEIntegridad: 'La evaluación se basa en el progreso individual, la adquisición de competencias funcionales y el grado de autonomía alcanzado, de acuerdo con los criterios del equipo docente y orientador.',
            salvaguardasEspecificas: [
                'Protección reforzada de datos relativos a salud, discapacidad, necesidades educativas y situación familiar.',
                'Uso de herramientas de accesibilidad validadas por el centro o la Consejería.',
                'Prioridad de la interacción humana y el acompañamiento afectivo en todas las experiencias educativas.'
            ]
        },
        ies: {
            id: 'ies',
            nombre: 'Instituto de Educación Secundaria (IES / SIES / SESO)',
            etapa: 'educación secundaria obligatoria, bachillerato y formación profesional',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Promoción de la autonomía reflexiva, el pensamiento crítico, la alfabetización informacional y la integridad académica. Se aborda el análisis de sesgos, el impacto ético y medioambiental de los modelos y el uso ético y transparente de la tecnología.',
            justificacionBase: 'En la educación secundaria y el bachillerato, la IA es tanto una herramienta de apoyo al estudio como un objeto de análisis crítico. El protocolo orienta al alumnado a distinguir entre la generación algorítmica y la elaboración propia, preparando a los jóvenes para un ejercicio ciudadano consciente y responsable.',
            orientacionProfesorado: 'El profesorado orienta el uso de la IA hacia la investigación, el contraste de fuentes, la retroalimentación formativa y el aprendizaje competencial, diversificando los instrumentos de evaluación para verificar la comprensión real.',
            orientacionAlumnado: 'El alumnado declara de forma transparente el uso de IA cuando proceda, cita adecuadamente las fuentes consultadas, contrasta las respuestas y asume la responsabilidad de la autoría final de sus trabajos.',
            criteriosEvaluacionEIntegridad: 'Los criterios de evaluación priorizan la resolución presencial, los debates, las exposiciones orales, el razonamiento y la capacidad de contrastar información frente al mero producto textual o digital.',
            salvaguardasEspecificas: [
                'Diferenciación del régimen de madurez y consentimiento en la frontera de los 14 años conforme a la normativa vigente.',
                'Protocolo de transparencia en tareas y proyectos: indicación de herramientas utilizadas y propósito de la consulta.',
                'Regulación del uso de dispositivos personales alineada con las normas de convivencia del centro y la Orden 104/2026.'
            ]
        },
        fp: {
            id: 'fp',
            nombre: 'Centro Integrado de Formación Profesional y Centros con FP (CIFP / FP)',
            etapa: 'formación profesional (grado básico, medio, superior y cursos de especialización)',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Aplicación profesionalizante, alineada con las demandas y perfiles de los sectores productivos de Castilla-La Mancha. Énfasis en la eficiencia técnica, el secreto profesional, la ética laboral y la preparación para la formación profesional dual.',
            justificacionBase: 'En la formación profesional, el protocolo prepara al futuro personal técnico y especialista en el manejo de soluciones de IA propias de cada familia profesional. Se enfatiza el valor del criterio humano experto, la seguridad en el tratamiento de procesos industriales o comerciales y el cumplimiento de normativas de calidad y confidencialidad.',
            orientacionProfesorado: 'El profesorado vincula el uso de la IA a casos de estudio reales, resolución de problemas técnicos, diseño de procesos y optimización de flujos de trabajo, contextualizando las limitaciones y riesgos del sector productivo correspondiente.',
            orientacionAlumnado: 'El alumnado aplica la IA con rigor técnico y deontológico, contrastando siempre los resultados con la normativa técnica del sector y respetando la confidencialidad de la información y de los entornos de trabajo en empresas colaboradoras.',
            criteriosEvaluacionEIntegridad: 'La evaluación se centra en la ejecución técnica práctica, el diagnóstico de averías o procesos, la defensa de proyectos y la justificación argumentada de las decisiones tomadas en contextos profesionales simulados o reales.',
            salvaguardasEspecificas: [
                'Prohibición de compartir secretos industriales, datos comerciales o procesos confidenciales de empresas colaboradoras en plataformas de IA públicas.',
                'Alineación de los proyectos de FP Dual con los acuerdos de confidencialidad y gobernanza del centro y la empresa.',
                'Verificación de autoría mediante pruebas de desempeño práctico y proyectos aplicados en talleres y laboratorios.'
            ]
        },
        eoi: {
            id: 'eoi',
            nombre: 'Escuela Oficial de Idiomas (EOI)',
            etapa: 'enseñanzas de idiomas de régimen especial (niveles A1 a C2)',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Práctica lingüística comunicativa, inmersión auditiva y textual, enriquecimiento de vocabulario y precisión gramatical. Se delimita el uso de traducción y generación automática para que no suplante la producción propia ni el desarrollo de la competencia comunicativa real.',
            justificacionBase: 'En las enseñanzas de idiomas, la IA ofrece oportunidades de interacción conversacional y modelado lingüístico. El protocolo orienta su uso para afianzar la comprensión y expresión, evitando que las herramientas de traducción automatizada reemplacen el esfuerzo reflexivo y la fluidez comunicativa del estudiante.',
            orientacionProfesorado: 'El profesorado aprovecha la IA para generar actividades de comprensión lectora, textos graduados por nivel del MCERL y ejercicios contextualizados, reforzando en el aula la interacción oral espontánea y la mediación lingüística.',
            orientacionAlumnado: 'El alumnado emplea la IA como interlocutor para practicar estructuras o resolver dudas de léxico, pero redacta sus composiciones y prepara sus intervenciones orales a partir de su propio repertorio lingüístico.',
            criteriosEvaluacionEIntegridad: 'Las pruebas de certificación y las actividades evaluables ponderan de manera determinante la interacción oral cara a cara, la producción escrita presencial y la espontaneidad comunicativa.',
            salvaguardasEspecificas: [
                'En tareas de producción escrita, delimitación explícita de cuándo se permite la consulta a correctores o asistentes y cuándo se exige producción sin ayuda externa.',
                'Supervisión del profesorado ante posibles sesgos culturales, dialectales o de registro en los modelos lingüísticos.',
                'Cumplimiento de las instrucciones de convocatoria para pruebas de certificación oficiales.'
            ]
        },
        cepa: {
            id: 'cepa',
            nombre: 'Centro de Educación de Personas Adultas (CEPA)',
            etapa: 'educación de personas adultas y aprendizaje a lo largo de la vida',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Alfabetización digital inclusiva, superación de brechas tecnológicas, autonomía personal y mejora de la empleabilidad y de la participación ciudadana.',
            justificacionBase: 'En los centros de educación de personas adultas, la IA se enfoca a reducir la brecha digital y a potenciar la autonomía del alumnado, adaptándose a trayectorias formativas heterogéneas, situaciones laborales diversas y ritmos de aprendizaje personalizados.',
            orientacionProfesorado: 'El profesorado facilita un acercamiento sereno, accesible y práctico a las tecnologías de IA, fomentando la autoconfianza digital y orientando el aprendizaje hacia necesidades cotidianas, académicas o laborales.',
            orientacionAlumnado: 'El alumnado aprende a utilizar las herramientas de IA con seguridad, identificando desinformación, protegiendo sus datos personales y aprovechando las tecnologías para su desarrollo formativo o laboral.',
            criteriosEvaluacionEIntegridad: 'La evaluación es continua, flexible y formativa, reconociendo el esfuerzo de autoaprendizaje, la aplicación funcional de competencias y la evolución individual.',
            salvaguardasEspecificas: [
                'Garantía de alternativas analógicas y atención presencial personalizada para el alumnado en proceso de alfabetización digital.',
                'Pautas específicas para módulos en aulas penitenciarias con estricta observancia de los protocolos de seguridad penitenciaria y desconexión.',
                'Protección de datos y respeto a las circunstancias personales o laborales del alumnado adulto.'
            ]
        },
        esad: {
            id: 'esad',
            nombre: 'Escuela Superior de Arte Dramático (ESAD)',
            etapa: 'enseñanzas artísticas superiores de arte dramático',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Investigación dramatúrgica, exploración textual, escenografía virtual y experimentación escénica. Se sitúa el cuerpo, la presencia viva y la voz humana como el centro irreemplazable del hecho teatral.',
            justificacionBase: 'En la formación teatral superior, la IA constituye un recurso complementario para la investigación y la conceptualización escénica. El protocolo delimita su función instrumental, asegurando que la dramaturgia viva, la verdad actoral y el proceso colectivo de puesta en escena sigan siendo el núcleo de la creación artística.',
            orientacionProfesorado: 'El profesorado guía la indagación dramatúrgica con IA para la búsqueda de referentes, análisis estilísticos o diseño de espacios escénicos, exigiendo en todo momento una fundamentación estética y conceptual propia.',
            orientacionAlumnado: 'El alumnado puede experimentar con la IA en fases previas de documentación o generación de disparadores creativos, manteniendo la plena autoría de sus textos, propuestas de dirección e interpretaciones escénicas.',
            criteriosEvaluacionEIntegridad: 'La evaluación se asienta en la interpretación corporal y vocal, los talleres prácticos, la dirección de actores y la coherencia del proyecto artístico personal ante el tribunal o público.',
            salvaguardasEspecificas: [
                'Transparencia en el uso de IA en proyectos de dramaturgia, dirección de escena o escenografía.',
                'Respeto a la propiedad intelectual de obras teatrales preexistentes y derechos morales de autoría.',
                'Protección del espacio de ensayo como ámbito de experimentación seguro e íntimo.'
            ]
        },
        easd_ea: {
            id: 'easd_ea',
            nombre: 'Escuela de Arte y Superior de Diseño (EASD / EA)',
            etapa: 'enseñanzas profesionales de artes plásticas y diseño y enseñanzas artísticas superiores de diseño',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Cultura visual contemporánea, experimentación plástica, diseño responsable y deontología creativa. Se aborda la propiedad intelectual, el valor de la artesanía y el diseño original frente a la generación algorítmica de imágenes.',
            justificacionBase: 'En las escuelas de arte y superiores de diseño, el protocolo equilibra la incorporación de los nuevos flujos de trabajo generativos con la defensa de la autoría original, la reflexión conceptual y el dominio de las técnicas manuales, plásticas y proyectuales.',
            orientacionProfesorado: 'El profesorado promueve el pensamiento proyectual crítico, orientando la IA hacia fases exploratorias de lluvia de ideas o contraste de estilos, priorizando siempre la coherencia gráfica, formal y funcional desarrollada por el estudiante.',
            orientacionAlumnado: 'El alumnado documenta su proceso creativo, diferencia la inspiración de la copia algorítmica, declara los elementos generados sintéticamente y respeta los derechos de propiedad intelectual de creadores y creadoras.',
            criteriosEvaluacionEIntegridad: 'La evaluación premia el proceso proyectual, los bocetos manuales, las memorias de diseño, la coherencia formal y la viabilidad técnica y conceptual de la obra o producto final.',
            salvaguardasEspecificas: [
                'Obligación de declarar el uso de generadores sintéticos en entregas de proyectos artísticos y carteras de diseño.',
                'Defensa del valor ético y patrimonial de las obras originales y las técnicas artesanales.',
                'Protección de los derechos de autor del propio alumnado en exposiciones y concursos.'
            ]
        },
        edre: {
            id: 'edre',
            nombre: 'Enseñanzas Deportivas de Régimen Especial (EDRE)',
            etapa: 'enseñanzas deportivas de régimen especial',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Rigor metodológico, planificación deportiva, prevención de lesiones y ética en el rendimiento. La tecnología es auxiliar en el análisis cinemático, la biomecánica y el diseño de sesiones formativas, situando la práctica motriz y la interacción humana en el centro.',
            justificacionBase: 'En las enseñanzas deportivas de régimen especial, la formación combina la fundamentación técnico-táctica con la práctica deportiva en pista, campo o medio natural. El protocolo orienta el uso de la IA hacia el análisis de situaciones de juego y la planificación de entrenamientos, asegurando la estricta protección de datos de salud y biométricos del alumnado y deportistas.',
            orientacionProfesorado: 'El profesorado utiliza herramientas de modelado o análisis para ilustrar situaciones tácticas y diseñar planificaciones de entrenamiento, enseñando a contrastar cualquier estimación algorítmica con la práctica motriz y los objetivos formativos de la modalidad.',
            orientacionAlumnado: 'El alumnado emplea la IA como herramienta auxiliar para analizar supuestos técnicos o planificar sesiones, asumiendo que el criterio táctico y la dirección de entrenamientos o grupos requieren observación directa y criterio humano.',
            criteriosEvaluacionEIntegridad: 'La evaluación se basa en demostraciones prácticas en pista o campo, diseño y defensa de sesiones de entrenamiento, resolución de supuestos tácticos y aplicación rigurosa de las normas de seguridad y deontología deportiva.',
            salvaguardasEspecificas: [
                'Protección reforzada de datos de salud, rendimiento físico o biométricos de deportistas, sin introducirlos en plataformas de IA públicas.',
                'Respeto a la imagen e intimidad del alumnado en grabaciones de análisis técnico o biomecánico.',
                'Prevalencia del criterio profesional del personal técnico y docente sobre cualquier prescripción algorítmica.'
            ]
        },
        conservatorio: {
            id: 'conservatorio',
            nombre: 'Conservatorio Profesional y Superior de Música y Danza',
            etapa: 'enseñanzas elementales, profesionales y superiores de música y danza',
            permiteUsoAlumnado: true,
            enfoquePedagogico: 'Interpretación acústica y corporal viva, análisis musicológico y coreográfico, audición activa y creatividad sonora. La tecnología es auxiliar del entrenamiento auditivo y del estudio, situando la interpretación humana en el centro.',
            justificacionBase: 'En los conservatorios, la vivencia del arte reside en la acústica viva, el timbre, la respiración, el gesto y la comunicación emocional con el público. El protocolo previene la sustitución del estudio riguroso del instrumento o la danza, orientando la IA hacia el análisis formal y el acompañamiento didáctico.',
            orientacionProfesorado: 'El profesorado orienta la IA hacia la transcriptoría preliminar, el análisis armónico complementario o la experimentación tímbrica, cuidando que no merme la disciplina del estudio diario ni la afinación y sensibilidad interpretativa.',
            orientacionAlumnado: 'El alumnado puede apoyarse en herramientas interactivas de afinación, análisis o síntesis para su estudio individual, manteniendo la autoría íntegra en la interpretación instrumental y en sus creaciones y arreglos.',
            criteriosEvaluacionEIntegridad: 'La evaluación se realiza mediante audiciones presenciales, recitales públicos, exámenes prácticos de interpretación y defensas orales y escritas de proyectos musicales y coreográficos.',
            salvaguardasEspecificas: [
                'Las audiciones y pruebas de acceso o evaluación se realizan con interpretación en vivo y directa.',
                'Respeto a los derechos de propiedad intelectual en el uso de partituras, grabaciones y software de producción musical.',
                'Cuidado de la salud postural y auditiva en el uso de dispositivos digitales de estudio.'
            ]
        }
    };

    // =========================================================================
    // Catálogo de Fragmentos Condicionales de Salvaguarda
    // =========================================================================
    const FRAGMENTOS_CONDICIONALES = {
        'CARD_AGE-menores_14': {
            id: 'menores_14',
            prioridad: 1,
            categoria: 'proteccion_infancia',
            titulo: 'Salvaguarda para alumnado menor de 14 años',
            clausula: 'El alumnado menor de 14 años interactuará con herramientas de inteligencia artificial exclusivamente bajo la mediación activa y presencial del profesorado, sin necesidad de registro autónomo en plataformas comerciales que requieran datos personales, respetando las orientaciones de la Consejería y la legislación de protección de la infancia.',
            recomendaciones: [
                'Uso de cuentas genéricas de aula o actividades grupales proyectadas.',
                'Información previa a las familias sobre los fines formativos de las actividades con IA.',
                'Priorización de servicios institucionales o herramientas locales que no recopilen identificadores de los menores.'
            ]
        },
        'CARD_VULNERABILITY-aulas_hospitalarias': {
            id: 'aulas_hospitalarias',
            prioridad: 2,
            categoria: 'vulnerabilidad_salud',
            titulo: 'Salvaguarda para atención educativa domiciliaria y hospitalaria',
            clausula: 'En la atención a alumnado convaleciente o ingresado, el uso de la IA se adaptará a su estado de salud y ritmo de recuperación, sirviendo como canal de vinculación con su grupo y de continuidad escolar sin generar sobrecarga cognitiva ni vulnerar el estricto deber de confidencialidad médica.',
            recomendaciones: [
                'Prohibición total de introducir informes clínicos, diagnósticos o datos de salud en herramientas externas de IA.',
                'Coordinación con el equipo docente de referencia del centro de origen.',
                'Flexibilización máxima de tareas y tiempos de respuesta.'
            ]
        },
        'CARD_VULNERABILITY-medidas_proteccion': {
            id: 'medidas_proteccion',
            prioridad: 2,
            categoria: 'vulnerabilidad_menores_protegidos',
            titulo: 'Salvaguarda para menores con medidas de protección',
            clausula: 'En aplicación del artículo 33 de la Ley 7/2023 de Castilla-La Mancha, se reforzará al máximo la reserva sobre datos identificativos, residenciales o de imagen de menores bajo medidas de protección, impidiendo cualquier rastro o filtración en entornos digitales abiertos o predictivos.',
            recomendaciones: [
                'Uso estricto de identificadores anonimizados o seudónimos técnicos.',
                'No publicación de imágenes, audios o producciones que permitan deducir la localización del menor.',
                'Coordinación permanente con los servicios de protección a la infancia.'
            ]
        },
        'CARD_VULNERABILITY-educacion_especial': {
            id: 'educacion_especial_apoyo',
            prioridad: 2,
            categoria: 'vulnerabilidad_apoyo_intensivo',
            titulo: 'Salvaguarda de apoyo educativo intensivo y datos psicopedagógicos',
            clausula: 'Los datos psicopedagógicos, dictámenes de escolarización e informes de evaluación psicopedagógica gozan de la consideración de información de especial sensibilidad y no serán introducidos en sistemas de inteligencia artificial externos, restringiéndose su tratamiento a los sistemas oficiales autorizados por la Consejería.',
            recomendaciones: [
                'Uso de perfiles sintéticos o supuestos teóricos sin datos reales para la preparación de adaptaciones.',
                'Validación de la accesibilidad cognitiva y sensorial de los recursos generados.',
                'Prevalencia de las decisiones del equipo de orientación y profesorado especialista.'
            ]
        },
        'CARD_VULNERABILITY-medidas_judiciales': {
            id: 'medidas_judiciales',
            prioridad: 2,
            categoria: 'vulnerabilidad_judicial',
            titulo: 'Salvaguarda para menores sujetos a medidas judiciales',
            clausula: 'En centros y programas con alumnado sujeto a medidas judiciales, la actividad formativa con tecnologías digitales se regirá por la estricta observancia de los regímenes de comunicación y supervisión judicialmente establecidos, garantizando la reinserción social y la protección de su identidad.',
            recomendaciones: [
                'Supervisión individualizada de las sesiones con herramientas digitales.',
                'Prohibición de acceso a redes sociales o herramientas que permitan comunicaciones no autorizadas.',
                'Registro y custodia segura de los equipos y soportes utilizados.'
            ]
        },
        'CARD_RURAL-entorno_rural': {
            id: 'entorno_rural_equidad',
            prioridad: 4,
            categoria: 'equidad_territorial',
            titulo: 'Garantía de equidad digital en el entorno rural',
            clausula: 'En centros rurales agrupados (CRA) y localidades de dispersión geográfica, el centro asegurará que ninguna actividad pedagógica que emplee IA penalice al alumnado con dificultades de acceso, garantizando siempre vías formativas alternativas plenamente equivalentes.',
            recomendaciones: [
                'Disponibilidad de recursos en el centro educativo durante el horario escolar.',
                'Alternativas formativas analógicas o con software local sin dependencia de conexión de banda ancha.',
                'Flexibilidad en los plazos de entrega y coordinación entre secciones del CRA.'
            ]
        },
        'CARD_RURAL-conectividad': {
            id: 'conectividad_limitada',
            prioridad: 4,
            categoria: 'brecha_conectividad',
            titulo: 'Alternativas ante limitaciones de conectividad',
            clausula: 'Cuando las condiciones de telecomunicaciones condicionen el uso de servicios en la nube, el centro priorizará el despliegue de modelos locales en dispositivos del centro o actividades de desconexión reflexiva sobre IA (unplugged computing).',
            recomendaciones: [
                'Uso de bancos de recursos descargados previamente.',
                'Actividades de lógica algorítmica y pensamiento computacional desconectado.',
                'Evitar tareas obligatorias fuera del centro que requieran conexión continua a modelos de lenguaje.'
            ]
        },
        'CARD_GOVERNANCE-fp_dual': {
            id: 'fp_dual_gobernanza',
            prioridad: 5,
            categoria: 'gobernanza_empresarial',
            titulo: 'Coordinación y secreto profesional en FP Dual y empresas',
            clausula: 'En los proyectos formativos desarrollados en alternancia con empresas (FP Dual), el alumnado y profesorado tutor observarán rigurosamente el deber de confidencialidad y secreto profesional, no introduciendo código fuente, planos, datos de clientes ni procesos internos de la empresa en herramientas de IA sin autorización expresa de la misma.',
            recomendaciones: [
                'Inclusión de cláusulas de confidencialidad y uso de IA en los convenios de colaboración con las empresas.',
                'Sensibilización previa del alumnado sobre propiedad intelectual e industrial en el sector productivo.',
                'Supervisión del profesorado tutor sobre los proyectos de fin de ciclo elaborados con datos empresariales.'
            ]
        },
        'aula_penitenciaria': {
            id: 'aula_penitenciaria_seguridad',
            prioridad: 2,
            categoria: 'seguridad_penitenciaria',
            titulo: 'Régimen de seguridad y desconexión en aulas penitenciarias',
            clausula: 'De conformidad con el Real Decreto 1203/1999 y las instrucciones de la Dirección General de Instituciones Penitenciarias, en las aulas ubicadas en centros penitenciarios las actividades formativas relacionadas con la IA se desarrollarán bajo la premisa de ausencia de conexión directa y no supervisada a la red Internet, utilizándose simulaciones locales o materiales analíticos bajo custodia de la dirección del centro penitenciario.',
            recomendaciones: [
                'Prohibición absoluta de dispositivos con conectividad autónoma exterior.',
                'Revisión previa por el equipo docente de cualquier soporte o software educativo introducido en el módulo.',
                'Coordinación técnica estrecha con los responsables de seguridad de la institución penitenciaria.'
            ]
        }
    };

    // =========================================================================
    // Conexión de Semillas Preexistentes del Catálogo
    // =========================================================================
    function extraerSemillasDeCatalogo(cardCatalog, selectedConditions) {
        if (!cardCatalog) return { clausulas: [], anexos: [], bibliografia: [] };

        const clausulas = [];
        const anexos = [];
        const bibliografia = [];
        const cardsProcesadas = new Set();

        const selectedKeys = selectedConditions instanceof Set
            ? selectedConditions
            : new Set(Object.entries(selectedConditions || {}).filter(([, v]) => v).map(([k]) => k));

        selectedKeys.forEach((key) => {
            const cardId = key.split('-')[0];
            if (cardsProcesadas.has(cardId)) return;
            cardsProcesadas.add(cardId);

            const card = cardCatalog[cardId];
            if (!card) return;

            if (card.protocolClauseText) {
                clausulas.push({
                    cardId,
                    titulo: card.title || cardId,
                    texto: card.protocolClauseText
                });
            }
            if (Array.isArray(card.recommendedAnnexes)) {
                anexos.push(...card.recommendedAnnexes);
            }
            if (Array.isArray(card.recommendedBibliography)) {
                bibliografia.push(...card.recommendedBibliography);
            }
        });

        return {
            clausulas,
            anexos: [...new Set(anexos)],
            bibliografia: [...new Set(bibliografia)]
        };
    }

    // =========================================================================
    // Normalizador de Tipología de Centro
    // =========================================================================
    function normalizarTipoCentro(tipo) {
        if (!tipo) return 'ies';
        const str = String(tipo).toLowerCase().trim();
        if (str.includes('infantil')) return 'escuela_infantil';
        if (str.includes('ceip') || str.includes('primaria') || str.includes('cra')) return 'ceip';
        if (str.includes('cee') || str.includes('especial')) return 'cee';
        if (str.includes('fp') || str.includes('cifp') || str.includes('formación profesional')) return 'fp';
        if (str.includes('eoi') || str.includes('idiomas')) return 'eoi';
        if (str.includes('cepa') || str.includes('adultos')) return 'cepa';
        if (str.includes('esad') || str.includes('dramático')) return 'esad';
        if (str.includes('easd') || str.includes('arte y superior') || str.includes('escuela de arte')) return 'easd_ea';
        if (str.includes('conservatorio') || str.includes('música') || str.includes('danza')) return 'conservatorio';
        if (str.includes('edre') || str.includes('deportiv') || str.includes('restauración')) return 'edre';
        return 'ies';
    }

    // =========================================================================
    // Deduplicador y depurador semántico de textos
    // =========================================================================
    function deduplicarTextos(arrayDeTextos) {
        const vistos = new Set();
        const resultado = [];

        (arrayDeTextos || []).forEach(item => {
            if (!item) return;
            const texto = typeof item === 'string' ? item.trim() : (item.texto || item.clausula || '').trim();
            if (!texto) return;

            const claveNormalizada = texto.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/gi, '');
            if (!vistos.has(claveNormalizada)) {
                vistos.add(claveNormalizada);
                resultado.push(item);
            }
        });

        return resultado;
    }

    // =========================================================================
    // Motor Principal de Composición Modular
    // =========================================================================
    function ensamblarProtocoloModulable(opciones) {
        const config = opciones || {};
        const tipoClave = normalizarTipoCentro(config.tipoCentro);
        const baseTipologia = PROTOCOLOS_BASE_TIPOLOGIA[tipoClave] || PROTOCOLOS_BASE_TIPOLOGIA.ies;

        const contextoSeleccionado = config.contextoSeleccionado || {};
        const selectedSet = contextoSeleccionado instanceof Set
            ? contextoSeleccionado
            : new Set(Object.entries(contextoSeleccionado).filter(([, v]) => v).map(([k]) => k));

        const cardCatalog = config.cardCatalog || (global.JCCM_ProtocoloIA && global.JCCM_ProtocoloIA.catalog) || global.cardCatalog || {};
        const semillas = extraerSemillasDeCatalogo(cardCatalog, selectedSet);

        // 1. Detección y resolución ordenada de fragmentos condicionales
        const fragmentosActivos = [];
        Object.entries(FRAGMENTOS_CONDICIONALES).forEach(([claveCondicion, fragmento]) => {
            let activa = false;
            if (claveCondicion === 'aula_penitenciaria') {
                activa = tipoClave === 'cepa' && (selectedSet.has('aula_penitenciaria') || contextoSeleccionado.aula_penitenciaria === true);
            } else {
                activa = selectedSet.has(claveCondicion);
            }

            if (activa) {
                fragmentosActivos.push(fragmento);
            }
        });

        // Ordenación de fragmentos por prioridad determinista
        fragmentosActivos.sort((a, b) => a.prioridad - b.prioridad);

        // 2. Construcción de Secciones Modulares

        // SECCIÓN 1: Justificación y Marco Normativo
        const bloquesJustificacion = [
            {
                tipo: 'comun',
                titulo: 'Objeto y finalidad del protocolo',
                contenido: 'El presente protocolo tiene por objeto definir las directrices organizativas, pedagógicas y éticas que rigen el uso educativo de los sistemas de inteligencia artificial en el centro, asegurando el respeto a los derechos fundamentales, la protección de la privacidad y el fomento de una ciudadanía digital crítica y responsable.'
            },
            {
                tipo: 'base_tipologia',
                titulo: `Marco pedagógico adaptado a ${baseTipologia.nombre}`,
                contenido: baseTipologia.justificacionBase
            },
            {
                tipo: 'comun',
                titulo: 'Naturaleza institucional y de apoyo al centro',
                contenido: 'Este documento constituye un borrador de trabajo institucional que el centro adapta y somete a los cauces de deliberación de sus órganos colegiados de gobierno y de coordinación docente, integrándose de forma armónica en las Normas de Organización, Funcionamiento y Convivencia (NOFC) y en el Plan Digital de Centro (PDC).'
            }
        ];

        // SECCIÓN 2: Diagnóstico Contextual y Cláusulas de Salvaguarda
        const bloquesDiagnostico = [];

        // Inyección de semillas del catálogo
        if (semillas.clausulas.length > 0) {
            bloquesDiagnostico.push({
                tipo: 'semilla_catalogo',
                titulo: 'Principios institucionales derivados del diagnóstico contextual',
                clausulas: semillas.clausulas.map(c => ({ titulo: c.titulo, texto: c.texto }))
            });
        }

        // Inyección de fragmentos condicionales activos
        if (fragmentosActivos.length > 0) {
            bloquesDiagnostico.push({
                tipo: 'fragmentos_condicionales',
                titulo: 'Medidas y salvaguardas específicas del centro',
                fragmentos: fragmentosActivos.map(f => ({
                    id: f.id,
                    titulo: f.titulo,
                    clausula: f.clausula,
                    recomendaciones: f.recomendaciones
                }))
            });
        } else {
            bloquesDiagnostico.push({
                tipo: 'comun',
                titulo: 'Medidas generales del centro',
                contenido: 'El centro no ha seleccionado condiciones singulares de vulnerabilidad, dispersión geográfica o regímenes especiales, aplicando el marco garantista ordinario establecido por la Consejería de Educación, Cultura y Deportes.'
            });
        }

        // SECCIÓN 3: Entornos Institucionales y Ámbitos de Uso
        const bloquesEntornos = [
            {
                tipo: 'comun',
                titulo: 'Criterio institucional de acceso y servicios',
                contenido: 'El centro promueve prioritariamente el uso de servicios corporativos dotados de garantías de seguridad y acuerdos de protección de datos suscritos por la administración educativa regional, como Microsoft Copilot mediante cuenta institucional de la Consejería en los perfiles autorizados.'
            },
            {
                tipo: 'base_tipologia',
                titulo: `Ámbitos de uso docente en ${baseTipologia.nombre}`,
                contenido: baseTipologia.orientacionProfesorado
            }
        ];

        if (baseTipologia.permiteUsoAlumnado && baseTipologia.orientacionAlumnado) {
            bloquesEntornos.push({
                tipo: 'base_tipologia',
                titulo: `Pautas orientativas para el alumnado en ${baseTipologia.nombre}`,
                contenido: baseTipologia.orientacionAlumnado
            });
        }

        // SECCIÓN 4: Normas de Uso e Integridad Académica
        const bloquesNormas = [
            {
                tipo: 'base_tipologia',
                titulo: 'Enfoque de evaluación y verificación del aprendizaje',
                contenido: baseTipologia.criteriosEvaluacionEIntegridad
            },
            {
                tipo: 'comun',
                titulo: 'Transparencia y declaración del uso de IA',
                contenido: 'Cuando una actividad académica o tarea de aprendizaje contemple o permita el apoyo de inteligencia artificial, se fomentará que el alumnado declare de manera descriptiva y proporcionada en qué ha consistido dicho apoyo, preservando siempre la autoría y comprensión sustantiva de la tarea.'
            }
        ];

        // SECCIÓN 5: Privacidad, Seguridad y Salvaguardas Específicas
        const bloquesPrivacidad = [
            {
                tipo: 'comun_fijo',
                titulo: 'Síntesis normativa y líneas rojas en protección de datos',
                contenido: 'Queda terminantemente prohibido incorporar datos de salud, informes de evaluación psicopedagógica, datos judiciales o cualquier categoría especial de datos personales (art. 9 y 10 RGPD) en sistemas de IA externos. La minimización de datos es preceptiva en todo uso administrativo o didáctico.'
            },
            {
                tipo: 'base_tipologia',
                titulo: `Salvaguardas de privacidad en ${baseTipologia.nombre}`,
                elementos: baseTipologia.salvaguardasEspecificas
            }
        ];

        // SECCIÓN 6: Cláusula de Revisión y Formalización
        const bloquesRevision = [
            {
                tipo: 'comun',
                titulo: 'Cláusula de revisión del protocolo',
                contenido: 'El centro establecerá la periodicidad y el órgano responsable de revisar este documento conforme a sus normas de organización y competencias, recomendándose una revisión anual o con ocasión de cambios tecnológicos sustanciales.'
            },
            {
                tipo: 'formalizacion_firmas',
                firmas: [
                    { cargo: 'V.º B.º La dirección del centro', firmante: 'Fdo.: _________________________' },
                    { cargo: 'Coordinación de formación y transformación digital', firmante: 'Fdo.: _________________________' }
                ],
                organoAprobacion: 'Órgano competente y fecha de aprobación (cuando corresponda): ____________________  ____/____/202__'
            }
        ];

        // 3. Consolidación de Anexos y Bibliografía recomendados
        const anexosRecomendados = deduplicarTextos([
            'ANEXO_GUIA_PROFESORADO',
            ...(baseTipologia.permiteUsoAlumnado ? ['ANEXO_GUIA_ALUMNADO', 'ANEXO_GUIA_ALUMNADO_LENGUAJE_CLARO'] : []),
            ...semillas.anexos,
            ...fragmentosActivos.flatMap(f => f.recomendaciones ? [`ANEXO_SALVAGUARDA_${f.id.toUpperCase()}`] : [])
        ]);

        const bibliografiaRecomendada = deduplicarTextos([
            'Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD), relativo a la protección de datos personales.',
            'Ley Orgánica 3/2018 (LOPDGDD), de Protección de Datos Personales y garantía de los derechos digitales.',
            'Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo, por el que se establecen normas armonizadas en materia de inteligencia artificial.',
            'Guía sobre el uso de la inteligencia artificial en el ámbito educativo (INTEF, 2024).',
            ...semillas.bibliografia,
            ...(tipoClave === 'cepa' && (selectedSet.has('aula_penitenciaria') || contextoSeleccionado.aula_penitenciaria)
                ? ['Real Decreto 1203/1999, por el que se integran en el Cuerpo de Maestros los funcionarios pertenecientes al Cuerpo de Profesores de Educación General Básica de Instituciones Penitenciarias y se regulan las funciones educativas en establecimientos penitenciarios.']
                : [])
        ]);

        return {
            metadatos: {
                tipoCentro: tipoClave,
                nombreTipologia: baseTipologia.nombre,
                etapa: baseTipologia.etapa,
                permiteUsoAlumnado: baseTipologia.permiteUsoAlumnado,
                nombreCentro: config.datosCentro?.nombreCentro || 'Centro sin especificar',
                localidad: config.datosCentro?.localidad || '',
                fechaGeneracion: new Date().toISOString(),
                versionMotor: '2.0-modular'
            },
            secciones: [
                { id: 'justificacion', numero: 1, titulo: '1. Justificación y marco normativo', bloques: bloquesJustificacion },
                { id: 'diagnostico', numero: 2, titulo: '2. Diagnóstico contextual y cláusulas institucionales', bloques: bloquesDiagnostico },
                { id: 'entornos', numero: 3, titulo: '3. Entornos institucionales y ámbitos de uso', bloques: bloquesEntornos },
                { id: 'normas', numero: 4, titulo: '4. Normas de uso e integridad académica', bloques: bloquesNormas },
                { id: 'privacidad', numero: 5, titulo: '5. Privacidad, seguridad y salvaguardas', bloques: bloquesPrivacidad },
                { id: 'revisionYFirmas', numero: 6, titulo: '6. Cláusula de revisión y formalización', bloques: bloquesRevision }
            ],
            anexosRecomendados,
            bibliografiaRecomendada,
            estadisticas: {
                totalSecciones: 6,
                totalBloques: bloquesJustificacion.length + bloquesDiagnostico.length + bloquesEntornos.length + bloquesNormas.length + bloquesPrivacidad.length + bloquesRevision.length,
                totalFragmentosCondicionales: fragmentosActivos.length,
                totalSemillasClausulas: semillas.clausulas.length
            }
        };
    }

    // =========================================================================
    // Exportación UMD compatible con navegador y Node.js
    // =========================================================================
    const compositionModule = {
        PROTOCOLOS_BASE_TIPOLOGIA,
        FRAGMENTOS_CONDICIONALES,
        extraerSemillasDeCatalogo,
        normalizarTipoCentro,
        deduplicarTextos,
        ensamblarProtocoloModulable
    };

    global.JCCM_ProtocoloIA = global.JCCM_ProtocoloIA || {};
    global.JCCM_ProtocoloIA.composition = compositionModule;
    global.compositionEngine = compositionModule;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = compositionModule;
    }
    if (typeof window !== 'undefined' && window !== global) {
        window.JCCM_ProtocoloIA = window.JCCM_ProtocoloIA || {};
        window.JCCM_ProtocoloIA.composition = compositionModule;
        window.compositionEngine = compositionModule;
    }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this)));

