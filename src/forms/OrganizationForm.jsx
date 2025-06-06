import { Form, Input, Select, DatePicker, Radio, Switch, InputNumber, Checkbox, Space } from 'antd';
import { useState, useEffect } from 'react';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
// import CoListSelect from '@/components/CoListComponent/CoListSelect';
import CustomColorSelect from '@/components/SelectBoxComponent/CustomColorSelect';

import { lead_source } from '@/utils/Lead/leadSource';
import { affiliatedSchoolList } from '@/utils/affiliatedSchoolList';
import { schoolTypeList } from '@/utils/schoolTypeList';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useCrudContext } from '@/context/crud';
import CoListSelect from '../components/CoListComponent/CoListSelect';
import LocationSelect from '../components/SelectBoxComponent/StateSelect';
import Loading from '../components/Loading';

export default function OrganizationForm({ config, isUpdate = false, form }) {

  const translate = useLanguage();

  const [status, setStatus] = useState('new');
  const [loading, setLoading] = useState(false);

  const [isMouSigned, setIsMouSigned] = useState(null);
  const [isSpecificDocumentRequired, setIsSpecificDocumentRequired] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [delayedCurrentStatus, setDelayedCurrentStatus] = useState(null);
  const [isInterested, setIsInterested] = useState(null)
  const [isConverted, setIsConverted] = useState(null)
  const [mouUrl, setMouUrl] = useState(null);
  const [isMouChanged, setIsMouChanged] = useState(false)


  const dispatch = useDispatch();
  const { crudContextAction, state } = useCrudContext();
  const { collapsedBox } = crudContextAction;
  const {isEditBoxOpen} = state;

  const { result: currentItem } = useSelector(selectCurrentItem);

  console.log("initial current Item value in organization Form :", currentItem)

  const setFormCoversionStage = (value) => {
    // console.log("set conversion stage value from current item :", value)
    if(value == 'new'){
      setStatus('new')
    }

    if(value == 'interested'){
      // currentItem.conversion_stage = 'prospecting';
      // console.log("setting tha form conversion stage prospecting")
      setStatus('prospecting')
    }
    
    if(value == 'interested_but_facing_delay'){
      // currentItem.conversion_stage = 'in_conversion'
      currentItem.converted = true
      setStatus('in_conversion');
      setIsConverted(false)
    }
    
    if(value == 'dropped'){
      // currentItem.conversion_stage = 'in_conversion';
      setStatus('in_conversion')
    }
  }

  useEffect(() => {
    if (isUpdate && currentItem) {

    let updatedConversionStage = "new"; // Default stage

    // Map backend conversion_stage to allowed values
    if (currentItem.conversion_stage === "new") {
      updatedConversionStage = "new";
    } else if (
      currentItem.conversion_stage === "interested" ||
      currentItem.conversion_stage === "dropped"
    ) {
      updatedConversionStage = "prospecting";
    } else if (currentItem.conversion_stage === "interested_but_facing_delay") {
      currentItem.conversion_stage == "in_conversion"
      updatedConversionStage = "in_conversion";
    }

      form.setFieldsValue({
        ...currentItem,
        converted: currentItem.conversion_stage == 'converted' ? true : null,
        conversion_stage: updatedConversionStage,
        date_of_first_contact: currentItem.date_of_first_contact
          ? dayjs(currentItem.date_of_first_contact)
          : null,
        mou_sign_date: currentItem.mou_sign_date ? dayjs(currentItem.mou_sign_date) : null,
        mou_start_date: currentItem.mou_start_date ? dayjs(currentItem.mou_start_date) : null,
        mou_end_date: currentItem.mou_end_date ? dayjs(currentItem.mou_end_date) : null,
      });
      // setFormCoversionStage(currentItem.conversion_stage)
      setMouUrl(currentItem.mou_url || null);
      setStatus(updatedConversionStage);
      setIsConverted(currentItem.converted || null)
      setIsMouSigned(currentItem.mou_sign || null)
      setIsInterested(currentItem.interested)
      setIsSpecificDocumentRequired(currentItem.specific_document_required || null);

    }
  }, [currentItem, isUpdate, form]);

  const handleDeleteMou = () => {
    setMouUrl(null);
    setFileList([]);
    form.setFieldsValue({
      mou_sign_date: null, // Clear DatePicker values
      mou_start_date: null,
      mou_end_date: null,
      confirmed_child_count: null
    });

    message.success('MOU document deleted. Please upload a new one.');
  };


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
    // console.log('Status changed to:', value);
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
    setDelayedCurrentStatus(value);
    // console.log("handled delayed current status :", value)
    // setStatus(value);
    handleFieldChange('current_status', value);
  };

  const handleInterestedChange = (e) => {
    const value = e.target.value
    setIsInterested(value)
    // console.log("handle interested change function value changed :", value)
  }

  const handleConvertedChange = (e) => {
    const value = e.target.value
    setIsConverted(value)
  }


  const handleSubmit = async(values) => {
    // console.log('Form submitted with values:', values);
    // console.log('current item details in Lead form :', currentItem);

    let dataToSend = { ...values };
    
    dataToSend.poc_id = currentItem.poc_id
    dataToSend.latest_mou_id = currentItem.latest_mou_id

    if (fileList) {
      // console.log('yes new mou is uploaded in file list in organization');
      dataToSend.mou_sign = true;
    }

    // console.log('data to send in organization form :', dataToSend);

    setLoading(true);

    try {
      if (isUpdate) {
       await dispatch(
          crud.update({
            entity: 'organization',
            id: currentItem.id,
            jsonData: dataToSend,
            withUpload: true,
          })
        );
        crudContextAction.panel.close();
        crudContextAction.editBox.close();
        
      } else {
        await dispatch(crud.create({ entity: 'organization', jsonData: dataToSend }));
        crudContextAction.panel.close();
      }
      dispatch(crud.list({ entity: 'organization' }));
    } catch (error) {
      message.error(translate(isUpdate ? 'error_updating_user' : 'error_creating_user'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <Loading isLoading={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={translate('conversion_stage')}
          name="conversion_stage"
          rules={[{ required: true }]}
        >
          <Select
            onChange={(value) => {
              handleStatusChange(value);
              form.setFieldValue('lead_status', value);
            }}
            options={[
              { label: translate('new'), value: 'new' },
              { label: translate('prospecting'), value: 'prospecting', disabled: !isEditBoxOpen },
              {
                label: translate('in_conversion'),
                value: 'in_conversion',
                disabled: !isEditBoxOpen,
              },
            ]}
            disabled
          />
        </Form.Item>

        <CoListSelect name="co_id" label="CO" required disabled={true} />

        <Form.Item
          label={translate('partner_name')}
          name="partner_name"
          rules={[{ required: true, message: translate('please_enter_name') }]}
        >
          <Input onChange={(e) => handleFieldChange('partner_name', e.target.value)} />
        </Form.Item>

        {/* <CountrySelect name="country" label="country" required /> */}

        <LocationSelect
          nameState="state_id"
          nameCity="city_id"
          labelState="state"
          labelCity="city"
          required={true}
          disabled={true}
        />

        <Form.Item
          label={translate('address_line_1')}
          name="address_line_1"
          rules={[{ required: true, message: translate('please_enter_address') }]}
        >
          <Input disabled onChange={(e) => handleFieldChange('address', e.target.value)} />
        </Form.Item>

        <Form.Item label={translate('address_line_2')} name="address_line_2">
          <Input disabled onChange={(e) => handleFieldChange('address', e.target.value)} />
        </Form.Item>

        <Form.Item
          label={translate('pincode')}
          name="pincode"
          rules={[
            { required: true, message: translate('please_enter_pincode') },
            { pattern: /^[1-9][0-9]{5}$/, message: translate('pincode_must_be_6_digits') },
          ]}
        >
          <Input
            type="text"
            maxLength={6}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
              if (value.length > 6) {
                value = value.slice(0, 6); // Trim extra digits
              }
              handleFieldChange('pincode', value);
            }}
            disabled
          />
        </Form.Item>

        <CustomColorSelect
          name="lead_source"
          label="lead_source"
          required
          options={lead_source}
          disabled={true}
        />

        <Form.Item
          label={translate('date_of_first_contact')}
          name="date_of_first_contact"
          rules={[
            {
              required: true,
              message: translate('please_enter_date_of_first_conversation'),
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleFieldChange(
                'date_of_first_conversation',
                date ? dayjs(date).format('YYYY-MM-DD') : null
              )
            }
          />
        </Form.Item>

        <Form.Item
          label={translate('Point_of_Contact_(POC)_Name')}
          name="poc_name"
          rules={[{ required: true }]}
        >
          <Input onChange={(e) => handleFieldChange('poc_name', e.target.value)} />
        </Form.Item>

        <Form.Item
          label={translate('POC_Designation')}
          name="poc_designation"
          rules={[{ required: true }]}
        >
          <Input onChange={(e) => handleFieldChange('poc_designation', e.target.value)} />
        </Form.Item>

        <Form.Item
          label={translate('POC_Contact')}
          name="poc_contact"
          rules={[  
            { required: true, message: translate('Please enter contact number') },
            {
              pattern: /^[6789]\d{9}$/, // Starts with 6,7,8,9 and exactly 10 digits
              message: translate('Invalid contact number'),
            },
          ]}
        >
          <Input
            placeholder="+91 1234567890"
            maxLength={10}
            onChange={(e) => handleFieldChange('poc_contact', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={translate('POC_Email')}
          name="poc_email"
          rules={[
            { required: true, message: translate('Please enter email') },
            { type: 'email', message: translate('Invalid email address') },
          ]}
        >
          <Input onChange={(e) => handleFieldChange('poc_email', e.target.value)} />
        </Form.Item>

        <Form.Item
          label={translate('partner_affiliation_type')}
          name="partner_affiliation_type"
          rules={[
            {
              required: status === 'prospecting' || status === 'in_conversion',
              message: translate('please_select_partner_affiliation_type'),
            },
          ]}
        >
          <Select
            disabled
            options={affiliatedSchoolList}
            onChange={(value) => handleFieldChange('affiliated_school', value)}
          />
        </Form.Item>

        <Form.Item label={translate('school_type')} name="school_type" required>
          <Select
            disabled
            options={schoolTypeList}
            onChange={(value) => handleFieldChange('type_of_school', value)}
          />
        </Form.Item>

        <Form.Item
          label={translate('total_child_count')}
          name="total_child_count"
          rules={[
            {
              required: true,
              message: translate('please_enter_total_child_count'),
            },
          ]}
        >
          <Input onChange={(value) => handleFieldChange('potential_no_of_children', value)} />
        </Form.Item>

        <Form.Item
          label={translate('potential_child_count')}
          name="potential_child_count"
          rules={[
            {
              required: true,
              message: translate('please_enter_potential_child_count'),
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve(); // Skip validation if empty (handled by `required`)
                const number = Number(value);
                if (isNaN(number) || number < 40 || number > 80) {
                  return Promise.reject(translate('value_must_be_between_40_and_80'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            disabled
            onChange={(e) => handleFieldChange('potential_no_of_children', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={translate('select_classes')}
          name="classes"
          rules={[
            {
              required: true,
              message: translate('please_select_at_least_one_classes'),
            },
            {
              validator: (_, value) =>
                value && value.length >= 1
                  ? Promise.resolve()
                  : Promise.reject(translate('please_select_at_least_one_classes')),
            },
          ]}
        >
          <Checkbox.Group
            disabled
            onChange={(checkedValues) => handleFieldChange('selected_classes', checkedValues)}
          >
            <Checkbox value="5th">5th</Checkbox>
            <Checkbox value="6th">6th</Checkbox>
            <Checkbox value="7th">7th</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label={translate('low_income_resource')}
          name="low_income_resource"
          valuePropName="checked"
          rules={[
            {
              required: status === 'prospecting' || status === 'in_conversion',
            },
          ]}
        >
          <Switch disabled checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item label={translate('interested')} name="interested" required>
          <Radio.Group disabled onChange={handleInterestedChange}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={translate('converted')} name="converted" required>
          <Radio.Group disabled onChange={handleConvertedChange}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {mouUrl ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 5px',
              borderRadius: '8px',
              background: 'rgba(245, 40, 145, 0.05)',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'black', marginRight: '10px' }}>
                Mou :
              </p>
              <a href={mouUrl} target="_blank" rel="noopener noreferrer">
                <Button icon={<EyeOutlined />} style={{ backgroundColor: 'transparent' }}>
                  View Document
                </Button>
              </a>
            </div>
            <Button icon={<DeleteOutlined />} danger onClick={handleDeleteMou} />
          </div>
        ) : (
          <>
            <Form.Item
              label={translate('MOU_document')}
              name="mou_document"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true }]}
            >
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                onChange={(info) => handleFileChange(info.fileList)}
              >
                <Button icon={<UploadOutlined />}>{translate('Click_to_upload')}</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label={translate('mou_sign_date')}
              name="mou_sign_date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label={translate('mou_start_date')}
              name="mou_start_date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label={translate('mou_end_date')}
              name="mou_end_date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label={translate('Confirmed Child Count')}
              name="confirmed_child_count"
              rules={[{ required: true, message: 'Please enter confirmed child count' }]}
            >
              <InputNumber
                placeholder="Enter confirmed child count"
                min={0}
                style={{ width: '100%' }}
                onChange={(value) => handleFieldChange('confirmed_child_count', value)}
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
    </Loading>
  );
}
