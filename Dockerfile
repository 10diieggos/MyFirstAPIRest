# configurando imagem base
FROM node:14

# Criando usuario, com grupo de mesmo nome
# e com uma home e com um shell inválido(mínima permissão possível)
# Instalando npm com versão 
RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@6.14.8

#criando variável de ambiente para a pasta de trabalho
ENV HOME=/home/app/MyFirstAPIRest/

#copiando o gerenciador de dependências para a pasta /home/app/MyFirstAPIRest/ 
# dentro da imagem
# utilizando o npm-shrinkwrap.json para garantir as versões das dependências
COPY package*.json npm-shrinkwrap.json $HOME

# dando permissão para o usuário rodar a app
RUN chown -R app:app $HOME

# tirando do contexto do root para o usuário
USER app

# configurando pasta de trabalho do container
# onde rodam os comandos externos como exec
WORKDIR $HOME

# limpando arquivos não mais necessaŕios 
#  e rodando o npm install sem a barra de progresso para
# melhorar a performance
RUN npm cache clean --force && npm install --silent --progress=false

# alterando o contexto para root para fazer cópias externas
USER root

# copiando os arquivos da apilcação
COPY . $HOME

# dando permissão para o usuário rodar a app
RUN chown -R app:app $HOME

# reconfigurando app como o usuárioo padrãoo da imagem
USER app

#configurando o comando que deve ser rodado quando o container subir
CMD [ "npm", "start" ]

# Video1
# Tudo o que você precisa saber para rodar Node.js com Docker
# https://www.youtube.com/watch?v=-StV4sf9N0g
# https://walde.co/2016/08/30/tudo-que-voce-precisa-saber-para-rodar-sua-aplicacao-nodejs-com-docker/