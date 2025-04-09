import CrudModule from '@/modules/CrudModule/CrudModule';
import { Form } from 'antd';
import PocForm from '@/forms/PocForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';
import ReadPoc from './ReadPoc';
import PageInfoPopup from '@/components/CustomPopUp/PageInfoPopup';

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
    visibleAddNewEntity: true,
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
    <>
      <PageInfoPopup
        message={
          'Manage poc: View poc details of partners, add new poc'
        }
        heading={'Welcome to Poc Page'}
      />
      <CrudModule
        createForm={<PocForm config={config} form={createForm} />}
        updateForm={<PocForm config={config} form={updateForm} isUpdate={true} />}
        config={config}
        readItem={<ReadPoc />}
      />
    </>
  );
}
