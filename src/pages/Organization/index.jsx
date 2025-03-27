import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';
import ReadOrganization from './ReadOrganization';

export default function Organization() {
  const translate = useLanguage();
  const entity = 'organization';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('organization'),
    DATATABLE_TITLE: translate('organization_list'),
    ADD_NEW_ENTITY: translate('add_new_organization'),
    ENTITY_NAME: translate('organization'),
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
  return (
    <CrudModule
      createForm={(form) => <DynamicForm form={form} fields={fields} />} 
      updateForm={(form) => <DynamicForm form={form} fields={fields} />}
      config={config}
      readItem={ <ReadOrganization />}
    />
  );
}
