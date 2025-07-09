"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectsByExamType = exports.getSubjectsByCategory = exports.getSubjectsByLevel = exports.nigeriaSubjects = void 0;
exports.nigeriaSubjects = [
    // Core Subjects
    {
        id: 'english',
        name: 'English Language',
        code: 'ENG',
        description: 'Language, literature, and communication skills',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'mathematics',
        name: 'Mathematics',
        code: 'MTH',
        description: 'Algebra, geometry, statistics, and calculus',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'biology',
        name: 'Biology',
        code: 'BIO',
        description: 'Study of living organisms and life processes',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        code: 'CHM',
        description: 'Study of matter, its properties and reactions',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'physics',
        name: 'Physics',
        code: 'PHY',
        description: 'Study of matter, energy, and their interactions',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'civic-education',
        name: 'Civic Education',
        code: 'CIV',
        description: 'Citizenship, rights, and responsibilities',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    // Social Sciences
    {
        id: 'government',
        name: 'Government',
        code: 'GOV',
        description: 'Political science and governance systems',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'economics',
        name: 'Economics',
        code: 'ECO',
        description: 'Economic principles and market systems',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'geography',
        name: 'Geography',
        code: 'GEO',
        description: 'Physical and human geography',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'history',
        name: 'History',
        code: 'HIS',
        description: 'Nigerian and world history',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'crs',
        name: 'Christian Religious Studies',
        code: 'CRS',
        description: 'Christian theology and biblical studies',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'irs',
        name: 'Islamic Religious Studies',
        code: 'IRS',
        description: 'Islamic theology and Quranic studies',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    // Languages
    {
        id: 'literature',
        name: 'Literature in English',
        code: 'LIT',
        description: 'English literature and literary analysis',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'french',
        name: 'French Language',
        code: 'FRE',
        description: 'French language and culture',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'yoruba',
        name: 'Yoruba Language',
        code: 'YOR',
        description: 'Yoruba language and culture',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'hausa',
        name: 'Hausa Language',
        code: 'HAU',
        description: 'Hausa language and culture',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'igbo',
        name: 'Igbo Language',
        code: 'IGB',
        description: 'Igbo language and culture',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    // Arts and Creative
    {
        id: 'fine-arts',
        name: 'Fine Arts',
        code: 'FAR',
        description: 'Visual arts, drawing, and painting',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'music',
        name: 'Music',
        code: 'MUS',
        description: 'Music theory and practice',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'cultural-creative-arts',
        name: 'Cultural and Creative Arts',
        code: 'CCA',
        description: 'Arts, culture, and creative expression',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    // Technical and Vocational
    {
        id: 'technical-drawing',
        name: 'Technical Drawing',
        code: 'TDR',
        description: 'Engineering drawing and design',
        category: 'vocational',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'woodwork',
        name: 'Woodwork',
        code: 'WWK',
        description: 'Wood crafting and carpentry',
        category: 'vocational',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'metal-work',
        name: 'Metal Work',
        code: 'MWK',
        description: 'Metalworking and fabrication',
        category: 'vocational',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'auto-mechanics',
        name: 'Auto Mechanics',
        code: 'AME',
        description: 'Automobile repair and maintenance',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    {
        id: 'electrical-installation',
        name: 'Electrical Installation',
        code: 'EIN',
        description: 'Electrical systems and installation',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    {
        id: 'building-construction',
        name: 'Building Construction',
        code: 'BCN',
        description: 'Construction techniques and materials',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    // Computer and IT
    {
        id: 'computer-studies',
        name: 'Computer Studies',
        code: 'CMP',
        description: 'Basic computer skills and programming',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'data-processing',
        name: 'Data Processing',
        code: 'DPR',
        description: 'Data management and processing',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    // Business and Commerce
    {
        id: 'commerce',
        name: 'Commerce',
        code: 'COM',
        description: 'Business principles and commercial activities',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'accounting',
        name: 'Accounting',
        code: 'ACC',
        description: 'Financial accounting and bookkeeping',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'office-practice',
        name: 'Office Practice',
        code: 'OPR',
        description: 'Office administration and management',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    {
        id: 'shorthand',
        name: 'Shorthand',
        code: 'SHD',
        description: 'Stenography and rapid writing',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    {
        id: 'typewriting',
        name: 'Typewriting',
        code: 'TYP',
        description: 'Typing skills and keyboarding',
        category: 'vocational',
        level: 'secondary',
        examType: 'NABTEB'
    },
    // Home Economics and Agriculture
    {
        id: 'home-economics',
        name: 'Home Economics',
        code: 'HEC',
        description: 'Home management and family life',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'agricultural-science',
        name: 'Agricultural Science',
        code: 'AGR',
        description: 'Farming, crop production, and animal husbandry',
        category: 'elective',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'food-nutrition',
        name: 'Food and Nutrition',
        code: 'FAN',
        description: 'Nutrition science and food preparation',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    // Health and Physical Education
    {
        id: 'health-education',
        name: 'Health Education',
        code: 'HED',
        description: 'Health science and wellness',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    {
        id: 'physical-health-education',
        name: 'Physical and Health Education',
        code: 'PHE',
        description: 'Physical fitness and health education',
        category: 'core',
        level: 'secondary',
        examType: 'All'
    },
    // Primary School Subjects
    {
        id: 'basic-science',
        name: 'Basic Science',
        code: 'BSC',
        description: 'Elementary science concepts',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    {
        id: 'basic-technology',
        name: 'Basic Technology',
        code: 'BTC',
        description: 'Elementary technology concepts',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    {
        id: 'social-studies',
        name: 'Social Studies',
        code: 'SOS',
        description: 'Society, culture, and citizenship',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    {
        id: 'business-studies',
        name: 'Business Studies',
        code: 'BST',
        description: 'Basic business concepts',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    {
        id: 'pre-vocational-studies',
        name: 'Pre-Vocational Studies',
        code: 'PVS',
        description: 'Introduction to vocational skills',
        category: 'core',
        level: 'primary',
        examType: 'Primary'
    },
    // Advanced/A-Level Subjects
    {
        id: 'further-mathematics',
        name: 'Further Mathematics',
        code: 'FMT',
        description: 'Advanced mathematics concepts',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    },
    {
        id: 'statistics',
        name: 'Statistics',
        code: 'STA',
        description: 'Statistical analysis and probability',
        category: 'elective',
        level: 'secondary',
        examType: 'WAEC'
    }
];
const getSubjectsByLevel = (level) => {
    return exports.nigeriaSubjects.filter(subject => subject.level === level);
};
exports.getSubjectsByLevel = getSubjectsByLevel;
const getSubjectsByCategory = (category) => {
    return exports.nigeriaSubjects.filter(subject => subject.category === category);
};
exports.getSubjectsByCategory = getSubjectsByCategory;
const getSubjectsByExamType = (examType) => {
    return exports.nigeriaSubjects.filter(subject => subject.examType === examType || subject.examType === 'All');
};
exports.getSubjectsByExamType = getSubjectsByExamType;
