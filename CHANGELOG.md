# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [24.07.2025] - 2025-07-28

### Adicionado
- Sistema trifásico completo com fases A, B e C
- Algoritmo BFS para propagação de energia
- Interface interativa com controle de chaves
- Sistema de cálculo automático de configurações
- Painel de debug em tempo real
- Suporte para múltiplas tensões (13.8kV a 95.6kV)
- Sistema de aterramento com chaves CS6A, CS6B, CS6C
- Detecção automática de conexões por sobreposição
- Visualização em tempo real com elementos energizados
- Documentação completa do projeto

### Funcionalidades
- **Fontes de Energia**: CSA, CSB, CSC sempre ativas
- **Chaves Controláveis**: Mais de 100 chaves individuais
- **Capacitores**: 5 valores por nível (100kVAr a 1600kVAr)
- **Cálculos Elétricos**: Potência reativa e tensão de ensaio
- **Interface Responsiva**: Layout adaptável
- **Sistema de Debug**: Logs detalhados e painel de análise

### Componentes Implementados
- **Fase A**: Blocos A1 e A2 com 20 capacitores cada
- **Fase B**: Blocos B1 e B2 com 20 capacitores cada  
- **Fase C**: Blocos C1 e C2 com 20 capacitores cada
- **Barramentos**: Principal, intermediário e inferior
- **Chaves Q**: Q1-Q5 para cada nível de capacitor
- **Chaves CS**: Controles de seção e aterramento

### Tecnologias
- Electron 29.1.5 para aplicação desktop
- HTML5/CSS3 para interface moderna
- JavaScript ES6+ para lógica de simulação
- Node.js para funcionalidades do sistema
- Electron Builder para distribuição

### Arquitetura
- Classe `CircuitoEletrico` para gerenciamento da simulação
- Sistema de grafos para representação do circuito
- Algoritmo BFS para propagação de energia
- Detecção automática de conexões por sobreposição
- Sistema de bloqueio seletivo através de chaves

## [Não Lançado]

### Planejado
- [ ] Sistema de relatórios em PDF
- [ ] Modo escuro para interface
- [ ] Simulação temporal
- [ ] API REST para integração
- [ ] Modo colaborativo
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
- [ ] Plugins para extensibilidade

### Em Desenvolvimento
- [ ] Otimização de performance
- [ ] Melhorias na interface
- [ ] Documentação adicional
- [ ] Exemplos de uso

## Tipos de Mudanças
- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas
