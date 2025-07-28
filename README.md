# 🔌 CapBankSimulator - Simulador Interativo de Banco de Capacitores

<div align="center">

![CapBankView Logo](assets/logo.png)

**Simulador e Visualizador Interativo de Diagrama Unifilar para Banco de Capacitores Trifásico**

[![Version](https://img.shields.io/badge/version-24.07.2025-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/electron-29.1.5-brightgreen.svg)](https://electronjs.org/)
[![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

## 📋 Visão Geral

O **CapBankSimulator** é uma aplicação desktop desenvolvida em Electron que simula o comportamento de um banco de capacitores trifásico através de um diagrama unifilar interativo. O sistema implementa um algoritmo avançado de propagação de energia baseado em grafos, permitindo visualização em tempo real do fluxo elétrico através dos componentes.

### 🎯 Características Principais

- **🔄 Sistema Trifásico Completo**: Simulação das três fases (A, B, C) com blocos independentes
- **⚡ Propagação de Energia Inteligente**: Algoritmo BFS para propagação automática através do circuito
- **🎮 Interface Interativa**: Controle visual de chaves e componentes através de cliques
- **📊 Cálculo Automático**: Sistema de cálculo de configurações baseado em potência reativa
- **🔍 Sistema de Debug**: Painel de análise em tempo real e logs detalhados
- **📱 Interface Responsiva**: Layout adaptável para diferentes resoluções

## 🚀 Funcionalidades

### ⚡ Sistema de Energia
- **Fontes Trifásicas**: CSA, CSB, CSC sempre ativas e energizadas
- **Chaves Controláveis**: Mais de 100 chaves individuais para controle de fluxo
- **Capacitores Escalonados**: 100kVAr, 200kVAr, 800kVAr, 1200kVAr, 1600kVAr por fase
- **Sistema de Aterramento**: Chaves CS6A, CS6B, CS6C com conexão ao terra

### 🎛️ Interface de Controle
- **Painel de Configurações**: Seleção de tipo de circuito e tensão nominal
- **Calculadora de Potência**: Cálculo automático de configurações ótimas
- **Visualização em Tempo Real**: Elementos energizados destacados em vermelho
- **Painel de Debug**: Análise detalhada de estados e conexões

### 📊 Cálculos Elétricos
- **Potência Reativa**: Cálculo baseado em MVAr de entrada
- **Tensão de Ensaio**: Correção automática para diferentes tensões
- **Configurações Ótimas**: Sugestão automática de chaves a serem fechadas
- **Múltiplas Tensões**: Suporte para 13.8kV até 95.6kV

## 🛠️ Tecnologias Utilizadas

- **[Electron](https://electronjs.org/)** - Framework para aplicações desktop
- **HTML5/CSS3** - Interface de usuário moderna e responsiva
- **JavaScript ES6+** - Lógica de simulação e controle
- **Node.js** - Runtime para funcionalidades do sistema
- **Electron Builder** - Empacotamento e distribuição

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação Local
```bash
# Clone o repositório
git clone https://github.com/alessandro-souza-dev/CapBankSimulator.git

# Entre no diretório
cd CapBankSimulator

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

### Build para Distribuição
```bash
# Gerar executável para Windows
npm run dist
```

## 🎮 Como Usar

### 1. Configuração Inicial
1. **Abra a aplicação** - Execute `npm start` ou o executável
2. **Configure o circuito** - Selecione tipo (monofásico/trifásico) e tensão nominal
3. **Defina a potência** - Insira a potência reativa desejada em MVAr

### 2. Cálculo Automático
1. **Clique em "Calcular Configuração"** - O sistema calculará a configuração ótima
2. **Analise os resultados** - Veja as sugestões de chaves a serem fechadas
3. **Aplique a configuração** - Use os botões para aplicar automaticamente

### 3. Controle Manual
1. **Clique nas chaves** - Abra/feche chaves individuais
2. **Observe a propagação** - Elementos energizados ficam vermelhos
3. **Use o debug** - Analise conexões e estados no painel inferior

### 4. Análise de Resultados
- **Elementos Vermelhos**: Componentes energizados
- **Chaves Fechadas**: Permitem passagem de energia
- **Chaves Abertas**: Bloqueiam o fluxo elétrico
- **Painel Debug**: Mostra estado detalhado de cada componente

## 🏗️ Arquitetura do Sistema

### 📁 Estrutura de Arquivos
```
CapBankSimulator/
├── assets/                 # Recursos visuais
│   └── logo.png            # Logo da aplicação
├── main.js                 # Processo principal do Electron
├── index.html              # Interface principal (Diagrama Unifilar V2.8)
├── script.js               # Lógica de simulação e propagação BFS
├── style.css               # Estilos visuais e animações
├── bank-selector.js        # Seletor de bancos de capacitores
├── package.json            # Configurações do projeto e dependências
├── installer.nsh           # Script do instalador NSIS
├── README.md               # Documentação principal
├── LICENSE                 # Licença ISC
├── CHANGELOG.md            # Histórico de versões
├── CONTRIBUTING.md         # Guia de contribuição
├── .gitignore              # Arquivos ignorados pelo Git
├── INSTRUCOES_PROJETO.md   # Instruções detalhadas do projeto
├── CALCULO_CORRENTES_TRIFASICO.md  # Documentação de cálculos
└── CHECKPOINT_SISTEMA_LIMPO.md     # Estado do sistema
```

### 🔧 Componentes Principais

#### `CircuitoEletrico` (script.js)
Classe principal que gerencia toda a simulação:
- **Propagação de Energia**: Algoritmo BFS para fluxo elétrico
- **Detecção de Conexões**: Análise automática por sobreposição
- **Controle de Chaves**: Gerenciamento de estados
- **Visualização**: Atualização em tempo real da interface

#### Sistema de Grafos
- **Nós**: Cada componente é um nó no grafo
- **Arestas**: Conexões detectadas automaticamente
- **Propagação**: BFS a partir das fontes de energia
- **Bloqueios**: Chaves abertas interrompem a propagação

## 📊 Especificações Técnicas

### ⚡ Capacidades do Sistema
- **Fases**: 3 (A, B, C)
- **Blocos por Fase**: 2 (A1/A2, B1/B2, C1/C2)
- **Chaves por Bloco**: 25 (5 níveis × 5 capacitores)
- **Capacitores Totais**: 60 (20 por fase)
- **Tensões Suportadas**: 13.8kV a 95.6kV
- **Potência Máxima**: Limitada apenas pela configuração

### 🔌 Componentes Elétricos
- **Fontes**: CSA, CSB, CSC (sempre ativas)
- **Chaves Q**: Q1-Q5 para cada nível de capacitor
- **Chaves CS**: Controles de seção e aterramento
- **Capacitores**: 5 valores por nível (100kVAr a 1600kVAr)
- **Barramentos**: Principal, intermediário e inferior

## 🔍 Sistema de Debug

### Console do Navegador (F12)
- **Logs Detalhados**: Cada operação gera informações
- **Estado das Chaves**: Rastreamento de mudanças
- **Conexões**: Lista de conexões detectadas
- **Propagação**: Caminho da energia através do circuito

### Painel de Debug (Interface)
- **Estado Atual**: Status de cada chave clicada
- **Conexões Diretas**: Elementos conectados
- **Histórico**: Últimas 50 operações
- **Análise**: Detalhes técnicos de cada componente

## 📸 Screenshots

### Interface Principal
![Interface Principal](docs/screenshots/main-interface.png)
*Diagrama unifilar completo com todas as três fases*

### Painel de Configurações
![Painel de Configurações](docs/screenshots/config-panel.png)
*Painel lateral com controles de configuração e cálculos*

### Sistema Energizado
![Sistema Energizado](docs/screenshots/energized-system.png)
*Visualização do sistema com componentes energizados em vermelho*

## 🔧 Configuração e Personalização

### Tensões Suportadas
| Tensão (kV) | Aplicação Típica |
|-------------|------------------|
| 13.8        | Distribuição urbana |
| 23.9        | Distribuição rural |
| 27.6        | Indústrias médias |
| 41.4        | Indústrias grandes |
| 47.8        | Subestações |
| 55.2        | Transmissão local |
| 71.7        | Transmissão regional |
| 95.6        | Transmissão principal |

### Configurações de Capacitores
| Nível | Capacitor 1 | Capacitor 2 | Capacitor 3 | Capacitor 4 | Capacitor 5 |
|-------|-------------|-------------|-------------|-------------|-------------|
| CP4   | 100 kVAr    | 200 kVAr    | 800 kVAr    | 1200 kVAr   | 1600 kVAr   |
| CP3   | 100 kVAr    | 200 kVAr    | 800 kVAr    | 1200 kVAr   | 1600 kVAr   |
| CP2   | 100 kVAr    | 200 kVAr    | 800 kVAr    | 1200 kVAr   | 1600 kVAr   |
| CP1   | 100 kVAr    | 200 kVAr    | 800 kVAr    | 1200 kVAr   | 1600 kVAr   |

## 🧪 Testes e Validação

### Cenários de Teste
1. **Teste de Propagação**: Verificar fluxo de energia através das fases
2. **Teste de Chaves**: Validar abertura/fechamento de todas as chaves
3. **Teste de Cálculos**: Confirmar precisão dos cálculos de potência
4. **Teste de Interface**: Verificar responsividade e usabilidade

### Executar Testes
```bash
# Executar testes unitários (quando implementados)
npm test

# Executar aplicação em modo de desenvolvimento
npm start

# Verificar build de produção
npm run dist
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### Aplicação não inicia
```bash
# Verificar versão do Node.js
node --version

# Reinstalar dependências
rm -rf node_modules
npm install
```

#### Chaves não respondem
1. Verifique se o JavaScript está habilitado
2. Abra o console (F12) para ver erros
3. Recarregue a página (Ctrl+R)

#### Cálculos incorretos
1. Verifique se a tensão nominal está correta
2. Confirme se a potência está em MVAr
3. Verifique se o tipo de circuito está correto

### Logs de Debug
Para ativar logs detalhados, abra o console do navegador (F12) e execute:
```javascript
// Ativar logs verbosos
window.debugMode = true;

// Ver estado atual do sistema
console.log(circuito.chaves);
console.log(circuito.graph);
```

## 🔄 Atualizações e Versionamento

### Histórico de Versões
- **v24.07.2025**: Versão atual com sistema trifásico completo
- **v24.06.2025**: Implementação do sistema de propagação BFS
- **v24.05.2025**: Interface inicial e componentes básicos

### Roadmap Futuro
- [ ] **Sistema de Relatórios**: Exportação de configurações em PDF
- [ ] **Modo Escuro**: Interface alternativa para baixa luminosidade
- [ ] **Simulação Temporal**: Análise de comportamento ao longo do tempo
- [ ] **API REST**: Interface para integração com outros sistemas
- [ ] **Modo Colaborativo**: Múltiplos usuários no mesmo diagrama

## 📚 Documentação Adicional

### Arquivos de Documentação
- [`INSTRUCOES_PROJETO.md`](INSTRUCOES_PROJETO.md) - Instruções detalhadas do projeto
- [`CALCULO_CORRENTES_TRIFASICO.md`](CALCULO_CORRENTES_TRIFASICO.md) - Cálculos elétricos
- [`CHECKPOINT_SISTEMA_LIMPO.md`](CHECKPOINT_SISTEMA_LIMPO.md) - Estado do sistema

### Recursos Externos
- [Documentação do Electron](https://electronjs.org/docs)
- [Guia de Diagramas Unifilares](https://example.com/unifilares)
- [Normas Técnicas ABNT](https://example.com/abnt)

## 🌟 Recursos Avançados

### Algoritmo de Propagação BFS
O sistema utiliza um algoritmo Breadth-First Search (BFS) otimizado para:
- **Detecção Automática**: Conexões identificadas por sobreposição de elementos
- **Propagação Inteligente**: Energia flui apenas através de caminhos válidos
- **Bloqueio Seletivo**: Chaves abertas interrompem seletivamente o fluxo
- **Performance**: Algoritmo O(V+E) para grafos com centenas de nós

### Sistema de Detecção de Conexões
```javascript
// Exemplo de detecção automática
function detectarConexoes(elemento1, elemento2) {
    const rect1 = elemento1.getBoundingClientRect();
    const rect2 = elemento2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📝 Diretrizes de Contribuição
- Mantenha o código limpo e documentado
- Teste todas as funcionalidades antes do commit
- Siga os padrões de nomenclatura existentes
- Atualize a documentação quando necessário

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Alessandro Souza**
- Desenvolvedor Full-Stack
- GitHub: [@alessandro-souza-dev](https://github.com/alessandro-souza-dev)

## 🙏 Agradecimentos

- Comunidade Electron pela excelente documentação
- Contribuidores que ajudaram no desenvolvimento
- Usuários que forneceram feedback valioso

## 📞 Suporte

Para suporte, abra uma [issue](https://github.com/alessandro-souza-dev/CapBankSimulator/issues) no GitHub ou entre em contato através do perfil.

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

</div>
