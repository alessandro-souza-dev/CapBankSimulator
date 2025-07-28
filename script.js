// --- script.js CORRIGIDO ---
// Lógica de desenho e interatividade do diagrama.
class CircuitoEletrico {
constructor() {
this.chaves = new Map();
this.graph = new Map();
this.powerDisplayElement = document.getElementById('diagram-status-display');
this.qSwitchMappings = new Map();
this.activeCapacitors = new Set();
this.circuitType = 'trifasico';
 
this.inicializarComponentes();
    this.buildMappings();
    this.buildCircuitGraph();
    this.updateAndPropagate();
}

applyConfiguration(config) {
    this.circuitType = config.circuitType || 'trifasico';
    document.getElementById('circuit-type').value = this.circuitType;
    this.chaves.forEach((_, key) => this.chaves.set(key, false));
    if (config.csToClose) {
        config.csToClose.forEach(csName => {
            if (this.chaves.has(csName)) this.chaves.set(csName, true);
        });
    }
    if (config.qToClose) {
        config.qToClose.forEach(fullQSwitchName => {
            if (this.chaves.has(fullQSwitchName)) this.chaves.set(fullQSwitchName, true);
        });
    }
    this.updateAndPropagate();
}

getCapacitorBranches() {
    const branches = [];
    const sources = { A: 'FONTE_CSA', B: 'FONTE_CSB', C: 'FONTE_CSC' };
    let returns;
    if (this.circuitType === 'monofasico') {
        const groundReturnNode = 'CS6C_TO_GROUND';
        returns = { A: groundReturnNode, B: groundReturnNode, C: groundReturnNode };
    } else {
        returns = { A: 'BUS_B_MAIN_TOP', B: 'BUS_C_MAIN_TOP', C: 'BUS_A_MAIN_BOTTOM' };
    }
    this.qSwitchMappings.forEach((mapping, switchName) => {
        branches.push({
            node: mapping.capName, switchName: switchName,
            source: sources[mapping.phase], returnBus: returns[mapping.phase],
            phase: mapping.phase
        });
    });
    return branches;
}

updateAndPropagate() {
    this.propagarEnergia();
    this.atualizarDisplayStatus();
    this.updateTitleWithCurrentPower();
}

inicializarComponentes() {
    document.querySelectorAll('.switch, .fonte-seta').forEach(el => {
        const name = this.getElementName(el).replace('FONTE_', '');
        this.chaves.set(name, false);
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChave(name);
        });
    });

    document.getElementById('circuit-type').addEventListener('change', (e) => {
        this.circuitType = e.target.value;
        this.updateAndPropagate();
    });

    document.getElementById('test-voltage').addEventListener('input', () => this.updateAndPropagate());
    document.getElementById('bank-voltage').addEventListener('change', () => this.updateAndPropagate());
}

buildMappings() {
    document.querySelectorAll('.switch[data-name^="Q"]').forEach(sw => {
        const swName = this.getElementName(sw);
        const match = swName.match(/Q(\d)_CP(\d)([ABC])(\d)/);
        if (!match) return;
        const [, qNum, cpNum, phase, groupNum] = match;
        
        sw.classList.add(`phase-${phase.toLowerCase()}`);
        
        const capName = `CAP_Q${qNum}-CP${cpNum}${phase}${groupNum}`;
        const capElement = document.querySelector(`[data-name="${capName}"]`);
        if (capElement) {
            this.qSwitchMappings.set(swName, {
                capName: capName, capElement: capElement, phase: phase,
                power: parseInt(capElement.querySelector(".capacitor-label").innerText, 10) || 0
            });
        }
    });
}

toggleChave(nomeChave) {
    this.chaves.set(nomeChave, !this.chaves.get(nomeChave));
    this.updateAndPropagate();
}

updateTitleWithCurrentPower() {
    let totalPowerKVAr = 0;

    this.activeCapacitors.forEach(switchName => {
        const mapping = this.qSwitchMappings.get(switchName);
        if (mapping) {
            totalPowerKVAr += mapping.power;
        }
    });

    const totalPowerMVAr = totalPowerKVAr / 1000;
    const circuitTypeText = this.circuitType === 'trifasico' ? 'TRIFÁSICO' : 'MONOFÁSICO';

    const bankVoltageElement = document.getElementById('bank-voltage');
    const bankVoltage = bankVoltageElement ? bankVoltageElement.value : '27.6';

    const titleElement = document.getElementById('dynamic-title');
    if (titleElement) {
        titleElement.textContent = `DIAGRAMA UNIFILAR ${circuitTypeText} - BANCO DE CAPACITORES - ${bankVoltage} kV - ${totalPowerMVAr.toFixed(3)} MVAr`;
    }
}

