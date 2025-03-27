import { useCallback, useEffect } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input, Card } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';
import useResponsive from '@/hooks/useResponsive';
import { PlusOutlined } from '@ant-design/icons';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;
  const { isMobile } = useResponsive();

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {!isMobile ? ADD_NEW_ENTITY : <PlusOutlined />}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();
  const { isMobile } = useResponsive();

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];
  
  const { state } = useCrudContext();
  const handleRead = (record) => {
    console.log('Before calling readBox.open(), isReadBoxOpen:', state.isReadBoxOpen);
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
    console.log('After calling readBox.open(), isReadBoxOpen:', state.isReadBoxOpen);
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  dataTableColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const tableStyles = {
    // Make table use full width on mobile
    '@media (max-width: 768px)': {
      '.ant-table': {
        width: '100%',
        margin: '0',
        padding: '0',
      },
      '.ant-table-container': {
        padding: '0',
      },
      // Adjust column widths for mobile
      '.ant-table-cell': {
        padding: '8px 4px !important',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  };

  const tableProps = {
    scroll: { x: true },
    // Add responsive configuration
    responsive: ['xs', 'sm', 'md'],
    // Customize which columns to show at different breakpoints
    columns: dataTableColumns.map((column) => ({
      ...column,
      responsive: ['xs', 'sm', 'md'],
    })),
  };

  const pageHeaderStyles = {
    padding: '10px 0px',
    '@media (max-width: 768px)': {
      '.ant-page-header-heading': {
        padding: '0 8px',
      },
      '.ant-page-header-content': {
        padding: '8px',
      },
    },
  };

  // console.log("table data source in table :", dataSource )
  // console.log('dataTableColumns values in table :', dataTableColumns);
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
            style={{
              width: '100%',
              marginBottom: '8px',
              '@media (min-width: 768px)': {
                width: 'auto',
                marginBottom: 0,
              },
            }}
          />,
          <Button
            onClick={handelDataTableLoad}
            key={`${uniqueId()}`}
            icon={<RedoOutlined />}
            style={{
              marginBottom: '8px',
              '@media (min-width: 768px)': {
                marginBottom: 0,
              },
            }}
          >
            {!isMobile && translate('Refresh')}
          </Button>,

          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        // style={{
        //   padding: '10px 0px',
        // }}/

        style={pageHeaderStyles}
      ></PageHeader>

      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dataSource.map((item) => (
            <Card key={item._id} style={{ padding: 10 }}>
              {dataTableColumns
                .filter((col) => col.dataIndex && col.dataIndex.length) // Ensure valid columns
                .map((col) => {
                  let value = col.dataIndex.reduce((acc, key) => acc?.[key], item); // Get nested values
                  if (col.render) {
                    value = col.render(value, item); // Apply render function if available
                  }
                  return (
                    <p key={col.dataIndex.join('.')}>
                      <b>{col.title}:</b> {value || '-'}
                    </p>
                  );
                })}

              <Button.Group>
                <Button icon={<EyeOutlined />} onClick={() => handleRead(item)} />
                <Button icon={<EditOutlined />} onClick={() => handleEdit(item)} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(item)} />
              </Button.Group>
            </Card>
          ))}
        </div>
      )}

      {!isMobile && (
        <div style={{ padding: '0px 8px' }}>
        <Table
          {...tableProps}
          columns={dataTableColumns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          scroll={{ x: true }}
          style={tableStyles}
        />
      </div>
      )}
    </>
  );
}
