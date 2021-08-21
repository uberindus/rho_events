#!/usr/bin/env bash

source .env.prod.db
source .env.backup

# be sure $BACKUP_PATH/events/db exists
# be sure $BACKUP_PATH/events/media exists
docker exec -t $DB_CONTAINER pg_dump -c -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_PATH/db/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
cp -p -r /var/lib/docker/volumes/events_media/_data $BACKUP_PATH/media/`date +"%d-%m-%Y"`/