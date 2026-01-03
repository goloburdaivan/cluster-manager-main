import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Tabs, Card, Code, Spinner, ScrollArea, DataList, Button
} from '@radix-ui/themes';
import {
    Cross1Icon,
    FileTextIcon,
    CopyIcon,
    LockClosedIcon,
    CubeIcon
} from '@radix-ui/react-icons';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

export default function ConfigMapDetails({ configMap: summaryCm, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yamlString, setYamlString] = useState('');

    useEffect(() => {
        if (summaryCm) {
            setLoading(true);
            axios.get(`/configmaps/${summaryCm.namespace}/${summaryCm.name}`)
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
                    console.error("Error fetching details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setDetails(null);
        }
    }, [summaryCm]);

    if (!summaryCm) return null;

    const cm = details || summaryCm;

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
                            backgroundColor: 'var(--cyan-9)', // Циан для конфигов
                            borderRadius: '6px',
                            color: 'white'
                        }}>
                            <FileTextIcon width="20" height="20" />
                        </Box>
                        <Flex direction="column">
                            <Heading size="4">{summaryCm.name}</Heading>
                            <Flex gap="2" align="center">
                                <Text size="2" color="gray">Namespace:</Text>
                                <Badge variant="outline" color="gray">{summaryCm.namespace}</Badge>
                                {cm.immutable && (
                                    <Badge color="amber" variant="solid" size="1">
                                        <LockClosedIcon /> Immutable
                                    </Badge>
                                )}
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

                <Tabs.Root defaultValue="data" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box px="4" pt="3" style={{ flexShrink: 0 }}>
                        <Tabs.List>
                            <Tabs.Trigger value="data">Data</Tabs.Trigger>
                            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                            <Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
                        </Tabs.List>
                    </Box>

                    <Box style={{ flexGrow: 1, overflow: 'hidden' }}>

                        {/* 1. DATA TAB (View content of config files) */}
                        <Tabs.Content value="data" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">
                                        {/* TEXT DATA */}
                                        {cm.data && Object.keys(cm.data).length > 0 ? (
                                            Object.entries(cm.data).map(([key, value]) => (
                                                <Card key={key} style={{ padding: 0, overflow: 'hidden' }}>
                                                    <Box p="2" style={{ backgroundColor: 'var(--gray-3)', borderBottom: '1px solid var(--gray-5)' }}>
                                                        <Flex justify="between" align="center">
                                                            <Text weight="bold" size="2">{key}</Text>
                                                            <Button
                                                                size="1"
                                                                variant="ghost"
                                                                onClick={() => navigator.clipboard.writeText(value)}
                                                            >
                                                                <CopyIcon />
                                                            </Button>
                                                        </Flex>
                                                    </Box>
                                                    <Editor
                                                        height="200px" // Фиксированная высота для каждого блока, можно сделать авто
                                                        defaultLanguage="ini" // Или 'yaml', 'json' если знать расширение
                                                        value={value}
                                                        theme="vs-dark"
                                                        options={{
                                                            readOnly: true,
                                                            minimap: { enabled: false },
                                                            scrollBeyondLastLine: false,
                                                            fontSize: 12,
                                                        }}
                                                    />
                                                </Card>
                                            ))
                                        ) : (
                                            !cm.binary_data && <Text color="gray">No text data found.</Text>
                                        )}

                                        {/* BINARY DATA */}
                                        {cm.binary_data && Object.keys(cm.binary_data).length > 0 && (
                                            <Flex direction="column" gap="2" mt="2">
                                                <Heading size="3">Binary Data</Heading>
                                                {Object.keys(cm.binary_data).map(key => (
                                                    <Card key={key}>
                                                        <Flex gap="2" align="center">
                                                            <CubeIcon />
                                                            <Text weight="bold">{key}</Text>
                                                            <Badge color="gray">Binary</Badge>
                                                        </Flex>
                                                    </Card>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* 2. OVERVIEW TAB */}
                        <Tabs.Content value="overview" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">
                                        <Card>
                                            <DataList.Root>
                                                <DataList.Item>
                                                    <DataList.Label>UID</DataList.Label>
                                                    <DataList.Value><Code variant="ghost">{cm.uid || '-'}</Code></DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Immutable</DataList.Label>
                                                    <DataList.Value>
                                                        {cm.immutable ? (
                                                            <Badge color="amber">Yes</Badge>
                                                        ) : (
                                                            <Badge color="gray">No</Badge>
                                                        )}
                                                    </DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Created</DataList.Label>
                                                    <DataList.Value>{new Date(cm.age).toLocaleString()}</DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </Card>

                                        {/* Labels & Annotations */}
                                        <Flex direction="column" gap="2">
                                            <Heading size="3">Labels</Heading>
                                            <Flex gap="2" wrap="wrap">
                                                {cm.labels && Object.keys(cm.labels).length > 0 ? (
                                                    Object.entries(cm.labels).map(([k, v]) => (
                                                        <Badge key={k} color="blue" variant="soft">
                                                            {k}={v}
                                                        </Badge>
                                                    ))
                                                ) : <Text color="gray">-</Text>}
                                            </Flex>
                                        </Flex>

                                        <Flex direction="column" gap="2">
                                            <Heading size="3">Annotations</Heading>
                                            {cm.annotations && Object.keys(cm.annotations).length > 0 ? (
                                                <Flex direction="column" gap="1">
                                                    {Object.entries(cm.annotations).map(([k, v]) => (
                                                        <Card key={k} style={{ padding: '8px' }}>
                                                            <Text size="1" weight="bold" color="gray" style={{ display: 'block', marginBottom: 2 }}>{k}</Text>
                                                            <Code size="1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{v}</Code>
                                                        </Card>
                                                    ))}
                                                </Flex>
                                            ) : <Text color="gray">-</Text>}
                                        </Flex>
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
