# Cálculo de Correntes por Fase - Sistema Trifásico

## Visão Geral

O sistema agora calcula as correntes considerando o comportamento real de um sistema trifásico, onde cada fase pode ter diferentes quantidades de capacitores conectados, resultando em correntes desequilibradas.

## Fórmulas Utilizadas

### Corrente de Fase (Sistema Trifásico)
```
I_fase = Q / (√3 × V_linha)
```

Onde:
- `I_fase` = Corrente de fase em Ampères
- `Q` = Potência reativa da fase em VAr
- `V_linha` = Tensão de linha em Volts
- `√3` = 1.732 (fator trifásico)

### Corrente de Linha (Sistema Desequilibrado)
Para sistemas desequilibrados, as correntes de linha são calculadas usando:
```
I_AB = √(I_A² + I_B² - 2×I_A×I_B×cos(120°))
I_BC = √(I_B² + I_C² - 2×I_B×I_C×cos(120°))
I_CA = √(I_C² + I_A² - 2×I_C×I_A×cos(120°))
```

## Exemplo Prático

### Cenário 1: Sistema Equilibrado
- Fase A: 1200 kVAr
- Fase B: 1200 kVAr  
- Fase C: 1200 kVAr
- Tensão: 13.8 kV

**Cálculo:**
```
I_A = 1,200,000 / (1.732 × 13,800) = 50.2 A
I_B = 1,200,000 / (1.732 × 13,800) = 50.2 A
I_C = 1,200,000 / (1.732 × 13,800) = 50.2 A
```

**Resultado:** Sistema equilibrado, todas as correntes iguais.

### Cenário 2: Sistema Desequilibrado
- Fase A: 1600 kVAr (4 capacitores)
- Fase B: 800 kVAr (2 capacitores)
- Fase C: 400 kVAr (1 capacitor)
- Tensão: 13.8 kV

**Cálculo:**
```
I_A = 1,600,000 / (1.732 × 13,800) = 66.9 A
I_B = 800,000 / (1.732 × 13,800) = 33.5 A
I_C = 400,000 / (1.732 × 13,800) = 16.7 A
```

**Desequilíbrio:** (66.9 - 16.7) / 66.9 × 100 = 75%

## Interface do Sistema

### Display Principal
O display principal mostra:
- Potência total reativa
- Potência e corrente por fase
- Número de capacitores por fase
- Correntes de linha
- Percentual de desequilíbrio

### Botão "ANALISAR FLUXO"
Exibe análise detalhada no console com:
- Informações por fase
- Correntes de linha
- Análise de desequilíbrio
- Status do sistema (equilibrado/desequilibrado)

### Botão "EXEMPLO TRIFÁSICO"
Executa exemplos de cálculo no console para demonstrar:
- Sistema equilibrado vs desequilibrado
- Cálculos de corrente de fase e linha
- Análise de desequilíbrio

## Considerações Importantes

### Desequilíbrio de Fases
- **< 5%**: Sistema equilibrado ✅
- **5-10%**: Desequilíbrio moderado ⚠️
- **> 10%**: Desequilíbrio elevado ⚠️

### Fluxo de Corrente Trifásico
O sistema representa corretamente o fluxo trifásico onde:
- Fase A retorna pela Fase B
- Fase B retorna pela Fase C  
- Fase C retorna pela Fase A

### Impacto do Desequilíbrio
Sistemas desequilibrados podem causar:
- Correntes de neutro elevadas
- Aquecimento desigual dos equipamentos
- Redução da eficiência do sistema
- Problemas de qualidade de energia

## Como Usar

1. **Configure a tensão** no painel de configuração
2. **Ligue as chaves** dos capacitores desejados
3. **Observe o display** para ver as correntes por fase
4. **Use "ANALISAR FLUXO"** para análise detalhada
5. **Use "EXEMPLO TRIFÁSICO"** para ver exemplos de cálculo

## Validação dos Cálculos

O sistema foi validado com:
- Fórmulas padrão de engenharia elétrica
- Exemplos de sistemas trifásicos reais
- Verificação de desequilíbrio de fases
- Cálculos de corrente de linha para sistemas desequilibrados