pathContainsCapacitor(path) {
    if (!path) return false;
    for (const nodeName of path) {
        if (this.graph.get(nodeName)?.domElement.classList.contains('capacitor')) return true;
    }
    return false;
}

// CORREÇÃO PRINCIPAL: Verificar se TODAS as chaves no caminho estão fechadas
isPathCompletelyConnected(path) {
    if (!path) return false;
    
    for (const nodeName of path) {
        const node = this.graph.get(nodeName);
        if (!node) continue;
        
        // Se o nó é uma chave, verificar se está fechada
        if (node.domElement.classList.contains('switch')) {
            const switchState = this.chaves.get(nodeName);
            if (!switchState) {
                return false;
            }
        }
    }
    return true;
}

propagarEnergia() {
    // 1. Resetar estilos
    this.graph.forEach(node => {
        node.domElement.classList.remove('has-potential', 'is-active-a', 'is-active-b', 'is-active-c', 'interphase-flow', 'animated-flow');
    });
    this.activeCapacitors.clear();

    this.chaves.forEach((isClosed, name) => {
        const el = this.graph.get(name)?.domElement || this.graph.get(`FONTE_${name}`)?.domElement;
        if (el) {
            el.classList.toggle('closed', isClosed);
        }
    });
    
    // 2. Análise de potencial
    const potentialNodes = new Set();
    const activeSources = [];
    const sourceMap = { 'CSA': 'FONTE_CSA', 'CSB': 'FONTE_CSB', 'CSC': 'FONTE_CSC' };
    for (const [sw, source] of Object.entries(sourceMap)) {
        if (this.chaves.get(sw)) {
            this.findAllReachableNodes(source).forEach(node => potentialNodes.add(node));
            activeSources.push(source);
        }
    }

    // 3. Detecção de Curto-Circuito
    const nodesInShortCircuitPaths = new Set();
    if (activeSources.length > 1) {
        for (let i = 0; i < activeSources.length; i++) {
            for (let j = i + 1; j < activeSources.length; j++) {
                const path = this.findPathBetweenNodes(activeSources[i], activeSources[j]);
                if (path && !this.pathContainsCapacitor(path)) {
                    path.forEach(node => nodesInShortCircuitPaths.add(node));
                }
            }
        }
    }

    // 4. CORREÇÃO: Detecção de Fluxo de Corrente - Verificar CAMINHO COMPLETO
    const nodesInCapacitorPaths = new Map();
    const capacitorBranches = this.getCapacitorBranches();
    for (const branch of capacitorBranches) {
        // PRIMEIRA VERIFICAÇÃO: A chave Q específica deve estar fechada
        if (!this.chaves.get(branch.switchName)) {
            continue;
        }

        // SEGUNDA VERIFICAÇÃO: Deve existir caminho completo com TODAS as chaves fechadas
        const pathFromSource = this.findPathBetweenNodes(branch.source, branch.switchName);
        const pathFromSwitch = this.findPathBetweenNodes(branch.switchName, branch.node);
        const pathToReturn = this.findPathBetweenNodes(branch.node, branch.returnBus);

        // TERCEIRA VERIFICAÇÃO: Todos os caminhos devem ter chaves fechadas
        const sourceToSwitchConnected = this.isPathCompletelyConnected(pathFromSource);
        const switchToCapConnected = this.isPathCompletelyConnected(pathFromSwitch);
        const capToReturnConnected = this.isPathCompletelyConnected(pathToReturn);

        // SÓ ATIVAR se TODOS os caminhos estiverem completamente conectados
        if (pathFromSource && pathFromSwitch && pathToReturn && 
            sourceToSwitchConnected && switchToCapConnected && capToReturnConnected) {
            
            this.activeCapacitors.add(branch.switchName);

            const fullFlowPath = new Set([...pathFromSource, ...pathFromSwitch, ...pathToReturn]);
            fullFlowPath.forEach(nodeName => {
                if (!nodesInCapacitorPaths.has(nodeName)) {
                    nodesInCapacitorPaths.set(nodeName, new Set());
                }
                nodesInCapacitorPaths.get(nodeName).add(branch.phase);
            });
        }
    }

    // 5. Aplicar Classes Visuais
    this.graph.forEach((node, nodeName) => {
        const el = node.domElement;
        if (nodesInShortCircuitPaths.has(nodeName)) {
            el.classList.add('interphase-flow');
        } else if (nodesInCapacitorPaths.has(nodeName)) {
            const phases = nodesInCapacitorPaths.get(nodeName);
            el.classList.add('animated-flow');

            let phase;
            const elementName = el.getAttribute('data-name') || '';

            // CORREÇÃO CRÍTICA: Capacitores só ficam ativos se sua chave Q estiver fechada
            if (el.classList.contains('capacitor')) {
                // Encontrar a chave Q correspondente ao capacitor
                const capacitorMatch = elementName.match(/CAP_(Q\d+)-CP\d+([ABC])\d+/);
                if (capacitorMatch) {
                    const qSwitchName = capacitorMatch[1] + '_' + elementName.split('-')[1]; // Ex: Q1_CP3A1

                    // SÓ marcar como ativo se a chave Q estiver fechada
                    if (this.activeCapacitors.has(qSwitchName)) {
                        const phaseMatch = elementName.match(/CAP_Q\d+-CP\d+([ABC])\d+/);
                        phase = phaseMatch ? phaseMatch[1] : phases.values().next().value;
                        el.classList.add(`is-active-${phase.toLowerCase()}`);
                    }
                }
            } else {
                // Para outros elementos (não capacitores), aplicar normalmente
                let phaseFromName = null;

                const patterns = [
                    /([ABC])\d*$/,
                    /CP\d+([ABC])\d+/,
                    /CS\d*([ABC])/,
                    /Q\d+_.*([ABC])\d+/
                ];

                for (const pattern of patterns) {
                    const match = elementName.match(pattern);
                    if (match) {
                        phaseFromName = match[1];
                        break;
                    }
                }

                if (phaseFromName && phases.has(phaseFromName)) {
                    phase = phaseFromName;
                } else {
                    phase = phases.values().next().value;
                }
                el.classList.add(`is-active-${phase.toLowerCase()}`);
            }

        } else if (potentialNodes.has(nodeName)) {
            el.classList.add('has-potential');
        }
    });
}

