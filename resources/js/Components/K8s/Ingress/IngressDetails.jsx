import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Grid, Separator, Tabs, Card, Code, Spinner, ScrollArea, DataList, Button, Tooltip
} from '@radix-ui/themes';
import {
    Cross1Icon,
    Share1Icon, // Та же иконка, что в списке
    CopyIcon,
    ArrowRightIcon,
    LockClosedIcon,
    GlobeIcon
} from '@radix-ui/react-icons';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

export default function IngressDetails({ ingress: summaryIng, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yamlString, setYamlString] = useState('');

    useEffect(() => {
        if (summaryIng) {
            setLoading(true);
            axios.get(`/ingresses/${summaryIng.namespace}/${summaryIng.name}`)
                .then(response => {
                    setDetails(response.data);
                    try {
                        const dump = yaml.dump(response.data);
                        setYamlString(dump);
                    } catch (e) {
                        setYamlString("# Error parsing YAML");
                    }
                })
                .catch(error => {
                    console.error("Error fetching ingress details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setDetails(null);
        }
    }, [summaryIng]);

    if (!summaryIng) return null;

    const ing = details || summaryIng;

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
                            backgroundColor: 'var(--pink-9)',
                            borderRadius: '6px',
                            color: 'white'
                        }}>
                            <Share1Icon width="20" height="20" />
                        </Box>
                        <Flex direction="column">
                            <Heading size="4">{summaryIng.name}</Heading>
                            <Flex gap="2" align="center">
                                <Text size="2" color="gray">Namespace:</Text>
                                <Badge variant="outline" color="gray">{summaryIng.namespace}</Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <IconButton variant="ghost" color="gray" onClick={onClose}>
                        <Cross1Icon width="20" height="20" />
                    </IconButton>
                </Flex>
            </Box>

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
                            <Tabs.Trigger value="rules">Rules</Tabs.Trigger>
                            <Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
                        </Tabs.List>
                    </Box>

                    <Box style={{ flexGrow: 1, overflow: 'hidden' }}>

                        {/* 1. OVERVIEW TAB */}
                        <Tabs.Content value="overview" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">
                                        <Card>
                                            <DataList.Root>
                                                <DataList.Item>
                                                    <DataList.Label>UID</DataList.Label>
                                                    <DataList.Value><Code variant="ghost">{ing.uid || '-'}</Code></DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Load Balancer</DataList.Label>
                                                    <DataList.Value>
                                                        {ing.load_balancer ? (
                                                            <Badge color="blue" variant="soft">{ing.load_balancer}</Badge>
                                                        ) : (
                                                            <Text color="gray">Pending / None</Text>
                                                        )}
                                                    </DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </Card>

                                        {/* TLS Configuration */}
                                        <Heading size="3">TLS / SSL</Heading>
                                        {ing.spec?.tls ? (
                                            ing.spec.tls.map((tls, i) => (
                                                <Card key={i}>
                                                    <Flex gap="3" align="start">
                                                        <LockClosedIcon width="20" height="20" color="var(--green-9)" />
                                                        <Box>
                                                            <Flex gap="2" mb="1">
                                                                <Text weight="bold">Secret:</Text>
                                                                <Code>{tls.secretName}</Code>
                                                            </Flex>
                                                            <Text size="2" color="gray" mb="1">Hosts:</Text>
                                                            <Flex gap="1" wrap="wrap">
                                                                {tls.hosts?.map(h => <Badge key={h} variant="outline">{h}</Badge>)}
                                                            </Flex>
                                                        </Box>
                                                    </Flex>
                                                </Card>
                                            ))
                                        ) : (
                                            <Text color="gray">No TLS configured (HTTP only).</Text>
                                        )}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* 2. RULES TAB (Routing) */}
                        <Tabs.Content value="rules" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Heading size="3" mb="3">Routing Rules</Heading>
                                    <Flex direction="column" gap="3">
                                        {ing.spec?.rules && ing.spec.rules.length > 0 ? (
                                            ing.spec.rules.map((rule, i) => (
                                                <Card key={i} style={{ borderLeft: '4px solid var(--accent-9)' }}>
                                                    <Flex direction="column" gap="3">

                                                        {/* HOST */}
                                                        <Flex align="center" gap="2" style={{ borderBottom: '1px solid var(--gray-4)', paddingBottom: 8 }}>
                                                            <GlobeIcon />
                                                            <Text weight="bold" size="3">
                                                                {rule.host || "* (Any Host)"}
                                                            </Text>
                                                        </Flex>

                                                        {/* PATHS */}
                                                        {rule.http?.paths?.map((path, idx) => (
                                                            <Flex key={idx} align="center" justify="between" gap="4" p="2" style={{ backgroundColor: 'var(--gray-2)', borderRadius: 6 }}>

                                                                {/* Path */}
                                                                <Flex direction="column" style={{ minWidth: 100 }}>
                                                                    <Code weight="bold">{path.path || "/"}</Code>
                                                                    <Text size="1" color="gray">{path.pathType}</Text>
                                                                </Flex>

                                                                <ArrowRightIcon color="gray" />

                                                                {/* Backend */}
                                                                <Flex direction="column" align="end">
                                                                    <Text weight="bold" color="blue">
                                                                        {path.backend?.service?.name}
                                                                    </Text>
                                                                    <Flex align="center" gap="1">
                                                                        <Text size="1" color="gray">Port:</Text>
                                                                        <Code size="1">
                                                                            {path.backend?.service?.port?.number || path.backend?.service?.port?.name}
                                                                        </Code>
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>
                                                        ))}
                                                    </Flex>
                                                </Card>
                                            ))
                                        ) : (
                                            <Text color="gray">No rules defined.</Text>
                                        )}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* 3. YAML TAB */}
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
