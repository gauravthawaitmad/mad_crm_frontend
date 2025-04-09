import { Form, Input, Select, DatePicker, Radio, Switch } from 'antd';
import { useState, useEffect } from 'react';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { Upload, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useCrudContext } from '@/context/crud';
import PartnerSelect from '@/components/SelectBoxComponent/PartnerSelect';
import Loading from '../components/Loading';

export default function PocForm({ config, isUpdate = false, form }) {
  // console.log(isUpdate, 'isUpdate in poc form');

  const translate = useLanguage();

  const dispatch = useDispatch();
  const { crudContextAction, state } = useCrudContext();
  const { isReadBoxOpen, isEditBoxOpen } = state;
  console.log("is EditBoxOpen  value in Poc form :", isEditBoxOpen)
  const { collapsedBox } = crudContextAction;

  const { result: currentItem } = useSelector(selectCurrentItem);
  // console.log('currentItem in edit poc ====>', currentItem);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUpdate && currentItem) {
      form.setFieldsValue({
        ...currentItem,
        date_of_first_contact: currentItem.date_of_first_contact
          ? dayjs(currentItem.date_of_first_contact)
          : null,
      });
    }
  }, [isUpdate, currentItem, form]);

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

  const handleSubmit = async(values) => {
    console.log('Form submitted with values:', values);
    const dataToSend = { ...values };

    setLoading(true);
  
    try {
      if (isUpdate) {
       await dispatch(
          crud.update({
            entity: 'poc',
            id: currentItem.id,
            jsonData: dataToSend,
          })
        );
        crudContextAction.panel.close();
        crudContextAction.editBox.close();
      } else {
        await dispatch(crud.create({ entity: 'poc', jsonData: dataToSend }));
        crudContextAction.panel.close();
      }
      dispatch(crud.list({ entity: 'poc' }));
    } catch (error) {
      message.error(translate(isUpdate ? 'error_updating_poc' : 'error_creating_poc'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Loading isLoading={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <PartnerSelect name="partner_id" label="Partner_Name" disabled={isEditBoxOpen} />

        {/* <CountrySelect name="country" label="country" required /> */}

        <Form.Item label={translate('date_of_first_contact')} name="date_of_first_contact" required>
          <DatePicker
            style={{ width: '100%' }}
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleFieldChange(
                'date_of_first_contact',
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
            placeholder="+91 9876543210" 
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
