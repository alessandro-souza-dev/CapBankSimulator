# Contribuindo para o CapBankSimulator

Obrigado por considerar contribuir para o CapBankSimulator! Este documento fornece diretrizes para contribuições.

## 🤝 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USUARIO/CapBankSimulator.git
cd CapBankSimulator

# Adicione o repositório original como upstream
git remote add upstream https://github.com/alessandro-souza-dev/CapBankSimulator.git
```

### 2. Configuração do Ambiente
```bash
# Instale as dependências
npm install

# Execute a aplicação para testar
npm start
```

### 3. Criando uma Branch
```bash
# Crie uma branch para sua feature/correção
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 4. Fazendo Mudanças
- Mantenha o código limpo e bem documentado
- Siga os padrões de nomenclatura existentes
- Teste suas mudanças antes de fazer commit
- Adicione comentários explicativos quando necessário

### 5. Commit e Push
```bash
# Adicione suas mudanças
git add .

# Faça commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"

# Push para seu fork
git push origin feature/nome-da-feature
```

### 6. Pull Request
1. Vá para o GitHub e crie um Pull Request
2. Descreva claramente suas mudanças
3. Referencie issues relacionadas se houver
4. Aguarde review e feedback

## 📝 Padrões de Código

### JavaScript
- Use ES6+ features quando apropriado
- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis e funções
- Adicione comentários para lógica complexa

```javascript
// ✅ Bom
function calcularPotenciaEfetiva(potenciaReativa, tensaoNominal, tensaoEnsaio) {
    // Calcula a potência efetiva baseada na tensão de ensaio
    const fatorCorrecao = Math.pow(tensaoEnsaio / tensaoNominal, 2);
    return potenciaReativa * fatorCorrecao;
}

// ❌ Evitar
function calc(p, v1, v2) {
    return p * Math.pow(v2 / v1, 2);
}
```

### HTML
- Use elementos semânticos
- Mantenha atributos `data-name` para identificação
- Organize elementos logicamente

### CSS
- Use classes descritivas
- Mantenha estilos organizados por componente
- Use variáveis CSS para cores e medidas comuns

## 🐛 Reportando Bugs

### Antes de Reportar
1. Verifique se o bug já foi reportado
2. Teste na versão mais recente
3. Reproduza o bug consistentemente

### Template de Bug Report
```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: Windows 10]
- Versão do Node: [ex: 16.14.0]
- Versão da Aplicação: [ex: 24.07.2025]
```

## 💡 Sugerindo Melhorias

### Template de Feature Request
```markdown
**Sua sugestão está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução que você gostaria**
Descrição clara da funcionalidade desejada.

**Descreva alternativas consideradas**
Outras soluções ou funcionalidades consideradas.

**Contexto adicional**
Qualquer outro contexto sobre a sugestão.
```

## 🧪 Testes

### Executando Testes
```bash
# Executar todos os testes
npm test

# Executar aplicação em modo de desenvolvimento
npm start

# Verificar build de produção
npm run dist
```

### Adicionando Testes
- Adicione testes para novas funcionalidades
- Mantenha cobertura de testes alta
- Use nomes descritivos para testes

## 📚 Documentação

### Atualizando Documentação
- Atualize README.md para novas funcionalidades
- Adicione comentários no código
- Atualize CHANGELOG.md
- Mantenha documentação técnica atualizada

### Escrevendo Documentação
- Use linguagem clara e concisa
- Inclua exemplos quando apropriado
- Mantenha formatação consistente
- Adicione screenshots para funcionalidades visuais

## 🏷️ Convenções de Commit

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

### Exemplos
```bash
feat(calculator): adiciona cálculo de potência trifásica
fix(ui): corrige posicionamento de chaves na fase B
docs(readme): atualiza instruções de instalação
style(css): melhora formatação dos estilos
refactor(circuit): simplifica algoritmo de propagação
test(unit): adiciona testes para classe CircuitoEletrico
chore(deps): atualiza dependências do Electron
```

## 🔍 Code Review

### Para Revisores
- Seja construtivo e respeitoso
- Foque na qualidade do código
- Teste as mudanças localmente
- Verifique se a documentação foi atualizada

### Para Contribuidores
- Responda a comentários prontamente
- Faça mudanças solicitadas
- Mantenha discussões focadas no código
- Seja receptivo a feedback

## 📞 Obtendo Ajuda

- Abra uma [issue](https://github.com/alessandro-souza-dev/CapBankSimulator/issues) para dúvidas
- Use as [discussions](https://github.com/alessandro-souza-dev/CapBankSimulator/discussions) para conversas gerais
- Entre em contato através do perfil do GitHub

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença ISC do projeto.

---

**Obrigado por contribuir! 🎉**
