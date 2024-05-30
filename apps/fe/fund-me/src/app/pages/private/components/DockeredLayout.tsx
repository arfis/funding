import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {HEADER_HEIGHT} from '../../../constants';

const Content = styled.div`
    display: flex;
    flex-direction: row;
    //padding-top: 20px;
`;

const ListContent = styled.div`
    max-height: calc(100vh - ${HEADER_HEIGHT});
    position: relative;
    top: 0;
`;

const Floating = styled.div`
    position: absolute;
    bottom: 10px;
    right: 20px;
    align-self: flex-end;
`
const List = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
`;

const FullscreenDocked = styled.div`
    position: relative;
    top: 10px;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    margin-bottom: 10px;
    max-height: calc(100vh - ${HEADER_HEIGHT});
`;

const DockedContent = styled.div`
    position: relative;
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
    addButton: ReactNode;
    showDockedFullScreen: boolean;
    showDocked: boolean;
}

const DockedLayout: React.FC<DockedLayoutProps> = ({listContent, dockedContent, addButton, showDockedFullScreen, showDocked}) => {
    return (
        <Content>
            {showDockedFullScreen ? <FullscreenDocked>{dockedContent}</FullscreenDocked> :
                (<>
                    <ListContent>
                        <List>{listContent}</List>
                        <Floating>{addButton}</Floating>
                    </ListContent>
                    {showDocked && dockedContent && <DockedContent>{dockedContent}</DockedContent>
                    }</>)
            }
        </Content>
    )
        ;
};

export default DockedLayout;
