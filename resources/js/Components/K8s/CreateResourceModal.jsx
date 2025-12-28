import React, { useState, useEffect } from 'react';
import {
    Dialog, Button, Flex, Box, Grid, Separator, Badge
} from '@radix-ui/themes';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

export default function BaseCreateModal({
                                            isOpen,
                                            onClose,
                                            title,
                                            initialYaml,
                                            renderForm,
                                            onSubmit
                                        }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialYaml) {
            try {
                const dump = typeof initialYaml === 'string' ? initialYaml : yaml.dump(initialYaml);
                setCode(dump);
            } catch (e) {
                setCode('');
            }
        }
    }, [isOpen, initialYaml]);

    const handleCodeChange = (newCode) => {
        setCode(newCode || '');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(code);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error creating resource. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
            <Dialog.Content style={{ maxWidth: '1000px', height: '85vh', padding: 0, display: 'flex', flexDirection: 'column' }}>

                <Flex justify="between" align="center" p="4" style={{ borderBottom: '1px solid var(--gray-5)' }}>
                    <Dialog.Title style={{ margin: 0 }}>{title}</Dialog.Title>
                    <Badge color="gray" variant="surface">YAML Mode Active</Badge>
                </Flex>

                <Grid columns="350px 1fr" style={{ flexGrow: 1, overflow: 'hidden' }}>

                    <Box p="4" style={{ borderRight: '1px solid var(--gray-5)', backgroundColor: 'var(--gray-2)', overflowY: 'auto' }}>
                        <Flex direction="column" gap="4">
                            {renderForm({
                                code,
                                setCode: handleCodeChange,
                                yaml
                            })}

                            <Separator size="4" mt="auto" />
                            <Box>
                                <Badge color="blue" variant="soft">Tip</Badge>
                                <span style={{ fontSize: '12px', color: 'gray', marginLeft: '8px' }}>
                                    Changes in the form update the YAML automatically.
                                </span>
                            </Box>
                        </Flex>
                    </Box>

                    <Box style={{ height: '100%' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="yaml"
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                tabSize: 2
                            }}
                        />
                    </Box>
                </Grid>

                <Flex gap="3" p="4" justify="end" style={{ borderTop: '1px solid var(--gray-5)' }}>
                    <Dialog.Close>
                        <Button variant="soft" color="gray">Cancel</Button>
                    </Dialog.Close>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    );
}
