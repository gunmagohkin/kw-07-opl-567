import { ImprovementEntry } from '../types';

export const mockEntries: ImprovementEntry[] = [
  {
    id: '1',
    controlNumber: '2025-WA-0041',
    recordNumber: '50',
    areaCode: 'KW 03',
    category: '5S',
    entryTitle: 'Maintenance and safety',
    description: 'Tools and materials organized properly, file cabinet moved to the left and good arrangement.',
    beforeImage: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
    improvement: 'Organize tools properly. Put labels on each cabinet. Arrange the file cabinet.',
    afterImage: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    improvementEffect: 'Things are well organized and labeled. Everyone can find what they need quickly.',
    dateTime: '05-16-2025',
    month: 'May'
  },
  {
    id: '2',
    controlNumber: '2025-WA-0042',
    recordNumber: '51',
    areaCode: 'KW 02',
    category: '5S',
    entryTitle: 'Safety',
    description: 'There are tools laying around. Not organized properly and might cause accident.',
    beforeImage: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    improvement: 'Additional safety measures and proper organization of tools.',
    afterImage: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg',
    improvementEffect: 'Safer work environment. Less clutter. Tools are organized by category. Accident prevention increased.',
    dateTime: '05-16-2025',
    month: 'May'
  },
  {
    id: '3',
    controlNumber: '2025-WA-0038',
    recordNumber: '48',
    areaCode: 'KW 05',
    category: '5S',
    entryTitle: 'PROPER STAG NO PROPER STACKING',
    description: 'Materials not properly stacked causing potential safety hazards.',
    beforeImage: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    improvement: 'PROVIDE STAG for proper material organization.',
    afterImage: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
    improvementEffect: 'Organized by Method. Improved Visitor Safety. Set up Employee Performance.',
    dateTime: '05-16-2025',
    month: 'May'
  },
  {
    id: '4',
    controlNumber: '2025-WA-0037',
    recordNumber: '41',
    areaCode: 'KW 06',
    category: '5S',
    entryTitle: 'CLEANING MATS NO PROPER STACKING',
    description: 'Cleaning mats are not properly organized and stacked.',
    beforeImage: 'https://images.pexels.com/photos/7525043/pexels-photo-7525043.jpeg',
    improvement: 'PROVIDE CART for proper organization.',
    afterImage: 'https://images.pexels.com/photos/6195237/pexels-photo-6195237.jpeg',
    improvementEffect: 'Organized by Method. Improved safety standards. Process improvements in cleaning operations.',
    dateTime: '05-16-2025',
    month: 'May'
  },
  {
    id: '5',
    controlNumber: '2025-WA-0042',
    recordNumber: '43',
    areaCode: 'KW 07',
    category: '5S',
    entryTitle: 'IMPROVED PM IMPLEMENTATION',
    description: 'Improving maintenance procedures and implementation.',
    beforeImage: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    improvement: 'Enhanced maintenance procedures with better tracking.',
    afterImage: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg',
    improvementEffect: 'Better maintenance tracking and improved operational efficiency.',
    dateTime: '05-16-2025',
    month: 'May'
  },
  {
    id: '6',
    controlNumber: '2025-WA-0054',
    recordNumber: '41',
    areaCode: 'KW 07',
    category: '5S',
    entryTitle: 'PANTRY DEMO',
    description: 'Demonstration of proper pantry organization and maintenance.',
    beforeImage: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    improvement: 'Organized pantry with proper labeling and storage solutions.',
    afterImage: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
    improvementEffect: 'Clean and functional pantry area with improved organization.',
    dateTime: '05-16-2025',
    month: 'May'
  }
];

export const availableMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];