const state = {
    pasoActual: 0,
    totalPasos: 5,
    nombresPasos: [
        "Datos del centro",
        "Entornos institucionales",
        "Normas e integridad",
        "Privacidad y datos",
        "Generación"
    ],
    configuracionIndex: 0,
    pantallaPaso1: 'identificacion',
    edicionResumen: false,
    edicionDatosCentro: false,
    base64Logo: null,
    contextoSeleccionado: {},
    aulaPenitenciaria: false,
    iaSinConexion: false,
    modalidadesInstitucionales: [],
    serviciosGestionadosCentro: '',
    otrosEntornosInstitucionales: ''
};

let tipoCentroAnterior = '';

// Carga inicial y auto-guardado
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', event => {
        const toggle = event.target.closest('.section-help-toggle');
        if (!toggle) return;

        const panel = document.getElementById(toggle.getAttribute('aria-controls'));
        if (!panel) return;

        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        panel.hidden = isExpanded;
    });

    // Eventos para el Auto-Guardado en cada cambio
    document.querySelectorAll('.auto-save').forEach(element => {
        element.addEventListener('input', guardarEnLocalStorage);
        element.addEventListener('change', guardarEnLocalStorage);
    });
    
    // Botones de JSON manuales
    document.getElementById('btn-save-json').addEventListener('click', exportarSesionJSON);
    document.getElementById('file-import').addEventListener('change', importarSesionJSON);


    // Evento Change
    const comboTipo = document.getElementById('tipo-centro');
    if (comboTipo) {
        comboTipo.addEventListener('change', adaptarFormulario);
    }
    inicializarCamposMultiples();
    inicializarEntornosInstitucionales();
    renderizarConfiguracionPaso1();
    actualizarEstadoPortada();
});

// Navegación
function iniciarWizard() {
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');
    const wizardNav = document.getElementById('wizard-nav');
    const progCont = document.getElementById('prog-cont');
    const progressText = document.getElementById('progress-text');

    if (step0) step0.classList.remove('active');
    if (step1) step1.classList.add('active');
    if (wizardNav) wizardNav.style.display = 'flex';
    if (progCont) progCont.style.display = 'block';
    if (progressText) progressText.style.display = 'block';
    
    state.pasoActual = 1;
    state.edicionResumen = false;
    state.edicionDatosCentro = false;
    actualizarVisibilidadGuardar();
    mostrarPantallaPaso1('identificacion');
    actualizarInterfaz();
}

function mostrarPantallaPaso1(pantalla) {
    state.pantallaPaso1 = pantalla;
    const header = document.getElementById('step-1-header');
    const heading = document.getElementById('step-1-heading');
    const assistantHelpToggle = document.getElementById('asistente-configuracion-help-toggle');
    const assistantHelpPanel = document.getElementById('ayuda-asistente-configuracion');
    const isConfiguration = pantalla === 'configuracion';
    const headings = {
        identificacion: state.edicionDatosCentro ? 'Editar datos del centro' : 'Datos del centro',
        configuracion: 'Asistente de configuración',
        resumen: 'Revisión del centro'
    };

    if (heading) heading.textContent = headings[pantalla] || 'Datos del centro';
    if (header) header.classList.toggle('header-section-with-advice', isConfiguration);
    if (assistantHelpToggle) {
        assistantHelpToggle.hidden = !isConfiguration;
        assistantHelpToggle.setAttribute('aria-expanded', 'false');
    }
    if (assistantHelpPanel) assistantHelpPanel.hidden = true;

    const pantallas = {
        identificacion: 'step-1-identificacion',
        configuracion: 'step-1-configuracion',
        resumen: 'step-1-resumen'
    };

    Object.entries(pantallas).forEach(([nombre, id]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.style.display = nombre === pantalla ? 'block' : 'none';
    });
}

function irAPaso(numeroPaso) {

    const step0 = document.getElementById('step-0');
    const wizardNav = document.getElementById('wizard-nav');
    const progCont = document.getElementById('prog-cont');
    const progressText = document.getElementById('progress-text');

    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    if (step0) step0.classList.remove('active');

    const pasoDestino =
        document.getElementById(`step-${numeroPaso}`);

    if (pasoDestino) {
        pasoDestino.classList.add('active');
    }

    if (wizardNav) wizardNav.style.display = 'flex';
    if (progCont) progCont.style.display = 'block';
    if (progressText) progressText.style.display = 'block';

    state.pasoActual = numeroPaso;

    if (numeroPaso === 1) {
        mostrarPantallaPaso1(state.pantallaPaso1 || 'identificacion');
        if (state.pantallaPaso1 === 'resumen') actualizarResumenContextual();
    }
    if (numeroPaso === 2) {
        const avisoMediacion = document.getElementById('ayuda-mediacion-menores-14');
        if (avisoMediacion) {
            avisoMediacion.hidden = obtenerSeleccionesContextoDisponibles()['CARD_AGE-menores_14'] !== true;
        }
        renderizarEntornosInstitucionales();
        actualizarModalidadesDesdeFormulario();
    }

    actualizarInterfaz();
}

function volverAPortada() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-0').classList.add('active');
    document.getElementById('wizard-nav').style.display = 'none';
    document.getElementById('prog-cont').style.display = 'none';
    document.getElementById('progress-text').style.display = 'none';
    state.pasoActual = 0;
    actualizarVisibilidadGuardar();
}

function avanzarPreguntaConfiguracion() {
    if (!validarPreguntaConfiguracion()) return;

    state.contextoSeleccionado = obtenerSeleccionesContexto();
    if (state.edicionResumen) {
        volverAlResumenConfiguracion();
        return;
    }
    const totalPreguntas = obtenerPreguntasConfiguracion().length;

    if (state.configuracionIndex < totalPreguntas - 1) {
        state.configuracionIndex += 1;
        mostrarPreguntaConfiguracion();
        guardarEnLocalStorage();
        return;
    }

    avanzarAsistenteConfiguracion();
}

function retrocederPreguntaConfiguracion() {
    if (state.edicionResumen) {
        volverAlResumenConfiguracion();
        return;
    }
    if (state.configuracionIndex > 0) {
        state.contextoSeleccionado = obtenerSeleccionesContexto();
        state.configuracionIndex -= 1;
        mostrarPreguntaConfiguracion();
        guardarEnLocalStorage();
    } else {
        retrocederAsistenteConfiguracion();
    }
}

function avanzarAsistenteConfiguracion() {
    if (!validarPreguntaConfiguracion()) return;

    state.contextoSeleccionado = obtenerSeleccionesContexto();
    state.edicionResumen = false;
    state.edicionDatosCentro = false;
    mostrarPantallaPaso1('resumen');
    actualizarResumenContextual();
    actualizarInterfaz();
    document.getElementById('steps-wrapper').scrollTop = 0;
    guardarEnLocalStorage();
}

function retrocederAsistenteConfiguracion() {
    state.contextoSeleccionado = obtenerSeleccionesContexto();
    guardarEnLocalStorage();
    mostrarPantallaPaso1('identificacion');
    state.pasoActual = 1;
    state.configuracionIndex = 0;
    actualizarInterfaz();
}

function abrirAsistenteConfiguracion() {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step-1')?.classList.add('active');
    mostrarPantallaPaso1('configuracion');

    state.pasoActual = 1;
    state.edicionResumen = false;
    state.edicionDatosCentro = false;
    state.configuracionIndex = Math.max(0, Math.min(state.configuracionIndex, obtenerPreguntasConfiguracion().length - 1));
    mostrarPreguntaConfiguracion();
    actualizarInterfaz();
    guardarEnLocalStorage();
}

function abrirPreguntaDesdeResumen(indicePregunta) {
    const preguntas = obtenerPreguntasConfiguracion();
    if (!Number.isInteger(indicePregunta) || !preguntas[indicePregunta]) return;

    state.edicionResumen = true;
    state.edicionDatosCentro = false;
    state.configuracionIndex = indicePregunta;
    state.pasoActual = 1;
    mostrarPantallaPaso1('configuracion');
    mostrarPreguntaConfiguracion();
    actualizarInterfaz();
    guardarEnLocalStorage();
}

function editarDatoCentroDesdeResumen(fieldId) {
    if (!['nombre-centro', 'tipo-centro', 'localidad'].includes(fieldId)) return;

    state.edicionDatosCentro = true;
    state.edicionResumen = false;
    state.pasoActual = 1;
    mostrarPantallaPaso1('identificacion');
    actualizarInterfaz();
    document.getElementById(fieldId)?.focus();
    guardarEnLocalStorage();
}

function volverAlResumenConfiguracion() {
    state.contextoSeleccionado = obtenerSeleccionesContexto();
    state.edicionResumen = false;
    state.edicionDatosCentro = false;
    mostrarPantallaPaso1('resumen');
    actualizarResumenContextual();
    actualizarInterfaz();
    document.getElementById('steps-wrapper').scrollTop = 0;
    guardarEnLocalStorage();
}

function abrirGuiaHerramienta() {
    const ventanaGuia = window.open('guia-uso.html', '_blank');
    if (ventanaGuia) ventanaGuia.opener = null;
}

function cambiarPaso(direccion) {
    const paso1Identificacion = document.getElementById('step-1-identificacion');
    const paso1Configuracion = document.getElementById('step-1-configuracion');

    if (state.pasoActual === 1 && state.pantallaPaso1 === 'resumen' && direccion === -1) {
        volverAPortada();
        return;
    }

    if (state.pasoActual === 1 && paso1Identificacion && paso1Identificacion.style.display !== 'none') {
        if (direccion === 1) {
            const nombre = document.getElementById('nombre-centro').value.trim();
            const tipo = document.getElementById('tipo-centro').value;
            const loc = document.getElementById('localidad').value.trim();
            
            if (nombre.length < 3 || loc.length < 3 || !tipo) {
                const errorMsg = document.getElementById('error-step-1');
                errorMsg.style.display = 'block';
                errorMsg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
                return;
            }

            document.getElementById('error-step-1').style.display = 'none';
            if (state.edicionDatosCentro) {
                state.edicionDatosCentro = false;
                mostrarPantallaPaso1('resumen');
                actualizarResumenContextual();
                actualizarInterfaz();
                guardarEnLocalStorage();
                return;
            }
            mostrarPantallaPaso1('configuracion');
            state.configuracionIndex = 0;
            mostrarPreguntaConfiguracion();
            actualizarInterfaz();
            guardarEnLocalStorage();
            return;
        }

        if (direccion === -1) {
            if (state.edicionDatosCentro) {
                state.edicionDatosCentro = false;
                mostrarPantallaPaso1('resumen');
                actualizarResumenContextual();
                actualizarInterfaz();
                guardarEnLocalStorage();
                return;
            }
            volverAPortada();
            return;
        }
    }

    if (state.pasoActual === 1 && paso1Configuracion && paso1Configuracion.style.display !== 'none') {
        if (direccion === -1) {
            retrocederAsistenteConfiguracion();
            return;
        }

        if (direccion === 1) {
            avanzarAsistenteConfiguracion();
            return;
        }
    }

    const pasoActualEl = document.getElementById(`step-${state.pasoActual}`);
    if (pasoActualEl) {
        pasoActualEl.classList.remove('active');
    }

    const pasoAnterior = state.pasoActual;
    state.pasoActual += direccion;
    const pasoSiguienteEl = document.getElementById(`step-${state.pasoActual}`);

    if (!pasoSiguienteEl) {
        state.pasoActual = pasoAnterior;
        return;
    }

    pasoSiguienteEl.classList.add('active');

    if (state.pasoActual === 2) {
        const avisoMediacion = document.getElementById('ayuda-mediacion-menores-14');
        if (avisoMediacion) {
            avisoMediacion.hidden = obtenerSeleccionesContextoDisponibles()['CARD_AGE-menores_14'] !== true;
        }
        renderizarEntornosInstitucionales();
        actualizarModalidadesDesdeFormulario();
    }
    
    actualizarInterfaz();
    document.getElementById('steps-wrapper').scrollTop = 0;

    guardarEnLocalStorage();
}

function actualizarInterfaz() {
    actualizarVisibilidadGuardar();
    actualizarNotaDatosSalud();
    const avisoMediacion = document.getElementById('ayuda-mediacion-menores-14');
    if (avisoMediacion) {
        avisoMediacion.hidden = obtenerSeleccionesContextoDisponibles()['CARD_AGE-menores_14'] !== true;
    }
    renderizarEntornosInstitucionales();
    actualizarRecordatorioServiciosPaso4();
    if (state.pasoActual === 0) return;
    
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progressText = document.getElementById('progress-text');
    const paso1Configuracion = document.getElementById('step-1-configuracion');
    const wizardNav = document.getElementById('wizard-nav');
    const enConfiguracion = state.pasoActual === 1 && state.pantallaPaso1 === 'configuracion';
    const editandoDatosCentro = state.pasoActual === 1 && state.pantallaPaso1 === 'identificacion' && state.edicionDatosCentro;

    if (wizardNav) wizardNav.style.display = enConfiguracion ? 'none' : 'flex';
    if (btnPrev) btnPrev.hidden = editandoDatosCentro;
    btnPrev.disabled = false;
    
    if (state.pasoActual > state.totalPasos) {
        btnNext.style.display = 'none';
        progressText.textContent = 'Fuentes de referencia';
        return;
    }

    if (state.pasoActual === 1 && state.pantallaPaso1 === 'configuracion') {
        const totalPreguntas = obtenerPreguntasConfiguracion().length;
        const esUltimaPregunta = state.configuracionIndex === totalPreguntas - 1;
        btnNext.textContent = state.edicionResumen
            ? 'Guardar y volver al resumen'
            : esUltimaPregunta ? 'Ver resumen' : 'Siguiente pregunta';
        btnPrev.textContent = state.edicionResumen
            ? 'Volver al resumen'
            : state.configuracionIndex === 0 ? 'Datos del centro' : 'Pregunta anterior';
    } else if (editandoDatosCentro) {
        btnNext.textContent = 'Guardar y volver al resumen';
        btnPrev.textContent = 'Volver al resumen';
    } else {
        btnNext.textContent = (state.pasoActual === state.totalPasos) ? 'Fuentes de referencia' : 'Siguiente';
        btnPrev.textContent = 'Anterior';
    }

    btnNext.style.display = state.pasoActual === state.totalPasos ? 'none' : 'flex';
    let progresoVisible = Math.min(state.pasoActual, state.totalPasos);
    let porcentaje = ((progresoVisible - 1) / (state.totalPasos - 1)) * 100;
    document.getElementById('progress-bar').style.width = `${porcentaje}%`;
    
    progressText.textContent = `Paso ${state.pasoActual} de ${state.totalPasos}: ${state.nombresPasos[state.pasoActual-1]}`;
}

function actualizarNotaDatosSalud() {
    const fila = document.getElementById('privacidad-datos-salud-contextual');
    const regla = document.getElementById('sub-priv-1-2-contextual');
    if (!fila || !regla) return;
    const hayApoyosIntensivos = obtenerSeleccionesContextoDisponibles()['CARD_VULNERABILITY-educacion_especial'] === true;
    fila.hidden = !hayApoyosIntensivos;
    regla.checked = hayApoyosIntensivos;
}

