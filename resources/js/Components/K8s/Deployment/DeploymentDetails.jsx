import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Grid, Separator, Tabs, Card, Code, Spinner, ScrollArea, DataList, Button
} from '@radix-ui/themes';
import {
    Cross1Icon,
    LayersIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    CubeIcon,
    CopyIcon
} from '@radix-ui/react-icons';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml'; // Не забудьте npm install js-yaml

export default function DeploymentDetails({ deployment: summaryDep, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yamlString, setYamlString] = useState('');

    useEffect(() => {
        if (summaryDep) {
            setLoading(true);
            axios.get(`/deployments/${summaryDep.namespace}/${summaryDep.name}`)
                .then(response => {
                    setDetails(response.data);
                    // Конвертируем JSON в YAML для отображения
                    try {
                        const dump = yaml.dump(response.data);
                        setYamlString(dump);
                    } catch (e) {
                        setYamlString("# Error parsing YAML");
                    }
                })
                .catch(error => {
                    console.error("Error fetching deployment details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setDetails(null);
        }
    }, [summaryDep]);

    if (!summaryDep) return null;

    const deploy = details || summaryDep;

    const handleCopyYaml = () => {
        navigator.clipboard.writeText(yamlString);
        alert("YAML copied to clipboard!");
    };

    return (
        <Flex direction="column" style={{ height: '100%' }}>
            {/* HEADER */}
            <Box style={{ backgroundColor: 'var(--gray-3)', padding: '16px', borderBottom: '1px solid var(--gray-5)' }}>
                <Flex justify="between" align="start">
                    <Flex gap="3" align="center">
                        <Box style={{
                            padding: '8px',
                            backgroundColor: 'var(--blue-9)',
                            borderRadius: '6px',
                            color: 'white'
                        }}>
                            <LayersIcon width="20" height="20" />
                        </Box>
                        <Flex direction="column">
                            <Heading size="4">{summaryDep.name}</Heading>
                            <Flex gap="2" align="center">
                                <Text size="2" color="gray">Namespace:</Text>
                                <Badge variant="outline" color="gray">{summaryDep.namespace}</Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <IconButton variant="ghost" color="gray" onClick={onClose}>
                        <Cross1Icon width="20" height="20" />
                    </IconButton>
                </Flex>
            </Box>

            {/* CONTENT */}
            <Box style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
                {loading && (
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            zIndex: 10
                        }}
                    >
                        <Spinner size="3" />
                    </Flex>
                )}

                <Tabs.Root defaultValue="overview" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box px="4" pt="3" style={{ flexShrink: 0 }}>
                        <Tabs.List>
                            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                            <Tabs.Trigger value="conditions">Conditions</Tabs.Trigger>
                            <Tabs.Trigger value="spec">Containers</Tabs.Trigger>
                            <Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
                        </Tabs.List>
                    </Box>

                    <Box style={{ flexGrow: 1, overflow: 'hidden' }}>
                        {/* OVERVIEW TAB */}
                        <Tabs.Content value="overview" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">
                                        <Grid columns="3" gap="3">
                                            <StatusCard label="Replicas" value={deploy.status?.replicas || 0} icon={<CubeIcon />} />
                                            <StatusCard label="Ready" value={deploy.status?.readyReplicas || 0} color="green" />
                                            <StatusCard label="Updated" value={deploy.status?.updatedReplicas || 0} color="blue" />
                                            <StatusCard label="Available" value={deploy.status?.availableReplicas || 0} color="teal" />
                                            <StatusCard label="Unavailable" value={deploy.status?.unavailableReplicas || 0} color="red" />
                                        </Grid>

                                        <Separator size="4" />

                                        <Heading size="3">Strategy</Heading>
                                        <Card>
                                            <DataList.Root>
                                                <DataList.Item>
                                                    <DataList.Label>Type</DataList.Label>
                                                    <DataList.Value>
                                                        <Badge color="blue" variant="soft">
                                                            {deploy.spec?.strategy?.type || 'RollingUpdate'}
                                                        </Badge>
                                                    </DataList.Value>
                                                </DataList.Item>
                                                {deploy.spec?.strategy?.rollingUpdate && (
                                                    <>
                                                        <DataList.Item>
                                                            <DataList.Label>Max Surge</DataList.Label>
                                                            <DataList.Value>{deploy.spec.strategy.rollingUpdate.maxSurge}</DataList.Value>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.Label>Max Unavailable</DataList.Label>
                                                            <DataList.Value>{deploy.spec.strategy.rollingUpdate.maxUnavailable}</DataList.Value>
                                                        </DataList.Item>
                                                    </>
                                                )}
                                            </DataList.Root>
                                        </Card>

                                        <Heading size="3">Selector</Heading>
                                        <Flex gap="2" wrap="wrap">
                                            {deploy.spec?.selector?.matchLabels ? (
                                                Object.entries(deploy.spec.selector.matchLabels).map(([k, v]) => (
                                                    <Badge key={k} color="orange" variant="soft">
                                                        {k}={v}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Text color="gray">-</Text>
                                            )}
                                        </Flex>
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* CONDITIONS TAB */}
                        <Tabs.Content value="conditions" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="2">
                                        {deploy.status?.conditions?.map((cond, i) => (
                                            <Card key={i}>
                                                <Flex gap="3" align="start">
                                                    {cond.status === 'True'
                                                        ? <CheckCircledIcon color="var(--green-9)" width="20" height="20" />
                                                        : <ExclamationTriangleIcon color="var(--amber-9)" width="20" height="20" />
                                                    }
                                                    <Box>
                                                        <Flex gap="2" align="center" mb="1">
                                                            <Text weight="bold">{cond.type}</Text>
                                                            <Badge variant="outline" color={cond.status === 'True' ? 'green' : 'gray'}>
                                                                {cond.status}
                                                            </Badge>
                                                        </Flex>
                                                        <Text size="2" color="gray" as="p">{cond.message || cond.reason}</Text>
                                                        <Text size="1" color="gray" mt="1">
                                                            Last update: {cond.lastUpdateTime || cond.lastTransitionTime}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </Card>
                                        )) || <Text color="gray">No conditions found.</Text>}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* CONTAINERS TAB */}
                        <Tabs.Content value="spec" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="3">
                                        <Heading size="3">Pod Template</Heading>
                                        {deploy.spec?.template?.spec?.containers?.map((c, i) => (
                                            <Card key={i}>
                                                <Flex direction="column" gap="3">
                                                    <Flex justify="between">
                                                        <Text weight="bold" size="3">{c.name}</Text>
                                                        <Badge color="gray">{c.imagePullPolicy}</Badge>
                                                    </Flex>

                                                    <DataList.Root>
                                                        <DataList.Item>
                                                            <DataList.Label>Image</DataList.Label>
                                                            <DataList.Value>
                                                                <Code>{c.image}</Code>
                                                            </DataList.Value>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.Label>Ports</DataList.Label>
                                                            <DataList.Value>
                                                                {c.ports?.map(p => (
                                                                    <Badge key={p.containerPort} mr="1" color="blue" variant="soft">
                                                                        {p.containerPort}/{p.protocol || 'TCP'}
                                                                    </Badge>
                                                                )) || '-'}
                                                            </DataList.Value>
                                                        </DataList.Item>
                                                        {/* Environment Variables */}
                                                        {c.env && (
                                                            <DataList.Item align="start">
                                                                <DataList.Label>Env</DataList.Label>
                                                                <DataList.Value>
                                                                    <Flex direction="column" gap="1">
                                                                        {c.env.map(e => (
                                                                            <Flex key={e.name} gap="2">
                                                                                <Text weight="bold" size="1">{e.name}=</Text>
                                                                                <Text size="1" color="gray">
                                                                                    {e.value ? e.value : (e.valueFrom ? 'ref(...)' : '')}
                                                                                </Text>
                                                                            </Flex>
                                                                        ))}
                                                                    </Flex>
                                                                </DataList.Value>
                                                            </DataList.Item>
                                                        )}
                                                    </DataList.Root>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* YAML TAB */}
                        <Tabs.Content value="yaml" style={{ height: '100%', position: 'relative' }}>
                            <Box style={{ position: 'absolute', top: 10, right: 25, zIndex: 5 }}>
                                <Button size="1" variant="soft" onClick={handleCopyYaml}>
                                    <CopyIcon /> Copy
                                </Button>
                            </Box>
                            <Editor
                                height="100%"
                                defaultLanguage="yaml"
                                value={yamlString}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 12,
                                    scrollBeyondLastLine: false,
                                    lineNumbers: 'on',
                                }}
                            />
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Box>
        </Flex>
    );
}

function StatusCard({ label, value, color = "gray", icon }) {
    return (
        <Card>
            <Flex direction="column" align="center" justify="center" gap="1">
                <Text size="1" color="gray" weight="bold">{label}</Text>
                <Flex align="center" gap="1">
                    {icon}
                    <Text size="5" weight="bold" color={color}>{value}</Text>
                </Flex>
            </Flex>
        </Card>
    );
}
