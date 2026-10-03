# Minha Cozinha — Receitas Pessoais

Aplicativo web/PWA mobile-first para cadastrar, pesquisar, editar e excluir receitas pessoais usando Firebase Authentication, Realtime Database e Firebase Storage. O front-end é estático e pode ser publicado diretamente no Netlify.

## 1. O que foi criado

- Login e cadastro por e-mail/senha com Firebase Authentication.
- Recuperação de senha por e-mail.
- Perfil com nome de exibição.
- Dashboard com saudação, contagem e receitas recentes.
- Cadastro de receitas com foto, categoria, descrição, tempo, rendimento, ingredientes, preparo e observações.
- Ingredientes dinâmicos sem limite artificial de quantidade.
- Otimização da foto no navegador antes do upload.
- Fotos no Firebase Storage, nunca em Base64 no Realtime Database.
- Lista, pesquisa, detalhes, edição e exclusão.
- Favoritos por receita, com filtro de favoritas.
- Filtros por categoria e ordenação por recentes/nome.
- Lista de compras sincronizada no Firebase, com itens concluídos.
- Ajuste de porções com recálculo dos ingredientes quando as quantidades são numéricas.
- Cronômetro integrado à receita.
- Modo “Cozinhar agora”, passo a passo por etapas.
- Campo opcional de custo total e custo por porção calculado automaticamente.
- PWA com manifest, service worker e ícones.
- Regras de segurança para manter os dados separados por UID.
- Layout inspirado na referência enviada: teal profundo, creme, laranja, amarelo, tipografia editorial, cartões e formas orgânicas — com identidade própria.

## 2. Importante sobre a configuração do Firebase

O arquivo `firebase-config.js` já está preenchido com a configuração do projeto Firebase informada para este aplicativo. A API Key de um app Web do Firebase não é tratada como uma senha; a proteção dos dados depende das Security Rules. Se você trocar de projeto, substitua a configuração nesse arquivo.

A configuração fornecida para este projeto é:

```js
const firebaseConfig = {
  apiKey: "(já preenchida no arquivo firebase-config.js)",
  authDomain: "minhas-receitas-bec31.firebaseapp.com",
  databaseURL: "https://minhas-receitas-bec31-default-rtdb.firebaseio.com",
  projectId: "minhas-receitas-bec31",
  storageBucket: "minhas-receitas-bec31.firebasestorage.app",
  messagingSenderId: "251624073318",
  appId: "1:251624073318:web:3b5d813fc7a86e03a9a5a7",
  measurementId: "G-BSKF0PVQP6"
};
```

O `measurementId` não é utilizado pelo aplicativo atual.

### A API Key é secreta?

A API Key do Firebase para aplicações web não funciona como uma senha. Ela pode aparecer no código do front-end. O que protege os seus dados são principalmente as regras do Realtime Database, Storage e Authentication. **Nunca deixe as regras do banco como públicas.**

## 3. Configurar o Firebase — passo a passo

### 3.1 Criar/abrir o projeto

1. Acesse o console do Firebase.
2. Abra o projeto `minhas-receitas-bec31` ou crie outro projeto.
3. Adicione um aplicativo Web ao projeto se ainda não existir.
4. Copie a configuração Web para `firebase-config.js`.

### 3.2 Ativar login

No Firebase Console:

1. Authentication → Sign-in method.
2. Ative **Email/Password**.
3. Salve.

As senhas não são salvas no Realtime Database. O Firebase Authentication gerencia a senha.

### 3.3 Criar o Realtime Database

1. Realtime Database → Create Database.
2. Escolha a região adequada.
3. Depois de criar, abra a aba **Rules**.
4. Copie o conteúdo de `database.rules.json` e publique as regras.

A estrutura usada pelo aplicativo é:

```text
users/
  UID_DO_USUARIO/
    profile/
      displayName
      email
      createdAt
    recipes/
      ID_DA_RECEITA/
        title
        description
        category
        ingredients[]
        preparation
        prepTime
        servings
        notes
        favorite
        imageUrl
        imagePath
        createdAt
        updatedAt
    shoppingList/
      ID_DO_ITEM/
        name
        qty
        unit
        checked
        createdAt
```

Cada usuário só consegue ler e escrever dentro de `users/SEU_UID/`.

### 3.5 Publicar as regras

**Importante:** o Netlify publica os arquivos do site, mas não publica automaticamente as Security Rules do Firebase. Você precisa aplicar as regras uma vez no console do Firebase ou usando o Firebase CLI.

#### Opção A — pelo console Firebase

1. Abra **Realtime Database → Rules**.
2. Substitua as regras pelo conteúdo de `database.rules.json`.
3. Clique em **Publish**.
4. Abra **Storage → Rules**.
5. Substitua as regras pelo conteúdo de `storage.rules`.
6. Clique em **Publish**.

#### Opção B — pelo Firebase CLI

Na pasta do projeto, execute:

```bash
firebase login
firebase use minhas-receitas-bec31
firebase deploy --only database,storage
```

O projeto já inclui `firebase.json` e `.firebaserc` apontando para `minhas-receitas-bec31`.

### 3.4 Ativar Storage

1. Storage → Get started.
2. Conclua a configuração.
3. Abra **Rules**.
4. Copie `storage.rules` para as regras do Storage e publique.

