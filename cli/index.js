const fs = require('fs');
const got = require('got');
const question = require('inquirer');
const renderRoute = require('./templates/route');

const API_ADDR = process.env.API_ADDR;
const API_PORT = 8443;
const LIA_ADDR = '52.221.188.139';
const LIA_PORT = 9001;

const options = {
  key: fs.readFileSync('/Users/diorahman/.minikube/client.key'),
  cert: fs.readFileSync('/Users/diorahman/.minikube/client.crt'),
  ca: [fs.readFileSync('/Users/diorahman/.minikube/ca.crt')]
};

(async () => {
  let { body } = await got(
    `https://${API_ADDR}:${API_PORT}/api/v1/namespaces/default/services`,
    options
  );

  const { items } = JSON.parse(body);
  patchedItems = items.map(item => {
    return Object.assign(item, {
      name: item.metadata.name,
      value: `${item.metadata.name}.${
        item.metadata.namespace
      }.svc.cluster.local`,
      short: item.metadata.name
    });
  });

  const first = await question.prompt([
    {
      type: 'list',
      name: 'service',
      message: 'Which service do you want to expose?',
      paginated: true,
      choices: patchedItems
    }
  ]);

  const selectedItems = items.filter(item => item.value === first.service);
  const selectedPort = selectedItems[0].spec.ports.filter(
    port => port.name === 'http' || port.targetPort == 'http' || port.port === 80
  );

  const manifest = renderRoute({
    name: selectedItems[0].name,
    fqdn: selectedItems[0].value,
    port: selectedPort[0].port
  });

  let posted = await got.post(`http://${LIA_ADDR}:${LIA_PORT}/api/v1/resources`, {body: manifest});
  console.log(posted.body);
})();
