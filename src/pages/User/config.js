import color from "@/utils/color";

export const fields = {
  first_name: {
    type: 'string',
  },
  last_name: {
    type: 'string',
  },
  email: {
    type: 'email',
  },
  city: {
    type: 'string',
  },
  role: {
    type: 'select',
    options: [
      {
        value: 'read',
        label: 'Arpita',
      },
      {
        value: 'Sanyukta',
        label: 'Sanyukta',
      },
      {
        value: 'Khushi Nahar',
        label: 'Khushi Nahar',
      },
    ],
  },
  enabled:{
    type: 'boolean'
  }
};