// Lógica de Adaptación de Formularios
const typeDescriptionTexts = {
    escuela_infantil: {
        intro: "Centro que ofrece el primer ciclo de educación infantil, dirigido a niñas y niños de 0 a 3 años. Los grupos, edades y servicios concretos dependen de la oferta y organización del centro.",
        aspects: [
            "Las edades, grupos, horarios y servicios presentes este curso.",
            "Qué tareas de IA realizaría el personal y si se prevé la participación del alumnado en alguna actividad con acompañamiento del personal.",
            "Qué datos personales, imágenes o voz podrían aparecer en materiales o consultas."
        ]
    },
    ceip: {
        intro: "Centro con enseñanzas de infantil y primaria y alumnado de distintas edades y con distintos grados de autonomía.",
        aspects: [
            "Los grupos y tramos de edad matriculados este curso.",
            "Si la IA la utiliza el personal para preparar materiales o si también hay interacción directa del alumnado.",
            "El acompañamiento, la accesibilidad y la información personal que puedan implicar esos usos."
        ]
    },
    cee: {
        intro: "Centro que puede escolarizar alumnado de distintas edades y con necesidades de apoyo diversas.",
        aspects: [
            "Los apoyos de comunicación y accesibilidad relevantes para las actividades previstas.",
            "Si la IA la utiliza el personal, el alumnado o ambos.",
            "La información personal que podría incluirse en materiales o consultas."
        ]
    },
    ies: {
        intro: "Centro con enseñanzas de secundaria y, según su oferta, otras etapas y alumnado de distintas edades.",
        aspects: [
            "Los cursos y grupos matriculados, incluidas las edades presentes.",
            "La diferencia entre preparar materiales desde el centro y el uso directo del alumnado.",
            "Los trabajos o datos personales que podrían incorporarse a las herramientas."
        ]
    },
    eoi: {
        intro: "En una EOI pueden convivir personas menores y adultas, en niveles y modalidades distintos.",
        aspects: [
            "Las edades presentes en cada grupo y modalidad.",
            "La práctica de idiomas y la posible interacción con herramientas de IA.",
            "La diferencia entre el uso del personal y el uso directo del alumnado."
        ]
    },
    cepa: {
        intro: "La oferta suele dirigirse a personas adultas, aunque la edad y el perfil pueden variar entre grupos.",
        aspects: [
            "Las edades del alumnado y las modalidades de enseñanza en las que está matriculado este curso.",
            "Los usos previstos por el personal y los posibles usos directos en actividades formativas.",
            "La información personal que podría incluirse en tareas o consultas."
        ]
    },
    fp: {
        intro: "En FP, algunas actividades incluyen prácticas y colaboración con empresas.",
        aspects: [
            "La información de empresas o de prácticas que podría incorporarse a las actividades.",
            "A quién se dirigirían los usos de IA previstos: al personal del centro, al alumnado o a ambos.",
            "Los datos personales o materiales que podrían compartirse con herramientas de IA."
        ]
    },
    esad: {
        intro: "En la ESAD, las actividades de creación e interpretación pueden implicar textos, voz e imagen.",
        aspects: [
            "Las obras, grabaciones u otros materiales que podrían incorporarse a una herramienta.",
            "Los usos previstos por el personal y los posibles usos directos del alumnado.",
            "La finalidad del uso y la información que se compartiría."
        ]
    },
    conservatorio: {
        intro: "En el conservatorio puede haber alumnado de distintas edades y trabajarse con partituras, voz y grabaciones.",
        aspects: [
            "Las enseñanzas, grupos y edades realmente matriculados.",
            "Los materiales musicales o grabaciones que podrían utilizarse con IA.",
            "La diferencia entre los usos de apoyo docente y los usos directos del alumnado."
        ]
    },
    easd_ea: {
        intro: "La oferta de las escuelas de arte y superior de diseño (EASD) y de las escuelas de arte (EA) puede variar según el centro.",
        aspects: [
            "Las enseñanzas, los grupos y las edades presentes este curso.",
            "Los proyectos de arte o diseño en los que se prevé utilizar IA.",
            "Los datos personales y materiales que podrían incluirse en esos usos."
        ]
    },
    edre: {
        intro: "Las enseñanzas deportivas pueden combinar formación teórica y práctica en una modalidad deportiva.",
        aspects: [
            "Las modalidades deportivas y las actividades formativas que ofrece el centro.",
            "Si el centro prevé usar IA en estas enseñanzas, puede valorar su aplicación a la planificación de entrenamientos, al análisis de técnicas o situaciones de juego y a la preparación de materiales formativos.",
            "Las imágenes, los vídeos o los datos de rendimiento que podrían formar parte de esos usos."
        ]
    }
};

const placeholderTexts = {
    escuela_infantil: {
        prof_text: "Por ejemplo, preparar un borrador de secuencia de juego o exploración acorde con la planificación del grupo, revisado por el equipo educativo.",
        prof_media: "Por ejemplo, crear un pictograma o una imagen genérica para una rutina, sin utilizar fotografías reales de niñas y niños.",
        prof_eval: "Por ejemplo, preparar un borrador de retroalimentación general sobre los objetivos trabajados, sin incluir observaciones individualizadas.",
        prof_form: "Por ejemplo, revisar cómo valorar materiales generados con IA y proteger la información de niñas y niños en actividades de 0 a 3 años.",
        alum_chat: "Por ejemplo, mostrar una imagen generada para nombrar objetos y comentarla con el grupo, con acompañamiento del equipo educativo.",
        norma_transp: "Por ejemplo, acordar en qué casos y canales habituales se informa a las familias de que se han preparado o adaptado materiales con IA para el grupo, en el marco de la comunicación periódica y sin vincularlo a plazos de evaluación formal.",
        norma_oral: "Por ejemplo, valorar el proceso mediante observaciones y evidencias adecuadas a la edad, sin exigir explicaciones formales.",
        norma_disp: "Por ejemplo, concretar el uso de teléfonos y equipos por parte del personal durante la jornada y las actividades.",
        norma_equi: "Por ejemplo, ofrecer recursos equivalentes en el centro, sin requerir dispositivos ni cuentas familiares.",
        norma_sost: "Por ejemplo, utilizar IA para preparar materiales solo cuando aporte valor frente a los recursos ya disponibles y evitar generaciones repetidas que no mejoren el material.",
        priv_cuentas: "Por ejemplo, indicar qué perfiles del personal acceden a cuentas institucionales y cómo se gestionan los cambios de acceso.",
        priv_reg: "Por ejemplo, indicar qué perfiles del personal pueden disponer de cuentas en plataformas de terceros, quién las gestiona y cómo se actualizan los accesos cuando cambian las actividades del grupo."
    },
    ceip: {
        prof_text: "Por ejemplo, crear borradores de cuentos adaptados al nivel de 2.º de Primaria.",
        prof_media: "Por ejemplo, generación de pictogramas para cartelería del centro.",
        prof_eval: "Por ejemplo, generar borradores de retroalimentación formativa para una tarea de 6.º de Primaria.",
        prof_form: "Por ejemplo, practicar la revisión de materiales generados para distintos cursos, atendiendo a errores, sesgos y adecuación a la edad.",
        alum_chat: "Por ejemplo, generar ideas para una historia en una actividad guiada por el profesorado y revisar las respuestas con el grupo.",
        norma_transp: "Por ejemplo, acordar cómo se acompaña al alumnado para comunicar, de forma adecuada a su edad, el uso de IA en una tarea y en qué casos se informa a las familias de materiales docentes adaptados con IA.",
        norma_oral: "Por ejemplo, cuando sea necesario comprobar el aprendizaje, pedir una explicación breve y adecuada a la edad o proponer una actividad alternativa, con apoyo docente.",
        norma_disp: "Por ejemplo, recoger la regla general de que el alumnado no acuda al centro con teléfonos móviles, prever las circunstancias excepcionales y concretar en las NOFC el uso de otros dispositivos conforme a la política del centro.",
        norma_equi: "Por ejemplo, ofrecer acceso supervisado a los equipos del centro y mantener alternativas analógicas para las tareas con IA.",
        norma_sost: "Por ejemplo, reservar la IA para tareas educativas en las que aporte valor y recurrir a los recursos disponibles cuando sean suficientes.",
        priv_cuentas: "Por ejemplo, indicar qué perfiles docentes acceden y, si se prevé acceso del alumnado, cómo se organiza.",
        priv_reg: "Por ejemplo, concretar quién administra las cuentas del profesorado y, si se prevén cuentas para el alumnado, cómo se organizan y revisan los accesos por curso o grupo."
    },
    esad: {
        prof_text: "Por ejemplo, diseño de materiales artísticos y proyectos creativos con apoyo de IA para la práctica docente.",
        prof_media: "Por ejemplo, generación de imágenes, referencias visuales o recursos de apoyo para talleres artísticos.",
        prof_eval: "Por ejemplo, preparar sugerencias de retroalimentación creativa y técnica.",
        prof_form: "Por ejemplo, analizar cómo influyen textos e imágenes generados por IA en la creación escénica, la representación y la autoría.",
        alum_chat: "Por ejemplo, explorar ideas para un personaje o una escena y valorar cuáles encajan con las decisiones creativas del grupo.",
        norma_transp: "Por ejemplo, distinguir qué ideas se exploraron con IA y qué decisiones creativas y materiales se incorporaron al resultado. Puede indicarse qué herramientas se emplearon y, si aporta claridad, algún ejemplo de las instrucciones dadas, sin incluir datos personales ni información confidencial.",
        norma_oral: "Por ejemplo, valorar el proceso creativo mediante una breve explicación, una muestra de bocetos u otra evidencia adecuada al proyecto.",
        norma_disp: "Por ejemplo, en Enseñanzas de Régimen Especial, la regla general es no usar móviles dentro del aula. El equipo docente puede decidir un uso pedagógico bajo supervisión; se prevén circunstancias excepcionales y se regulan los demás dispositivos conforme a la política del centro y las NOFC.",
        norma_equi: "Por ejemplo, facilitar el acceso a materiales y herramientas de apoyo según las necesidades y recursos disponibles.",
        norma_sost: "Por ejemplo, valorar si generar propuestas para un proceso creativo escénico aporta valor frente a los recursos disponibles y evitar repeticiones sin una finalidad clara.",
        priv_cuentas: "Por ejemplo, indicar qué perfiles acceden durante las fases de creación, revisión y presentación de proyectos.",
        priv_reg: "Por ejemplo, describir cómo se gestionan las cuentas y los permisos de acceso durante las fases de creación, revisión y presentación de proyectos."
    },
    conservatorio: {
        prof_text: "Por ejemplo, adaptación de repertorios, ejercicios y materiales didácticos con ayuda de IA.",
        prof_media: "Por ejemplo, creación de recursos visuales o de análisis musical para apoyar la interpretación.",
        prof_eval: "Por ejemplo, sugerir mejoras técnicas y expresivas.",
        prof_form: "Por ejemplo, valorar propuestas de interpretación o composición y contrastar su precisión con partituras y criterios musicales.",
        alum_chat: "Por ejemplo, en una actividad guiada por el profesorado, explorar distintas formas de abordar una pieza y contrastar las ideas con la partitura y los criterios musicales del grupo.",
        norma_transp: "Por ejemplo, distinguir la práctica o consulta con IA de las decisiones de interpretación y del trabajo musical propio. Puede indicarse qué partes del análisis, la composición o los arreglos tuvieron apoyo de IA y, si ayuda a comprender el proceso, algún ejemplo de las instrucciones dadas, sin incluir datos personales ni información confidencial.",
        norma_oral: "Por ejemplo, valorar una explicación o demostración breve sobre una decisión interpretativa, con alternativas accesibles cuando la actividad lo requiera.",
        norma_disp: "Por ejemplo, en Enseñanzas de Régimen Especial, la regla general es no usar móviles dentro del aula. El equipo docente puede decidir un uso pedagógico bajo supervisión; se prevén circunstancias excepcionales y se concreta en la política del centro y las NOFC el uso en espacios de interpretación y el de otros dispositivos.",
        norma_equi: "Por ejemplo, facilitar el acceso a recursos de apoyo para el alumnado del conservatorio.",
        norma_sost: "Por ejemplo, recurrir a herramientas digitales en la práctica musical cuando aporten valor frente a los recursos disponibles y evitar generar materiales repetidos.",
        priv_cuentas: "Por ejemplo, indicar qué perfiles acceden a cuentas para actividades de práctica musical o gestión de materiales.",
        priv_reg: "Por ejemplo, concretar qué perfiles utilizan cuentas para actividades musicales y quién revisa o actualiza sus permisos."
    },
    cee: {
        prof_text: "Por ejemplo, preparar borradores de textos didácticos en lectura fácil y con enfoque de Diseño Universal para el Aprendizaje, para revisión del profesorado antes de usarlos con el grupo.",
        prof_media: "Por ejemplo, crear pictogramas y audios descriptivos para materiales didácticos generales, revisados por el profesorado y sin incluir imágenes ni datos identificativos del alumnado.",
        prof_eval: "Por ejemplo, preparar borradores de retroalimentación formativa con criterios generales de aprendizaje, sin introducir informes psicopedagógicos ni datos de salud en IA comerciales abiertas.",
        prof_form: "Por ejemplo, revisar la adaptación de materiales a lectura fácil y accesibilidad cognitiva mediante casos de práctica.",
        alum_chat: "Por ejemplo, explorar una situación cotidiana mediante un diálogo guiado, con los apoyos de comunicación que precise cada persona y revisión del equipo educativo.",
        norma_transp: "Por ejemplo, acordar cómo puede el alumnado comunicar cuándo ha utilizado IA en una actividad, con los apoyos de comunicación que precise cada persona.",
        norma_oral: "Por ejemplo, valorar el proceso mediante el sistema habitual de comunicación del alumnado y los apoyos que precise, sin exigir una explicación oral.",
        norma_disp: "Por ejemplo, valorar en la política de dispositivos personales si se admiten dispositivos propios y prever dispositivos adaptados del centro según las necesidades del alumnado.",
        norma_equi: "Por ejemplo, prever una alternativa con recursos analógicos cuando la actividad lo requiera.",
        norma_sost: "Por ejemplo, reutilizar materiales accesibles y recurrir a la IA solo cuando permita mejorar la accesibilidad o la participación en una actividad.",
        priv_cuentas: "Por ejemplo, indicar qué perfiles profesionales necesitan acceso y qué apoyos facilitan su gestión.",
        priv_reg: "Por ejemplo, señalar qué perfiles necesitan cuentas, quién gestiona los permisos y qué apoyos facilitan su actualización."
    },
    ies: {
        prof_text: "Por ejemplo, diseñar situaciones de aprendizaje y rúbricas competenciales como borradores para revisión docente.",
        prof_media: "Por ejemplo, crear un esquema visual para explicar un proceso o relacionar conceptos de una materia.",
        prof_eval: "Por ejemplo, preparar borradores de retroalimentación formativa sobre un aprendizaje o a partir de una rúbrica.",
        prof_form: "Por ejemplo, practicar la comprobación de fuentes y la revisión de actividades y recursos generados para distintas materias.",
        alum_chat: "Por ejemplo, en una actividad guiada por el profesorado, contrastar con materiales de clase una explicación del asistente sobre un tema.",
        norma_transp: "Por ejemplo, acordar qué partes de un trabajo se apoyaron en IA y qué información ayuda a explicar ese uso; puede indicarse la herramienta y, cuando aporte claridad, algún ejemplo de instrucciones, sin datos personales ni historiales completos.",
        norma_oral: "Por ejemplo, valorar una explicación breve del proceso o una actividad alternativa vinculada a la materia, con criterios claros y proporcionales.",
        norma_disp: "Por ejemplo, recoger las reglas según la etapa: en ESO, como norma general, no se usan móviles durante la jornada; en bachillerato, no se usan en el aula salvo uso pedagógico decidido y supervisado por el equipo docente. Prever circunstancias excepcionales y regular otros dispositivos conforme a la política del centro y las NOFC.",
        norma_equi: "Por ejemplo, prever acceso a equipos del centro y una alternativa analógica para las tareas con IA que deban realizarse fuera del horario lectivo.",
        norma_sost: "Por ejemplo, reservar la IA generativa para tareas en las que aporte valor frente a una búsqueda sencilla y evitar consultas repetidas.",
        priv_cuentas: "Por ejemplo, concretar qué perfiles acceden a cuentas institucionales en las materias o actividades previstas.",
        priv_reg: "Por ejemplo, indicar qué perfiles acceden mediante cuentas en cada materia o actividad y quién revisa y actualiza esos permisos."
    },
    adultos: {
        prof_text: "Por ejemplo, preparar borradores de textos o diálogos didácticos adaptados al Marco Común Europeo de Referencia para las Lenguas (MCER), con revisión docente.",
        prof_media: "Por ejemplo, creación de audios para ejercicios de comprensión oral.",
        prof_eval: "Por ejemplo, preparar borradores de retroalimentación formativa sobre producciones lingüísticas.",
        prof_form: "Por ejemplo, revisar errores y expresiones poco naturales en diálogos generados para las lenguas que se enseñan.",
        alum_chat: "Por ejemplo, practicar un diálogo en el idioma estudiado y revisar las expresiones propuestas por el asistente.",
        norma_disp: "Por ejemplo, concretar en la política de dispositivos personales del centro y en las NOFC las reglas de uso y las alternativas disponibles.",
        norma_equi: "Por ejemplo, ofrecer acceso a las aulas informáticas y una alternativa analógica para las tareas con IA fuera del horario lectivo.",
        norma_sost: "Por ejemplo, reservar la IA generativa para tareas en las que aporte valor frente a una búsqueda sencilla y evitar consultas innecesarias.",
        priv_cuentas: "Por ejemplo, señalar qué perfiles acceden a cuentas institucionales en actividades de práctica lingüística.",
        priv_reg: "Por ejemplo, indicar quién gestiona las cuentas en plataformas de terceros, qué perfiles acceden y cómo se revisan los permisos según la actividad."
    },
    default: {
        prof_text: "Por ejemplo, preparar un borrador de material didáctico para una actividad del centro y revisar el resultado antes de utilizarlo.",
        prof_media: "Por ejemplo, crear una imagen, un esquema o un audio breve como apoyo para explicar una idea.",
        prof_eval: "Por ejemplo, preparar un borrador de retroalimentación formativa sobre una tarea concreta.",
        prof_form: "Por ejemplo, incluir formación en uso seguro de IA en el plan formativo del centro, según sus necesidades y planificación.",
        alum_chat: "Por ejemplo, proponer una actividad guiada para generar y contrastar ideas.",
        norma_transp: "Por ejemplo, acordar en qué actividades se declara el uso de IA y qué información se incluye.",
        norma_oral: "Por ejemplo, valorar una explicación del proceso, una evidencia o una actividad alternativa según el objetivo de aprendizaje y con criterios proporcionales.",
        norma_disp: "Por ejemplo, concretar en la política de dispositivos personales del centro el uso de móviles y otros dispositivos, incluidas las excepciones y alternativas.",
        norma_equi: "Por ejemplo, prever una alternativa adecuada cuando una actividad digital no sea accesible.",
        norma_sost: "Por ejemplo, evitar consultas innecesarias y recurrir a una búsqueda convencional cuando baste.",
        priv_cuentas: "Por ejemplo, valorar el uso de cuentas institucionales aprobadas y gestionadas por el centro, cuando estén disponibles.",
        priv_reg: "Por ejemplo, indicar qué perfiles disponen de cuentas en plataformas de terceros, quién las administra y cómo se revisan los accesos para cada actividad.",
        servicios_centro: "Ejemplo: una licencia o servicio de IA ya contratado o gestionado por el centro.",
        servicios_otros: "Antes de prever su uso, conviene comprobar los requisitos de instalación y funcionamiento, los dispositivos y recursos técnicos necesarios, dónde se guarda la información y si puede transmitirse posteriormente."
    }
};