As fotos são gravadas em:

```text
recipeImages/UID_DO_USUARIO/ID_DA_RECEITA/cover.jpg
```

O usuário só consegue acessar os próprios arquivos. O limite configurado para upload é 5 MB, além da otimização automática no navegador.

## 4. Testar localmente

Como o aplicativo usa módulos JavaScript e Service Worker, abra-o por um servidor HTTP local em vez de clicar duas vezes no `index.html`.

Se você tiver Python instalado:

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080`.

Também é possível usar a extensão Live Server do VS Code.

## 5. Publicar no Netlify

### Upload manual

1. Entre no Netlify.
2. Crie um novo site pelo método de deploy manual.
3. Extraia o ZIP no computador.
4. Confirme que `index.html` está diretamente na raiz da pasta extraída.
5. Faça o upload da pasta pelo painel do Netlify.

O ZIP de entrega desta versão já foi montado com `index.html` na raiz para facilitar o deploy manual.

A configuração Firebase já está incluída no `firebase-config.js`. Se estiver usando outro projeto, substitua esse arquivo antes do upload.

### GitHub

Você também pode colocar a pasta em um repositório GitHub e conectar o repositório ao Netlify. Para este projeto não há etapa de build obrigatória; o diretório publicado é a própria raiz (`.`).

## 6. Instalar no Android

Depois de publicar em HTTPS:

1. Abra o endereço do aplicativo no Chrome.
2. Abra o menu do navegador.
3. Procure **Instalar aplicativo** ou **Adicionar à tela inicial**.
4. Confirme.

A disponibilidade e o texto exato da opção podem variar conforme a versão do navegador e do Android.

O Service Worker deste projeto cria cache do shell da aplicação. Ele **não promete sincronização offline completa das receitas**, porque os dados principais continuam dependendo do Firebase.

## 7. Segurança

- Não use regras públicas para produção.
- Não coloque senhas no JavaScript nem no Realtime Database.
- O usuário autenticado é identificado por `auth.uid`.
- As regras do banco limitam leitura e gravação ao próprio UID.
- As regras do Storage limitam os arquivos ao próprio UID.
- A API Key web do Firebase não substitui as regras de segurança.

## 8. Arquivos principais

```text
receitas-app/
├── index.html
├── manifest.json
├── service-worker.js
├── firebase-config.js
├── database.rules.json
├── storage.rules
├── netlify.toml
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── database.js
│   ├── firebase-init.js
│   ├── recipes.js
│   ├── storage.js
│   └── ui.js
└── assets/
    └── icons/
        ├── icon-192.svg
        └── icon-512.svg
```

## 9. Observação sobre a referência visual

A arte enviada foi usada somente como direção visual: combinação de verde/teal, creme, laranja e amarelo; composição editorial; blocos orgânicos; fotos de alimentos; tipografia forte; cartões e botões arredondados. Nenhum logotipo, texto ou elemento específico da arte foi reutilizado.

## 10. Checklist antes do primeiro uso

- [x] Configuração Firebase já incluída em `firebase-config.js` com os dados fornecidos para `minhas-receitas-bec31`.
- [ ] Ativar Email/Password no Authentication.
- [ ] Criar Realtime Database.
- [ ] Publicar `database.rules.json`.
- [ ] Ativar Storage.
- [ ] Publicar `storage.rules`.
- [ ] Publicar o projeto no Netlify.
- [ ] Criar uma conta de teste.
- [ ] Cadastrar uma receita sem foto.
- [ ] Cadastrar uma receita com foto.
- [ ] Editar e excluir uma receita.
- [ ] Confirmar que um segundo usuário não consegue acessar os dados do primeiro.


## 11. Melhorias desta versão

Esta versão corrige especialmente o problema de layout observado em telas Android estreitas. O aplicativo agora força o shell mobile a ocupar 100% da largura, elimina a coluna lateral residual que deixava uma faixa vazia à direita e usa fotos em proporção quadrada nos cartões e na ficha da receita.

Também foram adicionadas as ferramentas de favoritos, categorias, lista de compras, ajuste de porções, cronômetro, modo de cozinhar e custo por porção.

### Checklist rápido desta versão

- [x] Layout mobile sem faixa vazia lateral.
- [x] Fotos 1:1 nos cartões.
- [x] Foto 1:1 na ficha da receita.
- [x] Favoritos persistidos no Firebase.
- [x] Categorias e filtros.
- [x] Lista de compras persistida no Firebase.
- [x] Ajuste de porções.
- [x] Cronômetro.
- [x] Modo Cozinhar agora.
- [x] Custo por porção.
- [x] Ícones PWA presentes no projeto.
- [x] Service Worker atualizado para nova versão de cache.

## 12. Solução para o erro "Não foi possível concluir"

Se o cadastro criar a conta no Authentication, mas falhar ao salvar o perfil, o aplicativo agora informa que o problema é de permissão do Realtime Database. Nesse caso, publique `database.rules.json` no Realtime Database.

Também confirme em **Authentication → Sign-in method** que **Email/Password** está habilitado.

Se o aplicativo foi atualizado no Netlify e o celular ainda mostrar uma versão antiga, feche a PWA e abra novamente. O Service Worker recebeu uma nova versão de cache (`v2`) para evitar manter o código anterior.
