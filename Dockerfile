# Use the official postgres image as the base
FROM postgres:latest

# (Optional) Copy any SQL scripts you want to run at startup
# into /docker-entrypoint-initdb.d
#COPY init.sql /docker-entrypoint-initdb.d/

# By default, the official postgres image runs the necessary entrypoint.