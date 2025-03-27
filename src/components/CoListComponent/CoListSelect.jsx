import React, { useState, useEffect } from 'react';
import { Select, Form, message } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';
import useLanguage from '@/locale/useLanguage';

export default function CoListSelect({ name, label, required }) {
  const translate = useLanguage();
  const [coList, setCoList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoList = async () => {
      setLoading(true);
      try {
        const auth = storePersist.get('auth');
        const token = auth?.current?.token;

        const response = await axios.get(`${API_BASE_URL}user/listAll?role=co,manager`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setCoList(response.data.result); // Ensure API returns `coList` array
        } else {
          message.error(translate('Failed to fetch CO list'));
        }
      } catch (error) {
        console.error('Error fetching CO list:', error);
        message.error(translate('An error occurred while fetching the CO list'));
      }
      setLoading(false);
    };

    fetchCoList();
  }, []);

  return (
    <Form.Item
      label={translate(label)}
      name={name}
      rules={[{ required: required || false, message: translate('Please select a CO') }]}
    >
      <Select
        loading={loading}
        showSearch
        optionFilterProp="children"
        style={{ width: '100%' }}
        placeholder={translate('Select a CO')}
        notFoundContent={translate('No COs found')}
      >
        {coList.map((co) => (
          <Select.Option key={co.id} value={co.id}>
            {translate(`${co.first_name} ${co.last_name || ''}`.trim())}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
