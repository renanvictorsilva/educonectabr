# ConectaEdu PR — versão 14.5 | identidade visual e pet funcional

## Como abrir
1. Extraia o ZIP mantendo todos os arquivos na mesma pasta.
2. Abra `index.html` em um navegador atualizado.
3. Entre com uma conta de demonstração ou use **Entrar sem login — Demonstração**.
4. Senha das contas de demonstração: `demo123`.

| Perfil | Usuário |
|---|---|
| Aluno | `aluno.demo` |
| Professor | `prof.demo` |
| Pedagogo | `pedagogo.demo` |
| Responsável | `familia.demo` |
| Administrador | `admin.demo` |

## O que inclui a plataforma
- **Menu lateral rolável:** o menu tem rolagem própria, barra de rolagem visível e continua acessível em telas baixas sem reduzir o zoom.
- **Atividades:** criar atividades pessoais, filtrar por estado, concluir e excluir; atualização do painel inicial e do progresso.
- **Calendário:** criar eventos com data, categoria e detalhes; consultar eventos no calendário e remover eventos personalizados.
- **Meu progresso:** indicadores por componente calculados a partir das atividades locais e planos de estudo salvos com meta, minutos por dia e data de revisão.
- **Área do professor:** criar atividades para turmas, definir prazo, atualizar status e excluir atribuições.
- **Visão pedagógica:** registrar, consultar e remover encaminhamentos de acompanhamento.
- **Permissões de navegação:** bloqueio de acesso pela interface às páginas profissionais quando o perfil atual não corresponde ao papel exigido.
- Mantidas as funcionalidades da versão anterior: quizzes com correção, registros de respostas abertas, catálogo de disciplinas e habilidades, biblioteca digital, notificações, acessibilidade, pet/moedas, perfil, área da família e exportação administrativa.

## Contas de demonstração e dados
Os dados de atividades, eventos, planos e registros profissionais são guardados no `localStorage` do navegador. Isso permite testar os fluxos, mas os dados **não são sincronizados entre dispositivos, usuários ou navegadores**. Limpar os dados do navegador pode apagá-los.

## Limitações para uso real por uma escola
Esta versão é um protótipo front-end funcional para testar fluxos; **não é ainda um sistema de produção com backend**. As contas são demonstrativas, e as verificações de perfil no navegador não oferecem segurança real contra alguém que manipule o código. Não insira dados pessoais reais de estudantes.

Para funcionar como plataforma escolar real e multiusuário, a próxima etapa precisa incluir API/backend hospedado, autenticação real, autorização por escola e por registro, banco de dados implantado, recuperação de senha, arquivos privados, logs de auditoria, backups, testes de segurança e política de privacidade/LGPD. O arquivo `database-schema-starter.sql` é apenas um ponto de partida e requer revisão técnica antes de qualquer implantação.

O catálogo de habilidades é ilustrativo; não o trate como transcrição oficial da BNCC ou do Referencial Curricular do Paraná sem validação da equipe pedagógica.

## v9 — navegação por áreas e inclusão

A navegação principal foi agrupada em quatro áreas:
- **Minha escola:** atividades escolares, calendário, plataformas, informações e comunicados, além de atalhos por perfil.
- **Treinar:** banco de atividades, disciplinas, habilidades, biblioteca digital e assistente de estudos.
- **Score:** moedas, pet, loja e conquistas.
- **Desempenho:** indicadores pessoais, progresso por disciplina e ranking demonstrativo da turma.

A área **Acessibilidade** agora inclui tamanho de texto, alto contraste, fonte sem serifa amigável à leitura, espaçamento ampliado, guia de leitura, redução de movimento, leitura em voz alta via recursos do navegador e atalhos de teclado (Alt+1 a Alt+5; Esc para interromper leitura/guia). As preferências são salvas neste navegador.

**Limites importantes:** o ranking usa colegas e valores fictícios para demonstração; moedas, pet e atividades permanecem locais neste navegador. A leitura em voz alta depende do suporte do navegador/dispositivo. Estas melhorias não significam certificação WCAG nem substituem avaliação com pessoas com deficiência. Para uso real por uma turma, é necessário backend, autenticação e autorização seguras e dados compartilhados.


## Melhorias visuais v10
- Interface refinada com cartões, bordas, sombras, hierarquia visual e animações suaves.
- Tema escuro revisado para campos, cartões, calendários, listas, tabelas, botões e textos auxiliares.
- Alto contraste reforçado com fundo preto, texto branco, links ciano, controles amarelos e foco bem visível. O alto contraste tem prioridade mesmo se o tema escuro estiver ativado.
- Ajustes de responsividade e respeito à preferência de movimento reduzido do sistema.

A aparência e a acessibilidade foram melhoradas no front-end; isso não substitui testes de acessibilidade com usuários e tecnologias assistivas.


## Melhorias visuais v11 e Libras
- Títulos principais de cada área maiores, mais pesados e com faixa de destaque visual.
- Títulos de seção e de cartões reforçados para facilitar a hierarquia e a leitura rápida.
- Ajustes específicos para manter os destaques legíveis no tema escuro e no alto contraste.
- Integração do widget VLibras com o script oficial `https://vlibras.gov.br/app/vlibras-plugin.js`. A tradução depende de conexão com a internet e da disponibilidade do serviço externo; nem todo conteúdo dinâmico ou mídia terá tradução automática perfeita.


