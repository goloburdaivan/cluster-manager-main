import React from 'react';
import Sidebar from '../Components/Sidebar';
import {
    Box,
    Flex,
    Text,
    TextField,
    IconButton,
    Avatar
} from '@radix-ui/themes';
import {
    MagnifyingGlassIcon,
    BellIcon
} from '@radix-ui/react-icons';

export default function AppLayout({ children, title }) {
    return (
        <Flex style={{ height: '100vh', overflow: 'hidden' }}>

            <Sidebar />

            <Flex direction="column" style={{ flex: 1, backgroundColor: 'var(--gray-1)' }}>

                <Flex
                    justify="between"
                    align="center"
                    px="5"
                    py="3"
                    style={{ borderBottom: '1px solid var(--gray-4)', backgroundColor: 'var(--gray-2)' }}
                >
                    <Text size="4" weight="bold">{title}</Text>

                    <Flex gap="4" align="center">
                        <Box style={{ width: 300 }}>
                            <TextField.Root placeholder="Search resources...">
                                <TextField.Slot>
                                    <MagnifyingGlassIcon height="16" width="16" />
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        <IconButton variant="ghost" color="gray">
                            <BellIcon width="18" height="18" />
                        </IconButton>

                        <Avatar
                            size="2"
                            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70"
                            fallback="A"
                            radius="full"
                        />
                    </Flex>
                </Flex>

                <Box p="5" style={{ overflowY: 'auto' }}>
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
