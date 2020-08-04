#Dockerfile
#制定node镜像的版本 node:10-alpine用于linux，比较小
FROM node:10-alpine
#移动当前目录下面的文件到镜像的app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#安装依赖
RUN npm install
#对外暴露的端口
EXPOSE 3000
#程序启动脚本
CMD ["node", "app.js"]