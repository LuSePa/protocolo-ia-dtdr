(function (global) {
    'use strict';

    const cardCatalog = {

    CARD_AGE: {

        id: "CARD_AGE",

        title: "Edad, madurez y capacidad legal del alumnado",

        summary:
            "La edad, la madurez y la capacidad legal del alumnado condicionan cómo se debe informar, supervisar y limitar el uso de la inteligencia artificial.",

        statusLabel:
            "Diagnóstico automático",

        configuration: [

            {
                type: "checkbox",

                label: "Tramos de edad presentes en el centro",

                options: [
                    {
                        id: "menores_14",
                        label: "Alumnado menor de 14 años",
                        description: "En este tramo la interacción es siempre mediada por el profesorado, mediante dinámicas colectivas y sin registro de cuentas personales por parte del alumnado.",
                        consequence: "El protocolo incorporará medidas específicas de acompañamiento digital y protección educativa.",
                        warning: "La autorización familiar debe valorarse caso por caso y no se presume automática para cualquier uso de IA.",
                        annex: "ANEXO_CONSENTIMIENTO_FAMILIAR",
                        bibliography: "LOPDGDD, artículo 7, cuando el consentimiento sea la base jurídica del tratamiento (umbral de 14 años); RGPD, artículo 8, solo cuando el consentimiento sea la base para la oferta directa a menores de servicios de la sociedad de la información; LOPDGDD, artículo 92, para publicación o difusión de datos de menores en esos servicios, con consentimiento específico para redes sociales o equivalentes; Guía INTEF sobre IA en educación, mediación docente íntegra en Infantil y Primaria.",
                        regulatoryBasis: "LOPDGDD, artículo 7, cuando el consentimiento sea la base jurídica del tratamiento (umbral de 14 años); RGPD, artículo 8, solo cuando el consentimiento sea la base para la oferta directa a menores de servicios de la sociedad de la información; LOPDGDD, artículo 92, para publicación o difusión de datos de menores en esos servicios, con consentimiento específico para redes sociales o equivalentes.",
                        justification: "El centro cuenta con alumnado menor de 14 años. Según los usos previstos, el protocolo puede recoger el acompañamiento y las medidas de protección que se consideren necesarios."
                    },
                    {
                        id: "edad_14_17",
                        label: "Alumnado de 14 a 17 años",
                        description: "Si el centro prevé que el alumnado utilice IA, puede valorar qué acompañamiento necesita cada actividad y qué requisitos de edad establece la herramienta.",
                        consequence: "El protocolo puede indicar qué acompañamiento e información se prevén para las actividades con IA.",
                        warning: "La autonomía debe valorarse de forma incremental y no automática.",
                        annex: "",
                        bibliography: "LOPDGDD, artículo 7, cuando el tratamiento se base en el consentimiento.",
                        regulatoryBasis: "LOPDGDD, artículo 7, cuando el tratamiento se base en el consentimiento.",
                        justification: "El centro cuenta con alumnado de 14 a 17 años. El protocolo puede recoger el acompañamiento previsto para las actividades con IA."
                    },
                    {
                        id: "18_mas",
                        label: "Alumnado de 18 años o más",
                        description: "Para el alumnado adulto, el centro puede valorar qué herramientas ofrece y qué información personal podría compartirse al utilizarlas.",
                        consequence: "El protocolo puede aclarar qué usos se prevén y cómo se cuida la información personal del alumnado adulto.",
                        warning: "La autonomía personal no elimina la protección de datos ni la responsabilidad institucional.",
                        annex: "",
                        bibliography: "RGPD, artículo 5, principios del tratamiento, y artículo 6, cuya base jurídica se determinará para cada tratamiento.",
                        regulatoryBasis: "RGPD, artículo 5, principios del tratamiento, y artículo 6, cuya base jurídica se determinará para cada tratamiento.",
                        justification: "El centro cuenta con alumnado de 18 años o más. El protocolo puede precisar qué herramientas se ofrecen y qué información personal podría compartirse al utilizarlas."
                    }
                ]
            },


        ],

        consequences: [
            "La base común es que el uso se adapte al desarrollo del alumnado y a la supervisión del profesorado.",
            "El centro debe distinguir entre menores, mayores de edad y casos que requieran protección específica o apoyo reforzado.",
            "La decisión sobre información, autorización o restricciones debe hacerse caso por caso, teniendo en cuenta la herramienta, la actividad y la normativa aplicable."
        ],

        legalBasis: [
            "LOPDGDD, artículo 7: regula el consentimiento de menores cuando esa es la base jurídica del tratamiento.",
            "RGPD, artículo 8: se aplica solo cuando el consentimiento sea la base jurídica para la oferta directa a menores de servicios de la sociedad de la información; la LOPDGDD fija en 14 años el umbral español para prestar ese consentimiento.",
            "LOPDGDD, artículo 92: protege los datos de menores cuando se publican o difunden en servicios de la sociedad de la información; exige consentimiento para redes sociales o servicios equivalentes."
        ],

        warnings: [
            "La autorización familiar no es automática ni universal para cualquier uso de IA con alumnado menor de 14 años.",
            "El uso de la IA no sustituye la supervisión docente ni la responsabilidad institucional del centro.",
            "La información contextual de los usuarios y las condiciones del servicio deben comprobarse antes de exigir un consentimiento o imponer una restricción."
        ],

        recommendedAnnexes: [
            "ANEXO_CONSENTIMIENTO_FAMILIAR, solo cuando la herramienta o la actividad requieran una autorización específica."
        ],

        recommendedBibliography: [
            "Reglamento (UE) 2016/679 (RGPD), artículo 8, solo cuando el consentimiento sea la base jurídica para la oferta directa a menores de servicios de la sociedad de la información; LOPDGDD, artículo 7, umbral español de 14 años cuando el tratamiento se base en consentimiento.",
            "Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales, artículo 7 cuando el tratamiento se base en consentimiento y artículo 92 para publicación o difusión de datos de menores en servicios de la sociedad de la información; consentimiento para redes sociales o equivalentes.",
            "Guía del INTEF sobre inteligencia artificial en educación: uso responsable, protección del alumnado y supervisión docente."
        ],

        protocolClauseText:
            "El uso de herramientas de inteligencia artificial se adaptará a la edad, la madurez y la capacidad legal del alumnado, con la supervisión del profesorado y con medidas de información, autorización o restricción que resulten necesarias conforme a la actividad, la herramienta y la normativa aplicable.",

        editable: true,

        autoDetected: true

    },

    CARD_VULNERABILITY: {

    id: "CARD_VULNERABILITY",

    title:
        "Protección reforzada de datos y alumnado en situación de vulnerabilidad",

    summary:
        "Estas situaciones pueden requerir ajustes en el acceso a herramientas, los apoyos o el cuidado de la información. El protocolo puede reflejar los que sean pertinentes para las actividades del centro.",

    statusLabel:
        "Diagnóstico automático",

    configuration: [

        {
            type: "checkbox",

            label:
                "Situaciones presentes en el centro",

            options: [
                {
                    id: "aulas_hospitalarias",
                    label: "Atención educativa durante hospitalización o convalecencia en el domicilio",
                    description: "Selecciona esta opción si el centro presta o coordina atención educativa durante una hospitalización o convalecencia en el domicilio. El protocolo puede contemplar la continuidad educativa y el cuidado de la información de salud que se utilice.",
                    consequence: "El protocolo podrá recoger pautas para la continuidad educativa y para el cuidado de información de salud cuando se utilice.",
                    warning: "Los datos de salud requieren acceso restringido, minimización y coordinación con el centro sanitario correspondiente.",
                    annex: "ANEXO_PROTECCION_DATOS_ESPECIAL",
                    bibliography: "RGPD, artículos 6 y 9, si se tratan datos de salud: base jurídica y excepción aplicable para categorías especiales; LOPDGDD, artículo 5.",
                    regulatoryBasis: "RGPD, artículos 6 y 9, si se tratan datos de salud: base jurídica y excepción aplicable para categorías especiales; LOPDGDD, artículo 5.",
                    justification: "Si algún uso de IA afecta a la atención educativa durante una hospitalización o convalecencia en el domicilio, el protocolo puede indicar cómo dar continuidad educativa y qué información de salud sería necesaria."
                },
                {
                    id: "medidas_proteccion",
                    label: "Alumnado menor de edad bajo medidas de protección o acogimiento",
                    description: "Selecciona esta opción si hay alumnado menor bajo medidas de protección o acogimiento en el centro. El protocolo puede precisar el acceso a información sobre esa situación y la coordinación necesaria.",
                    consequence: "El protocolo podrá precisar el acceso a información sobre la medida y la coordinación necesaria para los usos educativos relacionados.",
                    warning: "Como pauta interna, compartir la información de protección solo cuando sea necesario y por los canales autorizados por el centro.",
                    annex: "ANEXO_PROTECCION_DATOS_ESPECIAL",
                        bibliography: "Ley 7/2023 de Castilla-La Mancha, artículo 33, actuación sobre acceso a medios telemáticos para menores con medidas de protección; RGPD, artículos 5, 6 y 12 a 14 si se tratan datos personales (principios, base jurídica e información según el origen de los datos); LOPDGDD, artículo 5.",
                        regulatoryBasis: "Ley 7/2023 de Castilla-La Mancha, artículo 33, actuación sobre acceso a medios telemáticos para menores con medidas de protección; RGPD, artículos 5, 6 y 12 a 14 si se tratan datos personales (principios, base jurídica e información según el origen de los datos); LOPDGDD, artículo 5.",
                    justification: "Si un uso de IA requiere consultar información sobre medidas de protección o acogimiento de alumnado menor de edad, el protocolo puede indicar quién podrá acceder a ella y cómo se cuidará."
                },
                {
                    id: "educacion_especial",
                    label: "Alumnado que necesita apoyos intensivos para participar en actividades con IA",
                    description: "Selecciona esta opción si alguien necesita apoyos intensivos de acceso, comunicación o asistencia para participar en actividades con IA. El protocolo puede recoger los apoyos pertinentes sin atribuirlos a todo el alumnado.",
                    consequence: "El protocolo podrá reflejar los apoyos de acceso, comunicación o asistencia pertinentes para cada actividad.",
                    warning: "Como regla preventiva del centro, no introducir información personal o confidencial en herramientas no autorizadas.",
                    annex: "ANEXO_PROTECCION_DATOS_ESPECIAL",
                    bibliography: "RGPD, artículos 6 y 9, si el tratamiento incluye categorías especiales: base jurídica y excepción aplicable; LOPDGDD, artículo 5.",
                    regulatoryBasis: "RGPD, artículos 6 y 9, si el tratamiento incluye categorías especiales: base jurídica y excepción aplicable; LOPDGDD, artículo 5.",
                    justification: "El protocolo puede recoger los apoyos de acceso, comunicación o asistencia necesarios para las actividades con IA, sin atribuirlos al resto del alumnado."
                },
                {
                    id: "medidas_judiciales",
                    label: "Programas o unidades educativas para jóvenes con medidas judiciales",
                    description: "Selecciona esta opción si el centro desarrolla o coordina un programa educativo para jóvenes que cumplen medidas judiciales. El protocolo puede concretar quién accede a la información del programa y la coordinación necesaria para las actividades con IA.",
                    consequence: "El protocolo podrá concretar el acceso a información relacionada con el caso y la coordinación necesaria para las actividades.",
                    warning: "La información judicial debe manejarse con el rigor y la autoridad competentes, sin compartirla de forma amplia.",
                    annex: "ANEXO_PROTECCION_DATOS_ESPECIAL",
                    bibliography: "RGPD, artículo 10, y LOPDGDD, artículo 10, si se tratan datos de condenas, infracciones o medidas conexas. Su tratamiento exige supervisión pública o habilitación legal, según el caso. LOPDGDD, artículo 5.",
                    regulatoryBasis: "RGPD, artículo 10, y LOPDGDD, artículo 10, si se tratan datos de condenas, infracciones o medidas conexas. Su tratamiento exige supervisión pública o habilitación legal, según el caso. LOPDGDD, artículo 5.",
                    justification: "Se han señalado actividades con medidas judiciales; el protocolo tendrá en cuenta el acceso a la información del caso y la coordinación necesaria."
                }
            ]
        }

    ],

    consequences: [
        "Se refuerzan las obligaciones de protección de datos y la necesidad de minimización.",
        "Como regla preventiva del centro, se limitará la introducción de información identificativa o médica en herramientas de IA abiertas o no autorizadas por el centro.",
        "Pueden requerirse evaluaciones de impacto, medidas de confidencialidad y revisión específica según los datos y los riesgos del tratamiento.",
        "Se activa una protección reforzada para los colectivos con necesidades educativas o sociales especiales."
    ],

    legalBasis: [
        "Ley 7/2023 de Castilla-La Mancha, artículo 33, actuación sobre acceso a medios telemáticos, solo para menores con medidas de protección.",
        "RGPD, artículos 6 y 9, cuando se traten categorías especiales: deben concurrir una base jurídica y una excepción aplicable.",
        "RGPD, artículo 10, y LOPDGDD, artículo 10, si se tratan datos de condenas, infracciones o medidas conexas; el tratamiento requiere supervisión de autoridades públicas o habilitación legal, según el caso.",
        "LOPDGDD, artículo 5.",
        "Reglamento (UE) 2024/1689, según las obligaciones aplicables al sistema de IA y al papel del centro; la vulnerabilidad no determina por sí sola que un sistema sea de alto riesgo."
    ],

    warnings: [
        "Como regla preventiva del centro, no introducir datos identificativos, sanitarios o de tutela en herramientas de IA abiertas o no autorizadas por el centro.",
        "El centro valorará el contenido y contexto de la información psicopedagógica, sociofamiliar o de protección y definirá medidas de acceso y supervisión proporcionales al tratamiento y sus riesgos."
    ],

    recommendedAnnexes: [
        "ANEXO_PROTECCION_DATOS_ESPECIAL"
    ],

    recommendedBibliography: [
        "Ley 7/2023 de Castilla-La Mancha, artículo 33, actuación sobre acceso a medios telemáticos para menores con medidas de protección.",
        "RGPD, artículos 5, 6 y 12 a 14; artículo 9 si se tratan categorías especiales; artículo 10 y LOPDGDD, artículo 10, para datos de condenas, infracciones o medidas conexas, sujetos a supervisión pública o habilitación legal según el caso.",
        "LOPDGDD, artículos 5 y 10, según los datos y el tratamiento concretos.",
        "Reglamento (UE) 2024/1689, según las obligaciones aplicables al sistema de IA y al papel del centro; la vulnerabilidad no determina por sí sola que un sistema sea de alto riesgo."
    ],

    protocolClauseText:
        "El centro aplicará medidas reforzadas de protección de datos, minimización y supervisión cuando exista alumnado en situación de vulnerabilidad, protección específica o necesidades educativas intensivas.",

    editable: true,

    autoDetected: true

},

CARD_RURAL: {

    id: "CARD_RURAL",

    title:
        "Equidad digital: acceso y conectividad",

    summary:
        "La conectividad, la dispersión geográfica y la disponibilidad de dispositivos pueden afectar al acceso equitativo al uso de herramientas de inteligencia artificial y a la igualdad de oportunidades del alumnado.",

    statusLabel:
        "Diagnóstico automático",

    configuration: [

        {
            type: "checkbox",

            label:
                "Condiciones del entorno y acceso",

            options: [
                {
                    id: "entorno_rural",
                    label: "Ubicación rural o dispersión entre sedes que condiciona el acceso digital",
                    description: "La ubicación o la distancia entre sedes y recursos puede dificultar el acceso a actividades digitales. La ruralidad por sí sola no implica falta de conexión.",
                    consequence: "El protocolo priorizará la equidad de acceso y la adaptación a entornos con pocos recursos.",
                    warning: "La falta de conectividad no debe impedir el acceso a oportunidades educativas equivalentes.",
                    annex: "ANEXO_EQUIDAD_DIGITAL",
                    bibliography: "Guía INTEF sobre IA en educación, equidad de acceso y brecha digital (orientativa).",
                    regulatoryBasis: "",
                    justification: "La ubicación o la distancia entre sedes puede dificultar el acceso digital. El protocolo puede recoger alternativas adecuadas a las actividades del centro."
                },
                {
                    id: "conectividad",
                    label: "Conexión a internet insuficiente o inestable para las actividades previstas",
                    description: "Si la conexión no está disponible o es inestable en alguna sede, aula o actividad, puede dificultarse el uso de herramientas en línea.",
                    consequence: "El protocolo limitará el uso de funciones que dependan de una conexión estable o de servicios externos intensivos.",
                    warning: "Las actividades deben ofrecer alternativas cuando la conectividad sea insuficiente.",
                    annex: "ANEXO_EQUIDAD_DIGITAL",
                    bibliography: "Guía INTEF sobre IA en educación, equidad de acceso y brecha digital (orientativa).",
                    regulatoryBasis: "",
                        justification: "La falta de conexión puede dificultar algunas actividades con IA. El protocolo puede indicar qué alternativa ofrecer o cómo adaptar esas actividades."
                },
                {
                    id: "alternativas",
                    label: "Necesidad de alternativas por falta de dispositivos, conexión o accesibilidad",
                    description: "Conviene prever otra forma de participar cuando algún grupo no dispone de dispositivo o conexión, o cuando una herramienta no resulta accesible.",
                    consequence: "El protocolo incorporará recursos analógicos, presenciales o asistidos para favorecer la igualdad de oportunidades.",
                    warning: "Una alternativa válida debe estar disponible antes de exigir el uso de una herramienta digital concreta.",
                    annex: "ANEXO_EQUIDAD_DIGITAL",
                    bibliography: "Guía INTEF sobre IA en educación, equidad de acceso y brecha digital (orientativa).",
                    regulatoryBasis: "",
                        justification: "Si alguna actividad con IA no resulta accesible por falta de dispositivo o conexión, o por las características de la herramienta, el protocolo puede prever otra forma de participación."
                }
            ]
        }

    ],

    consequences: [
        "Se incorporarán medidas para favorecer el acceso equitativo a recursos y actividades apoyadas por IA.",
        "Se promoverán alternativas accesibles, analógicas o asistidas para evitar la exclusión por conectividad o disponibilidad tecnológica.",
        "Se reducirá la dependencia de entornos de alta conectividad o consumo intensivo de recursos."
    ],

    legalBasis: [],

    warnings: [
        "Las actividades no deben generar barreras de acceso por motivos tecnológicos, de conectividad o de disponibilidad de dispositivos.",
        "La equidad digital exige ofrecer alternativas cuando la herramienta no esté disponible o no sea accesible para todo el alumnado."
    ],

    recommendedAnnexes: [
        "ANEXO_EQUIDAD_DIGITAL"
    ],

    recommendedBibliography: [
        "Guía INTEF sobre IA en educación, equidad de acceso y brecha digital (orientativa)."
    ],

    protocolClauseText:
        "El centro incorporará medidas orientadas a mejorar la equidad digital, reducir barreras de acceso y ofrecer alternativas cuando la conectividad o la infraestructura tecnológica condicionen el uso de herramientas de inteligencia artificial.",

    editable: true,

    autoDetected: true

},

CARD_GOVERNANCE: {

    id: "CARD_GOVERNANCE",

    title:
        "Gobernanza y responsabilidades",

    summary:
        "La incorporación de herramientas de inteligencia artificial debe alinearse con la estrategia digital del centro, con la supervisión institucional y con las responsabilidades del equipo directivo y del profesorado.",

    statusLabel:
        "Diagnóstico automático",

    configuration: [

        {
            type: "checkbox",

            label:
                "Planificación institucional",

            options: [
                {
                    id: "plan_digital",
                    label: "Integración de este protocolo en el Plan Digital de Centro",
                    recommendation: "Recomendado",
                    description: "Integrar este protocolo en el Plan Digital de Centro ayuda a vincular sus acuerdos sobre IA con la planificación digital del centro y facilita su coordinación y revisión.",
                    descriptionLink: {
                        href: "ejemplo-pdc-ia.html",
                        label: "Consultar ejemplo de línea de actuación del PDC"
                    },
                    consequence: "El protocolo se integrará en el Plan Digital de Centro y se revisará con la coordinación correspondiente.",
                    warning: "La incorporación de IA debe contar con responsabilidad, supervisión y criterios de seguridad definidos.",
                    annex: "ANEXO_GOBERNANZA_DIGITAL",
                    bibliography: "Guía INTEF sobre IA en educación (orientativa); Plan Digital de Centro como instrumento de planificación institucional.",
                    regulatoryBasis: "",
                    justification: "El centro prevé incorporar este protocolo a su Plan Digital de Centro."
                },
                {
                    id: "fp_dual",
                    label: "Relación con empresas",
                    description: "Selecciona esta opción si el centro ofrece FP Dual u otras enseñanzas con formación en empresa. Valora quién coordina la relación con las entidades colaboradoras y cómo se distribuyen las responsabilidades.",
                    consequence: "El protocolo limitará la introducción de datos de empresas o alumnado en sistemas externos no autorizados.",
                    warning: "En cada colaboración, definir las responsabilidades y obligaciones de confidencialidad aplicables; si un proveedor trata datos personales por cuenta del centro, formalizar el encargo correspondiente.",
                    annex: "ANEXO_GOBERNANZA_DIGITAL",
                    bibliography: "RGPD, artículo 28, si un proveedor trata datos personales por cuenta del centro; Guía INTEF sobre IA en educación (orientativa).",
                    regulatoryBasis: "RGPD, artículo 28, si un proveedor trata datos personales por cuenta del centro.",
                    justification: "La relación con empresas o centros de formación profesional exige definir responsabilidades, confidencialidad y supervisión institucional."
                }
            ]
        },
        {
            type: "radio",
            label: "Titularidad del centro",
            options: [
                {
                    id: "titularidad_publica",
                    label: "Público",
                    description: "La Administración ofrece pautas sobre el uso de IA. El centro puede adaptarlas a su realidad y explicar en el protocolo cómo las aplicará.",
                    consequence: "El protocolo recogerá qué pautas de la Administración aplica el centro y cómo revisará el uso de la IA.",
                    warning: "La titularidad pública no sustituye la obligación de aplicar medidas de seguridad y acompañamiento.",
                    annex: "ANEXO_GOBERNANZA_DIGITAL",
                    bibliography: "RGPD, cuando se traten datos personales; Guía INTEF sobre IA en educación (orientativa).",
                    regulatoryBasis: "RGPD, cuando se traten datos personales.",
                    justification: "Esta opción permite explicar cómo se adaptan al centro las pautas de la Administración."
                },
                {
                    id: "titularidad_concertado",
                    label: "Concertado",
                    description: "El centro puede adaptar a su realidad las pautas sobre IA de la Administración y de la entidad titular del centro. Si lo necesita, puede consultar con ambas cómo aplicarlas.",
                    consequence: "El protocolo recogerá qué pautas de la Administración y de la entidad titular aplica el centro, y cómo revisará el uso de la IA.",
                    warning: "La titularidad concertada no modifica las obligaciones de protección de datos ni la responsabilidad educativa.",
                    annex: "ANEXO_GOBERNANZA_DIGITAL",
                    bibliography: "RGPD, cuando se traten datos personales; Guía INTEF sobre IA en educación (orientativa).",
                    regulatoryBasis: "RGPD, cuando se traten datos personales.",
                    justification: "Esta opción permite tener en cuenta las pautas de la Administración y de la entidad titular, y explicar cómo se adaptan al centro."
                },
                {
                    id: "titularidad_privada",
                    label: "Privado",
                    description: "El centro debe cumplir las normas aplicables. La entidad titular puede decidir qué pautas de la Administración sobre IA sigue y cómo las adapta a la realidad del centro.",
                    consequence: "El protocolo recogerá qué pautas de la Administración decide seguir la entidad titular y cómo las adapta al centro, dentro de las normas aplicables.",
                    warning: "La titularidad privada conserva las obligaciones relativas a protección de datos y cumplimiento normativo.",
                    annex: "ANEXO_GOBERNANZA_DIGITAL",
                    bibliography: "RGPD, cuando se traten datos personales; Guía INTEF sobre IA en educación (orientativa).",
                    regulatoryBasis: "RGPD, cuando se traten datos personales.",
                    justification: "El centro debe cumplir las normas aplicables. La entidad titular puede decidir si sigue también las pautas de la Administración sobre IA."
                }
            ]
        }

    ],

    consequences: [
        "Se incorporarán normas de gobernanza digital y adquisición de herramientas con criterios de seguridad y responsabilidad.",
        "Se identificarán las responsabilidades del centro, del profesorado y de cualquier proveedor o entidad externa implicada.",
        "Se reforzará la supervisión de las herramientas utilizadas institucionalmente y del uso que se hace de los datos."
    ],

    legalBasis: [
        "RGPD, artículo 28, si un proveedor trata datos personales por cuenta del centro."
    ],

    warnings: [
        "Las herramientas institucionales deben contar con garantías adecuadas de protección de datos y con criterios de supervisión definidos.",
        "Cuando existan acuerdos con empresas o proveedores externos, concretar las obligaciones de confidencialidad, protección de datos y coordinación según los datos tratados y el papel de cada parte."
    ],

    recommendedAnnexes: [
        "ANEXO_GOBERNANZA_DIGITAL"
    ],

    recommendedBibliography: [
        "RGPD, artículo 28, cuando un proveedor actúe como encargado del tratamiento.",
        "INTEF, Guía sobre el uso de la IA en el ámbito educativo (orientativa).",
        "Plan Digital de Centro, como instrumento de planificación institucional, no como fuente normativa."
    ],

    protocolClauseText:
        "El centro integrará el uso de la inteligencia artificial en su estrategia digital y establecerá mecanismos de coordinación, supervisión y responsabilidad institucional orientados a promover un uso seguro y transparente y a facilitar la revisión del cumplimiento normativo aplicable.",

    editable: true,

    autoDetected: true

}

};

    global.JCCM_ProtocoloIA = global.JCCM_ProtocoloIA || {};
    global.JCCM_ProtocoloIA.catalog = cardCatalog;
    global.cardCatalog = cardCatalog;

    if (typeof window !== 'undefined') {
        window.JCCM_ProtocoloIA = window.JCCM_ProtocoloIA || {};
        window.JCCM_ProtocoloIA.catalog = cardCatalog;
        window.cardCatalog = cardCatalog;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cardCatalog;
    }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this)));