const placeholderOverridesByType = {
    cepa: {
        priv_cuentas: "Por ejemplo, describir cómo se organiza el acceso del personal y, si se prevé, del alumnado adulto en actividades presenciales o a distancia.",
        priv_reg: "Por ejemplo, describir cómo se gestionan las cuentas del personal y, si se prevén para el alumnado adulto, cómo se organizan por modalidad o turno.",
        prof_text: "Por ejemplo, preparar una lectura guiada o una ficha de apoyo vinculada a los objetivos de aprendizaje y al nivel del grupo, con revisión docente.",
        prof_media: "Por ejemplo, crear esquemas visuales, audios de apoyo o recursos de repaso para una actividad formativa, revisados por el profesorado.",
        prof_eval: "Por ejemplo, preparar un borrador de retroalimentación sobre una producción del alumnado adulto a partir de criterios de evaluación conocidos.",
        prof_form: "Por ejemplo, adaptar casos de uso de IA a distintos niveles de competencia digital y revisar que las instrucciones sean claras.",
        alum_chat: "Por ejemplo, ensayar una conversación sobre una situación cotidiana ficticia y valorar si las respuestas del asistente sirven para ese contexto.",
        norma_transp: "Por ejemplo, acordar una descripción breve del apoyo que aportó la IA a una tarea, también si se realizó a distancia, y limitarla a la información necesaria sin pedir el historial completo de instrucciones.",
        norma_oral: "Por ejemplo, valorar una explicación breve del proceso o una actividad alternativa vinculada al objetivo formativo, también a distancia cuando resulte adecuado.",
        norma_disp: "Por ejemplo, concretar las reglas del centro para el uso de dispositivos personales según la actividad y la modalidad, junto con las alternativas disponibles.",
        norma_equi: "Por ejemplo, ofrecer acceso a equipos del centro y alternativas adaptadas a las modalidades, sedes y turnos para las actividades con IA fuera del horario lectivo.",
        norma_sost: "Por ejemplo, considerar los recursos digitales disponibles en cada modalidad y recurrir a la IA solo cuando aporte valor a los objetivos formativos."
    },
    edre: {
        priv_cuentas: "Por ejemplo, concretar qué perfiles acceden a cuentas institucionales en actividades de enseñanza deportiva y quién gestiona los cambios.",
        priv_reg: "Por ejemplo, indicar qué perfiles utilizan cuentas en actividades de enseñanza deportiva y quién actualiza los accesos cuando cambian los grupos o actividades.",
        prof_text: "Por ejemplo, preparar un borrador de planificación de una sesión de entrenamiento, revisado por el equipo docente.",
        prof_media: "Por ejemplo, elaborar un esquema visual genérico para explicar una técnica o una situación de juego, sin utilizar imágenes identificables de deportistas.",
        prof_eval: "Por ejemplo, preparar un borrador de retroalimentación sobre una situación técnica o táctica ficticia.",
        prof_form: "Por ejemplo, contrastar propuestas sobre técnica y táctica con casos ficticios y contenidos de la modalidad.",
        alum_chat: "Por ejemplo, analizar una situación táctica ficticia con el asistente y contrastar su explicación con los contenidos de la actividad.",
        norma_transp: "Por ejemplo, indicar si la IA se usó para planificar una sesión de entrenamiento o analizar una técnica o situación de juego, y qué propuestas se contrastaron con la práctica y los objetivos formativos, sin incluir imágenes ni datos que identifiquen a deportistas.",
        norma_oral: "Por ejemplo, contrastar una explicación del análisis técnico o táctico con una demostración práctica, cuando resulte adecuada al objetivo formativo.",
        norma_disp: "Por ejemplo, si se prevé el uso de dispositivos personales en actividades deportivas, concretar en qué espacios y condiciones se permiten y qué alternativa ofrece el centro.",
        norma_equi: "Por ejemplo, ofrecer recursos del centro o una alternativa cuando una actividad digital con IA se realice en espacios sin dispositivo o conexión.",
        norma_sost: "Por ejemplo, reservar la IA para tareas de planificación o análisis técnico-táctico cuando aporte valor frente a otros recursos y evitar consultas que no mejoren la actividad."
    },
    easd_ea: {
        priv_cuentas: "Por ejemplo, indicar qué perfiles acceden durante proyectos de arte o diseño y cómo se gestionan los permisos.",
        priv_reg: "Por ejemplo, concretar cómo se asignan y revisan las cuentas y los permisos durante proyectos de arte o diseño.",
        prof_text: "Por ejemplo, preparar un borrador de texto de presentación para un proyecto de arte o diseño y revisarlo antes de incorporarlo.",
        prof_media: "Por ejemplo, generar referencias visuales genéricas para explorar opciones de composición, sin adjuntar obras personales identificables.",
        prof_form: "Por ejemplo, revisar sesgos, autoría y derechos de uso en imágenes generadas para proyectos de arte o diseño.",
        alum_chat: "Por ejemplo, explorar conceptos visuales para un proyecto y comparar las propuestas del asistente con los objetivos de diseño.",
        norma_transp: "Por ejemplo, describir si se usó IA para explorar referencias visuales, composiciones o textos de presentación, y qué decisiones de diseño tomó el alumnado al incorporarlos al proyecto, sin adjuntar obras personales ni información confidencial.",
        norma_oral: "Por ejemplo, valorar una explicación breve de las decisiones de diseño o una muestra del proceso creativo, según el objetivo del proyecto.",
        norma_disp: "Por ejemplo, si se prevén dispositivos personales en talleres o proyectos de arte y diseño, concretar en qué actividades se admiten, bajo qué condiciones y qué alternativa ofrece el centro.",
        norma_equi: "Por ejemplo, facilitar acceso a equipos o materiales digitales del centro para los proyectos que los necesiten y una alternativa si no se dispone de dispositivo o conexión.",
        norma_sost: "Por ejemplo, valorar si generar referencias visuales o propuestas de diseño aporta valor al proyecto frente a los recursos disponibles y evitar repeticiones sin una finalidad clara."
    },
    fp: {
        priv_cuentas: "Por ejemplo, indicar qué perfiles acceden a cuentas institucionales en las prácticas previstas y quién gestiona los cambios.",
        priv_reg: "Por ejemplo, indicar qué perfiles disponen de cuentas para las prácticas previstas, quién administra los accesos y cómo se actualizan al cambiar de módulo o proyecto.",
        prof_text: "Por ejemplo, preparar un borrador de instrucciones para una práctica profesional vinculada a los resultados de aprendizaje del módulo.",
        prof_media: "Por ejemplo, preparar un diagrama que represente las fases de un procedimiento técnico del módulo.",
        prof_form: "Por ejemplo, contrastar respuestas sobre procedimientos profesionales con documentación técnica y casos simulados.",
        alum_chat: "Por ejemplo, simular un diálogo sobre un procedimiento profesional con un caso ficticio y contrastar los pasos con la documentación del módulo.",
        norma_oral: "Por ejemplo, valorar una explicación breve del proceso o una actividad alternativa vinculada a los resultados de aprendizaje del módulo, con criterios claros y proporcionales.",
        norma_transp: "Por ejemplo, indicar qué partes de una práctica o proyecto profesional se apoyaron en IA y para qué se utilizó. Si la actividad implica a una empresa, evitar datos o información confidencial; incluir ejemplos de instrucciones solo cuando puedan compartirse y ayuden a comprender el proceso.",
        norma_disp: "Por ejemplo, en FP, como norma general, no se usan móviles dentro del aula; se permiten solo para un uso pedagógico decidido y supervisado por el equipo docente. Prever circunstancias excepcionales y regular otros dispositivos en la política del centro y las NOFC.",
        norma_equi: "Por ejemplo, facilitar recursos del centro para tareas profesionales con IA y prever una alternativa equivalente cuando no haya dispositivo o conexión fuera del horario lectivo.",
        norma_sost: "Por ejemplo, reservar la IA para tareas profesionales en las que aporte valor frente a la documentación técnica u otros recursos disponibles, evitando consultas repetidas."
    },
    eoi: {
        priv_cuentas: "Por ejemplo, señalar qué perfiles acceden a cuentas institucionales en actividades de práctica lingüística.",
        priv_reg: "Por ejemplo, indicar qué perfiles utilizan cuentas para la práctica lingüística y cómo se gestionan sus accesos en actividades presenciales o a distancia.",
        prof_form: "Por ejemplo, revisar errores y expresiones poco naturales en diálogos generados para las lenguas que se enseñan.",
        norma_transp: "Por ejemplo, indicar si la IA se usó para practicar, revisar o traducir y qué cambios hizo el alumnado, sin exigir el historial completo de instrucciones ni incluir datos personales en la declaración.",
        norma_oral: "Por ejemplo, valorar una explicación breve del proceso en el formato adecuado a la destreza trabajada, también en actividades a distancia.",
        norma_disp: "Por ejemplo, recoger que los móviles no se usan en el aula salvo decisión pedagógica del equipo docente y bajo su supervisión; prever circunstancias excepcionales y concretar otros dispositivos en la política del centro y las NOFC.",
        norma_equi: "Por ejemplo, ofrecer acceso a las aulas informáticas para practicar idiomas con IA y prever una alternativa cuando falte dispositivo o conexión.",
        alum_chat: "Por ejemplo, practicar un diálogo en el idioma estudiado y revisar las expresiones propuestas por el asistente.",
        norma_sost: "Por ejemplo, usar IA al preparar recursos lingüísticos solo cuando aporte valor frente a materiales disponibles y contrastar sus propuestas con fuentes fiables."
    },
};

const defaultAgeOptionsByType = {
    escuela_infantil: ['menores_14'],
    ceip: ['menores_14'],
    cee: ['menores_14', 'edad_14_17', '18_mas'],
    ies: ['menores_14', 'edad_14_17'],
    eoi: ['edad_14_17', '18_mas'],
    cepa: ['18_mas'],
    fp: ['edad_14_17', '18_mas'],
    esad: ['18_mas'],
    conservatorio: ['menores_14', 'edad_14_17', '18_mas'],
    easd_ea: [],
    edre: []
};

function toggleSubOptions(checkbox, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Si el contenedor no existe todavía, salimos sin error
    
    if (checkbox.checked) {
        container.style.display = 'block';
        container.style.animation = 'fadeIn 0.3s';
    } else {
        container.style.display = 'none';
    }
}

