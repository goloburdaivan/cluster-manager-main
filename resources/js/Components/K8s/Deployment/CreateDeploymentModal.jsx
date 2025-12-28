import React, { useState, useEffect } from 'react';
import { TextField, Select, Text } from '@radix-ui/themes';
import CreateResourceModal from '../CreateResourceModal.jsx'
import yaml from "js-yaml";
import {getDeploymentTemplate} from "../../../Constants/k8s-template.js";
import {router} from "@inertiajs/react";

export default function CreateDeploymentModal({ isOpen, onClose, namespaces = [] }) {

    const handleCreate = async (yamlCode) => {
        const deploymentObject = yaml.load(yamlCode)
        router.post('/deployments', deploymentObject, {
            preserveScroll: true
        });
    };

    return (
        <CreateResourceModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Deployment"
            initialYaml={getDeploymentTemplate()}
            onSubmit={handleCreate}
            renderForm={({ code, setCode, yaml }) => (
                <DeploymentForm
                    code={code}
                    setCode={setCode}
                    yamlLib={yaml}
                    namespaces={namespaces}
                />
            )}
        />
    );
}

function DeploymentForm({ code, setCode, yamlLib, namespaces }) {
    const [formData, setFormData] = useState({
        name: '',
        namespace: 'default',
        image: '',
        replicas: 1
    });

    useEffect(() => {
        try {
            const doc = yamlLib.load(code);
            if (doc) {
                setFormData({
                    name: doc.metadata?.name || '',
                    namespace: doc.metadata?.namespace || 'default',
                    replicas: doc.spec?.replicas || 1,
                    image: doc.spec?.template?.spec?.containers?.[0]?.image || ''
                });
            }
        } catch (e) {
        }
    }, [code]);

    const updateYaml = (field, value) => {
        try {
            const doc = yamlLib.load(code);

            if (field === 'name') {
                doc.metadata.name = value;
                if (doc.metadata.labels) doc.metadata.labels['app'] = value;
                if (doc.spec?.selector?.matchLabels) doc.spec.selector.matchLabels['app'] = value;
                if (doc.spec?.template?.metadata?.labels) doc.spec.template.metadata.labels['app'] = value;
            }
            else if (field === 'namespace') {
                doc.metadata.namespace = value;
            }
            else if (field === 'replicas') {
                doc.spec.replicas = parseInt(value) || 0;
            }
            else if (field === 'image') {
                if (doc.spec?.template?.spec?.containers?.length > 0) {
                    doc.spec.template.spec.containers[0].image = value;
                }
            }

            const newYaml = yamlLib.dump(doc);
            setCode(newYaml);
            setFormData(prev => ({ ...prev, [field]: value }));
        } catch (e) {
            console.error("YAML update error", e);
        }
    };

    return (
        <>
            <Text size="2" color="gray" weight="bold">Basic Configuration</Text>

            <label>
                <Text size="2" weight="bold">Name</Text>
                <TextField.Root
                    value={formData.name}
                    onChange={e => updateYaml('name', e.target.value)}
                    placeholder="my-deployment"
                />
            </label>

            <label>
                <Text size="2" weight="bold">Namespace</Text>
                <Select.Root
                    value={formData.namespace}
                    onValueChange={val => updateYaml('namespace', val)}
                >
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                        {namespaces.map(ns => {
                            const val = typeof ns === 'string' ? ns : ns.name || ns.metadata.name;
                            return <Select.Item key={val} value={val}>{val}</Select.Item>;
                        })}
                    </Select.Content>
                </Select.Root>
            </label>

            <label>
                <Text size="2" weight="bold">Image</Text>
                <TextField.Root
                    value={formData.image}
                    onChange={e => updateYaml('image', e.target.value)}
                    placeholder="nginx:latest"
                />
            </label>

            <label>
                <Text size="2" weight="bold">Replicas</Text>
                <TextField.Root
                    type="number"
                    min="1"
                    value={formData.replicas}
                    onChange={e => updateYaml('replicas', e.target.value)}
                />
            </label>
        </>
    );
}
