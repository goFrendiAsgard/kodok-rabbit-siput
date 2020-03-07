FROM node:lts
LABEL SERVICE siput

# define environments
ENV SERVICE_NAME siput

# Create and set the workdir
RUN mkdir -p /app
WORKDIR /app

# copy current directory to workdir
ADD . /app
RUN npm install --production

CMD npm start
