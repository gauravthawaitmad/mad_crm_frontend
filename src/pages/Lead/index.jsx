import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import LeadForm from '@/forms/LeadForm';
import { Form } from 'antd';
import useLanguage from '@/locale/useLanguage';
import ReadLead from '@/pages/Lead/ReadLead';
import { CrudContextProvider, useCrudContext } from '@/context/crud';
import PageInfoPopup from '@/components/CustomPopUp/PageInfoPopUp';

function LeadContent() {
  const translate = useLanguage();
  const entity = 'lead';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('lead'),
    DATATABLE_TITLE: translate('lead_list'),
    ADD_NEW_ENTITY: translate('add_new_lead'),
    ENTITY_NAME: translate('lead'),
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
    visibleAddNewEntity : true
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();


  // createForm={<LeadForm config={config} form={createForm} fields={fields} />}

  return (
    <>
      <PageInfoPopup
        heading={'Welcome to Lead Page'}
        message={
          'Manage leads: add partners, edit details, convert to organizations, and update statuses'
        }
      />
      <CrudModule
        createForm={<LeadForm config={config} form={createForm} fields={fields} />}
        // updateForm={<LeadForm config={config} form={updateForm} isUpdate={true} fields={fields} />}
        config={config}
        updateForm={<LeadForm config={config} form={updateForm} isUpdate={true} fields={fields} />}
        readItem={<ReadLead />}
      />
    </>
  );
}

export default function Leads() {
  return (
    <CrudContextProvider>
      <LeadContent />
    </CrudContextProvider>
  );
}
