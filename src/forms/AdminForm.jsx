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
import LocationSelect from '../components/SelectBoxComponent/StateSelect';
import Loading from '../components/Loading';
import ManagerListSelect from '../components/ManagerListComponent/ManagerListSelect';

export default function UserForm({ config, isUpdate = false, form }) {
  // console.log(isUpdate, 'isUpdate');
  const translate = useLanguage();

  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { collapsedBox } = crudContextAction;
  const [loading, setLoading] = useState(false);

  const { result: currentItem } = useSelector(selectCurrentItem);

  const [roleStatus, setRoleStatus] = useState(null)
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
    }
  }, [currentItem, isUpdate, form]);


  const [formData, setFormData] = useState({
    co_name: null,
    partner_name: null,
    address: null,
    pincode: null,
    lead_source: null,
    createdDate: null,
    status: null,
  });

  const handleRoleStatus = (value) => {
    setRoleStatus(value)
  }


  const [, forceRender] = useState(0);
  // When status changes, also update formData
  const handleStatusChange = (value) => {
    console.log('Status changed to:', value);
    setStatus(value);
    form.setFieldValue('lead_status', value);

    // Force a re-render to update the visible fields
    forceRender((prev) => prev + 1);
  };


  const handleSubmit = async (values) => {
    console.log('Form submitted with values in admin form :', values);
    const dataToSend = { ...values };

    setLoading(true);

    try {
      if (isUpdate) {
        await dispatch(crud.update({ entity: 'user', id: currentItem.id, jsonData: dataToSend }));
        crudContextAction.panel.close();
        crudContextAction.editBox.close();
      } else {
        await dispatch(crud.create({ entity: 'user', jsonData: dataToSend }));
        crudContextAction.panel.close();
      }

      dispatch(crud.list({ entity: 'user' }));
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
            label={translate('first_name')}
            name="first_name"
            rules={[{ required: true, message: translate('please_enter_first_name') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={translate('last_name')}
            name="last_name"
            rules={[{ required: true, message: translate('please_enter_last_name') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={translate('email')}
            name="email"
            rules={[
              { required: true, message: translate('please_enter_email') },
              { type: 'email', message: translate('please_enter_valid_email') },
            ]}
          >
            <Input placeholder={translate('Enter your email')} />
          </Form.Item>

          <LocationSelect
            nameState="state_id"
            nameCity="city_id"
            labelState="state"
            labelCity="city"
            required={true}
          />
        

          <Form.Item
            label={translate('password')}
            name="password"
            rules={[
              !isUpdate && { required: true, message: translate('please_enter_password') }, // Required only if not updating
              { min: 6, message: translate('password_min_length') },
            ].filter(Boolean)} // Remove `false` values from the array
          >
            <Input.Password placeholder={translate('Enter your password')} />
          </Form.Item>

          <Form.Item
            label={translate('role')}
            name="role"
            rules={[
              {
                required: true,
                message: translate('please_select_role'),
              },
            ]}
          >
            <Select onChange={handleRoleStatus}>
              <Select.Option value="super_admin">Super Admin</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="co">CO</Select.Option>
            </Select>
          </Form.Item>

          {roleStatus === 'co' && (
            <ManagerListSelect name="manager_id" label="Manager" required />
          )}

          <Form.Item label={translate('enabled')} name="enabled" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
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

// import { Form, Input, Select } from 'antd';
// import { UploadOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
// import { message, Upload, Button, Switch } from 'antd';
// import { useDispatch } from 'react-redux';

// import useLanguage from '@/locale/useLanguage';

// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!');
//   }
//   return isJpgOrPng && isLt2M;
// };

// export default function AdminForm({ config, isUpdate = false, form }) {
//   const translate = useLanguage();

//   const dispatch = useDispatch();
//   return (
//     <>
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//       <Form.Item
//         label={translate('first Name')}
//         name="name"
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Input autoComplete="off" />
//       </Form.Item>
//       <Form.Item
//         label={translate('last Name')}
//         name="surname"
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Input autoComplete="off" />
//       </Form.Item>
//       <Form.Item
//         label={translate('email')}
//         name="email"
//         rules={[
//           {
//             required: true,
//           },
//           {
//             type: 'email',
//           },
//         ]}
//       >
//         <Input autoComplete="off" />
//       </Form.Item>

//       {!isUpdateForm && (
//         <Form.Item
//           label={translate('Password')}
//           name="password"
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input.Password autoComplete="new-password" />
//         </Form.Item>
//       )}

//       <Form.Item
//         label={translate('Role')}
//         name="role"
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Select>
//           <Select.Option value="owner" disabled={!isForAdminOwner}>
//             {translate('Account owner')}
//           </Select.Option>
//           <Select.Option value="admin" disabled={isForAdminOwner}>
//             {translate('super_admin')}
//           </Select.Option>
//           <Select.Option value="manager" disabled={isForAdminOwner}>
//             {translate('manager')}
//           </Select.Option>
//           <Select.Option value="employee" disabled={isForAdminOwner}>
//             {translate('employee')}
//           </Select.Option>
//           <Select.Option value="create_only" disabled={isForAdminOwner}>
//             {translate('create_only')}
//           </Select.Option>
//           <Select.Option value="read_only" disabled={isForAdminOwner}>
//             {translate('read_only')}
//           </Select.Option>
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label={translate('enabled')}
//         name="enabled"
//         valuePropName={'checked'}
//         initialValue={true}
//       >
//         <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
//       </Form.Item>

//       {/* <Form.Item
//         name="file"
//         label={translate('Photo')}
//         valuePropName="fileList"
//         getValueFromEvent={(e) => e.fileList}
//       >
//         <Upload beforeUpload={beforeUpload}>
//           <Button icon={<UploadOutlined />}>{translate('click_to_upload')}</Button>
//         </Upload>
//       </Form.Item> */}

//       </Form>
//     </>
//   );
// }
