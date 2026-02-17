backend-elysia-start:
	cd backend-elysia && bun run ./src/index.ts

#   single instance
#
# 	Running 30s test @ http://localhost:3000
# 	10 threads and 100 connections
# 	Thread Stats   Avg      Stdev     Max   +/- Stdev
# 		Latency   326.79us  351.34us  28.32ms   98.70%
# 		Req/Sec    31.35k     2.91k   49.20k    75.01%
# 	9385974 requests in 30.10s, 1.12GB read
# 	Requests/sec: 311817.67
# 	Transfer/sec:     38.06MB

#	@ docker @ mac mini base
# 	1 instance, Requests/sec: 311817.67
#   2 instance, Requests/sec: 524470.28
#   3 instance, Requests/sec: 730607.29
#   4 instance, Requests/sec: 818889.44
# 	5 instance, Requests/sec: 827579.76

bench-elysia:
	wrk -t10 -c100 -d30s http://localhost:3000

backend-nest-start:
	cd backend-nest && npm run start

bench-nest:
	wrk -t10 -c100 -d30s http://localhost:3000

# 	Running 30s test @ http://localhost:3000
# 	10 threads and 100 connections
# 	Thread Stats   Avg      Stdev     Max   +/- Stdev
# 		Latency     1.68ms    2.66ms 142.05ms   99.76%
# 		Req/Sec     6.37k   466.69    18.22k    91.54%
# 	1904382 requests in 30.10s, 434.06MB read
# 	Requests/sec:  63268.28
# 	Transfer/sec:     14.42MB