function actualizarAyudaEjemploDinamico(textarea, ejemplo) {
    textarea.placeholder = textarea.getAttribute('data-add-placeholder') || 'Añadir norma personalizada';
    if (textarea.hasAttribute('data-parent')) {
        const parent = document.getElementById(textarea.getAttribute('data-parent'));
        const sharedHintId = parent?.getAttribute('aria-describedby');
        if (sharedHintId && ejemplo) textarea.setAttribute('aria-describedby', sharedHintId);
        else textarea.removeAttribute('aria-describedby');
        return;
    }

    const hintId = `ayuda-${textarea.id}`;
    let hint = document.getElementById(hintId);
    if (!hint) {
        hint = document.createElement('p');
        hint.id = hintId;
        hint.className = 'dynamic-field-hint';
        hint.setAttribute('aria-live', 'polite');
        textarea.parentNode.insertBefore(hint, textarea);
    }

    hint.textContent = ejemplo || '';
    hint.hidden = !ejemplo;
    if (ejemplo) {
        textarea.setAttribute('aria-describedby', hintId);
    } else {
        textarea.removeAttribute('aria-describedby');
    }
}

const consejosSeccionesAdicionales = {
    aulaEquidad: {
        escuela_infantil: 'El centro puede ofrecer alternativas desde sus recursos, sin exigir dispositivos, conexión ni cuentas familiares.',
        ceip: 'El centro puede prever acompañamiento para las tareas digitales y una alternativa para quien no disponga de equipo propio.',
        cee: 'Las alternativas pueden ajustarse a distintos apoyos y formas de acceso.',
        ies: 'El protocolo puede prever alternativas para las tareas fuera del centro que no dependan de dispositivos o conexión propios.',
        fp: 'Se pueden prever recursos del centro o una alternativa equivalente para el trabajo fuera del horario lectivo.',
        eoi: 'El protocolo puede prever otra forma de práctica cuando no se disponga de conexión o dispositivo personal.',
        cepa: 'El centro puede tener en cuenta la disponibilidad variable de dispositivos y prever otra forma de realizar la tarea.',
        esad: 'El centro puede prever que los procesos creativos se realicen sin depender de equipo personal.',
        conservatorio: 'El centro puede ofrecer opciones de práctica que no dependan de dispositivo, conexión o grabación propios.',
        easd_ea: 'Si se prevén proyectos de arte o diseño con medios digitales, el centro puede facilitar alternativas para que la participación no dependa del equipo propio.',
        edre: 'Si las actividades se desarrollan en espacios con distinta disponibilidad de conexión o dispositivos, el centro puede prever alternativas para realizarlas.'
    },
    normaSemaforo: {
        escuela_infantil: 'En el primer ciclo de educación infantil, las actividades con el alumnado se realizan sin IA. El semáforo orienta en este ciclo la labor de preparación y diseño de materiales por parte del personal educativo.',
        ceip: 'En educación infantil y primaria, el semáforo ayuda a secuenciar la mediación docente, reservando el nivel verde para la indagación colectiva guiada y asegurando actividades fundamentales sin IA para afianzar la lectoescritura y el razonamiento.',
        cee: 'En educación especial, el semáforo permite graduar el uso de herramientas de accesibilidad y comunicación asistida, asegurando que las decisiones educativas y la estimulación humana directa permanezcan en el centro.',
        ies: 'En educación secundaria y bachillerato, el semáforo facilita acordar con el alumnado el grado de autonomía permitido en cada tarea, delimitando cuándo la IA asiste en la ideación y cuándo se exige producción individual o prueba sin IA.',
        fp: 'En formación profesional, el semáforo vincula el uso de IA a estándares de desempeño profesional y confidencialidad, reservando el nivel rojo para las destrezas prácticas de taller y la resolución técnica presencial.',
        eoi: 'En enseñanzas de idiomas, el semáforo ayuda a graduar el apoyo de traducción y modelos lingüísticos para el estudio, asegurando que las pruebas de certificación y la producción oral espontánea se desarrollen sin IA.',
        cepa: 'En educación de personas adultas, el semáforo fomenta la autonomía digital y la transparencia en las tareas, adaptando las alternativas presenciales para el alumnado en alfabetización inicial o en aulas penitenciarias.',
        esad: 'En arte dramático, el semáforo distingue la exploración dramatúrgica y documental preliminar de la vivencia actoral, reservando el nivel rojo para el trabajo de ensayos, la presencia viva y la escena.',
        easd_ea: 'En escuelas de arte y diseño, el semáforo delimita el papel de los generadores sintéticos en la fase de ideación o moodboard, preservando la autoría personal y la ejecución plástica y proyectual propia.',
        edre: 'En enseñanzas deportivas de régimen especial, el semáforo orienta el análisis de datos técnicos, situaciones tácticas y planificaciones, manteniendo en nivel rojo la práctica motriz en pista o campo y las pruebas de rendimiento deportivo real.',
        conservatorio: 'En música y danza, el semáforo orienta el análisis formal, la transcripción o el acompañamiento de estudio, garantizando que la interpretación acústica, la técnica corporal y las audiciones se realicen sin IA.'
    }
};

function actualizarConsejoPorTipologia(id, consejos, tipo, respaldo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        const texto = Object.prototype.hasOwnProperty.call(consejos, tipo) ? consejos[tipo] : respaldo;
        elemento.textContent = texto;
        const ayudaContextual = elemento.closest('.section-help-guidance');
        if (ayudaContextual) ayudaContextual.hidden = !texto;
    }
}

function adaptarFormulario() {
    const tipoSelect = document.getElementById('tipo-centro');
    if (!tipoSelect) return;
    
    const tipo = tipoSelect.value.toLowerCase();
    if (tipo !== 'cepa' && state.aulaPenitenciaria) state.aulaPenitenciaria = false;
    actualizarConsejoPorTipologia('consejo-aula-equidad', consejosSeccionesAdicionales.aulaEquidad, tipo, 'El protocolo puede concretar qué dispositivos se permiten, en qué actividades y qué alternativas se ofrecen a quien no disponga de ellos.');
    actualizarConsejoPorTipologia('consejo-norma-semaforo', consejosSeccionesAdicionales.normaSemaforo, tipo, '');
    const typeInfo = document.getElementById('tipo-centro-info');
    if (typeInfo) {
        const description = typeDescriptionTexts[tipo];
        typeInfo.replaceChildren();
        if (description) {
            const intro = document.createElement('p');
            intro.textContent = `${description.intro} Para el protocolo pueden ser relevantes:`;

            const list = document.createElement('ul');
            description.aspects.forEach(aspect => {
                const item = document.createElement('li');
                item.textContent = aspect;
                list.appendChild(item);
            });

            typeInfo.append(intro, list);
        }
        typeInfo.style.display = description ? 'block' : 'none';
    }
    const textAreas = document.querySelectorAll('.dynamic-ph');
    let grupo = 'default';

    if (tipo !== tipoCentroAnterior) {
        aplicarEdadesPredeterminadas(tipo);

        tipoCentroAnterior = tipo;
    }

    if (tipo.includes('escuela_infantil')) {
        grupo = 'escuela_infantil';
    } else if (tipo.includes('ceip')) {
        grupo = 'ceip';
    } else if (tipo.includes('cee')) {
        grupo = 'cee';
    } else if (tipo.includes('ies')) {
        grupo = 'ies';
    } else if (tipo.includes('cifp') || tipo.includes('fp') || tipo.includes('integrado')) {
        grupo = 'ies';
    } else if (tipo.includes('eoi')) {
        grupo = 'adultos';
    } else if (tipo.includes('cepa')) {
        grupo = 'adultos';
    } else if (tipo.includes('esad')) {
        grupo = 'esad';
    } else if (tipo.includes('conservatorio')) {
        grupo = 'conservatorio';
    }

textAreas.forEach(ta => {

    const phType = ta.getAttribute('data-ph-type');

    const placeholderByType = placeholderOverridesByType[tipo]?.[phType];
    const ejemplo = placeholderByType
        || placeholderTexts[grupo]?.[phType]
        || placeholderTexts.default?.[phType]
        || '';

    actualizarAyudaEjemploDinamico(ta, ejemplo);

});

    if (state.pantallaPaso1 === 'resumen') {
        actualizarResumenContextual();
    }
    actualizarInterfaz();

}

function aplicarEdadesPredeterminadas(tipo) {
    const grupo = tipo.includes('escuela_infantil') ? 'escuela_infantil'
        : tipo.includes('cifp') || tipo.includes('fp') || tipo.includes('integrado')
        ? 'fp'
        : tipo.includes('ceip') ? 'ceip'
            : tipo.includes('cee') ? 'cee'
                : tipo.includes('ies') ? 'ies'
                    : tipo.includes('eoi') ? 'eoi'
                        : tipo.includes('cepa') ? 'cepa'
                            : tipo.includes('esad') ? 'esad'
                                : tipo.includes('conservatorio') ? 'conservatorio'
                                    : tipo === 'easd_ea' ? 'easd_ea'
                                        : tipo === 'edre' ? 'edre'
                                    : null;
    const opciones = defaultAgeOptionsByType[grupo] || [];

    Object.keys(state.contextoSeleccionado)
        .filter(key => key.startsWith('CARD_AGE-'))
        .forEach(key => delete state.contextoSeleccionado[key]);

    opciones.forEach(opcion => {
        state.contextoSeleccionado[`CARD_AGE-${opcion}`] = true;
    });
}

function migrarSeleccionesEdad(selecciones = {}) {
    const migradas = { ...selecciones };
    if (migradas['CARD_AGE-edad_14_18']) {
        migradas['CARD_AGE-edad_14_17'] = true;
        migradas['CARD_AGE-18_mas'] = true;
    }
    if (migradas['CARD_AGE-adulto']) migradas['CARD_AGE-18_mas'] = true;

    delete migradas['CARD_AGE-edad_14_18'];
    delete migradas['CARD_AGE-adulto'];

    return migradas;
}

const modalidadesInstitucionalesDisponibles = [
    { id: 'consejeria', label: 'Copilot con cuenta institucional @educastillalamancha.es (docentes)' },
    { id: 'centro', label: 'Licencias o contratos gestionados por el centro' },
    { id: 'otro', label: 'Herramientas propias y locales' }
];

function modalidadesInstitucionalesDeSesion(data) {
    const validas = new Set(modalidadesInstitucionalesDisponibles.map(modalidad => modalidad.id));
    if (Array.isArray(data.modalidadesInstitucionales)) {
        const modalidades = [...new Set(data.modalidadesInstitucionales.filter(modalidad => validas.has(modalidad)))];
        if (data.iaSinConexion === true && !modalidades.includes('otro')) modalidades.push('otro');
        return {
            modalidades,
            serviciosGestionadosCentro: typeof data.serviciosGestionadosCentro === 'string' ? data.serviciosGestionadosCentro : '',
            otrosEntornosInstitucionales: typeof data.otrosEntornosInstitucionales === 'string' ? data.otrosEntornosInstitucionales : '',
            iaSinConexion: false
        };
    }

    const servicios = Array.isArray(data.herramientasAutorizadas) ? data.herramientasAutorizadas : [];
    const modalidades = new Set();
    const serviciosCentro = [];
    const otrosEntornos = [];
    servicios.forEach(servicio => {
        const nombre = typeof servicio.nombre === 'string' ? servicio.nombre.trim() : '';
        const esCopilot = /copilot/i.test(nombre) || servicio.id === 'copilot-trabajo';
        if (esCopilot) {
            modalidades.add('consejeria');
        } else if (servicio.modalidadAcceso === 'centro' && nombre) {
            modalidades.add('centro');
            serviciosCentro.push(nombre);
        } else if (nombre && ['otro', 'consejeria'].includes(servicio.modalidadAcceso)) {
            modalidades.add('otro');
            otrosEntornos.push(nombre);
        }
    });

    if (data.versionHerramientas === 1 && data.inputs?.['sub-prof-1-1'] === true) {
        modalidades.add('consejeria');
    }
    if (data.iaSinConexion === true) modalidades.add('otro');
    return {
        modalidades: [...modalidades],
        serviciosGestionadosCentro: [...new Set(serviciosCentro)].join('\n'),
        otrosEntornosInstitucionales: [...new Set(otrosEntornos)].join('\n'),
        iaSinConexion: false
    };
}

function leerModalidadesInstitucionales() {
    const opciones = Array.from(document.querySelectorAll('[data-institutional-modality]'));
    if (!opciones.length) return state.modalidadesInstitucionales;
    return opciones.filter(opcion => opcion.checked).map(opcion => opcion.dataset.institutionalModality);
}

function leerLineasCampoDinamico(textarea) {
    if (!textarea) return '';
    const group = textarea.closest?.('.textarea-group');
    const fields = group ? Array.from(group.querySelectorAll('textarea')) : [textarea];
    return fields.map(field => field.value.trim()).filter(Boolean).join('\n');
}

