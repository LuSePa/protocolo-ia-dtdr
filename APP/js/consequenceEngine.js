(function (global) {
    'use strict';

    const PRIORITY = {
        "CARD_AGE-menores_14": 1,
        "CARD_VULNERABILITY-aulas_hospitalarias": 2,
        "CARD_VULNERABILITY-medidas_proteccion": 2,
        "CARD_VULNERABILITY-educacion_especial": 2,
        "CARD_VULNERABILITY-medidas_judiciales": 2,
        "CARD_AGE-edad_14_17": 3,
        "CARD_AGE-18_mas": 3,
        "CARD_RURAL-entorno_rural": 4,
        "CARD_RURAL-conectividad": 4,
        "CARD_RURAL-alternativas": 4,
        "CARD_GOVERNANCE-plan_digital": 5,
        "CARD_GOVERNANCE-fp_dual": 5,
        "CARD_GOVERNANCE-titularidad_publica": 5,
        "CARD_GOVERNANCE-titularidad_concertado": 5,
        "CARD_GOVERNANCE-titularidad_privada": 5
    };

    const getOptionKey = (cardId, optionId) => `${cardId}-${optionId}`;

    function makeConditionSet(selectedMap) {
        return new Set(
            Object.entries(selectedMap || {})
                .filter(([, checked]) => checked)
                .map(([key]) => key)
        );
    }

    function normalizeOption(option, cardId) {
        if (!option || !option.id) return null;
        return {
            ...option,
            key: getOptionKey(cardId, option.id),
            priority: option.priority ?? PRIORITY[getOptionKey(cardId, option.id)] ?? 99,
            active: true
        };
    }

    function getSelectedOptions(cardCatalog, selectedSet) {
        const selected = [];

        Object.values(cardCatalog || {}).forEach((card) => {
            const groups = Array.isArray(card?.configuration) ? card.configuration : [];
            const directOptions = Array.isArray(card?.options) ? card.options : [];
            const options = [...directOptions, ...groups.flatMap((group) => group?.options || [])];

            options.forEach((option) => {
                const normalized = normalizeOption(option, card.id);
                if (normalized && selectedSet.has(normalized.key)) {
                    selected.push(normalized);
                }
            });
        });

        return selected.sort((a, b) => a.priority - b.priority);
    }

    function selectedOptionText(card, option) {
        return option.label || option.title || option.id;
    }

    function buildContextProfile(cardCatalog, selectedSet) {
        const selectedOptions = getSelectedOptions(cardCatalog, selectedSet);
        const conditions = selectedOptions.map((option) => ({
            key: option.key,
            cardId: option.cardId || option.key.split('-')[0],
            label: selectedOptionText(cardCatalog[option.cardId || option.key.split('-')[0]], option),
            priority: option.priority,
            consequence: option.consequence || '',
            warning: option.warning || '',
            annex: option.annex || '',
            bibliography: option.bibliography || '',
            regulatoryBasis: option.regulatoryBasis || '',
            justification: option.justification || ''
        }));

        const consequences = [...new Set(conditions
            .map((condition) => condition.consequence)
            .filter(Boolean))];
        const warnings = [...new Set(conditions
            .map((condition) => condition.warning)
            .filter(Boolean))];
        const annexes = [...new Set(conditions
            .map((condition) => condition.annex)
            .filter(Boolean))];
        const bibliography = [...new Set(conditions
            .map((condition) => condition.bibliography)
            .filter(Boolean))];
        const regulatoryBasis = [...new Set(conditions
            .map((condition) => condition.regulatoryBasis || '')
            .filter(Boolean))];

        const summary = buildInstitutionalSummary(conditions);
        const justification = buildInstitutionalJustification({
            conditions,
            summary,
            consequences
        });

        return {
            summary,
            conditions,
            consequences,
            warnings,
            recommendedAnnexes: annexes,
            recommendedBibliography: bibliography,
            regulatoryBasis,
            priority: conditions.map((condition) => condition.key),
            justification
        };
    }

    function buildInstitutionalSummary(conditions) {
        if (!conditions.length) {
            return 'El centro todavía no ha identificado condiciones institucionales que requieran medidas específicas en el protocolo.';
        }

        const ordered = [...conditions].sort((a, b) => a.priority - b.priority);
        const labels = ordered.map((condition) => condition.label);
        const keyConditions = labels.slice(0, 2);
        const remaining = labels.length - keyConditions.length;

        if (labels.length === 1) {
            return `El centro dispone de la condición ${labels[0].toLowerCase()}. El protocolo establecerá las medidas correspondientes.`;
        }

        const base = `El centro identifica ${keyConditions.join(' y ')}`;
        return remaining > 0
            ? `${base} y otras condiciones que requieren una valoración específica. El protocolo aplicará las medidas más garantistas.`
            : `${base}. El protocolo aplicará las medidas y la supervisión adecuadas.`;
    }

    function buildInstitutionalJustification(profile) {
        const ordered = [...(profile.conditions || [])].sort((a, b) => a.priority - b.priority);
        const phrases = ordered
            .map((condition) => condition.justification)
            .filter(Boolean)
            .map((phrase) => phrase.replace(/[.!?]+$/, '').trim());

        if (!phrases.length) {
            return 'El protocolo incorpora medidas de protección, supervisión y responsabilidad institucional adaptadas a las condiciones identificadas.';
        }

        if (phrases.length === 1) {
            return `${phrases[0]}.`;
        }

        const final = phrases.map((phrase, index) => {
            if (index === 0) return phrase;
            if (index === phrases.length - 1) return ` y ${phrase}`;
            return `; ${phrase}`;
        }).join('');

        return `${final}.`.replace(/\s+/g, ' ');
    }

    function findCardOption(cardCatalog, key) {
        for (const card of Object.values(cardCatalog || {})) {
            const groups = Array.isArray(card?.configuration) ? card.configuration : [];
            const options = [
                ...(Array.isArray(card?.options) ? card.options : []),
                ...groups.flatMap((group) => group?.options || [])
            ];
            const option = options.find((item) => `${card.id}-${item.id}` === key);
            if (option) return option;
        }
        return null;
    }

    const engine = {
        makeConditionSet,
        buildContextProfile,
        buildInstitutionalJustification,
        findCardOption,
        getSelectedOptions,
        selectedOptionText
    };

    global.JCCM_ProtocoloIA = global.JCCM_ProtocoloIA || {};
    global.JCCM_ProtocoloIA.engine = engine;

    global.consequenceEngine = engine;
    global.buildContextProfile = buildContextProfile;
    global.buildInstitutionalJustification = buildInstitutionalJustification;
    global.makeConditionSet = makeConditionSet;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = engine;
    }
    if (typeof window !== 'undefined' && window !== global) {
        window.JCCM_ProtocoloIA = window.JCCM_ProtocoloIA || {};
        window.JCCM_ProtocoloIA.engine = engine;
        window.consequenceEngine = engine;
        window.buildContextProfile = buildContextProfile;
        window.buildInstitutionalJustification = buildInstitutionalJustification;
        window.makeConditionSet = makeConditionSet;
    }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this)));
