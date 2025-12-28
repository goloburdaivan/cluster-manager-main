export const getDeploymentTemplate = (name = 'my-app', namespace = 'default', image = 'nginx:latest') => ({
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
        name: name,
        namespace: namespace,
        labels: { app: name }
    },
    spec: {
        replicas: 1,
        selector: { matchLabels: { app: name } },
        template: {
            metadata: {
                name: name,
                labels: { app: name }
            },
            spec: {
                containers: [{
                    name: 'main',
                    image: image,
                    ports: [{ containerPort: 80 }]
                }]
            }
        }
    }
});
