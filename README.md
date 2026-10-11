# Lavoisier Drinks

Site institucional de uma empresa fictícia de drinks sem álcool. Design responsivo em HTML, CSS e JavaScript, sem dependências de pacotes ou serviços de terceiros.

A direção visual usa tons de carvão e lavanda, tipografia Cormorant Garamond e Manrope, fotografias amplas e transições suaves. As fontes são hospedadas localmente em `site/fonts/`, provenientes dos pacotes Fontsource 5.3.0, com suas licenças incluídas.

As animações respeitam `prefers-reduced-motion`. A troca de sabores aceita cliques, controles anterior/próximo e as teclas de seta, Home e End. A navegação, as perguntas frequentes e os três sabores permanecem acessíveis sem JavaScript.

## Editar e gerar o site

Os arquivos editáveis estão em `site/`. As imagens originais da marca são preservadas dentro de `lavoisier-drinks-github.zip`.

Depois de editar os arquivos, gere o pacote com Python 3:

```sh
python3 scripts/build_site.py
```

O script gera o ZIP de forma determinística e verifica sua integridade. Inclua o ZIP atualizado junto com os arquivos editados no commit. O workflow existente publica esse pacote no GitHub Pages.

## Visualizar localmente

Sirva o pacote completo para incluir as imagens. A partir da raiz do repositório:

```sh
mkdir -p /tmp/lavoisier-preview/th
python3 -m zipfile -e lavoisier-drinks-github.zip /tmp/lavoisier-preview/th
python3 -m http.server 8000 --directory /tmp/lavoisier-preview
```

A página inicial usa o caminho `/th/`. Verifique também `/th/privacidade/`, o menu no celular, a seleção interativa dos três sabores e as perguntas frequentes. Os detalhes e a navegação permanecem disponíveis sem JavaScript.

## Publicar

Em Settings → Pages, selecione **GitHub Actions**. O workflow **Publish Lavoisier Drinks** publica em pushes na branch `main` e também pode ser executado manualmente. Endereço: https://lavoisierdrinks.github.io/th/.

O site apresenta o conceito da marca e direciona o contato para o Instagram. Não inclui pedidos, pagamentos, rastreamento ou formulários. As imagens são ilustrativas. Uma mudança no endereço do GitHub Pages exige atualizar as URLs canônicas, metadados sociais, sitemap, robots e os caminhos da página 404.