function mostrarLineasCampoDinamico(textarea, contenido) {
    if (!textarea) return;
    const group = textarea.closest?.('.textarea-group');
    if (!group) {
        textarea.value = contenido || '';
        return;
    }

    group.querySelectorAll('.textarea-extra-wrapper').forEach(wrapper => wrapper.remove());
    const lines = String(contenido || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    textarea.value = lines.shift() || '';
    lines.forEach(line => crearTextareaExtra(group, textarea, line));
}

function actualizarModalidadesDesdeFormulario() {
    const opciones = Array.from(document.querySelectorAll('[data-institutional-modality]'));
    if (opciones.length) state.modalidadesInstitucionales = leerModalidadesInstitucionales();
    const serviciosCentro = document.getElementById('servicios-gestionados-centro');
    const otrosEntornos = document.getElementById('otros-entornos-institucionales');
    if (serviciosCentro) state.serviciosGestionadosCentro = leerLineasCampoDinamico(serviciosCentro);
    if (otrosEntornos) state.otrosEntornosInstitucionales = leerLineasCampoDinamico(otrosEntornos);
    actualizarRecordatorioServiciosPaso4();
}

function actualizarRecordatorioServiciosPaso4() {
    const recordatorio = document.getElementById('recordatorio-servicios-paso2');
    if (!recordatorio) return;

    const servicios = (state.modalidadesInstitucionales || []).includes('centro')
        ? String(state.serviciosGestionadosCentro || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
        : [];

    if (servicios.length > 0) {
        const etiqueta = 'Licencias o contratos gestionados por el centro:';
        const detalle = ` ${servicios.join(', ')}. Conviene concretar qué perfiles acceden y quién administra estos permisos.`;
        recordatorio.textContent = `${etiqueta}${detalle}`;
        if (typeof document !== 'undefined' && document.createElement) {
            try {
                const strong = document.createElement('strong');
                strong.textContent = etiqueta;
                const texto = document.createTextNode(detalle);
                if (typeof recordatorio.replaceChildren === 'function') {
                    recordatorio.replaceChildren(strong, texto);
                }
            } catch (_) {}
        }
        recordatorio.hidden = false;
    } else {
        recordatorio.textContent = '';
        if (typeof recordatorio.replaceChildren === 'function') {
            try { recordatorio.replaceChildren(); } catch (_) {}
        }
        recordatorio.hidden = true;
    }
}

function renderizarEntornosInstitucionales() {
    const titularidad = obtenerSeleccionesContextoDisponibles();
    const copilotDisponible = titularidad['CARD_GOVERNANCE-titularidad_privada'] !== true
        && (titularidad['CARD_GOVERNANCE-titularidad_publica'] === true
            || titularidad['CARD_GOVERNANCE-titularidad_concertado'] === true);
    if (!copilotDisponible) {
        state.modalidadesInstitucionales = (state.modalidadesInstitucionales || [])
            .filter(modalidad => modalidad !== 'consejeria');
    }
    const selected = new Set(state.modalidadesInstitucionales || []);
    const copilotInput = document.getElementById('entorno-consejeria');
    const copilotOption = copilotInput?.closest('.contextual-option');
    if (copilotOption) copilotOption.hidden = !copilotDisponible;
    document.querySelectorAll('[data-institutional-modality]').forEach(opcion => {
        opcion.checked = selected.has(opcion.dataset.institutionalModality);
    });
    const serviciosCentro = document.getElementById('entorno-centro-detalles');
    const otrosEntornos = document.getElementById('entorno-otros-detalles');
    const centroTextarea = document.getElementById('servicios-gestionados-centro');
    const otrosTextarea = document.getElementById('otros-entornos-institucionales');
    if (serviciosCentro) serviciosCentro.hidden = !selected.has('centro');
    if (otrosEntornos) otrosEntornos.hidden = !selected.has('otro');
    if (centroTextarea) mostrarLineasCampoDinamico(centroTextarea, state.serviciosGestionadosCentro);
    if (otrosTextarea) mostrarLineasCampoDinamico(otrosTextarea, state.otrosEntornosInstitucionales);
}

function inicializarEntornosInstitucionales() {
    const options = document.getElementById('institutional-environments-options');
    if (options) {
        options.addEventListener('change', event => {
            if (!event.target.matches('[data-institutional-modality], textarea')) return;
            actualizarModalidadesDesdeFormulario();
            renderizarEntornosInstitucionales();
            guardarEnLocalStorage();
        });
        options.addEventListener('input', event => {
            if (!event.target.matches('textarea')) return;
            actualizarModalidadesDesdeFormulario();
            guardarEnLocalStorage();
        });
    }
    renderizarEntornosInstitucionales();
}

// Funciones de Guardado y Carga de Datos (Incluyendo LocalStorage)
function recolectarDatos() {
    actualizarModalidadesDesdeFormulario();
    const data = { 
    nombre: document.getElementById('nombre-centro').value, 
    tipo: document.getElementById('tipo-centro').value, 
    localidad: document.getElementById('localidad').value,
    pasoActual: state.pasoActual,
    configuracionIndex: state.configuracionIndex,
    pantallaPaso1: state.pantallaPaso1,
    edicionResumen: state.edicionResumen,
    edicionDatosCentro: state.edicionDatosCentro,
    versionFlujo: 2,
    versionHerramientas: 7,
    aulaPenitenciaria: state.aulaPenitenciaria,
    iaSinConexion: state.iaSinConexion,
    contextoSeleccionado: state.contextoSeleccionado,
    modalidadesInstitucionales: state.modalidadesInstitucionales,
    serviciosGestionadosCentro: state.serviciosGestionadosCentro,
    otrosEntornosInstitucionales: state.otrosEntornosInstitucionales,
    inputs: {} 
};
document.querySelectorAll('.auto-save').forEach(el => {

    if (el.type === 'checkbox') {

        data.inputs[el.id] = el.checked;

    } else if (
        el.tagName === 'TEXTAREA' &&
        el.id
    ) {

        const grupo = [el.value];

        const extras = document.querySelectorAll(
            `textarea[data-parent="${el.id}"]`
        );

        extras.forEach(extra => {
            grupo.push(extra.value);
        });

        data.inputs[el.id] = grupo;
    }
});
    return data;
}

function guardarEnLocalStorage() {
    const data = recolectarDatos();
    localStorage.setItem('protocoloIA_Data', JSON.stringify(data));
    actualizarVisibilidadGuardar();
}

function restaurarDesdeLocalStorage() {
    const savedData = localStorage.getItem('protocoloIA_Data');
    if(savedData) {
        const data = JSON.parse(savedData);
        aplicarDatosAFormulario(data);
        if (data.versionHerramientas !== 7) {
            guardarEnLocalStorage();
        }
    }
}

function continuarSesion() {
    restaurarDesdeLocalStorage();
    if (state.pasoActual === 0) iniciarWizard();
    actualizarResumenContextual();
}

function actualizarVisibilidadGuardar() {
    const btnGuardar = document.getElementById('btn-save-json');
    if (!btnGuardar) return;

    const haySesionGuardada = Boolean(localStorage.getItem('protocoloIA_Data'));
    btnGuardar.hidden = state.pasoActual === 0 && !haySesionGuardada;
}

function actualizarEstadoPortada() {

    const haySesionGuardada =
        localStorage.getItem('protocoloIA_Data');

    const acciones =
        document.getElementById('session-actions');

    const btnComenzar =
        document.getElementById('btn-comenzar');

    if (haySesionGuardada) {

        if (acciones) {
            acciones.style.display = 'block';
        }

        if (btnComenzar) {
            btnComenzar.style.display = 'none';
        }

    } else {

        if (acciones) {
            acciones.style.display = 'none';
        }

        if (btnComenzar) {
            btnComenzar.style.display = 'inline-block';
        }

    }

    actualizarVisibilidadGuardar();

}

function iniciarNuevaSesion() {

    showConfirmModal(
        'Nueva sesión',
        '¿Desea eliminar la sesión guardada y comenzar una nueva?',
        function () {

            localStorage.removeItem(
                'protocoloIA_Data'
            );

            location.reload();

        }
    );

}

function obtenerContainerId(checkboxId) {

    return 'sub_' +
        checkboxId
            .replace('tool-', '')
            .replace('norma-', 'norma_')
            .replace('priv-', 'priv_')
            .replace(/-/g, '_');

}

function aplicarDatosAFormulario(data) {
    state.aulaPenitenciaria = data.aulaPenitenciaria === true;
    state.edicionResumen = data.edicionResumen === true;
    state.edicionDatosCentro = data.edicionDatosCentro === true;
    state.contextoSeleccionado = migrarSeleccionesEdad(data.contextoSeleccionado || {});
    delete state.contextoSeleccionado['CARD_SCENARIOS-centro_sin_ia'];
    const entornosGuardados = modalidadesInstitucionalesDeSesion(data);
    state.modalidadesInstitucionales = entornosGuardados.modalidades;
    state.serviciosGestionadosCentro = entornosGuardados.serviciosGestionadosCentro;
    state.otrosEntornosInstitucionales = entornosGuardados.otrosEntornosInstitucionales;
    state.iaSinConexion = entornosGuardados.iaSinConexion;
    renderizarEntornosInstitucionales();

    const nombreInput = document.getElementById('nombre-centro');
    if (nombreInput) nombreInput.value = data.nombre || '';

    const localidadInput = document.getElementById('localidad');
    if (localidadInput) localidadInput.value = data.localidad || '';

    const tipoSelect = document.getElementById('tipo-centro');
    if (tipoSelect) {
        tipoSelect.value = data.tipo || '';
        if (data.tipo) {
            // La restauración conserva las edades guardadas; no es un cambio de tipología.
            tipoCentroAnterior = tipoSelect.value.toLowerCase();
            adaptarFormulario();
        }
    }

    document.querySelectorAll('.textarea-extra-wrapper').forEach(wrapper => wrapper.remove());
    document.querySelectorAll('.auto-save').forEach(el => {
        if (el.type === 'checkbox' && !el.disabled) {
            el.checked = false;
        } else if (el.tagName === 'TEXTAREA') {
            el.value = '';
        }
    });

    for (const [key, value] of Object.entries(data.inputs || {})) {

        const el = document.getElementById(key);

        if (el) {

            if (el.type === 'checkbox' && !el.disabled) {

                el.checked = value;

                if (el.classList.contains('main-checkbox')) {

                    const containerId =
                        obtenerContainerId(key);

                    toggleSubOptions(
                        el,
                        containerId
                    );

                }

            } else if (el.tagName === 'TEXTAREA') {

                if (Array.isArray(value)) {

                    el.value = value[0] || '';

                    const group = document.getElementById(
                        'group-' + el.id
                    );

                    if (group) {

                        for (let i = 1; i < value.length; i++) {

                            crearTextareaExtra(
                                group,
                                el,
                                value[i]
                            );

                        }

                    }

                } else {

                    el.value = value;

                }

            }

        }

    }

    renderizarEntornosInstitucionales();

    document.querySelectorAll('.main-checkbox').forEach(chk => {

        const containerId =
            obtenerContainerId(chk.id);

        toggleSubOptions(
            chk,
            containerId
        );

    });

    state.configuracionIndex = Number.isInteger(data.configuracionIndex) ? data.configuracionIndex : 0;

    if (typeof data.pasoActual !== 'number' || data.pasoActual <= 0) {
        actualizarVisibilidadGuardar();
        return;
    }

    if (data.versionFlujo === 2) {
        state.pantallaPaso1 = data.pantallaPaso1 || 'identificacion';
        if (data.pasoActual === 1) {
            mostrarPantallaPaso1(state.pantallaPaso1);
            if (state.pantallaPaso1 === 'configuracion') mostrarPreguntaConfiguracion();
            if (state.pantallaPaso1 === 'resumen') actualizarResumenContextual();
        }
        irAPaso(data.pasoActual);
        return;
    }

    if (data.pasoActual === 2) {
        state.pasoActual = 1;
        state.pantallaPaso1 = 'resumen';
        mostrarPantallaPaso1('resumen');
        actualizarResumenContextual();
        irAPaso(1);
        return;
    }

    const pasoMigrado = data.pasoActual > 2 ? data.pasoActual - 1 : data.pasoActual;
    state.pantallaPaso1 = pasoMigrado === 1 && Number.isInteger(data.configuracionIndex)
        ? 'configuracion'
        : 'identificacion';
    if (pasoMigrado === 1) {
        mostrarPantallaPaso1(state.pantallaPaso1);
        if (state.pantallaPaso1 === 'configuracion') mostrarPreguntaConfiguracion();
    }
    irAPaso(pasoMigrado);

}

function obtenerNombreArchivoProtocolo(nombreCentro, extension) {
    const centro = String(nombreCentro || 'Centro')
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
        .replace(/-+/g, '-')
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[. ]+$/g, '') || 'Centro';
    return `Protocolo de IA ${centro}.${extension}`;
}

function obtenerNombreArchivoSesion(nombreCentro) {
    return obtenerNombreArchivoProtocolo(nombreCentro, 'json');
}

async function solicitarDestinoGuardado(nombreArchivo, mimeType, extension, descripcion) {
    if (typeof navigator !== 'undefined' && /Electron\//i.test(navigator.userAgent)) {
        return { handle: null };
    }
    if (typeof window.showSaveFilePicker !== 'function') return { handle: null };

    try {
        return {
            handle: await window.showSaveFilePicker({
                suggestedName: nombreArchivo,
                types: [{
                    description: descripcion,
                    accept: { [mimeType]: [extension] }
                }]
            })
        };
    } catch (error) {
        if (error.name === 'AbortError') return null;
        throw error;
    }
}

async function guardarBlobArchivo(blob, nombreArchivo, destino) {
    if (destino.handle) {
        const escritor = await destino.handle.createWritable();
        try {
            await escritor.write(await blob.arrayBuffer());
            await escritor.close();
        } catch (error) {
            if (typeof escritor.abort === 'function') {
                try {
                    await escritor.abort();
                } catch {}
            }
            throw error;
        }
        return { estado: 'guardado', nombre: destino.handle.name || nombreArchivo };
    }

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return {
        estado: 'descargado',
        nombre: nombreArchivo,
        escrituraDirectaBloqueada: Boolean(destino.handle)
    };
}

async function exportarSesionJSON() {
    const nombreCentro = document.getElementById('nombre-centro').value;
    const nombreArchivo = obtenerNombreArchivoSesion(nombreCentro);
    const contenido = JSON.stringify(recolectarDatos(), null, 2);

    let destino;
    try {
        destino = await solicitarDestinoGuardado(
            nombreArchivo,
            'application/json',
            '.json',
            'Copia de sesión de la aplicación'
        );
        if (!destino) return;
        const resultado = await guardarBlobArchivo(
            new Blob([contenido], { type: 'application/json' }),
            nombreArchivo,
            destino
        );
        if (resultado.estado === 'guardado') {
            showModal('Guardado completado', `Copia guardada como "${resultado.nombre}". La aplicación también guarda los cambios automáticamente en este navegador.`);
        }
    } catch (error) {
        console.error(error);
        showModal('Error al guardar', 'No se pudo guardar la copia de sesión.');
    }
}

function añadirLineaTexto(button) {

    const groupId = button.dataset.target;
    const group = document.getElementById(groupId);

    if (!group) return;

    const primerTextarea = group.querySelector('textarea');

    if (!primerTextarea) return;

    crearTextareaExtra(
        group,
        primerTextarea,
        ''
    );

    guardarEnLocalStorage();
}

function crearTextareaExtra(group, textareaBase, valor = '') {

    const wrapper = document.createElement('div');

    wrapper.className = 'textarea-extra-wrapper';

    const nuevoTextarea = document.createElement('textarea');

    nuevoTextarea.className = textareaBase.className;

    nuevoTextarea.setAttribute(
        'data-ph-type',
        textareaBase.getAttribute('data-ph-type')
    );

    const addPlaceholder = textareaBase.getAttribute('data-add-placeholder');
    if (addPlaceholder) {
        nuevoTextarea.setAttribute('data-add-placeholder', addPlaceholder);
        nuevoTextarea.setAttribute('aria-label', addPlaceholder);
    }

nuevoTextarea.setAttribute(
    'data-parent',
    textareaBase.id
);

nuevoTextarea.name =
    textareaBase.id +
    '_extra_' +
    Date.now() +
    '_' +
    Math.floor(Math.random() * 1000);

    nuevoTextarea.placeholder = addPlaceholder || 'Añadir norma personalizada';

    const exampleHintId = textareaBase.getAttribute('aria-describedby');
    if (exampleHintId) nuevoTextarea.setAttribute('aria-describedby', exampleHintId);

    nuevoTextarea.value = valor;

    nuevoTextarea.addEventListener(
        'input',
        guardarEnLocalStorage
    );

    nuevoTextarea.addEventListener(
        'change',
        guardarEnLocalStorage
    );

    const btnDelete = document.createElement('button');

    btnDelete.type = 'button';

    btnDelete.className = 'btn-delete-line';

btnDelete.textContent = '🗑';

btnDelete.setAttribute(
    'aria-label',
    'Eliminar línea'
);
    btnDelete.addEventListener('click', () => {

        wrapper.remove();

        guardarEnLocalStorage();

    });

    wrapper.appendChild(nuevoTextarea);
    wrapper.appendChild(btnDelete);

    group.appendChild(wrapper);

    return nuevoTextarea;
}

function inicializarCamposMultiples() {

    const textareas =
    document.querySelectorAll('.ideas-textarea');

    textareas.forEach(textarea => {

        if (
        textarea.parentElement &&
        textarea.parentElement.classList.contains('textarea-group')
        ) {
        return;
        }

        if (
        textarea.hasAttribute('data-parent')
        ) {
         return;
            }


    const group = document.createElement('div');

    group.className = 'textarea-group';

    group.id = 'group-' + textarea.id;

    textarea.parentNode.insertBefore(
        group,
        textarea
    );

    group.appendChild(textarea);

    const btn = document.createElement('button');

    btn.type = 'button';

    btn.className = 'btn-add-line';

btn.textContent =
    '➕ Añadir otra línea';

btn.setAttribute(
    'aria-label',
    'Añadir otra línea'
);


    btn.dataset.target =
        group.id;

    btn.onclick = function() {

        añadirLineaTexto(this);

    };

    group.parentNode.insertBefore(
        btn,
        group.nextSibling
    );

});

}

function ejecutarCargaSesion(data) {
    aplicarDatosAFormulario(data);
    guardarEnLocalStorage();
    actualizarEstadoPortada();
    if (state.pasoActual === 0 || typeof data.pasoActual !== 'number' || data.pasoActual <= 0) {
        iniciarWizard();
    }
    showModal("Carga completada", "Datos restaurados correctamente.");
}

function esSesionJSONValida(data) {
    const esObjeto = valor => valor !== null && typeof valor === 'object' && !Array.isArray(valor);
    if (!esObjeto(data)) return false;
    if (!['nombre', 'tipo', 'localidad'].every(campo => typeof data[campo] === 'string')) return false;
    if (!Number.isInteger(data.pasoActual) || data.pasoActual < 0 || data.pasoActual > 6) return false;
    if (!esObjeto(data.contextoSeleccionado) || !esObjeto(data.inputs)) return false;
    if (!Object.values(data.contextoSeleccionado).every(valor => typeof valor === 'boolean')) return false;
    if (!Object.values(data.inputs).every(valor =>
        typeof valor === 'boolean' || typeof valor === 'string' ||
        (Array.isArray(valor) && valor.every(linea => typeof linea === 'string'))
    )) return false;

    const tipoSelect = document.getElementById('tipo-centro');
    if (!tipoSelect || !Array.from(tipoSelect.options).some(opcion => opcion.value === data.tipo)) return false;
    if (data.versionFlujo !== undefined &&
        (!Number.isInteger(data.versionFlujo) || data.versionFlujo < 0 || data.versionFlujo > 2)) return false;
    if (data.versionHerramientas !== undefined &&
        (!Number.isInteger(data.versionHerramientas) || data.versionHerramientas < 0 || data.versionHerramientas > 7)) return false;
    if (data.configuracionIndex !== undefined &&
        (!Number.isInteger(data.configuracionIndex) || data.configuracionIndex < 0)) return false;
    if (data.pantallaPaso1 !== undefined &&
        !['identificacion', 'configuracion', 'resumen'].includes(data.pantallaPaso1)) return false;
    const recuperaConfiguracion = data.pasoActual === 1 &&
        (data.versionFlujo === 2 ? data.pantallaPaso1 === 'configuracion' : data.configuracionIndex !== undefined);
    if (recuperaConfiguracion &&
        (data.configuracionIndex === undefined ||
            data.configuracionIndex >= obtenerPreguntasConfiguracion(data.tipo).length)) return false;
    if (!['edicionResumen', 'edicionDatosCentro', 'aulaPenitenciaria', 'iaSinConexion', 'centroSinIA']
        .every(campo => data[campo] === undefined || typeof data[campo] === 'boolean')) return false;
    if (!['serviciosGestionadosCentro', 'otrosEntornosInstitucionales']
        .every(campo => data[campo] === undefined || typeof data[campo] === 'string')) return false;
    if (data.modalidadesInstitucionales !== undefined &&
        (!Array.isArray(data.modalidadesInstitucionales) ||
            !data.modalidadesInstitucionales.every(modalidad =>
                modalidadesInstitucionalesDisponibles.some(disponible => disponible.id === modalidad)))) return false;
    if (data.herramientasAutorizadas !== undefined &&
        (!Array.isArray(data.herramientasAutorizadas) ||
            !data.herramientasAutorizadas.every(herramienta =>
                esObjeto(herramienta) &&
                ['id', 'nombre', 'modalidadAcceso'].every(campo =>
                    herramienta[campo] === undefined || typeof herramienta[campo] === 'string')))) return false;
    return true;
}

function importarSesionJSON(event) {
    const file = event.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!esSesionJSONValida(data)) {
                throw new Error('Invalid session JSON');
            }
            const hayDatosActivos = Boolean(localStorage.getItem('protocoloIA_Data')) || state.pasoActual > 0;
            if (hayDatosActivos) {
                showConfirmModal(
                    'Cargar copia de sesión',
                    'Al cargar este archivo se reemplazarán los datos de la sesión actual. ¿Desea continuar?',
                    () => ejecutarCargaSesion(data),
                    'Cargar sesión'
                );
            } else {
                ejecutarCargaSesion(data);
            }
        } catch (err) { 
            showModal("Error", "El archivo no es válido o no es compatible con esta versión.");
        } finally {
            if (event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
}

let focoAnteriorModal = null;

function abrirModal(elementoInicial) {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    if (modal.style.display !== 'flex') focoAnteriorModal = document.activeElement;
    modal.style.display = 'flex';
    elementoInicial?.focus();
}

function showModal(title, message, isHtml = false) {
    restablecerPresentacionModal();
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = title;
    const msgEl = document.getElementById('modal-msg');
    if (msgEl) {
        if (isHtml) {
            msgEl.innerHTML = message;
            if (msgEl.nodeType === undefined) {
                msgEl.textContent = message.replace(/<[^>]+>/g, '');
            }
        } else {
            msgEl.textContent = message;
        }
    }
    const btns = document.getElementById('modal-btns');
    if (btns) {
        btns.innerHTML = '<button class="btn btn-primary" id="modal-accept-btn" onclick="cerrarModal()">Aceptar</button>';
    }
    abrirModal(document.getElementById('modal-accept-btn'));
}

function mostrarDeclaracionTransparencia() {
    const message = [
        'Este recurso es una propuesta de la Consejería de Educación, Cultura y Deportes de Castilla – La Mancha, destinada a su difusión y reutilización por los centros educativos de Castilla-La Mancha.',
        'En coherencia con la labor en competencia digital e innovación educativa, esta propuesta busca reflejar los principios de transparencia, rigor técnico y uso ético de la tecnología.',
        'Durante su elaboración y programación se ha aplicado la metodología de desarrollo asistido por inteligencia artificial (<em>Vibe Coding</em>), contando con el apoyo de herramientas de IA generativa: Gemini (Google), para el boceto inicial; Microsoft Copilot, para preparar el primer borrador; Gemini Notebook, para la revisión de textos legales; y GitHub Copilot, para la programación y el apoyo en la redacción y revisión de textos de la guía.',
        'Todos los contenidos, pautas y desarrollos técnicos han contado con la debida supervisión, revisión crítica y validación humana para asegurar su adecuación pedagógica, técnica y normativa.'
    ].join('\n\n');

    showModal('Declaración de transparencia y uso de inteligencia artificial', message, true);
    document.getElementById('modal-msg').classList.add('transparency-message');
    document.getElementById('modal-content').classList.add('transparency-modal');
}

function restablecerPresentacionModal() {
    const message = document.getElementById('modal-msg');
    const content = document.getElementById('modal-content');
    if (message?.classList) message.classList.remove('transparency-message');
    if (content?.classList) content.classList.remove('transparency-modal');
}

function cerrarModal() {
    const modal = document.getElementById('custom-modal');
    if (!modal || modal.style.display !== 'flex') return;
    modal.style.display = 'none';
    restablecerPresentacionModal();
    const focoAnterior = focoAnteriorModal;
    focoAnteriorModal = null;
    if (focoAnterior?.isConnected && typeof focoAnterior.focus === 'function') focoAnterior.focus();
}

function gestionarTecladoModal(event) {
    const modal = document.getElementById('custom-modal');
    const modalAbierto = modal?.style.display === 'flex';
    if (modalAbierto && event.key === 'Tab') {
        const botones = Array.from(modal.querySelectorAll('button:not([disabled])'));
        if (!botones.length) return;
        const primero = botones[0];
        const ultimo = botones[botones.length - 1];
        if (!modal.contains(document.activeElement) || (event.shiftKey && document.activeElement === primero) || (!event.shiftKey && document.activeElement === ultimo)) {
            event.preventDefault();
            (event.shiftKey ? ultimo : primero).focus();
        }
    } else if (event.key === 'Escape') {
        if (modalAbierto) {
            event.preventDefault();
            cerrarModal();
            return;
        }
        const helpToggle = document.querySelector('.section-help-toggle[aria-expanded="true"]');
        if (helpToggle) {
            const panel = document.getElementById(helpToggle.getAttribute('aria-controls'));
            helpToggle.setAttribute('aria-expanded', 'false');
            if (panel) panel.hidden = true;
            helpToggle.focus();
        }
    }
}

document.addEventListener('keydown', gestionarTecladoModal);

function showConfirmModal(
    title,
    message,
    onConfirm,
    confirmLabel = 'Eliminar sesión'
) {
    restablecerPresentacionModal();

    document.getElementById(
        'modal-title'
    ).textContent = title;

    document.getElementById(
        'modal-msg'
    ).textContent = message;

    const btns =
        document.getElementById('modal-btns');

    btns.innerHTML = `
        <button class="btn"
                onclick="cerrarModal()">
            Cancelar
        </button>

        <button class="btn btn-primary"
                id="modal-confirm-btn">
            ${confirmLabel}
        </button>
    `;

    abrirModal(document.getElementById('modal-confirm-btn'));

    document.getElementById(
        'modal-confirm-btn'
    ).onclick = function () {

        cerrarModal();

        onConfirm();

    };

}

function auditarAplicacion() {

    console.group('🔎 Diagnóstico de aplicación');

    console.log('Versión: 1.1');

    let errores = 0;

    // -------------------------
    // CAMPOS MÚLTIPLES
    // -------------------------

    console.group('Campos múltiples');

    const textareas =
        document.querySelectorAll('.ideas-textarea');

    const textareasPrincipales =
        document.querySelectorAll(
            '.ideas-textarea:not([data-parent])'
        );

    let correctos = 0;

    textareas.forEach(textarea => {

        // Ignorar textarea dinámicos creados por el usuario
        if (
            textarea.hasAttribute('data-parent')
        ) {
            return;
        }

        const grupo =
            document.getElementById(
                'group-' + textarea.id
            );

        const boton =
            document.querySelector(
                `[data-target="group-${textarea.id}"]`
            );

        const ok =
            !!grupo && !!boton;

        if (ok) {
            correctos++;
        } else {
            errores++;
        }

        console.log(
            textarea.id,
            ok ? '✅' : '❌'
        );

    });

    console.log(
        `Resultado: ${correctos}/${textareasPrincipales.length}`
    );

    console.groupEnd();

    // -------------------------
    // SESIONES
    // -------------------------

    console.group('Sesiones');

    console.log(
        'continuarSesion',
        typeof continuarSesion === 'function'
            ? '✅'
            : '❌'
    );

    console.log(
        'iniciarNuevaSesion',
        typeof iniciarNuevaSesion === 'function'
            ? '✅'
            : '❌'
    );

    console.groupEnd();

    // -------------------------
    // MODAL
    // -------------------------

    console.group('Modal');

    console.log(
        'custom-modal',
        document.getElementById('custom-modal')
            ? '✅'
            : '❌'
    );

    console.log(
        'showModal',
        typeof showModal === 'function'
            ? '✅'
            : '❌'
    );

    console.log(
        'showConfirmModal',
        typeof showConfirmModal === 'function'
            ? '✅'
            : '❌'
    );

    console.log(
        'cerrarModal',
        typeof cerrarModal === 'function'
            ? '✅'
            : '❌'
    );

    console.groupEnd();

    // -------------------------
    // NAVEGACIÓN
    // -------------------------

    console.group('Navegación');

    for (let i = 0; i <= 6; i++) {

        const step =
            document.getElementById(`step-${i}`);

        console.log(
            `step-${i}`,
            step ? '✅' : '❌'
        );

        if (!step) {
            errores++;
        }

    }

    console.groupEnd();

    // -------------------------
    // CATÁLOGO DE TARJETAS
    // -------------------------

    console.group('Catálogo de tarjetas');

    console.log(
        'CARD_AGE',
        cardCatalog.CARD_AGE ? '✅' : '❌'
    );

    console.log(
        'CARD_GOVERNANCE',
        cardCatalog.CARD_GOVERNANCE ? '✅' : '❌'
    );

    console.groupEnd();

    // -------------------------
    // RESUMEN
    // -------------------------

    console.group('Resumen');

    if (errores === 0) {

        console.log(
            '✅ Aplicación validada sin errores detectados'
        );

    } else {

        console.warn(
            `⚠️ Errores detectados: ${errores}`
        );

    }

    console.groupEnd();

    console.groupEnd();

}

const tipologiasConRelacionEmpresas = ['fp', 'ies', 'cee', 'cepa', 'esad', 'easd_ea', 'edre'];

const ayudasRelacionEmpresasPorTipologia = {
    fp: 'En un CIFP, la formación en empresa puede implicar varias familias profesionales y empresas colaboradoras. Valora quién coordina los usos de IA vinculados a las prácticas y cómo se revisan.',
    ies: 'La coordinación de la FP Dual puede implicar al equipo de cada ciclo y a las empresas colaboradoras. Marca esta opción solo si el IES ofrece FP Dual u otra enseñanza con formación en empresa, y concreta quién coordina los usos de IA.',
    cee: 'En las ofertas profesionales del CEE, la coordinación con la entidad colaboradora puede requerir considerar la accesibilidad y los apoyos de cada actividad. Marca esta opción solo si el centro ofrece enseñanzas con formación en empresa.',
    cepa: 'En el CEPA, los turnos, modalidades y sedes pueden influir en la coordinación de la formación en empresa. Marca esta opción solo si la oferta incluye esas enseñanzas y concreta quién coordina los usos de IA con las entidades colaboradoras.',
    esad: 'En las ofertas de FP de la ESAD, la colaboración puede relacionarse con proyectos de creación, producción o trabajo técnico. Marca esta opción solo si la oferta incluye formación en empresa y valora quién coordina los usos de IA con las entidades colaboradoras.',
    easd_ea: 'La colaboración con empresas puede variar según la oferta y los proyectos del centro. Esta opción permite documentar la relación y los usos de IA previstos, si corresponde.',
    edre: 'La formación práctica puede incluir colaboración con empresas u otras entidades, según la modalidad y el centro. Esta opción permite documentar quién coordina la relación y los usos de IA previstos, si corresponde.'
};

const descripcionesComunesAsistente = {
    CARD_VULNERABILITY: 'En este apartado se puede indicar si este curso el centro atiende a alumnado en alguna de estas situaciones o participa en alguno de estos programas. Conviene señalar solo los casos que puedan afectar a los usos de IA y no incluir nombres ni otros datos identificativos. Si hay dudas, puede consultarse a quienes coordinan los apoyos o servicios.',
    CARD_GOVERNANCE: 'Este apartado permite indicar si se prevé incorporar el protocolo a un documento de planificación institucional. El instrumento concreto puede ajustarse a la organización del centro.'
};

const descripcionesAsistentePorTipologia = {
    escuela_infantil: {
        CARD_AGE: 'La selección debe reflejar el tramo presente e indicar si la IA la utilizaría el personal o si se prevé participación mediada del alumnado.',
        CARD_VULNERABILITY: 'En escuela infantil, las medidas pueden ajustarse a los grupos o actividades afectados, sin extenderse al resto del alumnado.',
        CARD_RURAL: 'En escuela infantil, conviene valorar la conexión, los dispositivos y la accesibilidad disponibles para el personal y las actividades previstas. No se presupone que las familias aporten equipos o conexión.',
        CARD_GOVERNANCE: 'Si se prevén usos de IA por parte del personal, puede precisarse quién los coordina y revisa y cómo se contempla cualquier participación mediada del alumnado.',
    },
    ceip: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En infantil y primaria, estas situaciones pueden afectar a grupos o actividades concretos. El protocolo puede recoger los apoyos y cuidados pertinentes sin identificar a nadie.',
        CARD_RURAL: 'La conexión y los dispositivos pueden variar entre escuelas o sedes y según las actividades de aula o las tareas previstas. En un CRA, la opción de ubicación rural puede reflejar la distancia entre escuelas cuando condiciona el acceso digital; disponer de varias sedes, por sí solo, no obliga a marcarla.',
        CARD_GOVERNANCE: 'En infantil y primaria, puede precisarse quién coordina y revisa el protocolo y, si hay varias escuelas o sedes, cómo se organiza esa coordinación entre ellas.',
    },
    cee: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En un CEE, los apoyos de comunicación, acceso o asistencia pueden influir en algunas actividades con IA. El protocolo puede describir los apoyos necesarios para esos usos, sin extenderlos a todo el alumnado.',
        CARD_RURAL: 'La conexión, los dispositivos y su compatibilidad con los apoyos habituales pueden variar según la actividad. Si una herramienta no resulta accesible, conviene prever otra opción.',
        CARD_GOVERNANCE: 'La coordinación y revisión pueden tener en cuenta la accesibilidad y los apoyos necesarios para cada actividad.',
    },
    ies: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En secundaria, estas situaciones pueden afectar solo a determinados grupos o actividades. El protocolo puede precisar los apoyos y el cuidado de la información en esos casos.',
        CARD_RURAL: 'La conexión y los dispositivos pueden variar entre grupos, también en las tareas que se realizan fuera del centro.',
        CARD_GOVERNANCE: 'Puede precisarse cómo se coordinan y revisan las decisiones entre las estructuras del centro para mantener criterios compartidos entre materias, departamentos y etapas.',
    },
    fp: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En FP, algunas prácticas pueden implicar información personal, de salud o de empresas. El protocolo puede precisar qué información se utiliza y qué coordinación requieren esas actividades.',
        CARD_RURAL: 'La conexión y el equipamiento pueden variar entre talleres y prácticas; si hay actividades en empresas, también en esos espacios.',
        CARD_GOVERNANCE: 'La organización puede precisar cómo se distribuyen las responsabilidades entre las familias profesionales y, si procede, quién coordina la relación con empresas colaboradoras.',
    },
    eoi: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En la práctica lingüística pueden aparecer datos personales o necesidades de apoyo. El protocolo puede concretar cómo se cuidan los materiales y qué apoyos requiere cada actividad.',
        CARD_RURAL: 'La conexión y el acceso a dispositivos pueden variar según la sede y el turno, tanto para practicar idiomas en el centro como fuera de él.',
        CARD_GOVERNANCE: 'Puede precisarse quién coordina y revisa las decisiones entre departamentos, niveles y modalidades.',
    },
    cepa: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En CEPA pueden convivir personas adultas con experiencias y apoyos diversos. El protocolo puede reflejar lo necesario para cada grupo o actividad, sin generalizarlo a todo el alumnado.',
        CARD_RURAL: 'La conexión y el acceso a dispositivos pueden variar según las sedes, los turnos, las modalidades y los recursos disponibles para el alumnado.',
        CARD_GOVERNANCE: 'La coordinación y revisión pueden organizarse según las ofertas formativas, modalidades, turnos y sedes del centro.',
        CARD_SCENARIOS: 'Indica si la actividad educativa se desarrolla en un establecimiento penitenciario para tener en cuenta la coordinación y los permisos aplicables.'
    },
    esad: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En los procesos creativos pueden intervenir voz, imagen u obras personales. El protocolo puede aclarar qué materiales se utilizan y qué apoyos necesitan las actividades implicadas.',
        CARD_RURAL: 'Los espacios y recursos disponibles pueden variar en actividades de creación con imagen, sonido u otros medios digitales.',
        CARD_GOVERNANCE: 'El centro puede precisar quién decide y revisa los usos previstos y cómo se integran en la organización de las enseñanzas artísticas, respetando sus decisiones pedagógicas.',
    },
    conservatorio: {
        CARD_AGE: 'La selección debe recoger los tramos con alumnado matriculado este curso para adaptar el protocolo a la realidad del centro.',
        CARD_VULNERABILITY: 'En las actividades musicales pueden utilizarse voz, imagen o grabaciones. El protocolo puede precisar qué materiales se comparten y qué apoyos requieren los grupos implicados.',
        CARD_RURAL: 'El acceso a dispositivos y conexión puede ser relevante para consultar partituras, practicar o utilizar grabaciones; no se da por hecho que el alumnado disponga de recursos propios.',
        CARD_GOVERNANCE: 'Puede precisarse quién coordina y revisa las decisiones de las enseñanzas musicales y cómo se incorporan a la planificación del centro.',
    },
    easd_ea: {
        CARD_AGE: 'El alumnado de estas enseñanzas es mayor de 14 años. La selección debe recoger solo los tramos presentes en la matrícula de este curso.',
        CARD_VULNERABILITY: 'Las situaciones que puedan afectar a un grupo o actividad pueden reflejarse con las medidas pertinentes, sin incluir datos identificativos.',
        CARD_RURAL: 'Si se prevén proyectos de arte o diseño con medios digitales, la conexión y los dispositivos disponibles pueden variar según el espacio y la actividad.',
        CARD_GOVERNANCE: 'El protocolo puede reflejar cómo se distribuyen las responsabilidades y se organiza su seguimiento en el centro.'
    },
    edre: {
        CARD_AGE: 'El alumnado de estas enseñanzas es mayor de 14 años. La selección debe recoger solo los tramos presentes en la matrícula de este curso.',
        CARD_VULNERABILITY: 'En algunas actividades deportivas podrían utilizarse imágenes, vídeos o datos de salud o rendimiento. El centro puede valorar cómo cuidar esa información y qué apoyos requiere cada actividad.',
        CARD_RURAL: 'Si se prevén actividades con medios digitales, la conexión y los dispositivos disponibles pueden variar entre espacios de práctica.',
        CARD_GOVERNANCE: 'El protocolo puede reflejar quién revisa los resultados de IA antes de utilizarlos en actividades formativas.'
    }
};

