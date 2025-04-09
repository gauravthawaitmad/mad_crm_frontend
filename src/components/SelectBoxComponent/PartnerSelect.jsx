import React, { useState, useEffect } from 'react';
import { Form, Select, message, Spin } from 'antd';
import useLanguage from '@/locale/useLanguage';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';

export default function PartnerSelect({ name, label, required, disabled  }) {
  const translate = useLanguage();
  const [partnerList, setPartnerList] = useState([]); // Full fetched list
  const [filteredPartners, setFilteredPartners] = useState([]); // Search results
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const auth = storePersist.get('auth');
        const token = auth?.current?.token;

        const response = await axios.get(`${API_BASE_URL}Lead/listAll`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.status === 200) {
        //   console.log('Fetched partner data:', response.data);
          setPartnerList(response.data.result || []);
          setFilteredPartners(response.data.result || []); // Initially show all partners
        } else {
          message.error(translate('Failed to fetch partner list'));
        }
      } catch (error) {
        console.error('Error fetching partner list:', error);
        message.error(translate('An error occurred while fetching the partner list'));
      }
      setLoading(false);
    };

    fetchPartners();
  }, []);

  // Local search filtering
  const handleSearch = (value) => {
    const filtered = partnerList.filter((partner) =>
      partner.partner_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPartners(filtered);
  };

  return (
    <Form.Item
      label={translate(label)}
      name={name}
      rules={[{ required: required || false, message: translate('Please select a partner') }]}
    >
      <Select
        showSearch
        allowClear
        loading={loading}
        disabled={loading || disabled} // ✅ Corrected: Either loading OR explicitly disabled
        filterOption={false} // Disable default filtering
        onSearch={handleSearch} // Custom local filtering
        style={{ width: '100%' }}
        placeholder={loading ? translate('Loading...') : translate('Select a partner')}
        notFoundContent={loading ? <Spin size="small" /> : translate('No partners found')}
      >
        {filteredPartners.map((partner) => (
          <Select.Option key={partner.id} value={partner.id}>
            {translate(partner.partner_name)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
