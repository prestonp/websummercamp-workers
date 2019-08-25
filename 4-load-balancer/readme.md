### 2-fallback.js

For the fallback example, I've included a simple Golang server that responds
with a 200 "hello world" after 3 seconds. This is to demonstrate a slow origin
that causes the load balancer to fall back to another origin.

To run the slow server and open a local tunnel to `localhost:8080`

```
go run slow.go
cloudflared tunnel
```

Copy the hostname generated from the Cloudflare Argo Tunnel and replace one of the hosts
in 2-fallback.js. Then try hitting the slow host. The loadbalancing worker should timeout 
and serve another host.

```
$ cloudflared tunnel
INFO[0000] Build info: {GoOS:darwin GoVersion:go1.11.1 GoArch:amd64}
INFO[0000] Version 2019.4.0
INFO[0000] Flags                                         proxy-dns-upstream="https://1.1.1.1/dns-query, https://1.0.0.1/dns-query"
INFO[0000] cloudflared will not automatically update when run from the shell. To enable auto-updates, run cloudflared as a service: https://developers.cloudflare.com/argo-tunnel/reference/service/
INFO[0000] Starting metrics server                       addr="127.0.0.1:60359"
INFO[0000] Proxying tunnel requests to http://localhost:8080
INFO[0005] Connected to CDG
INFO[0005] Each HA connection's tunnel IDs: map[0:6x4hc86gg9xnc1zpd6659n2dd2cg0ag77sxb1psxiz4ut1v13u50]
INFO[0005] +-------------------------------------------------------+
INFO[0005] |  Your free tunnel has started! Visit it:              |
INFO[0005] |    https://ist-lending-logged-tear.trycloudflare.com  |
INFO[0005] +-------------------------------------------------------+
```

> [Argo Tunnel](https://developers.cloudflare.com/argo-tunnel/) exposes applications running on your local web server, on any network with an Internet connection, without adding DNS records or configuring a firewall or router

You could also use `ngrok` as an alternative tunneling solution.