function obtenerPreguntasConfiguracion(tipoCentro) {
    const tipo = (tipoCentro ?? document.getElementById('tipo-centro')?.value ?? '').toLowerCase();
    const contextosVulnerabilidad = {
        escuela_infantil: {
            alumnado: 'alumnado de alguno de los grupos de la escuela infantil',
            grupos: 'los grupos de la escuela infantil',
            grupoApoyo: 'algún grupo de la escuela infantil',
            actividades: 'las actividades educativas del grupo'
        },
        ceip: {
            alumnado: 'alumnado de infantil o primaria',
            grupos: 'los grupos de infantil o primaria',
            grupoApoyo: 'algún grupo de infantil o primaria',
            actividades: 'las actividades escolares del grupo'
        },
        cee: {
            alumnado: 'alumnado de alguno de los grupos del CEE',
            grupos: 'los grupos del CEE',
            grupoApoyo: 'algún grupo del CEE',
            actividades: 'las actividades educativas y de apoyo'
        },
        ies: {
            alumnado: 'alumnado de ESO o bachillerato',
            grupos: 'los cursos o grupos del centro',
            grupoApoyo: 'algún grupo de ESO o bachillerato',
            actividades: 'las actividades de su etapa'
        },
        eoi: {
            alumnado: 'alumnado de un curso de idiomas',
            grupos: 'los cursos de idiomas',
            grupoApoyo: 'algún curso de idiomas',
            actividades: 'las actividades de práctica lingüística'
        },
        cepa: {
            alumnado: 'alumnado de una oferta formativa del CEPA',
            grupos: 'las ofertas formativas del CEPA',
            grupoApoyo: 'algún grupo de una oferta formativa del CEPA',
            actividades: 'las actividades formativas'
        },
        fp: {
            alumnado: 'alumnado de un ciclo formativo',
            grupos: 'los ciclos formativos del centro',
            grupoApoyo: 'algún grupo de un ciclo formativo',
            actividades: 'las actividades formativas o prácticas'
        },
        esad: {
            alumnado: 'alumnado de arte dramático',
            grupos: 'las enseñanzas de arte dramático',
            grupoApoyo: 'algún grupo de arte dramático',
            actividades: 'las actividades de creación o interpretación'
        },
        conservatorio: {
            alumnado: 'alumnado de las enseñanzas musicales',
            grupos: 'las enseñanzas musicales del centro',
            grupoApoyo: 'algún grupo o nivel de las enseñanzas musicales',
            actividades: 'las actividades musicales'
        },
        easd_ea: {
            alumnado: 'alumnado de las enseñanzas impartidas por el centro',
            grupos: 'los grupos de las enseñanzas impartidas por el centro',
            grupoApoyo: 'algún grupo o actividad',
            actividades: 'las actividades educativas previstas'
        },
        edre: {
            alumnado: 'alumnado de las enseñanzas deportivas del centro',
            grupos: 'los grupos de las enseñanzas deportivas',
            grupoApoyo: 'algún grupo o actividad deportiva',
            actividades: 'las actividades formativas previstas'
        }
    }[tipo];
    const preguntas = Object.values(cardCatalog).flatMap((card) =>
        card.configuration.map((group, groupIndex) => ({
            cardId: card.id,
            groupIndex,
            commonDescription: card.id === 'CARD_GOVERNANCE' && group.type === 'radio'
                ? ''
                : descripcionesComunesAsistente[card.id] || '',
            title: card.id === 'CARD_AGE'
                ? 'Alumnado matriculado: tramos de edad'
                : card.id === 'CARD_VULNERABILITY'
                    ? card.title
                    : card.id === 'CARD_RURAL'
                        ? card.title
                : `${card.title}: ${group.label}`,
            description: card.id === 'CARD_GOVERNANCE' && group.type === 'radio'
                ? 'Indica la titularidad del centro para contextualizar cómo se describen la distribución de responsabilidades y la supervisión en el protocolo.'
                : descripcionesAsistentePorTipologia[tipo]?.[card.id] || (card.id === 'CARD_AGE'
                ? 'Selecciona los tramos de edad en los que hay alumnado matriculado este curso. Así, el protocolo se adaptará a la realidad del centro.'
                : card.id === 'CARD_VULNERABILITY'
                    ? 'Selecciona las situaciones que requieran adaptar las medidas del protocolo.'
                    : card.id === 'CARD_RURAL'
                            ? 'Señala las condiciones del entorno que deban tenerse en cuenta en el protocolo.'
                        : card.id === 'CARD_GOVERNANCE'
                                ? 'Selecciona los aspectos que deban quedar recogidos en el protocolo.'
                            : 'Revisa los parámetros relevantes para la configuración del protocolo.'),
            options: group.options
                .filter(option => option.id !== 'fp_dual' || tipologiasConRelacionEmpresas.includes(tipo))
                .filter(option => !(['escuela_infantil', 'ceip'].includes(tipo) && option.id === 'medidas_judiciales'))
                .filter(option => !(tipo === 'escuela_infantil' && card.id === 'CARD_AGE' && option.id !== 'menores_14'))
                .filter(option => !(['easd_ea', 'edre'].includes(tipo) && card.id === 'CARD_AGE' && option.id === 'menores_14'))
                .map((option) => {
                    if (card.id === 'CARD_GOVERNANCE' && option.id === 'fp_dual') {
                        return {
                            ...option,
                            description: ayudasRelacionEmpresasPorTipologia[tipo] || option.description
                        };
                    }
                    if (card.id !== 'CARD_VULNERABILITY' || !contextosVulnerabilidad) return option;
                    const optionDescriptions = {
                        aulas_hospitalarias: `Selecciona esta opción si hay ${contextosVulnerabilidad.alumnado} que recibe atención educativa durante una hospitalización o convalecencia en el domicilio. El protocolo puede contemplar la continuidad de ${contextosVulnerabilidad.actividades} y el cuidado de la información de salud que se utilice.`,
                        medidas_proteccion: `Selecciona esta opción si hay menores bajo medidas de protección o acogimiento en ${contextosVulnerabilidad.grupos}. El protocolo puede precisar el acceso a información sobre esa situación y la coordinación necesaria para las actividades relacionadas.`,
                        educacion_especial: `Selecciona esta opción si en ${contextosVulnerabilidad.grupoApoyo} hay alumnado que necesita apoyos intensivos de acceso, comunicación o asistencia para participar en actividades con IA. El protocolo puede recoger los apoyos pertinentes sin atribuirlos al resto del alumnado.`,
                        medidas_judiciales: 'Selecciona esta opción si el centro desarrolla o coordina un programa educativo para jóvenes que cumplen medidas judiciales. El protocolo puede concretar quién accede a la información del programa y la coordinación necesaria para las actividades con IA.'
                    };
                    return { ...option, description: optionDescriptions[option.id] || option.description };
                }),
            type: group.type
        }))
    );

    const escenarios = [];
    if (tipo === 'cepa') {
        escenarios.push({
            id: 'aula_penitenciaria',
            stateFlag: 'aulaPenitenciaria',
            label: 'Actividad educativa en un establecimiento penitenciario',
            description: 'Respeta las normas de control y seguridad del establecimiento y coordina la actividad educativa. Comprueba los permisos aplicables antes de introducir equipos o programas; esta selección no autoriza IA ni presupone ausencia de Internet.'
        });
    }

    if (escenarios.length) {
        preguntas.push({
            cardId: 'CARD_SCENARIOS',
            groupIndex: 0,
            title: 'Contextos institucionales',
            description: descripcionesAsistentePorTipologia[tipo]?.CARD_SCENARIOS || 'Selecciona los contextos institucionales que deban reflejarse en el protocolo.',
            options: escenarios,
            type: 'checkbox'
        });
    }
    return preguntas;
}