atualizarDisplayStatus() {
    if (!this.powerDisplayElement) {
        this.powerDisplayElement = document.getElementById('diagram-status-display');
        if(!this.powerDisplayElement) return;
    }

    const testVoltageKV = parseFloat(document.getElementById("test-voltage").value);
    const bankVoltageKV = parseFloat(document.getElementById("bank-voltage").value) || 13.8;
    const operatingVoltageKV = !isNaN(testVoltageKV) && testVoltageKV > 0 ? testVoltageKV : bankVoltageKV;

    const powerByPhase = { 'A': 0, 'B': 0, 'C': 0 };
    this.activeCapacitors.forEach(activeSwitchName => {
        const mapping = this.qSwitchMappings.get(activeSwitchName);
        if (mapping) {
            powerByPhase[mapping.phase] += mapping.power;
        }
    });

    const voltageCorrectionFactor = Math.pow(operatingVoltageKV / bankVoltageKV, 2);
    const totalEffectivePowerMVAr = (Object.values(powerByPhase).reduce((a, b) => a + b, 0) / 1000) * voltageCorrectionFactor;
    const effectivePowerA_MVAr = (powerByPhase['A'] / 1000) * voltageCorrectionFactor;
    const effectivePowerB_MVAr = (powerByPhase['B'] / 1000) * voltageCorrectionFactor;
    const effectivePowerC_MVAr = (powerByPhase['C'] / 1000) * voltageCorrectionFactor;

    let I_L_A = 0, I_L_B = 0, I_L_C = 0;
    const V_op_LL = operatingVoltageKV * 1000;

    if (this.circuitType === 'monofasico') {
        const V_op = operatingVoltageKV * 1000;
        if (V_op > 0) {
            I_L_A = (effectivePowerA_MVAr * 1000000) / V_op;
            I_L_B = (effectivePowerB_MVAr * 1000000) / V_op;
            I_L_C = (effectivePowerC_MVAr * 1000000) / V_op;
        }
    } else {
        if (V_op_LL > 0) {
            const I_ph_AB = (effectivePowerA_MVAr * 1000000) / V_op_LL;
            const I_ph_BC = (effectivePowerB_MVAr * 1000000) / V_op_LL;
            const I_ph_CA = (effectivePowerC_MVAr * 1000000) / V_op_LL;
            I_L_A = Math.sqrt(I_ph_AB ** 2 + I_ph_CA ** 2 - 2 * I_ph_AB * I_ph_CA * Math.cos(120 * Math.PI / 180));
            I_L_B = Math.sqrt(I_ph_BC ** 2 + I_ph_AB ** 2 - 2 * I_ph_BC * I_ph_AB * Math.cos(120 * Math.PI / 180));
            I_L_C = Math.sqrt(I_ph_CA ** 2 + I_ph_BC ** 2 - 2 * I_ph_CA * I_ph_BC * Math.cos(120 * Math.PI / 180));
        }
    }

    let summaryRowHtml = '';
    if (this.circuitType === 'trifasico') {
        const activePowers = [effectivePowerA_MVAr, effectivePowerB_MVAr, effectivePowerC_MVAr].map(parseFloat).filter(p => p > 0);
        let imbalanceClass = '', imbalanceText = 'N/A';
        if (activePowers.length > 1) {
            const maxPower = Math.max(...activePowers);
            const minPower = Math.min(...activePowers);
            const imbalancePercent = maxPower > 0 ? ((maxPower - minPower) / maxPower * 100) : 0;
            imbalanceText = `${imbalancePercent.toFixed(1)} %`;
            if (imbalancePercent > 10) imbalanceClass = 'status-danger';
            else if (imbalancePercent > 5) imbalanceClass = 'status-warning';
        }
        summaryRowHtml = `<tr><td>Desequilíbrio</td><td class="${imbalanceClass}">${imbalanceText}</td></tr>`;
    } else {
        const I_neutro_total = I_L_A + I_L_B + I_L_C;
        summaryRowHtml = `<tr><td>Corrente de Neutro</td><td>${I_neutro_total.toFixed(1)} A</td></tr>`;
    }

    const currentRows = `
        ${I_L_A > 0.1 ? `<tr><td>Corrente Linha A</td><td>${I_L_A.toFixed(1)} A</td></tr>` : ''}
        ${I_L_B > 0.1 ? `<tr><td>Corrente Linha B</td><td>${I_L_B.toFixed(1)} A</td></tr>` : ''}
        ${I_L_C > 0.1 ? `<tr><td>Corrente Linha C</td><td>${I_L_C.toFixed(1)} A</td></tr>` : ''}
    `;

    const html = `
    <div class="status-columns-container">
        <div class="status-column">
            <table class="status-table"><tbody>
                <tr><td>Pot. Total Efetiva</td><td>${totalEffectivePowerMVAr.toFixed(3)} MVAr</td></tr>
                <tr><td>Pot. Fase A</td><td>${effectivePowerA_MVAr.toFixed(2)} MVAr</td></tr>
                <tr><td>Pot. Fase B</td><td>${effectivePowerB_MVAr.toFixed(2)} MVAr</td></tr>
                <tr><td>Pot. Fase C</td><td>${effectivePowerC_MVAr.toFixed(2)} MVAr</td></tr>
            </tbody></table>
        </div>
        <div class="status-column">
            <table class="status-table"><tbody>
                ${currentRows}
                ${summaryRowHtml}
            </tbody></table>
        </div>
    </div>`;
    
    const statusDisplay = document.getElementById('diagram-status-display');
    if(statusDisplay) statusDisplay.innerHTML = html;

    const titleElement = document.getElementById('dynamic-title');
    if (titleElement) {
        const circuitTypeText = this.circuitType === 'trifasico' ? 'TRIFÁSICO' : 'MONOFÁSICO';
        titleElement.textContent = `DIAGRAMA UNIFILAR ${circuitTypeText} - BANCO DE CAPACITORES - ${bankVoltageKV} kV - ${totalEffectivePowerMVAr.toFixed(3)} MVAr`;
    }
}

