import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import UserForm from '@/forms/AdminForm';
import useLanguage from '@/locale/useLanguage';
import { Form } from 'antd';

export default function Users() {
  const translate = useLanguage();
  const entity = 'user';
  const searchConfig = {
    displayLabels: ['first_name'],
    searchFields: 'first_name',
  };
  const deleteModalLabels = ['first_name'];

  const Labels = {
    PANEL_TITLE: translate('user'),
    DATATABLE_TITLE: translate('user_list'),
    ADD_NEW_ENTITY: translate('add_new_user'),
    ENTITY_NAME: translate('user'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    // visibleAddNewEntity: true,
    
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <CrudModule
      createForm={<UserForm config={config} form={createForm} />}
      updateForm={<UserForm config={config} form={updateForm} isUpdate={true} />}
      config={config}
    />
  );
}
