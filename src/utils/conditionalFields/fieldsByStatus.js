export const getFieldsByStatus = (fields, status) => {
  const dynamicFields = { ...fields };

  if (status === 'Completed') {
    dynamicFields.completed_date = { type: 'date', label: 'Completed Date', required: true };
  } else {
    delete dynamicFields.completed_date;
  }

  if (status === 'Rejected') {
    dynamicFields.rejection_reason = {
      type: 'textarea',
      label: 'Rejection Reason',
      required: true,
    };
  } else {
    delete dynamicFields.rejection_reason;
  }

  if (status === 'In Progress') {
    dynamicFields.expected_completion_date = { type: 'date', label: 'Expected Completion Date' };
  } else {
    delete dynamicFields.expected_completion_date;
  }

  return dynamicFields;
};
