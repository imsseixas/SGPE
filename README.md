# Sistema de Gerenciamento de Pagamentos de Estudantes

Este é um aplicativo React completo para gerenciamento de pagamentos de estudantes, desenvolvido com TypeScript, Tailwind CSS e shadcn/ui.

## Funcionalidades

- **Dashboard Interativo**: Interface intuitiva para gerenciamento de pagamentos
- **Gerenciamento de Estudantes**: Adicionar e remover estudantes
- **Seleção de Período**: Dropdowns para escolher mês e ano
- **Registro de Pagamentos**: Campo para inserir valores de pagamento
- **Edição de Pagamentos**: Opção para editar ou excluir pagamentos registrados
- **Exibição de Informações**: Visualização do plano de estudo, valor total, valor pago e valor restante
- **Histórico de Pagamentos**: Tabela com todos os pagamentos registrados para o estudante e período selecionados
- **Persistência de Dados**: Dados salvos localmente no navegador

## Estrutura de Dados

- **Estudantes**: Nome e plano de estudo associado
- **Planos de Estudo**: Nome e valor mensal
- **Pagamentos**: Registro de pagamentos com data, estudante, mês/ano e valor

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse o aplicativo em `http://localhost:5173`

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes de UI)
- Vite (bundler)
- localStorage (persistência de dados)

## Estrutura do Projeto

- `/src/components`: Componentes React (Dashboard, PaymentTable, StudentForm)
- `/src/context`: Contexto global para gerenciamento de estado
- `/src/hooks`: Hooks personalizados
- `/src/types`: Definições de tipos TypeScript
- `/src/App.tsx`: Componente principal da aplicação

## Customização

Você pode facilmente customizar este aplicativo:

- Adicione novos planos de estudo no componente de adição de planos
- Modifique a interface visual nos componentes em `/src/components`
- Estenda as funcionalidades adicionando novos componentes e recursos

## Próximos Passos Possíveis

- Implementar persistência de dados com backend
- Adicionar autenticação de usuários
- Implementar relatórios e gráficos de pagamentos
- Adicionar funcionalidade de exportação de dados