findPathBetweenNodes(startNode, endNode) { if (!this.graph.has(startNode) || !this.graph.has(endNode)) return null; const queue = [startNode]; const predecessor = new Map(); const visited = new Set([startNode]); let pathFound = false; while (queue.length > 0) { const currentName = queue.shift(); if (currentName === endNode) { pathFound = true; break; } const currentNode = this.graph.get(currentName); if (currentNode.domElement.classList.contains('switch') && !this.chaves.get(currentName)) { continue; } for (const neighborName of currentNode.connections) { if (!visited.has(neighborName)) { visited.add(neighborName); predecessor.set(neighborName, currentName); queue.push(neighborName); } } } if (!pathFound) return null; const path = new Set(); let at = endNode; while (at) { path.add(at); at = predecessor.get(at); } return path; }
findAllReachableNodes(startNodeName) { if (!this.graph.has(startNodeName)) return new Set(); const queue = [startNodeName]; const visited = new Set([startNodeName]); while (queue.length > 0) { const currentName = queue.shift(); const currentNode = this.graph.get(currentName); if (currentNode.domElement.classList.contains('switch') && !this.chaves.get(currentName)) { continue; } currentNode.connections.forEach(neighborName => { if (!visited.has(neighborName) && this.graph.has(neighborName)) { visited.add(neighborName); queue.push(neighborName); } }); } return visited; }
getElementName(el) { return el.dataset.name || `el_${Math.round(el.getBoundingClientRect().left)}_${Math.round(el.getBoundingClientRect().top)}`; }
buildCircuitGraph() { const e=Array.from(document.querySelectorAll(".line, .bus, .switch, .capacitor, .connection-line, .fonte-seta, .ground-symbol, .connection-dot")); e.forEach(el=>{const name=this.getElementName(el); this.graph.set(name,{domElement:el,connections:new Set})}); const ncs=Array.from(document.querySelectorAll(".no-connection-symbol")).map(s=>s.getBoundingClientRect()); for(let i=0;i<e.length;i++){for(let j=i+1;j<e.length;j++){const r1=e[i].getBoundingClientRect(); const r2=e[j].getBoundingClientRect(); if(this.areElementsConnected(r1,r2)){let b=!1; for(const sr of ncs){if(this.areElementsConnected(r1,sr,0)&&this.areElementsConnected(r2,sr,0)){b=!0;break}} if(!b){const n1=this.getElementName(e[i]); const n2=this.getElementName(e[j]); this.graph.get(n1).connections.add(n2); this.graph.get(n2).connections.add(n1)}}}} }
areElementsConnected(r1,r2,t=3){const e={l:r1.left-t,r:r1.right+t,t:r1.top-t,b:r1.bottom+t};return!(e.r<r2.left||e.l>r2.right||e.b<r2.top||e.t>r2.bottom)}
 
}