function mostrarPreguntaConfiguracion() {
    const container = document.getElementById('assistant-question-container');
    const title = document.getElementById('assistant-question-title');
    const description = document.getElementById('assistant-question-description');
    const commonDescription = document.getElementById('assistant-question-common-description');
    const preguntas = obtenerPreguntasConfiguracion();
    const pregunta = preguntas[state.configuracionIndex];

    if (!container || !pregunta) return;

    title.textContent = pregunta.title;
    description.textContent = pregunta.description;
    const hasQuestionHelp = Boolean(pregunta.commonDescription);
    if (commonDescription) {
        commonDescription.hidden = !hasQuestionHelp;
        if (hasQuestionHelp) commonDescription.textContent = pregunta.commonDescription;
    }
    const prevButton = document.getElementById('assistant-prev');
    const nextButton = document.getElementById('assistant-next');
    const progressLabel = document.getElementById('assistant-question-progress-label');
    const progress = document.getElementById('assistant-question-progress');

    if (prevButton) {
        prevButton.disabled = false;
        prevButton.hidden = state.edicionResumen;
        prevButton.textContent = state.edicionResumen
            ? 'Volver al resumen'
            : state.configuracionIndex === 0 ? 'Datos del centro' : 'Pregunta anterior';
    }
    if (nextButton) {
        nextButton.textContent = state.edicionResumen
            ? 'Guardar y volver al resumen'
            : state.configuracionIndex === preguntas.length - 1 ? 'Ver resumen' : 'Siguiente pregunta';
    }
    if (progressLabel) {
        progressLabel.textContent = `Pregunta ${state.configuracionIndex + 1} de ${preguntas.length}`;
    }
    if (progress) {
        progress.max = preguntas.length;
        progress.value = state.configuracionIndex + 1;
    }

    const selectedOptions = new Set(
        Object.keys(state.contextoSeleccionado)
    );

    const optionMarkup = pregunta.options.map((option) => {
        const inputId = `${pregunta.cardId}-${option.id}`;
        const isSelected = option.stateFlag ? state[option.stateFlag] === true : selectedOptions.has(inputId);
        return `
            <div class="card-option-wrapper">
                <label class="card-option" for="${inputId}">
                    <input
                        id="${inputId}"
                        type="${pregunta.type}"
                        name="${pregunta.cardId}-${pregunta.groupIndex}"
                        value="${option.id}"
                        data-card-id="${pregunta.cardId}"
                        data-option-id="${option.id}"
                        ${option.stateFlag ? `data-scenario-flag="${option.stateFlag}"` : ''}
                        class="context-step1-input"
                        ${isSelected ? 'checked' : ''}>
                    <span>${option.label}</span>
                    ${option.recommendation ? `<span class="option-recommendation">${option.recommendation}</span>` : ''}
                </label>
                ${option.description ? `
                    <p class="context-option-description" ${isSelected ? '' : 'hidden'}>
                        ${option.description}
                        ${option.descriptionLink ? `
                            <br>
                            <a class="context-option-description-link" href="${option.descriptionLink.href}" target="_blank" rel="noopener noreferrer">
                                ${option.descriptionLink.label}<span class="visually-hidden"> (se abre en una pestaña nueva)</span>
                            </a>
                        ` : ''}
                    </p>
                ` : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="assistant-question">
            <div class="assistant-options">${optionMarkup}</div>
        </div>
    `;

    document.querySelectorAll('.context-step1-input').forEach((input) => {
        const description = input.closest('.card-option-wrapper')?.querySelector('.context-option-description');
        if (description) {
            description.hidden = !input.checked;
        }

        input.classList.add('auto-save');
        input.addEventListener('change', () => {
            if (input.dataset.scenarioFlag) {
                state[input.dataset.scenarioFlag] = input.checked;
            }
            state.contextoSeleccionado = obtenerSeleccionesContexto();
            document.querySelectorAll('.context-step1-input').forEach((optionInput) => {
                const optionDescription = optionInput.closest('.card-option-wrapper')?.querySelector('.context-option-description');
                if (optionDescription) optionDescription.hidden = !optionInput.checked;
            });
            actualizarResumenContextual();
            renderizarEntornosInstitucionales();
            actualizarNotaDatosSalud();
            const avisoMediacion = document.getElementById('ayuda-mediacion-menores-14');
            if (avisoMediacion) {
                avisoMediacion.hidden = obtenerSeleccionesContextoDisponibles()['CARD_AGE-menores_14'] !== true;
            }
            guardarEnLocalStorage();
        });
    });

    state.contextoSeleccionado = obtenerSeleccionesContexto();
    actualizarResumenContextual();
    renderizarEntornosInstitucionales();
}

function renderizarConfiguracionPaso1() {
    mostrarPreguntaConfiguracion();
}

function validarPreguntaConfiguracion() {
    const preguntas = obtenerPreguntasConfiguracion();
    const pregunta = preguntas[state.configuracionIndex];
    const esEdad = pregunta?.cardId === 'CARD_AGE';
    const esTitularidad = pregunta?.cardId === 'CARD_GOVERNANCE' && pregunta.type === 'radio';
    const error = document.getElementById('assistant-selection-error');

    if (!esEdad && !esTitularidad) return true;

    state.contextoSeleccionado = obtenerSeleccionesContexto();
    const opcionesPregunta = new Set(
        pregunta.options.map(option => `${pregunta.cardId}-${option.id}`)
    );
    const haySeleccion = Object.entries(state.contextoSeleccionado)
        .some(([key, checked]) => checked && opcionesPregunta.has(key));

    if (!haySeleccion) {
        if (error) {
            error.textContent = esEdad
                ? 'Selecciona al menos un tramo de edad para continuar.'
                : 'Selecciona la titularidad del centro para continuar.';
            error.style.display = 'block';
        }
        return false;
    }

    if (error) error.style.display = 'none';
    return true;
}

function obtenerDiagnosticoAutomatico(cardId, tipoCentro) {
    const tipo = tipoCentro.toLowerCase();

    if (cardId === 'CARD_AGE') {
        if (tipo.includes('escuela_infantil')) {
            return 'El centro ofrece el primer ciclo de educación infantil; confirma las edades y los grupos presentes para adaptar el protocolo.';
        }

        if (tipo.includes('ceip') || tipo.includes('cee')) {
            return 'Tu centro escolariza alumnado menor de 14 años o con necesidades que requieren protección específica.';
        }

        if (tipo.includes('ies') || tipo.includes('fp') || tipo.includes('integrado')) {
            return 'Tu centro combina alumnado menor y mayor de 14 años, por lo que exige una configuración diferenciada.';
        }

        if (tipo.includes('cepa') || tipo.includes('eoi')) {
            return 'Tu centro incluye alumnado adulto o joven con necesidades formativas específicas.';
        }

        return 'La edad y la madurez del alumnado deben determinarse para adaptar el protocolo.';
    }

    if (cardId === 'CARD_VULNERABILITY') {
        if (tipo.includes('cee')) {
            return 'El centro atiende alumnado con necesidades de protección, salud o apoyo especial.';
        }

        return 'La protección reforzada se valorará ante información personal o confidencial, medidas de protección o necesidades educativas específicas.';
    }

    if (cardId === 'CARD_RURAL') {
        if (tipo.includes('ceip') || tipo.includes('cee') || tipo.includes('ies') || tipo.includes('eoi')) {
            return 'La disponibilidad de conectividad y dispositivos puede afectar al acceso equitativo al uso de la IA.';
        }

        return 'La equidad de acceso debe valorarse en función de la conectividad, la infraestructura y la disponibilidad de dispositivos.';
    }

    if (cardId === 'CARD_GOVERNANCE') {
        return 'La gobernanza institucional debe definir responsabilidades, supervisión y criterios de seguridad.';
    }

    return 'La configuración debe adaptarse a la realidad del centro.';
}

function obtenerSeleccionesContexto() {
    const selections = { ...state.contextoSeleccionado };
    const pregunta = obtenerPreguntasConfiguracion()[state.configuracionIndex];
    if (!pregunta) return selections;

    const questionKeys = new Set(
        pregunta.options.map(option => `${pregunta.cardId}-${option.id}`)
    );
    questionKeys.forEach(key => delete selections[key]);

    document.querySelectorAll('.context-step1-input:checked').forEach((input) => {
        if (input.dataset.scenarioFlag) return;
        const key = `${input.dataset.cardId}-${input.dataset.optionId}`;
        if (questionKeys.has(key)) selections[key] = true;
    });

    return selections;
}

function obtenerSeleccionesContextoDisponibles() {
    if (typeof cardCatalog === 'undefined' || !cardCatalog) {
        return { ...(state.contextoSeleccionado || {}) };
    }
    const availableKeys = new Set(
        obtenerPreguntasConfiguracion().flatMap(pregunta =>
            pregunta.options.map(option => `${pregunta.cardId}-${option.id}`)
        )
    );

    return Object.fromEntries(
        Object.entries(state.contextoSeleccionado || {})
            .filter(([key, selected]) => selected && availableKeys.has(key))
    );
}

function obtenerPerfilContexto() {
    if (!window.consequenceEngine) {
        return null;
    }

    return window.consequenceEngine.buildContextProfile(
        cardCatalog,
        window.consequenceEngine.makeConditionSet(obtenerSeleccionesContextoDisponibles())
    );
}

function actualizarResumenContextual() {
    const summaryEl = document.getElementById('contextual-profile-summary');
    if (!summaryEl) return;

    const profile = obtenerPerfilContexto();
    const conditions = new Map((profile?.conditions || []).map(condition => [condition.key, condition]));
    const selected = obtenerSeleccionesContextoDisponibles();
    summaryEl.replaceChildren();

    const introduction = document.createElement('p');
    introduction.className = 'configuration-review-intro';
    introduction.textContent = 'El resumen reúne los datos del centro y las respuestas seleccionadas. Cada apartado puede editarse por separado.';
    summaryEl.appendChild(introduction);

    const createSection = (title, editLabel, onEdit) => {
        const section = document.createElement('section');
        section.className = 'configuration-review-section';
        const header = document.createElement('div');
        header.className = 'configuration-review-section-header';
        const heading = document.createElement('h3');
        heading.textContent = title;
        header.appendChild(heading);
        if (onEdit) {
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-secondary configuration-review-edit';
            editButton.textContent = 'Editar';
            editButton.setAttribute('aria-label', `Editar ${editLabel}`);
            editButton.addEventListener('click', onEdit);
            header.appendChild(editButton);
        }
        section.appendChild(header);
        summaryEl.appendChild(section);
        return section;
    };

    const centerSection = createSection(
        'Datos del centro',
        'datos del centro',
        () => editarDatoCentroDesdeResumen('nombre-centro')
    );
    const typeSelect = document.getElementById('tipo-centro');
    const typeLabel = typeSelect?.selectedOptions?.[0]?.textContent
        || Array.from(typeSelect?.options || []).find(option => option.value === typeSelect.value)?.textContent
        || typeSelect?.value
        || 'Pendiente';
    const centerFacts = [
        ['Nombre', document.getElementById('nombre-centro')?.value || 'Pendiente', 'nombre-centro'],
        ['Tipología', typeLabel.trim(), 'tipo-centro'],
        ['Localidad', document.getElementById('localidad')?.value || 'Pendiente', 'localidad']
    ];
    const facts = document.createElement('dl');
    facts.className = 'configuration-review-facts';
    centerFacts.forEach(([label, value, fieldId]) => {
        const fact = document.createElement('div');
        fact.className = 'configuration-review-fact';
        const term = document.createElement('dt');
        term.textContent = label;
        const detail = document.createElement('dd');
        detail.textContent = value;
        fact.append(term, detail);
        facts.appendChild(fact);
    });
    centerSection.appendChild(facts);

    obtenerPreguntasConfiguracion().forEach((question, questionIndex) => {
        const section = createSection(question.title, question.title, () => abrirPreguntaDesdeResumen(questionIndex));
        const selectedOptions = question.options.filter(option => option.stateFlag
            ? state[option.stateFlag] === true
            : selected[`${question.cardId}-${option.id}`] === true);

        if (!selectedOptions.length) {
            const empty = document.createElement('p');
            empty.className = 'configuration-review-empty';
            empty.textContent = 'Sin respuestas seleccionadas.';
            section.appendChild(empty);
            return;
        }

        const answers = document.createElement('ul');
        answers.className = 'configuration-review-answers';
        selectedOptions.forEach(option => {
            const key = `${question.cardId}-${option.id}`;
            const condition = conditions.get(key);
            const answer = document.createElement('li');
            answer.className = 'configuration-review-answer';
            const label = document.createElement('strong');
            label.textContent = option.label;
            answer.appendChild(label);
            const justification = option.justification || condition?.justification || option.description;
            if (justification) {
                const explanation = document.createElement('p');
                explanation.textContent = justification;
                answer.appendChild(explanation);
            }
            answers.appendChild(answer);
        });
        section.appendChild(answers);
    });
}

function actualizarContextoDesdeCambios() {
    document.querySelectorAll('.context-step1-input').forEach((input) => {
        input.addEventListener('change', () => {
            state.contextoSeleccionado = obtenerSeleccionesContexto();
            actualizarResumenContextual();
        });
    });
}

function renderizarTarjetasContexto() {
    return;
}

const appModule = {
    state,
    iniciarWizard,
    mostrarPantallaPaso1,
    irAPaso,
    volverAPortada,
    avanzarPreguntaConfiguracion,
    retrocederPreguntaConfiguracion,
    avanzarAsistenteConfiguracion,
    retrocederAsistenteConfiguracion,
    abrirAsistenteConfiguracion,
    abrirPreguntaDesdeResumen,
    editarDatoCentroDesdeResumen,
    volverAlResumenConfiguracion,
    abrirGuiaHerramienta,
    cambiarPaso,
    actualizarInterfaz,
    actualizarNotaDatosSalud,
    toggleSubOptions,
    actualizarAyudaEjemploDinamico,
    actualizarConsejoPorTipologia,
    adaptarFormulario,
    aplicarEdadesPredeterminadas,
    migrarSeleccionesEdad,
    modalidadesInstitucionalesDeSesion,
    leerModalidadesInstitucionales,
    leerLineasCampoDinamico,
    mostrarLineasCampoDinamico,
    actualizarModalidadesDesdeFormulario,
    actualizarRecordatorioServiciosPaso4,
    renderizarEntornosInstitucionales,
    inicializarEntornosInstitucionales,
    recolectarDatos,
    guardarEnLocalStorage,
    restaurarDesdeLocalStorage,
    continuarSesion,
    actualizarVisibilidadGuardar,
    actualizarEstadoPortada,
    iniciarNuevaSesion,
    obtenerContainerId,
    aplicarDatosAFormulario,
    obtenerNombreArchivoProtocolo,
    obtenerNombreArchivoSesion,
    solicitarDestinoGuardado,
    guardarBlobArchivo,
    exportarSesionJSON,
    añadirLineaTexto,
    crearTextareaExtra,
    inicializarCamposMultiples,
    ejecutarCargaSesion,
    importarSesionJSON,
    showModal,
    mostrarDeclaracionTransparencia,
    restablecerPresentacionModal,
    cerrarModal,
    showConfirmModal,
    auditarAplicacion,
    obtenerPreguntasConfiguracion,
    mostrarPreguntaConfiguracion,
    renderizarConfiguracionPaso1,
    validarPreguntaConfiguracion,
    obtenerDiagnosticoAutomatico,
    obtenerSeleccionesContexto,
    obtenerSeleccionesContextoDisponibles,
    obtenerPerfilContexto,
    actualizarResumenContextual,
    actualizarContextoDesdeCambios,
    renderizarTarjetasContexto
};

const JCCM_ProtocoloIA = (typeof window !== 'undefined' ? window.JCCM_ProtocoloIA : (typeof globalThis !== 'undefined' ? globalThis.JCCM_ProtocoloIA : null)) || {};

JCCM_ProtocoloIA.app = appModule;
JCCM_ProtocoloIA.state = state;

if (typeof window !== 'undefined') {
    window.JCCM_ProtocoloIA = JCCM_ProtocoloIA;
}
if (typeof globalThis !== 'undefined') {
    globalThis.JCCM_ProtocoloIA = JCCM_ProtocoloIA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { app: appModule, state };
}
