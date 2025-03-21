# hsa13-hw12-queues
Set up 3 containers  - beanstalkd and redis (rdb and aof).  Write 2 simple scripts: 1st should put message into queue, 2nd should read from queue.   Configure storing to disk.  Сompare queues performance.

## Test Results

### Performance Summary

| **Queue**       | **Operation** | **Transactions/sec** | **Throughput (MB/sec)** | **Response Time (ms)** | **Concurrency** |
|-----------------|--------------|----------------------|-------------------------|------------------------|----------------|
| **Beanstalkd**  | **Read**      | 🟢 **402.18**        |  **0.04**             |  2.46                | 0.99           |
| **Beanstalkd**  | **Write**     | 🟠 **397.99**        |  0.02                 |  3.07                | 1.22           |
| **Redis AOF**   | **Read**      | 🟢 **405.03**        |  0.01                 |  2.77                | 1.12           |
| **Redis AOF**   | **Write**     | 🟠 **405.57**        |  0.01                 |  2.90                | 1.18           |
| **Redis RDB**   | **Read**      | 🟢 **403.35**        | 0.01                 |  2.69                | 1.08           |
| **Redis RDB**   | **Write**     | 🟠 **404.36**        |  0.01                 |  2.79                | 1.13           |

### Legend
- 🟢 Highest transaction rate
- 🟠 Moderate performance
