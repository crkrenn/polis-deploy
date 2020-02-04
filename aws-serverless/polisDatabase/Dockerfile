FROM postgres:9.5

ARG db=polis-dev
ARG uid=postgres
ARG pwd=postgres

ENV POSTGRES_DB ${db}
ENV POSTGRES_USER ${uid}
ENV POSTGRES_PASSWORD ${pwd}

ADD ./postgres/db_setup_draft.sql /docker-entrypoint-initdb.d/
