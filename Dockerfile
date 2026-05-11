FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY index.html ./
COPY script.js ./
COPY styles.css ./
COPY supabase-config.js ./
COPY env-loader.js ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]