# CLAUDE.md

Back-end de uma plataforma de cursos em vídeo (estilo Rocketseat/Alura) em AdonisJS 7 + TypeScript, com arquitetura hexagonal e DDD. A especificação do produto fica no Notion, na página **Academy** dentro de **Projetos**. Consulte-a antes de mudar regras de negócio.

## Comandos

- `npm run dev`: servidor com HMR (`http://localhost:3333/api/v1`)
- `npm test`: todos os testes (Japa); `node ace test unit` ou `node ace test functional` para uma suíte
- `npm run typecheck`, `npm run lint`, `npm run format`
- `node ace migration:run`: roda as migrations e regenera `database/schema.ts`

Rode `typecheck`, `lint` e os testes antes de dar uma tarefa como concluída.

## Domínio

- **Usuário**, com uma role: `admin`, `instrutor` ou `aluno` (RBAC)
- **Coleção**: conjunto ordenado de conteúdos; a ordem é definida pelos instrutores. O termo é "coleção", nunca "trilha".
- **Conteúdo**: vídeo com título e descrição; pertence a uma única coleção
- **Progresso**: conteúdos marcados como assistidos
- **Posição de reprodução**: ponto onde o usuário parou no vídeo, sincronizado via WebSocket, mantido no Redis durante a sessão e gravado no PostgreSQL periodicamente e ao desconectar

Regras: só usuário logado assiste; vídeos não podem ser baixados (Mux com signed playback); vídeos ficam armazenados apenas no Mux (sem S3, sem Lambda). O Redis é usado para cache e para a posição de reprodução.

## Arquitetura

- O domínio e os casos de uso não importam nada de `@adonisjs/*`, Lucid ou bibliotecas de infraestrutura. Eles dependem de portas (interfaces de repositórios e serviços); os adaptadores do Adonis (controllers, modelos Lucid, clientes do Mux/Redis/SES) implementam essas portas.
- Casos de uso retornam `Either` (`left(erro)` / `right(resultado)`) em vez de lançar exceções de regra de negócio. Os erros implementam `UseCaseError`.
- Entidades estendem `Entity` ou `AggregateRoot` e são criadas por uma factory estática (`static create(props, id?)`); o construtor é `protected`. Use `Optional<T, K>` para props com valor padrão.
- Eventos de domínio são registrados com `addDomainEvent` no agregado e despachados pelo repositório depois de persistir, com `DomainEvents.dispatchEventsForAggregate(aggregate.id)`.
- A estrutura das pastas dos bounded contexts e a troca de SQLite por PostgreSQL ainda serão definidas na spec de Fundação e Identidade. Até lá, não crie contextos novos sem alinhar.

### Núcleo (`app/core`, importado como `#core/*`)

Veio do repositório `wolney-fo/mycampus` (`src/core`), adaptado ao Adonis:

- `either`, `entities/{entity,aggregate_root,unique_entity_id,value_object,watched_list}`
- `events/{domain_event,domain_events,event_handler}`
- `errors/{use_case_error,not_allowed_error,resource_not_found_error,invalid_credentials_error}`
- `repositories/pagination_params`, `types/optional`

Mudanças em relação ao original: `Entity.equals` compara ids com `UniqueEntityId.equals` (o original comparava referências) e `DomainEvent.ocurredAt` virou `occurredAt`.

## Convenções

- Nomes de arquivo em snake_case (`watched_list.ts`), como no Adonis
- Imports pelos aliases de `package.json` (`#core/*`, `#models/*`, ...), nunca por caminho relativo; ao criar uma pasta nova em `app/`, adicione o alias correspondente
- Use `import type` para importar só tipos
- Prettier do Adonis: sem ponto e vírgula, aspas simples, 2 espaços
- Testes com Japa (`test.group` + `assert`): unitários em `tests/unit/**/*.spec.ts` e funcionais em `tests/functional/**/*.spec.ts`. Casos de uso são testados com repositórios em memória, sem banco.
- `database/schema.ts` é gerado automaticamente; não edite à mão
- `.adonisjs/` é código gerado
