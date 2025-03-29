import { useEffect, useState } from 'react';

import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import { Layout } from 'antd';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';
import useResponsive from '@/hooks/useResponsive';

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp } = useAppContext();
  const { isPanelClose } = stateCrud;
  // const { isNavMenuClose } = stateApp;
  const { panel } = crudContextAction;

  const [isSidePanelClose, setSidePanel] = useState(isPanelClose);

  const { isMobile } = useResponsive();

  useEffect(() => {
    let timer = [];
    if (isPanelClose) {
      timer = setTimeout(() => {
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
    }

    return () => clearTimeout(timer);
  }, [isPanelClose]);

  // useEffect(() => {
  //   if (!isNavMenuClose) {
  //     panel.close();
  //   }
  // }, [isNavMenuClose]);
  return (
    <Content
      className="whiteBox shadow layoutPadding"
      style={{
        // backgroundColor: 'blue',
        // padding: '30px',
        padding: isMobile ? '10px' : '30px',
        // margin: '20px auto',
        margin: isMobile ? '10px auto' : '20px auto',
        width: '100%',
        maxWidth: '100%',
        flex: 'none',
      }}
    >
      {children}
    </Content>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <>
      <DefaultLayout>
        <SidePanel
          config={config}
          topContent={sidePanelTopContent}
          bottomContent={sidePanelBottomContent}
          // fixHeaderPanel={fixHeaderPanel}
        ></SidePanel>

        <ContentBox> {children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
