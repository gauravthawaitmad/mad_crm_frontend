import { useEffect, useState } from 'react';

import { Tag, Row, Col, Typography, Card } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

import { SmileOutlined } from '@ant-design/icons';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  // const getStatsData = async ({ entity, currency }) => {
  //   return await request.summary({
  //     entity,
  //     options: { currency },
  //   });
  // };

  // const {
  //   result: invoiceResult,
  //   isLoading: invoiceLoading,
  //   onFetch: fetchInvoicesStats,
  // } = useOnFetch();

  // const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  // const {
  //   result: paymentResult,
  //   isLoading: paymentLoading,
  //   onFetch: fetchPayemntsStats,
  // } = useOnFetch();

  // const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
  //   request.summary({ entity: 'client' })
  // );

  // useEffect(() => {
  //   const currency = money_format_settings.default_currency_code || null;

  //   if (currency) {
  //     fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
  //     fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
  //     fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
  //   }
  // }, [money_format_settings.default_currency_code]);

  // const dataTableColumns = [
  //   {
  //     title: translate('number'),
  //     dataIndex: 'number',
  //   },
  //   {
  //     title: translate('Client'),
  //     dataIndex: ['client', 'name'],
  //   },

  //   {
  //     title: translate('Total'),
  //     dataIndex: 'total',
  //     onCell: () => {
  //       return {
  //         style: {
  //           textAlign: 'right',
  //           whiteSpace: 'nowrap',
  //           direction: 'ltr',
  //         },
  //       };
  //     },
  //     render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
  //   },
  //   {
  //     title: translate('Status'),
  //     dataIndex: 'status',
  //   },
  // ];

  // const entityData = [
  //   {
  //     result: invoiceResult,
  //     isLoading: invoiceLoading,
  //     entity: 'invoice',
  //     title: translate('Invoices'),
  //   },
  //   {
  //     result: quoteResult,
  //     isLoading: quoteLoading,
  //     entity: 'quote',
  //     title: translate('quote'),
  //   },
  // ];

  // const statisticCards = entityData.map((data, index) => {
  //   const { result, entity, isLoading, title } = data;

  //   return (
  //     <PreviewCard
  //       key={index}
  //       title={title}
  //       isLoading={isLoading}
  //       entity={entity}
  //       statistics={
  //         !isLoading &&
  //         result?.performance?.map((item) => ({
  //           tag: item?.status,
  //           color: 'blue',
  //           value: item?.percentage,
  //         }))
  //       }
  //     />
  //   );
  // });

  // if (!money_format_settings) {
  //   return (
  //     <>
  //       <Row gutter={[32, 32]}>
  //         <SummaryCard
  //           title={translate('Invoices')}
  //           prefix={translate('This month')}
  //           isLoading={invoiceLoading}
  //           data={invoiceResult?.total}
  //         />
  //         <SummaryCard
  //           title={translate('Quote')}
  //           prefix={translate('This month')}
  //           isLoading={quoteLoading}
  //           data={quoteResult?.total}
  //         />
  //         <SummaryCard
  //           title={translate('paid')}
  //           prefix={translate('This month')}
  //           isLoading={paymentLoading}
  //           data={paymentResult?.total}
  //         />
  //         <SummaryCard
  //           title={translate('Unpaid')}
  //           prefix={translate('Not Paid')}
  //           isLoading={invoiceLoading}
  //           data={invoiceResult?.total_undue}
  //         />
  //       </Row>
  //       <div className="space30"></div>
  //       <Row gutter={[32, 32]}>
  //         <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
  //           <div className="whiteBox shadow" style={{ height: 458 }}>
  //             <Row className="pad20" gutter={[0, 0]}>
  //               {statisticCards}
  //             </Row>
  //           </div>
  //         </Col>
  //         <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
  //           <CustomerPreviewCard
  //             isLoading={clientLoading}
  //             activeCustomer={clientResult?.active}
  //             newCustomer={clientResult?.new}
  //           />
  //         </Col>
  //       </Row>
  //       <div className="space30"></div>
  //       <Row gutter={[32, 32]}>
  //         <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
  //           <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
  //             <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
  //               {translate('Recent Invoices')}
  //             </h3>

  //             <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
  //           </div>
  //         </Col>

  //         <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
  //           <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
  //             <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
  //               {translate('Recent Quotes')}
  //             </h3>
  //             <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
  //           </div>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  // } else {
  //   return (
  //   <>
  //   </>
  //   )
  // }


  return (
    <Row justify="center" align="middle" style={{ height: '100vh', textAlign: 'center' }}>
      <Col xs={24} sm={18} md={14} lg={12} xl={10}>
        <Card
          bordered={false}
          style={{
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <SmileOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
          <Typography.Title level={2} style={{ marginTop: 20 }}>
            Welcome to <span style={{ color: '#1890ff' }}>MAD</span> Dashboard!
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '16px', color: '#555' }}>
            Your data and insights will appear here once available. For now, sit back and enjoy your
            journey with us.
          </Typography.Paragraph>
        </Card>
      </Col>
    </Row>
  );
}
