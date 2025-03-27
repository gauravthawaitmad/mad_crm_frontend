import { Form, Input, Select, DatePicker, Radio, Switch } from 'antd';
import { useState, useEffect } from 'react';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

import CountrySelect from '@/components/SelectBoxComponent/CountrySelect';
import CoListSelect from '@/components/CoListComponent/CoListSelect';
import StateSelect from '@/components/SelectBoxComponent/StateSelect';
import CustomColorSelect from '@/components/SelectBoxComponent/CustomColorSelect';

import { lead_source } from '@/utils/Lead/leadSource';
import { affiliatedSchoolList } from '@/utils/affiliatedSchoolList';
import { schoolTypeList } from '@/utils/schoolTypeList';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useCrudContext } from '@/context/crud';

export default function PocForm({ config, isUpdate = false, form }) {
  console.log(isUpdate, 'isUpdate');
  const translate = useLanguage();

  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { collapsedBox } = crudContextAction;

  const { result: currentItem } = useSelector(selectCurrentItem);
  // console.log(currentItem, 'currentItem');

  useEffect(() => {
    if (isUpdate && currentItem) {
      form.setFieldsValue({
        ...currentItem,
        date_of_first_conversation: currentItem.date_of_first_conversation
          ? dayjs(currentItem.date_of_first_conversation)
          : null,
        date_of_mou_signing: currentItem.date_of_mou_signing
          ? dayjs(currentItem.date_of_mou_signing)
          : null,
        date_of_closing_lead: currentItem.date_of_closing_lead
          ? dayjs(currentItem.date_of_closing_lead)
          : null,
      });
      setStatus(currentItem.lead_status || 'new');
      setIsMouSigned(currentItem.mou_signed || null);
      setIsSpecificDocumentRequired(currentItem.specific_document_required || null);
    }
  }, [currentItem, isUpdate, form]);

  // const { result: listResult} =    useSelector(selectListItems);
  // const { pagination, items: dataSource } = listResult;

  // const handelDataTableLoad = useCallback((pagination) => {
  //   const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
  //   dispatch(crud.list({ entity, options }));
  // }, []);

  const [formData, setFormData] = useState({
    co_name: null,
    partner_name: null,
    address: null,
    pincode: null,
    lead_source: null,
    createdDate: null,
    status: null,
  });

  // Utility to update formData state
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [, forceRender] = useState(0);
  // When status changes, also update formData
  const handleStatusChange = (value) => {
    console.log('Status changed to:', value);
    setStatus(value);
    handleFieldChange('status', value);
    form.setFieldValue('lead_status', value);

    // Force a re-render to update the visible fields
    forceRender((prev) => prev + 1);
  };

  // Handle MOU signed status change
  const handleMouChange = (e) => {
    const value = e.target.value;
    setIsMouSigned(value);
    handleFieldChange('mou_signed', value);
  };

  const handleSpecificDocumentRequiredChange = (e) => {
    const value = e.target.value;
    setIsSpecificDocumentRequired(value);
    handleFieldChange('specific_document_required', value);
  };

  const handleFileChange = (fileList) => {
    setFileList(fileList);
  };

  const handleDelayedCurrentStatusChange = (value) => {
    // setDelayedCurrentStatus(value);
    setStatus(value);
    handleFieldChange('current_status', value);
  };

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
    const dataToSend = { ...values };

    if (isUpdate) {
      dispatch(crud.update({ entity: 'lead', id: currentItem._id, jsonData: dataToSend }))
        .then(() => {
          message.success(translate('lead_updated_successfully'));
          // Close the side panel
          crudContextAction.panel.close();
          crudContextAction.editBox.close();
          // Refresh the table by dispatching list action
          dispatch(crud.list({ entity: 'lead' }));
        })
        .catch((error) => {
          message.error(translate('error_updating_lead'));
        });
    } else {
      dispatch(crud.create({ entity: 'lead', jsonData: dataToSend }))
        .then(() => {
          message.success(translate('lead_created_successfully'));
          // Close the side panel
          crudContextAction.panel.close();
          // Refresh the table by dispatching list action
          dispatch(crud.list({ entity: 'lead' }));
        })
        .catch((error) => {
          message.error(translate('error_creating_lead'));
        });
    }
  };

  const stagesOrder = [
    'new',
    'first_conversation',
    'interested',
    'interested_but_facing_delay',
    'not_interested',
    'converted',
    'dropped',
  ];

  const isStageVisible = (stage) => {
    const currentStatus = status;
    const currentIndex = stagesOrder.indexOf(currentStatus);
    const stageIndex = stagesOrder.indexOf(stage);

    console.log('Checking visibility:', {
      stage,
      currentStatus,
      currentIndex,
      stageIndex,
      isVisible: stageIndex <= currentIndex,
    });

    return stageIndex <= currentIndex;
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Status */}
        <Form.Item label={translate('lead_status')} name="lead_status" rules={[{ required: true }]}>
          <Select
            onChange={(value) => {
              handleStatusChange(value);
              form.setFieldValue('lead_status', value);
            }}
            options={[
              { label: translate('new'), value: 'new' },
              { label: translate('first_conversation'), value: 'first_conversation' },
              { label: translate('interested'), value: 'interested' },
              {
                label: translate('interested_but_facing_delay'),
                value: 'interested_but_facing_delay',
              },
              { label: translate('not_interested'), value: 'not_interested' },
              { label: translate('converted'), value: 'converted' },
              { label: translate('dropped'), value: 'dropped' },
            ]}
          />
        </Form.Item>
        <CoListSelect name="co_name" label="CO_Name" required />
        {/* Lead Name */}
        <Form.Item
          label={translate('partner_name')}
          name="partner_name"
          rules={[{ required: true, message: translate('please_enter_name') }]}
        >
          <Input onChange={(e) => handleFieldChange('partner_name', e.target.value)} />
        </Form.Item>

        {/* <CountrySelect name="country" label="country" required /> */}

        <StateSelect name="state" label="state" required />

        <Form.Item
          label={translate('city')}
          name="city"
          rules={[{ required: true, message: translate('please_enter_city') }]}
        >
          <Input onChange={(e) => handleFieldChange('city', e.target.value)} />
        </Form.Item>

        <Form.Item
          label={translate('address')}
          name="address"
          rules={[{ required: true, message: translate('please_enter_address') }]}
        >
          <Input onChange={(e) => handleFieldChange('address', e.target.value)} />
        </Form.Item>
        <Form.Item
          label={translate('pincode')}
          name="pincode"
          rules={[{ required: true, message: translate('please_enter_pincode') }]}
        >
          <Input onChange={(e) => handleFieldChange('pincode', e.target.value)} />
        </Form.Item>

        <CustomColorSelect name="lead_source" label="lead_source" required options={lead_source} />

        {isStageVisible('first_conversation') && (
          <>
            <Form.Item
              label={translate('date_of_first_conversation')}
              name="date_of_first_conversation"
              rules={[
                {
                  required: status === 'first_conversation' || status === 'interested',
                  message: translate('please_enter_date_of_first_conversation'),
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date) =>
                  handleFieldChange(
                    'date_of_first_conversation',
                    date ? dayjs(date).format('YYYY-MM-DD') : null
                  )
                }
              />
            </Form.Item>

            <Form.Item label={translate('Point_of_Contact_(POC)_Name')} name="poc_name" required>
              <Input onChange={(e) => handleFieldChange('poc_name', e.target.value)} />
            </Form.Item>

            <Form.Item label={translate('POC_Designation')} name="poc_designation" required>
              <Input onChange={(e) => handleFieldChange('poc_designation', e.target.value)} />
            </Form.Item>

            <Form.Item label={translate('POC_Contact')} name="poc_contact" required>
              <Input
                placeholder="+1 123 456 789"
                onChange={(e) => handleFieldChange('poc_contact', e.target.value)}
              />
            </Form.Item>

            <Form.Item label={translate('POC_Email')} name="poc_email" required>
              <Input onChange={(e) => handleFieldChange('poc_email', e.target.value)} />
            </Form.Item>

            <Form.Item
              label={translate('Affiliated_School')}
              name="affiliated_school"
              rules={[
                {
                  required: status === 'first_conversation' || status === 'interested',
                  message: translate('please_select_potential_affiliated_school'),
                },
              ]}
            >
              <Select
                options={affiliatedSchoolList}
                onChange={(value) => handleFieldChange('affiliated_school', value)}
              />
            </Form.Item>

            <Form.Item label={translate('Type_of_School')} name="type_of_school" required>
              <Select
                options={schoolTypeList}
                onChange={(value) => handleFieldChange('type_of_school', value)}
              />
            </Form.Item>

            <Form.Item
              label={translate('Potential_No_Of_Children')}
              name="potential_no_of_children"
              rules={[
                {
                  required: status === 'first_conversation' || status === 'interested',
                  message: translate('please_enter_potential_no_of_children'),
                },
              ]}
            >
              <Input onChange={(value) => handleFieldChange('potential_no_of_children', value)} />
            </Form.Item>
          </>
        )}

        {status === 'interested' && (
          <>
            <Form.Item label={translate('MOU_Signed')} name="mou_signed" required>
              <Radio.Group onChange={handleMouChange}>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>

            {isMouSigned === 'yes' && (
              <Form.Item
                label={translate('date_of_MOU_signing')}
                name="date_of_mou_signing"
                rules={[
                  {
                    required: status === 'interested',
                    message: translate('please_select_date_of_MOU_signing'),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(date) =>
                    handleFieldChange(
                      'date_of_MOU_signing',
                      date ? dayjs(date).format('YYYY-MM-DD') : null
                    )
                  }
                />
              </Form.Item>
            )}

            {isMouSigned === 'yes' && (
              <Form.Item
                label={translate('MOU_document')}
                name="mou_document"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  {
                    required: status === 'interested',
                    message: translate('please_upload_mou_document'),
                  },
                ]}
              >
                <Upload
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={(info) => handleFileChange(info.fileList)}
                >
                  <Button icon={<UploadOutlined />}>{translate('Click_to_upload')}</Button>
                </Upload>
              </Form.Item>
            )}

            {isMouSigned === 'no' && (
              <Form.Item
                label={translate('reason_for_not_signing')}
                name="reason_for_not_signing"
                rules={[
                  {
                    required: status === 'interested',
                    message: translate('please_select_reason_for_not_signing'),
                  },
                ]}
              >
                <Select onChange={(value) => handleFieldChange('reason_for_not_signing', value)}>
                  <Select.Option value="waiting_for_signature">Waiting for signature</Select.Option>
                  <Select.Option value="final_approval">Final approval</Select.Option>
                  <Select.Option value="document_review">Document review</Select.Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label={translate('specific_document_required')}
              name="specific_document_required"
              rules={[
                {
                  required: status === 'interested',
                  message: translate('please_select_specific_document_required'),
                },
              ]}
            >
              <Radio.Group onChange={handleSpecificDocumentRequiredChange}>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>

            {isSpecificDocumentRequired === 'yes' && (
              <Form.Item
                label={translate('specify_required_document')}
                name="specify_required_document"
              >
                <Input
                  onChange={(e) => handleFieldChange('specify_required_document', e.target.value)}
                />
              </Form.Item>
            )}
          </>
        )}

        {status === 'interested_but_facing_delay' && (
          <>
            <Form.Item label={translate('current_status')} name="current_status" required>
              <Select onChange={handleDelayedCurrentStatusChange}>
                <Select.Option value="waiting_for_management_approval">
                  Waiting for management approval
                </Select.Option>
                <Select.Option value="mou_in_discussion">MOU in discussion</Select.Option>
                <Select.Option value="space_issue">Space issue</Select.Option>
                <Select.Option value="funding_concern">Funding concern</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>

            {delayedCurrentStatus === 'other' && (
              <Form.Item
                label={translate('if_any_other_status')}
                name="if_any_other_status"
                rules={[{ required: true, message: 'Please specify the other status' }]}
              >
                <Input onChange={(e) => handleFieldChange('if_any_other_status', e.target.value)} />
              </Form.Item>
            )}

            <Form.Item
              label={translate('expected_timeline_for_conversion_(No_of_days)')}
              name="expected_timeline_for_conversion"
            >
              <Input
                onChange={(e) =>
                  handleFieldChange('expected_timeline_for_conversion', e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label={translate('follow_up_meeting_scheduled')}
              name="follow_up_meeting_scheduled"
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item
              label={translate('further_meeting_scheduled')}
              name="further_meeting_scheduled"
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </>
        )}

        {status === 'not_interested' && (
          <>
            <Form.Item
              label={translate('reason_for_non_conversion')}
              name="reason_for_non_conversion"
              rules={[
                { required: true, message: translate('please_select_reason_for_non_conversion') },
              ]}
            >
              <Select
                onChange={(value) => handleFieldChange('reason_for_non_conversion', value)}
                options={[
                  { label: 'MoU content issues', value: 'MoU_content_issues' },
                  {
                    label: 'Needs permission from management',
                    value: 'needs_permission_from_management',
                  },
                  { label: "Class timings didn't work", value: 'class_timings_didnt_work' },
                  { label: 'Lack of space for classes', value: 'lack_of_space_for_classes' },
                  { label: 'No permission from parents', value: 'no_permission_from_parents' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>

            <Form.Item label={translate('if_any_other_reason')} name="if_any_other_reason">
              <Input onChange={(e) => handleFieldChange('if_any_other_reason', e.target.value)} />
            </Form.Item>

            <Form.Item
              label={translate('date_of_closing_lead')}
              name="date_of_closing_lead"
              rules={[{ required: true, message: translate('please_select_date_of_closing_lead') }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date) =>
                  handleFieldChange(
                    'date_of_closing_lead',
                    date ? dayjs(date).format('YYYY-MM-DD') : null
                  )
                }
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
