/** User-facing copy for the profile screen. */
export const profileStrings = {
  title: 'Profile',
  sections: { name: 'Name', email: 'Email', photo: 'Photo' },
  fields: { firstName: 'First name', lastName: 'Last name', email: 'Email' },
  name: { save: 'Save name', saving: 'Saving...' },
  email: { save: 'Save email', saving: 'Saving...' },
  avatar: { upload: 'Upload new photo', working: 'Working...', remove: 'Remove' },
} as const;
