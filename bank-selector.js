// --- bank-selector.js ---
// Lógica de cálculo que gera sugestões e oferece um botão para aplicá-las ao diagrama.

class BankSelector {
    constructor() {
        // --- Constantes e Configurações Físicas ---
        this.EPSILON = 1e-9;
        this.SQRT3 = Math.sqrt(3);
        this.Q_SWITCH_POWERS = [100, 200, 800, 1200, 1600]; // KVAr por unidade
        this.AVAILABLE_VOLTAGES = {
            trifasico: [13.8, 23.9, 27.6, 41.4, 47.8, 55.2, 71.7, 95.6],
            monofasico: [13.8, 27.6, 41.4, 55.2],
            delta: [13.8, 27.6, 41.4, 55.2],
            estrela: [23.9, 47.8, 71.7, 95.6]
        };

        this.CAPACITOR_POWER_LIMITS_BY_VOLTAGE = {
            "13.8": { "grupo1": { "min": 0.3, "max": 11.7 }, "grupo1_2": { "min": 0.6, "max": 23.4 } },
            "23.9": { "grupo1": { "min": 0.3, "max": 11.7 }, "grupo1_2": { "min": 0.6, "max": 23.4 } },
            "27.6": { "grupo1": { "min": 1.2, "max": 46.8 }, "grupo1_2": { "min": 2.4, "max": 93.6 } },
            "41.4": { "grupo1": { "min": 0.9, "max": 35.1 }, "grupo1_2": { "min": 1.8, "max": 70.2 } },
            "47.8": { "grupo1": { "min": 1.2, "max": 46.8 }, "grupo1_2": { "min": 2.4, "max": 93.6 } },
            "55.2": { "grupo1": { "min": 1.2, "max": 46.8 }, "grupo1_2": { "min": 2.4, "max": 93.6 } },
            "71.7": { "grupo1": { "min": 0.9, "max": 35.1 }, "grupo1_2": { "min": 1.8, "max": 70.2 } },
            "95.6": { "grupo1": { "min": 1.2, "max": 46.8 }, "grupo1_2": { "min": 2.4, "max": 93.6 } }
        };
        
        this.CAPACITORS_BY_VOLTAGE = { 
            "13.8": ["CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2"],
            "23.9": ["CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2"],
            "27.6": ["CP1A1","CP1A2","CP1B1","CP1B2","CP1C1","CP1C2","CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"],
            "41.4": ["CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"],
            "47.8": ["CP1A1","CP1A2","CP1B1","CP1B2","CP1C1","CP1C2","CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"],
            "55.2": ["CP1A1","CP1A2","CP1B1","CP1B2","CP1C1","CP1C2","CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"],
            "71.7": ["CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"],
            "95.6": ["CP1A1","CP1A2","CP1B1","CP1B2","CP1C1","CP1C2","CP2A1","CP2A2","CP2B1","CP2B2","CP2C1","CP2C2","CP3A1","CP3A2","CP3B1","CP3B2","CP3C1","CP3C2","CP4A1","CP4A2","CP4B1","CP4B2","CP4C1","CP4C2"] 
        };
        
        // --- FONTE DA VERDADE: LISTAS EXATAS DE CHAVES CS POR TENSÃO E GRUPO ---
        this.CS_SWITCH_GROUPS_BY_VOLTAGE = {
            "13.8": {
                "g1": ["CSA", "CSB", "CSC", "CS1A1", "CS1B1", "CS1C1", "CS2A1", "CS2B1", "CS2C1", "CS7A", "CS7B", "CS7C"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS1A1", "CS1A2", "CS1B1", "CS1B2", "CS1C1", "CS1C2", "CS2A1", "CS2A2", "CS2B1", "CS2B2", "CS2C1", "CS2C2", "CS7A", "CS7B", "CS7C"]
            },
            "23.9": {
                "g1": ["CSA", "CSB", "CSC", "CS1A1", "CS1B1", "CS1C1", "CS2A1", "CS2B1", "CS2C1", "CS6A", "CS6B"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS1A1", "CS1A2", "CS1B1", "CS1B2", "CS1C1", "CS1C2", "CS2A1", "CS2A2", "CS2B1", "CS2B2", "CS2C1", "CS2C2", "CS6A", "CS6B"]
            },
            "27.6": {
                "g1": ["CSA", "CSB", "CSC", "CS2A1", "CS2B1", "CS2C1", "CS3A1", "CS3B1", "CS3C1", "CS7A", "CS7B", "CS7C"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS2A1", "CS2A2", "CS2B1", "CS2B2", "CS2C1", "CS2C2", "CS3A1", "CS3A2", "CS3B1", "CS3B2", "CS3C1", "CS3C2", "CS7A", "CS7B", "CS7C"]
            },
            "41.4": {
                "g1": ["CSA", "CSB", "CSC", "CS1A1", "CS1B1", "CS1C1", "CS4A1", "CS4B1", "CS4C1", "CS7A", "CS7B", "CS7C"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS1A1", "CS1A2", "CS1B1", "CS1B2", "CS1C1", "CS1C2", "CS4A1", "CS4A2", "CS4B1", "CS4B2", "CS4C1", "CS4C2", "CS7A", "CS7B", "CS7C"]
            },
            "47.8": {
                "g1": ["CSA", "CSB", "CSC", "CS2A1", "CS2B1", "CS2C1", "CS3A1", "CS3B1", "CS3C1", "CS6A", "CS6B"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS2A1", "CS2A2", "CS2B1", "CS2B2", "CS2C1", "CS2C2", "CS3A1", "CS3A2", "CS3B1", "CS3B2", "CS3C1", "CS3C2", "CS6A", "CS6B"]
            },
            "55.2": {
                "g1": ["CSA", "CSB", "CSC", "CS4A1", "CS4B1", "CS4C1", "CS7A", "CS7B", "CS7C"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS4A1", "CS4A2", "CS4B1", "CS4B2", "CS4C1", "CS4C2", "CS7A", "CS7B", "CS7C"]
            },
            "71.7": {
                "g1": ["CSA", "CSB", "CSC", "CS1A1", "CS1B1", "CS1C1", "CS4A1", "CS4B1", "CS4C1", "CS6A", "CS6B"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS1A1", "CS1A2", "CS1B1", "CS1B2", "CS1C1", "CS1C2", "CS4A1", "CS4A2", "CS4B1", "CS4B2", "CS4C1", "CS4C2", "CS6A", "CS6B"]
            },
            "95.6": {
                "g1": ["CSA", "CSB", "CSC", "CS4A1", "CS4B1", "CS4C1", "CS6A", "CS6B"],
                "g1_g2": ["CSA", "CSB", "CSC", "CS4A1", "CS4A2", "CS4B1", "CS4B2", "CS4C1", "CS4C2", "CS6A", "CS6B"]
            }
        };

        this.qCombinationsWithPower = this._generateQCombinationsWithPower(true);
        this.lastCalculationResult = null;
    }

    _getCombinations(a,k){const r=[];const c=(s,o)=>{if(o.length===k){r.push([...o]);return}for(let i=s;i<a.length;i++){o.push(a[i]);c(i+1,o);o.pop()}};c(0,[]);return r}
    _generateQCombinationsWithPower(includeEmpty = false){ const c=[],q=[1,2,3,4,5];for(let i= (includeEmpty ? 0 : 1) ;i<=q.length;i++){ c.push(...this._getCombinations(q,i)) } return c.map(b=>({power:b.reduce((s,qi)=>s+this.Q_SWITCH_POWERS[qi-1],0),comb:b})).sort((a,b)=>a.power-b.power||a.comb.length-b.comb.length)}
    _getSinglePhaseColumns(voltage) {
        const voltageStr = String(voltage);
        const allCapsForVoltage = this.CAPACITORS_BY_VOLTAGE[voltageStr] || [];
        if (allCapsForVoltage.length === 0) return [];

        const columnData = {};
        const orderedColumnNames = ["A1", "B1", "C1", "A2", "B2", "C2"];

        orderedColumnNames.forEach(name => {
            columnData[name] = {
                name: name,
                seriesCaps: 0,
                caps: [],
                csSwitches: new Set()
            };
        });

        allCapsForVoltage.forEach(capName => {
            const match = capName.match(/CP(\d+)([A-C])([1-2])/);
            if (match) {
                const columnName = `${match[2]}${match[3]}`;
                if (columnData[columnName]) {
                    columnData[columnName].seriesCaps++;
                    columnData[columnName].caps.push(capName);

                    // Corrigido: usar CS_SWITCH_GROUPS_BY_VOLTAGE ao invés de CS_SWITCHES_BY_VOLTAGE_TRI
                    const switchGroups = this.CS_SWITCH_GROUPS_BY_VOLTAGE[voltageStr];
                    if (switchGroups) {
                        // Combinar todas as chaves dos grupos g1 e g1_g2
                        const allCSSwitches = [...new Set([...switchGroups.g1, ...switchGroups.g1_g2])];
                        allCSSwitches.forEach(cs => {
                            if (cs === `CS${capName.substring(2)}` || (cs.startsWith(`CS`) && cs.endsWith(columnName))) {
                                columnData[columnName].csSwitches.add(cs);
                            }
                        });
                    }
                }
            }
        });

        return orderedColumnNames.map(name => columnData[name]).filter(col => col.seriesCaps > 0);
    }
    _curateOptions(s, q) { if (!s.length) return []; const meetsReq = s.filter(sol => sol.meets_ideal_power_req); let bestOption; if (meetsReq.length > 0) { meetsReq.sort((a, b) => { const diffA = a.q_efetiva - q; const diffB = b.q_efetiva - q; if (Math.abs(diffA - diffB) > 0.01) { return diffA - diffB; } const complexityA = (a.columns_activated_str ? (a.columns_activated_str.match(/,/g) || []).length : 0) * 10 + (a.q_config_str.match(/Q/g) || []).length; const complexityB = (b.columns_activated_str ? (b.columns_activated_str.match(/,/g) || []).length : 0) * 10 + (b.q_config_str.match(/Q/g) || []).length; if (complexityA !== complexityB) { return complexityA - complexityB; } return a.q_efetiva - b.q_efetiva; }); bestOption = meetsReq[0]; } else { bestOption = s.sort((a,b) => b.q_efetiva - a.q_efetiva)[0]; } let curated = []; const allSorted = [...s].sort((a, b) => a.q_efetiva - b.q_efetiva); const bestIndex = allSorted.findIndex(sol => sol === bestOption); if (bestIndex !== -1) { if (bestIndex > 1) curated.push(allSorted[bestIndex - 2]); if (bestIndex > 0) curated.push(allSorted[bestIndex - 1]); curated.push(allSorted[bestIndex]); if (bestIndex < allSorted.length - 1) curated.push(allSorted[bestIndex + 1]); if (bestIndex < allSorted.length - 2) curated.push(allSorted[bestIndex + 2]); } curated = [...new Set(curated)]; if (curated.length === 0 && bestOption) curated.push(bestOption); curated.forEach(sol => { sol.is_default = (sol === bestOption); }); return curated.sort((a,b) => a.q_efetiva - b.q_efetiva); }

    findBestBankConfiguration(inputs) {
        if (inputs.circuitType === 'trifasico') {
            const targetBankVoltage = inputs.bankVoltageKV;
            const voltageStr = String(targetBankVoltage);

            // Determinar tipo de conexão baseado na tensão
            let connectionType;
            if (this.AVAILABLE_VOLTAGES.delta.includes(targetBankVoltage)) {
                connectionType = "Delta";
            } else if (this.AVAILABLE_VOLTAGES.estrela.includes(targetBankVoltage)) {
                connectionType = "Estrela";
            } else {
                connectionType = "Delta"; // fallback padrão
            }

            const qRequiredMVAR = inputs.targetQ_MVAR;
            const limits = this.CAPACITOR_POWER_LIMITS_BY_VOLTAGE[voltageStr];

            if (!limits || !this.CS_SWITCH_GROUPS_BY_VOLTAGE[voltageStr]) {
                return { error: `Dados de configuração não definidos para a tensão de ${targetBankVoltage} kV.` };
            }

            if (qRequiredMVAR > limits.grupo1_2.max + this.EPSILON) {
                return { error: `Potência solicitada (${qRequiredMVAR.toFixed(1)} MVAr) excede a capacidade do banco (${limits.grupo1_2.max.toFixed(1)} MVAr).` };
            }

            const allCaps = this.CAPACITORS_BY_VOLTAGE[voltageStr] || [];
            const capsG1 = allCaps.filter(c => c.endsWith('1'));
            const capsG2 = allCaps.filter(c => c.endsWith('2'));
            
            const maxPowerG1_MVAR = (this.Q_SWITCH_POWERS.reduce((a, b) => a + b, 0) * capsG1.length) / 1000;
            const switchGroups = this.CS_SWITCH_GROUPS_BY_VOLTAGE[voltageStr];
            
            // --- CENÁRIO EXCLUSIVO: GRUPO 1 ---
            if (qRequiredMVAR <= maxPowerG1_MVAR + this.EPSILON) {
                let solutionsG1 = [];
                this.qCombinationsWithPower.forEach(qConfig => {
                    const qProvidedMVAR = (qConfig.power * capsG1.length) / 1000;
                    const qToClose = capsG1.flatMap(capPrefix => qConfig.comb.map(qNum => `Q${qNum}_${capPrefix}`));
                    
                    solutionsG1.push({
                        q_config_str: qConfig.comb.length > 0 ? qConfig.comb.map(q => `Q${q}`).join(', ') : "Nenhum",
                        q_efetiva: qProvidedMVAR,
                        meets_ideal_power_req: qProvidedMVAR >= qRequiredMVAR - this.EPSILON,
                        group_info: "Grupo 1",
                        csToClose: switchGroups.g1,
                        qToClose: qToClose
                    });
                });
                
                const finalSolutions = this._curateOptions(solutionsG1, qRequiredMVAR);
                return { bankConfig: { voltage: targetBankVoltage, connectionType }, solutions: finalSolutions };
            }
            // --- CENÁRIO EXCLUSIVO: GRUPO 1+G2 ---
            else {
                let solutionsG1G2 = [];
                const qToClose_G1_Full = capsG1.flatMap(capPrefix => [1, 2, 3, 4, 5].map(qNum => `Q${qNum}_${capPrefix}`));
                
                this.qCombinationsWithPower.forEach(qConfigG2 => {
                    const qProvidedG2_MVAR = (qConfigG2.power * capsG2.length) / 1000;
                    const totalProvidedMVAR = maxPowerG1_MVAR + qProvidedG2_MVAR;
                    
                    const qToClose_G2 = capsG2.flatMap(capPrefix => qConfigG2.comb.map(qNum => `Q${qNum}_${capPrefix}`));
                    const configStrG2 = qConfigG2.comb.length > 0 ? qConfigG2.comb.map(q => `Q${q}`).join(',') : "Nenhum";

                    solutionsG1G2.push({
                        q_config_str: `Q1-5 (G1) + ${configStrG2} (G2)`,
                        q_efetiva: totalProvidedMVAR,
                        meets_ideal_power_req: totalProvidedMVAR >= qRequiredMVAR - this.EPSILON,
                        group_info: "Grupo 1+2",
                        csToClose: switchGroups.g1_g2,
                        qToClose: [...qToClose_G1_Full, ...qToClose_G2]
                    });
                });
                
                const finalSolutions = this._curateOptions(solutionsG1G2, qRequiredMVAR);
                return { bankConfig: { voltage: targetBankVoltage, connectionType }, solutions: finalSolutions };
            }
        }

        if (inputs.circuitType === 'monofasico') {
            const targetBankVoltage = inputs.bankVoltageKV;
            const voltageStr = String(targetBankVoltage);
            const connectionType = "Estrela-Aterrado";
            const targetKVAr = inputs.targetQ_MVAR * 1000;
            const limits = this.CAPACITOR_POWER_LIMITS_BY_VOLTAGE[voltageStr];

            if (!limits) {
                return { error: `Limites de potência não definidos para a tensão de ${targetBankVoltage} kV.` };
            }

            const availableColumns = this._getSinglePhaseColumns(targetBankVoltage);
            if (availableColumns.length === 0) return { error: `Nenhuma coluna de capacitores encontrada para esta tensão.` };
            
            const maxTotalPowerMVAR = limits.grupo1_2.max;
            if ((targetKVAr / 1000) > maxTotalPowerMVAR + this.EPSILON) {
                return { error: `Potência solicitada (${(targetKVAr/1000).toFixed(1)} MVAr) excede a capacidade máxima do banco (${maxTotalPowerMVAR.toFixed(1)} MVAr).` };
            }

            const MAX_POWER_PER_COLUMN_KVAR = this.Q_SWITCH_POWERS.reduce((a, b) => a + b, 0); 
            
            let accumulatedPower = 0;
            let columnsToUse = [];
            for (const column of availableColumns) {
                columnsToUse.push(column);
                if (accumulatedPower + (MAX_POWER_PER_COLUMN_KVAR * column.seriesCaps) >= targetKVAr - this.EPSILON) {
                    break;
                }
                accumulatedPower += MAX_POWER_PER_COLUMN_KVAR * column.seriesCaps;
            }

            const powerFromFullColumns = accumulatedPower;
            const fullColumns = columnsToUse.slice(0, -1);
            const finalColumn = columnsToUse.slice(-1)[0];
            
            let allSolutions = [];

            this.qCombinationsWithPower.forEach(qConfig => {
                const totalEffectiveKVAr = powerFromFullColumns + (qConfig.power * (finalColumn ? finalColumn.seriesCaps : 0));

                let configStr = fullColumns.map(c => `Q1-Q5 em ${c.name}`).join('; ');
                if (qConfig.comb.length > 0 && finalColumn) {
                     if(configStr) configStr += '; ';
                     configStr += `${qConfig.comb.map(q => `Q${q}`).join(',')} em ${finalColumn.name}`;
                }

                let qToClose = [];
                fullColumns.forEach(col => {
                    col.caps.forEach(capPrefix => {
                        [1, 2, 3, 4, 5].forEach(qNum => qToClose.push(`Q${qNum}_${capPrefix}`));
                    });
                });
                if (finalColumn) {
                    finalColumn.caps.forEach(capPrefix => {
                        qConfig.comb.forEach(qNum => qToClose.push(`Q${qNum}_${capPrefix}`));
                    });
                }

                const csToClose = new Set();
                columnsToUse.forEach(col => {
                    col.csSwitches.forEach(cs => csToClose.add(cs));
                    const phase = col.name.charAt(0);
                    csToClose.add(`CS${phase}`);
                    csToClose.add(`CS6${phase}`);
                });
                if (columnsToUse.length > 0) {
                    csToClose.add('CS6C');
                }

                allSolutions.push({
                    q_config_str: configStr || "Nenhuma chave Q",
                    q_efetiva: totalEffectiveKVAr / 1000,
                    meets_ideal_power_req: totalEffectiveKVAr >= targetKVAr - this.EPSILON,
                    columns_activated_str: columnsToUse.map(c => c.name).join(', '),
                    csToClose: Array.from(csToClose),
                    qToClose: qToClose,
                });
            });

            const curatedSolutions = this._curateOptions(allSolutions, targetKVAr / 1000);
             if (curatedSolutions.length === 0) return { error: `Não foi possível encontrar uma combinação para ${(targetKVAr/1000).toFixed(1)} MVAr.` };

            return { bankConfig: { voltage: targetBankVoltage, connectionType }, solutions: curatedSolutions };
        }
        return { error: "Tipo de circuito inválido." };
    }
}

// --- LÓGICA DE INTERFACE DO USUÁRIO ---
function applySuggestion(solutionIndex) {
    if (window.bankSelectorInstance && window.bankSelectorInstance.lastCalculationResult) {
        const solution = window.bankSelectorInstance.lastCalculationResult.solutions[solutionIndex];
        const circuitType = document.getElementById('circuit-type').value;
        if (solution && window.interactiveDiagram) {
            const configPlan = {
                csToClose: solution.csToClose,
                qToClose: solution.qToClose,
                circuitType: circuitType,
            };
            window.interactiveDiagram.applyConfiguration(configPlan);
            document.querySelectorAll('.results-table-row').forEach(row => row.classList.remove('applied-config'));
            const appliedRow = document.getElementById(`solution-row-${solutionIndex}`);
            if (appliedRow) appliedRow.classList.add('applied-config');

            // CORREÇÃO: Atualizar título principal com valores da solução aplicada
            updateMainTitle(solution);
        } else {
            console.error("Não foi possível encontrar a solução ou o diagrama interativo.");
        }
    }
}

function updateMainTitle(solution) {
    const titleElement = document.getElementById('dynamic-title');
    if (!titleElement) return;

    const circuitType = document.getElementById('circuit-type').value;
    const circuitTypeText = circuitType === 'trifasico' ? 'TRIFÁSICO' : 'MONOFÁSICO';

    const bankVoltageKV = parseFloat(document.getElementById('bank-voltage').value) || 13.8;
    const testVoltageKV = parseFloat(document.getElementById('test-voltage').value);
    const isTestVoltageActive = !isNaN(testVoltageKV) && testVoltageKV > 0 && testVoltageKV !== bankVoltageKV;

    // CORREÇÃO: Sempre usar tensão do banco no título
    let effectivePower = solution.q_efetiva;

    if (isTestVoltageActive) {
        const correctionFactor = Math.pow(testVoltageKV / bankVoltageKV, 2);
        effectivePower = solution.q_efetiva * correctionFactor;
    }

    titleElement.textContent = `DIAGRAMA UNIFILAR ${circuitTypeText} - BANCO DE CAPACITORES - ${bankVoltageKV} kV - ${effectivePower.toFixed(3)} MVAr`;
}

function initializeBankSelector() {
    window.bankSelectorInstance = new BankSelector(); 
    const calculateButton = document.getElementById('calculate-circuit');
    const powerInput = document.getElementById('test-power');
    const effectivePowerInput = document.getElementById('effective-test-power');
    const testVoltageInput = document.getElementById('test-voltage');
    const voltageSelect = document.getElementById('bank-voltage');
    const circuitTypeSelect = document.getElementById('circuit-type');
    const resultsDiv = document.getElementById('circuit-results');

    function updateVoltageOptions() {
        const selectedType = circuitTypeSelect.value;
        const voltages = window.bankSelectorInstance.AVAILABLE_VOLTAGES[selectedType] || [];
        const currentSelectedValue = voltageSelect.value;
        voltageSelect.innerHTML = '';
        voltages.forEach(v => {
            const option = document.createElement('option');
            option.value = v; option.textContent = v;
            voltageSelect.appendChild(option);
        });
        if (voltages.includes(parseFloat(currentSelectedValue))) {
            voltageSelect.value = currentSelectedValue;
        } else if (voltages.length > 0) {
            voltageSelect.value = voltages[0];
        }
        // Dispara a atualização do diagrama ao mudar o tipo de circuito e, consequentemente, a tensão
        if (window.interactiveDiagram) {
            window.interactiveDiagram.updateAndPropagate();
        }
    }
    
    circuitTypeSelect.addEventListener('change', updateVoltageOptions);
    updateVoltageOptions();

    calculateButton.addEventListener('click', () => {
        document.querySelectorAll('.results-table-row').forEach(row => row.classList.remove('applied-config'));

        const targetPowerInput = parseFloat(powerInput.value);
        const bankVoltageKV = parseFloat(voltageSelect.value);
        const testVoltageKV = parseFloat(testVoltageInput.value);
        
        if (isNaN(targetPowerInput) || targetPowerInput <= 0) {
            resultsDiv.innerHTML = `<p style="color: #e74c3c;">⚠️ Insira um valor de Potência Reativa válido.</p>`;
            return;
        }

        let effectiveTargetQ_MVAR = targetPowerInput;
        let displayCorrectionFactor = 1.0;

        if (!isNaN(testVoltageKV) && testVoltageKV > 0 && testVoltageKV !== bankVoltageKV) {
            const nominalCorrectionFactor = Math.pow(bankVoltageKV / testVoltageKV, 2);
            effectiveTargetQ_MVAR = targetPowerInput * nominalCorrectionFactor;
            effectivePowerInput.value = effectiveTargetQ_MVAR.toFixed(3);
            
            displayCorrectionFactor = Math.pow(testVoltageKV / bankVoltageKV, 2);
        } else {
            effectivePowerInput.value = '';
        }
        
        const inputs = {
            targetQ_MVAR: effectiveTargetQ_MVAR,
            bankVoltageKV: bankVoltageKV,
            circuitType: circuitTypeSelect.value,
        };

        const result = window.bankSelectorInstance.findBestBankConfiguration(inputs);
        window.bankSelectorInstance.lastCalculationResult = result;

        displayResults(result, resultsDiv, displayCorrectionFactor);

        // CORREÇÃO: Atualizar título com a melhor solução encontrada
        if (result.solutions && result.solutions.length > 0) {
            const bestSolution = result.solutions.find(sol => sol.is_default) || result.solutions[0];
            updateMainTitle(bestSolution);
        }
    });

    function displayResults(result, displayElement, correctionFactor = 1.0) {
        if (result.error) { 
            displayElement.innerHTML = `<p style="color: #e74c3c; font-size: 14px;">⚠️ ${result.error}</p>`; 
            return; 
        }
        if (!result.solutions || result.solutions.length === 0) { 
            displayElement.innerHTML = '<p>Nenhuma configuração viável encontrada.</p>'; 
            return; 
        }

        const { voltage, connectionType } = result.bankConfig;
        const isTestVoltageActive = correctionFactor !== 1.0;

        let tableHeader = `
            <th style="padding: 4px;">Configuração Sugerida</th>
            <th style="padding: 4px;">Pot. Nominal (MVAr)</th>
            ${isTestVoltageActive ? '<th style="padding: 4px;">Pot. Ensaio (MVAr)</th>' : ''}
            <th style="padding: 4px;">Ação</th>
        `;

        // Criar título com informação de potência de ensaio se aplicável
        let titleText = `Sugestões para Banco ${voltage} kV (${connectionType})`;
        if (isTestVoltageActive) {
            const testVoltageKV = parseFloat(document.getElementById('test-voltage').value);
            titleText += ` - Ensaio: ${testVoltageKV} kV`;
        }

        let html = `<div><p style="margin-bottom: 5px;"><strong>${titleText}:</strong></p>
                   <table style="width: 100%; border-collapse: collapse;">
                       <thead style="text-align: left; background-color: #f0f0f0;">
                           <tr>${tableHeader}</tr>
                       </thead>
                       <tbody>`;

       result.solutions.forEach((sol, index) => {
           const rowStyle = sol.is_default ? 'font-weight: bold; background-color: #eaf2ff;' : '';
           const applyButton = `<button class="apply-button" onclick="applySuggestion(${index})">Aplicar</button>`;
           
           const nominalPower = sol.q_efetiva.toFixed(2);
           const effectivePower = (sol.q_efetiva * correctionFactor).toFixed(2);
           
           let groupInfoText = sol.group_info || (sol.columns_activated_str ? `Colunas: ${sol.columns_activated_str}` : '');

           html += `<tr id="solution-row-${index}" class="results-table-row" style="${rowStyle}">
                       <td style="padding: 4px; white-space: normal;">${sol.q_config_str} ${groupInfoText ? `(${groupInfoText})` : ''}</td>
                       <td style="padding: 4px;">${nominalPower}</td>
                       ${isTestVoltageActive ? `<td style="padding: 4px;">${effectivePower}</td>` : ''}
                       <td style="padding: 4px;">${applyButton}</td>
                    </tr>`;
       });
       
       html += '</tbody></table></div>';
       displayElement.innerHTML = html;
       const style = document.createElement('style');
       style.innerHTML = `.apply-button { font-size: 12px; padding: 2px 6px; cursor: pointer; border-radius: 3px; border: 1px solid #0d6efd; background: #eaf2ff; color: #0d6efd; } .apply-button:hover { background: #0d6efd; color: white; }`;
       document.head.appendChild(style);
   }
}

document.addEventListener('DOMContentLoaded', () => {
   initializeBankSelector();
});