import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { SmileOutlined } from '@ant-design/icons';

export default function PageInfoPopup({ message, duration = 5000, onClose, heading }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div style={popupStyle}>
      <Alert
        message= {heading}
        description={message}
        type="info"
        showIcon = {<SmileOutlined />}
        closable
        onClose={() => setVisible(false)}
        icon={<SmileOutlined />}
      />
    </div>
  );
}

const popupStyle = {
  position: 'fixed',
  top: 20,
  right: 20,
  width: 300,
  zIndex: 1000,
};