import React from 'react';
import { Form, Select} from 'antd';
import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';

export default function CountrySelect({ name, label, required }) {
  const translate = useLanguage();

  return (
    <Form.Item
      label={translate(label)}
      name={name}
      rules={[
        {
          required: required || false,
        },
      ]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        style={{ width: '100%' }}
      >
        {countryList.map((country) => (
          <Select.Option key={country.value} value={country.value} label={translate(country.label)}>
            {country.icon && country.icon + ' '}
            {translate(country.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
