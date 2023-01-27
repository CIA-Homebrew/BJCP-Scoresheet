#!/bin/bash
### Uncomment and set these environmental variables in your droplet


### (REQUIRED) This email address will have admin access by default in the scoresheets app
### ------------------------------------------------------------------------------------------------------
# export ADMIN_EMAIL=your.email@example.com
### ------------------------------------------------------------------------------------------------------



### (REQUIRED) Domain scoresheets app will be deployed to. This is used for email validation and password reset links 
### ------------------------------------------------------------------------------------------------------
# export DOMAIN=scoresheets.your_domain.com
### ------------------------------------------------------------------------------------------------------



### (REQUIRED) Email setup variables. These are used for email validation and self-service password resets.
### ------------------------------------------------------------------------------------------------------
# export EMAIL_HOST=email_server.host.com
# export EMAIL_USER=email_username
# export EMAIL_PASSWORD=email_password
# export EMAIL_PORT=465
# export EMAIL_SECURE=true
### ------------------------------------------------------------------------------------------------------



### (Optional) Postgres user credentials override for db access. 
### If not set, the script will create postgres user "admin" with a random password
### ------------------------------------------------------------------------------------------------------
# export PG_USER=admin
# export PG_PASSWORD=password
### ------------------------------------------------------------------------------------------------------



### (Optional, but highly recommended) SSL Setup
### Enable HTTPS on host domain through nginx. 
### If not enabled, most web browsers will show a security error when you try to navigate to the page
### ------------------------------------------------------------------------------------------------------

# export SSL_ENABLED=true

# cat > /etc/ssl/$DOMAIN.crt << EOF
# -----BEGIN CERTIFICATE-----
# PASTE
# YOUR
# SSL 
# CERT
# TEXT
# HERE
# -----END CERTIFICATE-----
# EOF

# cat > /etc/ssl/$DOMAIN.key << EOF
# -----BEGIN RSA PRIVATE KEY-----
# PASTE
# YOUR
# SSL
# RSA
# PRIVATE
# KEY
# HERE
# -----END RSA PRIVATE KEY-----
# EOF

### ------------------------------------------------------------------------------------------------------


if [ -z ${DOMAIN+x} ]; then echo "Please uncomment and set the variables above before proceeding" && exit 1; fi;

## Set a random database password if an env variable is not set
RANDOM_PW=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12 ; echo '')

## Update
sudo apt-get update

## Install and set up NGINX
sudo apt install nginx -y

if [ "$SSL_ENABLED" = true ]
then
cat > /etc/nginx/sites-available/default << EOF
server {
  listen 80;
  server_name $DOMAIN;
  return 301 https://\$host\$request_uri;
}

server {
  listen 443 ssl;
  server_name $DOMAIN;
  keepalive_timeout   70;

  ssl_certificate     /etc/ssl/$DOMAIN.crt;
  ssl_certificate_key /etc/ssl/$DOMAIN.key;
  ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers         HIGH:!aNULL:!MD5;

  location / {
  proxy_pass http://127.0.0.1:8080;
  }
}
EOF

else 

cat > /etc/nginx/sites-available/default << EOF
server {
  listen 80;
  server_name $DOMAIN;
  keepalive_timeout   70;

  location / {
  proxy_pass http://127.0.0.1:8080;
  }
}
EOF

fi

## Install Docker (via https://docs.docker.com/engine/install/ubuntu/)
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

## Install and start Postgres
docker pull postgres
POSTGRES_CONTAINER_ID=$(docker run \
  --name postgresql \
  -e POSTGRES_USER=${PG_USER:="admin"} \
  -e POSTGRES_PASSWORD=${PG_PASSWORD:=$RANDOM_PW} \
  -p 5432:5432 \
  -v /data:/var/lib/postgresql/data \
  --restart unless-stopped \
  -d postgres \
)

POSTGRES_CONTAINER_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $POSTGRES_CONTAINER_ID)

## Postgres needs about a minute to come online
echo "Waiting for 60s..."
sleep 60

## Install and start BJCP-Scoresheets server
docker pull ghcr.io/cia-homebrew/bjcp-scoresheet:master
docker run \
  --name bjcp-scoresheet \
  -e DOMAIN=$DOMAIN \
  -e ADMIN_EMAIL=$ADMIN_EMAIL \
  -e EMAIL_HOST=$EMAIL_HOST \
  -e EMAIL_PASSWORD=$EMAIL_PASSWORD \
  -e EMAIL_PORT=$EMAIL_PORT \
  -e EMAIL_SECURE=$EMAIL_SECURE \
  -e EMAIL_USER=$EMAIL_USER \
  -e DATABASE_URL="postgres://$PG_USER:$PG_PASSWORD@$POSTGRES_CONTAINER_IP:5432/postgres" \
  -p 8080:8080 \
  --memory-swap -1 \
  --restart unless-stopped \
  -d ghcr.io/cia-homebrew/bjcp-scoresheet:master

## Start NGINX
sudo systemctl start nginx
