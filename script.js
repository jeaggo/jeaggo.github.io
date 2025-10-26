let currentSection = 1;
let selectedCard = null;
let assignedDomains = {};
let draggedElement = null;
let droppedItems = {
    maestros: false,
    transaccional: false,
    referencia: false,
    metadata: false,
    eventos: false
};

// --- Funciones de Navegación ---

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach(step => {
        const sectionId = parseInt(step.dataset.section);
        step.classList.remove('active', 'completed');
        if (sectionId < currentSection) {
            step.classList.add('completed');
        } else if (sectionId === currentSection) {
            step.classList.add('active');
        }
    });
}

function goToSection(sectionNumber) {
    if (sectionNumber < 1 || sectionNumber > 5) return;

    // Ocultar sección actual
    document.getElementById(`section${currentSection}`).classList.remove('active');
    
    // Actualizar sección
    currentSection = sectionNumber;
    
    // Mostrar nueva sección
    document.getElementById(`section${currentSection}`).classList.add('active');
    
    // Actualizar barra de progreso
    updateProgressBar();

    // Limpiar feedback
    document.querySelectorAll('.feedback').forEach(f => f.style.display = 'none');
}

// --- Lógica de la Sección 1: Drag and Drop ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar barra de progreso
    updateProgressBar();
    
    // Habilitar navegación por clic en la barra de progreso (solo a secciones ya completadas)
    document.querySelectorAll('.progress-step').forEach(step => {
        step.addEventListener('click', () => {
            const sectionId = parseInt(step.dataset.section);
            if (sectionId < currentSection) {
                goToSection(sectionId);
            }
        });
    });

    // Drag and Drop para Sección 1
    document.querySelectorAll('#section1 .data-card[draggable="true"]').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.dataTransfer.setData('text/plain', e.target.dataset.type); // Para compatibilidad
            e.target.style.opacity = '0.5';
        });

        card.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });

    document.querySelectorAll('.drag-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('highlight');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('highlight');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('highlight');
            
            const category = zone.dataset.category;
            const draggedType = draggedElement.dataset.type;
            
            if (category === draggedType) {
                // Si ya hay algo, no permitir soltar (solo un elemento por zona)
                if (droppedItems[category]) return; 

                const span = zone.querySelector('span');
                span.textContent = draggedElement.textContent.trim(); // Mostrar el texto de la tarjeta
                span.style.color = '#2ecc71';
                droppedItems[category] = true;
                draggedElement.style.display = 'none'; // Ocultar el elemento original
            }
        });
    });
});


function checkSection1() {
    const allAssigned = Object.values(droppedItems).every(v => v === true);
    const feedback = document.getElementById('feedback1');
    
    if (allAssigned) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ ¡Excelente trabajo, investigador! Has clasificado correctamente todos los tipos de datos. Los datos maestros son la columna vertebral de la organización, mientras que los transaccionales registran las operaciones diarias. Has demostrado comprensión del ciclo de vida de los datos. <strong>Clave:</strong> El expediente del sospechoso es el <strong>MAESTRO</strong>.';
        setTimeout(() => goToSection(2), 3000);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '❌ Aún faltan documentos por clasificar o la clasificación es incorrecta. Revisa las categorías y asegúrate de arrastrar cada documento a su tipo correcto.';
    }
    feedback.style.display = 'block';
}

// --- Lógica de la Sección 2: Asignación de Dominios ---

function selectCard(card, section) {
    document.querySelectorAll(`#section${section} .data-card`).forEach(c => {
        c.classList.remove('selected');
    });
    card.classList.add('selected');
    selectedCard = card;
    document.getElementById('domain-select').disabled = false;
}

function assignDomain() {
    if (!selectedCard) return;
    
    const select = document.getElementById('domain-select');
    const selectedDomain = select.value;
    const feedback = document.getElementById('feedback2');
    
    if (selectedDomain) {
        const correctDomain = selectedCard.dataset.domain;
        const cardText = selectedCard.textContent.trim();
        
        if (selectedDomain === correctDomain) {
            // Asignación correcta
            assignedDomains[cardText] = selectedDomain;
            selectedCard.classList.remove('selected');
            selectedCard.classList.add('completed'); // Clase visual para completado
            selectedCard.style.cursor = 'default';
            selectedCard.onclick = null; // Deshabilitar clic
            select.value = '';
            selectedCard = null;
            
            // Actualizar feedback
            feedback.className = 'feedback correct';
            feedback.textContent = `✅ ¡Correcto! '${cardText}' ha sido asignado al dominio de ${selectedDomain}.`;
            feedback.style.display = 'block';

            // Verificar si todos están asignados
            const allAssigned = document.querySelectorAll('#section2 .data-card').length === Object.keys(assignedDomains).length;
            if (allAssigned) {
                feedback.innerHTML = '✅ ¡Dominio de Datos Asignado! Has organizado la información por su área de responsabilidad. <strong>Clave:</strong> El dominio que contiene la información más sensible es <strong>CLIENTES</strong>.';
                setTimeout(() => goToSection(3), 3000);
            }
        } else {
            // Asignación incorrecta
            feedback.className = 'feedback incorrect';
            feedback.textContent = `❌ Incorrecto. '${cardText}' no pertenece al dominio de ${selectedDomain}. Vuelve a intentarlo.`;
            feedback.style.display = 'block';
        }
    }
}

