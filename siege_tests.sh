#!/bin/bash

TIME=5s
CONCURRENT=100

mkdir -p results

# Redis AOF
echo "🚀 Redis AOF WRITE"
siege -d0.5 -t$TIME -c$CONCURRENT --content-type 'application/json' \
  'http://localhost:3000/enqueue POST {"queue": "redisAof", "message": "Load test message"}' \
  > results/redis_aof_write.log 2>&1

echo "🚀 Redis AOF READ"
siege -d0.5 -t$TIME -c$CONCURRENT \
  'http://localhost:3000/dequeue?queue=redisAof' \
  > results/redis_aof_read.log 2>&1

# Redis RDB
echo "🚀 Redis RDB WRITE"
siege -d0.5 -t$TIME -c$CONCURRENT --content-type 'application/json' \
  'http://localhost:3000/enqueue POST {"queue": "redisRdb", "message": "Load test message"}' \
  > results/redis_rdb_write.log 2>&1

echo "🚀 Redis RDB READ"
siege -d0.5 -t$TIME -c$CONCURRENT \
  'http://localhost:3000/dequeue?queue=redisRdb' \
  > results/redis_rdb_read.log 2>&1

# Beanstalkd
echo "🚀 Beanstalkd WRITE"
siege -d0.5 -t$TIME -c$CONCURRENT --content-type 'application/json' \
  'http://localhost:3000/enqueue POST {"queue": "beanstalkd", "message": "Load test message"}' \
  > results/beanstalkd_write.log 2>&1

echo "🚀 Beanstalkd READ"
siege -d0.5 -t$TIME -c$CONCURRENT \
  'http://localhost:3000/dequeue?queue=beanstalkd' \
  > results/beanstalkd_read.log 2>&1

echo "✅ All done! Check 'results/' for logs"