## Versão 13 — elementos visuais
- Ícones vetoriais SVG incorporados localmente para navegação, cartões, áreas escolares, acessibilidade e loja.
- Ilustração vetorial original do pet, sem emojis nem dependência de banco de imagens externo.
- Ícones ajustados para modo claro, modo escuro e alto contraste.
- Os SVGs são decorativos e marcados como ocultos para leitores de tela; controles mantêm seus rótulos textuais.


## v14 — mapa integrado e diferenciação de perfis
- A primeira versão chegou a incluir uma imagem aérea de referência; ela foi removida na v14.4 a pedido do projeto. O mapa esquemático ilustrativo com salas, laboratório, biblioteca e quadra foi mantido.
- Diferenciação visual das áreas profissionais por cor e cabeçalho: professor, equipe pedagógica, responsável e administração.
- Melhorias responsivas no mapa e respeito à preferência de movimento reduzido.
- Personalização visual do pet: boné e aura aparecem sobre a ilustração quando adquiridos.

### Verificações e limites da v14
Esta versão continua sendo um protótipo front-end local. As contas e dados continuam demonstrativos e salvos no navegador; não há sincronização multiusuário nem autenticação segura de produção. O mapa usado nesta versão é ilustrativo e esquemático, com salas, laboratório, biblioteca e quadra; não utiliza a imagem aérea enviada anteriormente.

## Atualização v14.2 — perfis profissionais e preferências

- Corrigida a navegação para manter Notificações, Acessibilidade e Meu perfil disponíveis para todos os perfis previstos.
- Área do professor: planejamento de aula e registro rápido de observações pedagógicas.
- Área do pedagogo: ciclos de acompanhamento e pautas de reunião.
- Área do responsável: rotina de estudos e rascunhos de mensagens para a escola.
- Perfil: identificação do tipo de conta, exportação de preferências e restauração das opções visuais.
- Acessibilidade: fonte amigável, espaçamento de leitura, guia de leitura, redução de movimento e leitura em voz alta com suporte do navegador.
- Registros e preferências permanecem locais neste protótipo. Para produção, é necessário implementar autenticação, autorização e persistência no servidor.


## v14.4 — correção definitiva das abas e chat por turma

- Substituída a cadeia de wrappers antigos de navegação por uma camada final única carregada após `app.js` e `enhancements.js`. As abas **Notificações**, **Acessibilidade** e **Meu perfil** podem ser abertas pelos perfis de aluno, professor, pedagogo, responsável e administrador.
- Os botões compartilhados usam as mesmas ações de renderização, contraste, preferências e salvamento do perfil, independentemente da área inicial do usuário.
- Adicionado **Chat por turma** para professores e pedagogos, com canais separados para 6º a 9º anos e 1º a 3º anos do Ensino Médio. Inclui envio de mensagens, autor e horário, histórico por canal, alternância entre turmas e exportação JSON da conversa.
- O chat atual é um protótipo de interface com persistência no `localStorage`: permite demonstrar e testar os canais no mesmo navegador/origem, mas **não entrega mensagens entre pessoas em dispositivos/navegadores diferentes**. Para comunicação real multiusuário é necessário conectar autenticação e API/banco hospedado.
- Acrescentado ao `database-schema-starter.sql` um ponto de partida para canais e mensagens por turma. Antes de produção, a equipe técnica deve implementar e testar RLS, autorização por escola/turma e a identidade real do remetente; nunca confiar apenas no perfil informado pelo navegador.
- Removido do pacote o arquivo de imagem aérea não utilizado; mantido o mapa ilustrativo esquemático original.
- Validado com testes automatizados de navegação e interação nos perfis principais; verificação de sintaxe JavaScript e integridade do pacote incluídas na entrega.


## v14.5 — identidade visual ConectaEdu e pet interativo

- Aplicada a marca fornecida pelo projeto na entrada e no menu lateral; paleta de marca com preto, branco e azul-ciano, tipografia consistente, componentes e estados visuais harmonizados.
- Atualizada a cor principal para `#0EA5E9`, com versões compatíveis para tema escuro e alto contraste. As opções de acessibilidade já existentes foram preservadas.
- Loja do pet completa: boné azul, aura, óculos, laço, petisco e evolução de nível, com custos, validação de saldo e indicação de itens adquiridos.
- Nome personalizável, quatro opções de cor, ações de carinho e brincadeira, indicador de bem-estar e barra de XP/nível.
- Concluir uma atividade pela primeira vez continua rendendo 10 moedas e agora adiciona 5 XP ao pet. Respostas corretas nos quizzes também concedem XP. O saldo e a personalização são guardados no navegador e migram dados de acessórios das versões anteriores.
- Mantido o mapa ilustrativo esquemático anterior; a imagem aérea não faz parte deste pacote.

**Limite:** o sistema de pet usa armazenamento local (`localStorage`) como parte do protótipo; não há sincronização entre dispositivos. Os recursos não substituem serviços de backend/autenticação para uso por uma escola real.
