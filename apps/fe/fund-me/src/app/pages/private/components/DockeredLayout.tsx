import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '../../../constants';

const Content = styled.div`
    display: flex;
    flex-direction: row;
    //padding-top: 20px;
`;

const List = styled.div`
    max-height: calc(100vh - ${HEADER_HEIGHT});
    position: sticky;
    overflow-y: auto;
    width: 100%;
`;

const DockedContent = styled.div`
    position: sticky;
    top: 10px;
    overflow-y: auto;
    height: 100%;
    width: 800px;
    padding-bottom: 10px;
    max-height: calc(100vh - ${HEADER_HEIGHT});
`;

interface DockedLayoutProps {
    listContent: ReactNode;
    dockedContent: ReactNode;
}

const DockedLayout: React.FC<DockedLayoutProps> = ({ listContent, dockedContent }) => {
    return (
        <Content>
            <List>{listContent}</List>
            {dockedContent && <DockedContent>{dockedContent}</DockedContent>}
        </Content>
    );
};

export default DockedLayout;