// --- Lógica de la Sección 3: Validación de Datos ---

function checkSection3() {
    const input1 = document.getElementById('validation1').value.trim().toLowerCase();
    const input2 = document.getElementById('validation2').value.trim().toLowerCase();
    const input3 = document.getElementById('validation3').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback3');
    
    // Respuestas correctas:
    // 1. Unicidad
    // 2. Integridad Referencial
    // 3. Formato
    
    const correctAnswers = {
        validation1: 'unicidad',
        validation2: 'integridad referencial',
        validation3: 'formato'
    };

    let isCorrect = true;
    
    if (input1 !== correctAnswers.validation1) isCorrect = false;
    if (input2 !== correctAnswers.validation2) isCorrect = false;
    if (input3 !== correctAnswers.validation3) isCorrect = false;

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ ¡Validación Exitosa! Has identificado las reglas de calidad de datos. La <strong>unicidad</strong> asegura que cada registro es único. La <strong>integridad referencial</strong> mantiene las relaciones. El <strong>formato</strong> asegura la consistencia. <strong>Clave:</strong> El valor que falta en el expediente es <strong>95</strong>.';
        setTimeout(() => goToSection(4), 3000);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '❌ Hay errores en la validación. Revisa los conceptos de calidad de datos y vuelve a intentarlo.';
    }
    feedback.style.display = 'block';
}

// --- Lógica de la Sección 4: Clasificación de Seguridad ---

function checkSection4() {
    const answer1 = document.getElementById('security1').value; // Público
    const answer2 = document.getElementById('security2').value; // Confidencial
    const answer3 = document.getElementById('security3').value; // Crítico
    const answer4 = document.getElementById('security4').value; // Interno
    const feedback = document.getElementById('feedback4');

    const correctAnswers = {
        security1: 'publico',
        security2: 'confidencial',
        security3: 'critico',
        security4: 'interno'
    };

    let isCorrect = true;
    if (answer1 !== correctAnswers.security1) isCorrect = false;
    if (answer2 !== correctAnswers.security2) isCorrect = false;
    if (answer3 !== correctAnswers.security3) isCorrect = false;
    if (answer4 !== correctAnswers.security4) isCorrect = false;

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ ¡Clasificación de Seguridad Aprobada! Has protegido la información según su sensibilidad. <strong>Público</strong>, <strong>Interno</strong>, <strong>Confidencial</strong> y <strong>Crítico</strong> son niveles esenciales. <strong>Clave:</strong> El código de acceso es <strong>456</strong>.';
        setTimeout(() => goToSection(5), 3000);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '❌ La clasificación de seguridad es incorrecta. Revisa la pista y los niveles de sensibilidad de la información.';
    }
    feedback.style.display = 'block';
}

// --- Lógica de la Sección 5: Almacenamiento y Acceso ---

function checkSection5() {
    const answer1 = document.getElementById('storage1').value; // En Memoria (RAM/Cache)
    const answer2 = document.getElementById('storage2').value; // Data Warehouse (Histórico)
    const answer3 = document.getElementById('storage3').value; // Sistema de Archivos
    const answer4 = document.getElementById('storage4').value; // Almacenamiento en la Nube
    const answer5 = document.getElementById('storage5').value; // Base de Datos Transaccional
    const feedback = document.getElementById('feedback5');

    const correctAnswers = {
        storage1: 'memoria',
        storage2: 'historico',
        storage3: 'archivo',
        storage4: 'nube',
        storage5: 'base'
    };

    let isCorrect = true;
    if (answer1 !== correctAnswers.storage1) isCorrect = false;
    if (answer2 !== correctAnswers.storage2) isCorrect = false;
    if (answer3 !== correctAnswers.storage3) isCorrect = false;
    if (answer4 !== correctAnswers.storage4) isCorrect = false;
    if (answer5 !== correctAnswers.storage5) isCorrect = false;

    if (isCorrect) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '🎉 <strong>¡CASO RESUELTO!</strong> Has identificado correctamente los métodos de almacenamiento y acceso. El sospechoso fue atrapado intentando acceder a la base de datos transaccional (E) con credenciales robadas del sistema de archivos (C), pero la información más crítica estaba protegida por el Data Warehouse (B) y la nube (D). El acceso rápido (A) fue la clave para la captura. <strong>Clave Final:</strong> Usa las claves de las secciones anteriores en orden: <strong>MAESTRO-CLIENTES-95-456</strong>.';
        // Mostrar mensaje final (si existe un elemento con id finalMessage)
        const finalMessage = document.getElementById('finalMessage');
        if (finalMessage) {
            finalMessage.style.display = 'block';
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '❌ El mapa de almacenamiento es incorrecto. Revisa la pista y considera la velocidad, el volumen y la frecuencia de acceso de cada escenario.';
    }
    feedback.style.display = 'block';
}

