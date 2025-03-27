import React, { useState, useEffect } from 'react';
import { Select, Form, message } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';
import useLanguage from '@/locale/useLanguage';

export default function ManagerListSelect({ name, label, required }) {
  const translate = useLanguage();
  const [managerList, setManagerList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManagerList = async () => {
      setLoading(true);
      try {
        const auth = storePersist.get('auth');
        const token = auth?.current?.token;

        const response = await axios.get(`${API_BASE_URL}user/listAll?role=manager`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setManagerList(response.data.result); // Ensure API returns `coList` array
        } else {
          message.error(translate('Failed to fetch Manager list'));
        }
      } catch (error) {
        console.error('Error fetching Manager list:', error);
        message.error(translate('An error occurred while fetching the manager list'));
      }
      setLoading(false);
    };

    fetchManagerList();
  }, []);

  return (
    <Form.Item
      label={translate(label)}
      name={name}
      rules={[{ required: required || false, message: translate('Please select a Manager') }]}
    >
      <Select
        loading={loading}
        showSearch
        optionFilterProp="children"
        style={{ width: '100%' }}
        placeholder={translate('Select a manager')}
        notFoundContent={translate('No COs found')}
      >
        {managerList.map((manager) => (
          <Select.Option key={manager.id} value={manager.id}>
            {translate(`${manager.first_name} ${manager.last_name || ''}`.trim())}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