// Resto do código de inicialização permanece igual...
document.addEventListener('DOMContentLoaded', () => {
window.interactiveDiagram = new CircuitoEletrico();
 
const configPanel = document.getElementById('config-panel');
const togglePanelButton = document.getElementById('toggle-panel-button');

togglePanelButton.addEventListener('click', () => {
    configPanel.classList.toggle('minimized');
    if (configPanel.classList.contains('minimized')) {
        togglePanelButton.textContent = '▶';
    } else {
        togglePanelButton.textContent = '◀';
    }
});

const diagramContainer = document.getElementById('diagram-container');
let scale = 0.75;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX, startY;

const applyTransform = () => {
    diagramContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
};

document.body.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (target.closest('.switch, .fonte-seta, #config-panel, #logo-container, .apply-button, .calc-button')) {
        return;
    }
    e.preventDefault();
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
});

document.body.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    e.preventDefault();
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
});

document.body.addEventListener('mouseup', () => {
    isPanning = false;
});

document.body.addEventListener('wheel', (e) => {
    if (e.target.closest('#config-panel')) {
        return;
    }
    e.preventDefault();

    const zoomIntensity = 0.1;
    const rect = diagramContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const scaleFactor = e.deltaY < 0 ? (1 + zoomIntensity) : (1 - zoomIntensity);
    const newScale = scale * scaleFactor;
    if (newScale < 0.2 || newScale > 4) return;
    panX -= (mouseX / scale) * (newScale - scale);
    panY -= (mouseY / scale) * (newScale - scale);
    scale = newScale;
    applyTransform();
});

applyTransform();

function formatLabelsWithLineBreaks() {
    document.querySelectorAll('.switch-label').forEach(label => {
        const text = label.textContent.trim();
        const qMatch = text.match(/^(Q\d+)\s+(CP\d+[ABC]\d+)$/);
        if (qMatch) {
            label.innerHTML = `${qMatch[1]}<br>${qMatch[2]}`;
            return;
        }
        const csMatch = text.match(/^(CS\d+)([ABC]\d*)$/);
        if (csMatch) {
            label.innerHTML = `${csMatch[1]}<br>${csMatch[2]}`;
            return;
        }
    });

    document.querySelectorAll('.capacitor-label').forEach(label => {
        const text = label.textContent.trim();
        const powerMatch = text.match(/^(\d+)(KVAr|kVar|KVAR)$/i);
        if (powerMatch) {
            label.innerHTML = `${powerMatch[1]}<br>kVAr`;
            return;
        }
    });
}

setTimeout(() => {
    const titleElement = document.getElementById('dynamic-title');
    const bankVoltageKV = parseFloat(document.getElementById("bank-voltage").value) || 13.8;
    const circuitType = document.getElementById('circuit-type').value;
    const circuitTypeText = circuitType === 'trifasico' ? 'TRIFÁSICO' : 'MONOFÁSICO';
    if (titleElement) {
        titleElement.textContent = `DIAGRAMA UNIFILAR ${circuitTypeText} - BANCO DE CAPACITORES - ${bankVoltageKV} kV - 0.000 MVAr`;
    }
    formatLabelsWithLineBreaks();
}, 100);

});