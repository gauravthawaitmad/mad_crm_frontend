import CrudModule from '@/modules/CrudModule/CrudModule';
import { Form } from 'antd';
import PocForm from '@/forms/PocForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';
import ReadPoc from './ReadPoc';

export default function Poc() {
  const translate = useLanguage();
  const entity = 'poc';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('poc'),
    DATATABLE_TITLE: translate('poc_list'),
    ADD_NEW_ENTITY: translate('add_new_poc'),
    ENTITY_NAME: translate('poc'),
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
  };
  // return (
  //   <CrudModule
  //     createForm={<DynamicForm fields={fields} />}
  //     updateForm={<DynamicForm fields={fields} />}
  //     config={config}
  //   />
  // );


  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <CrudModule
      // createForm={<PocForm config={config} form={createForm} />}
      // updateForm={<PocForm config={config} form={updateForm} isUpdate={true} />}
      config={config}
      readItem={<ReadPoc/>}
    />
  );
}
