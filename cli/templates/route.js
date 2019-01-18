module.exports = function(service, subdomain = "haha.com") {
  return `
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: ${service.name}-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "${service.name}.${subdomain}"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${service.name}
spec:
  hosts:
  - "${service.name}.${subdomain}"
  gateways:
  - ${service.name}-gateway
  http:
  - match:
    route:
    - destination:
        host: ${service.fqdn}
        port:
          number: ${service.port}
`;
};
