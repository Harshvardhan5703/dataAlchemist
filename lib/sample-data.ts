import { DataType, EntityData, ClientData, WorkerData, TaskData } from '@/types/data-types';

export function generateSampleData(type: DataType): EntityData[] {
  switch (type) {
    case 'clients':
      return generateSampleClients();
    case 'workers':
      return generateSampleWorkers();
    case 'tasks':
      return generateSampleTasks();
    default:
      return [];
  }
}

function generateSampleClients(): ClientData[] {
  return [
    {
      ClientID: 'C001',
      ClientName: 'TechCorp Solutions',
      PriorityLevel: 5,
      RequestedTaskIDs: 'T001,T003,T007',
      GroupTag: 'enterprise',
      AttributesJSON: '{"budget": 50000, "deadline": "2024-03-15", "contact": "john.doe@techcorp.com"}'
    },
    {
      ClientID: 'C002',
      ClientName: 'StartupInc',
      PriorityLevel: 3,
      RequestedTaskIDs: 'T002,T005',
      GroupTag: 'startup',
      AttributesJSON: '{"budget": 15000, "deadline": "2024-02-28", "contact": "jane@startupinc.com"}'
    },
    {
      ClientID: 'C003',
      ClientName: 'Global Enterprises',
      PriorityLevel: 4,
      RequestedTaskIDs: 'T001,T004,T006,T008',
      GroupTag: 'enterprise',
      AttributesJSON: '{"budget": 75000, "deadline": "2024-04-01", "contact": "admin@globalent.com"}'
    },
    {
      ClientID: 'C004',
      ClientName: 'Local Business Co',
      PriorityLevel: 2,
      RequestedTaskIDs: 'T009,T010',
      GroupTag: 'small-business',
      AttributesJSON: '{"budget": 8000, "deadline": "2024-03-30", "contact": "owner@localbiz.com"}'
    },
    {
      ClientID: 'C005',
      ClientName: 'Innovation Labs',
      PriorityLevel: 5,
      RequestedTaskIDs: 'T003,T007,T011,T012',
      GroupTag: 'research',
      AttributesJSON: '{"budget": 100000, "deadline": "2024-05-15", "contact": "research@innolabs.com"}'
    },
    {
      ClientID: 'C006',
      ClientName: 'Healthcare Plus',
      PriorityLevel: 4,
      RequestedTaskIDs: 'T013,T014,T015',
      GroupTag: 'healthcare',
      AttributesJSON: '{"budget": 60000, "deadline": "2024-03-20", "contact": "it@healthplus.com"}'
    },
    {
      ClientID: 'C007',
      ClientName: 'FinTech Solutions',
      PriorityLevel: 5,
      RequestedTaskIDs: 'T016,T017,T018',
      GroupTag: 'finance',
      AttributesJSON: '{"budget": 120000, "deadline": "2024-04-10", "contact": "dev@fintech.com"}'
    },
    {
      ClientID: 'C008',
      ClientName: 'EduTech Platform',
      PriorityLevel: 3,
      RequestedTaskIDs: 'T019,T020',
      GroupTag: 'education',
      AttributesJSON: '{"budget": 25000, "deadline": "2024-03-25", "contact": "tech@edutech.com"}'
    },
    {
      ClientID: 'C009',
      ClientName: 'RetailMax',
      PriorityLevel: 2,
      RequestedTaskIDs: 'T001,T002',
      GroupTag: 'retail',
      AttributesJSON: '{"budget": 12000, "deadline": "2024-02-20", "contact": "it@retailmax.com"}'
    },
    {
      ClientID: 'C010',
      ClientName: 'Manufacturing Pro',
      PriorityLevel: 4,
      RequestedTaskIDs: 'T004,T005,T006',
      GroupTag: 'manufacturing',
      AttributesJSON: '{"budget": 45000, "deadline": "2024-03-31", "contact": "systems@mfgpro.com"}'
    },
    {
      ClientID: 'C011',
      ClientName: 'Media Group',
      PriorityLevel: 3,
      RequestedTaskIDs: 'T007,T008,T009',
      GroupTag: 'media',
      AttributesJSON: '{"budget": 35000, "deadline": "2024-03-10", "contact": "digital@mediagroup.com"}'
    },
    {
      ClientID: 'C012',
      ClientName: 'Energy Systems',
      PriorityLevel: 5,
      RequestedTaskIDs: 'T010,T011,T012,T013',
      GroupTag: 'energy',
      AttributesJSON: '{"budget": 90000, "deadline": "2024-04-20", "contact": "tech@energysys.com"}'
    },
    {
      ClientID: 'C013',
      ClientName: 'Transport Solutions',
      PriorityLevel: 2,
      RequestedTaskIDs: 'T014,T015',
      GroupTag: 'transport',
      AttributesJSON: '{"budget": 18000, "deadline": "2024-02-25", "contact": "it@transportsol.com"}'
    },
    {
      ClientID: 'C014',
      ClientName: 'Agriculture Tech',
      PriorityLevel: 3,
      RequestedTaskIDs: 'T016,T017',
      GroupTag: 'agriculture',
      AttributesJSON: '{"budget": 22000, "deadline": "2024-03-05", "contact": "dev@agritech.com"}'
    },
    {
      ClientID: 'C015',
      ClientName: 'Gaming Studio',
      PriorityLevel: 4,
      RequestedTaskIDs: 'T018,T019,T020',
      GroupTag: 'gaming',
      AttributesJSON: '{"budget": 55000, "deadline": "2024-04-15", "contact": "dev@gamingstudio.com"}'
    }
  ];
}

function generateSampleWorkers(): WorkerData[] {
  return [
    {
      WorkerID: 'W001',
      WorkerName: 'Alice Johnson',
      Skills: 'javascript,react,node.js,typescript',
      AvailableSlots: '[1,2,3,5]',
      MaxLoadPerPhase: 3,
      WorkerGroup: 'frontend',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W002',
      WorkerName: 'Bob Smith',
      Skills: 'python,django,postgresql,aws',
      AvailableSlots: '[2,3,4,5,6]',
      MaxLoadPerPhase: 4,
      WorkerGroup: 'backend',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W003',
      WorkerName: 'Carol Davis',
      Skills: 'ui/ux,figma,adobe-suite,prototyping',
      AvailableSlots: '[1,3,4]',
      MaxLoadPerPhase: 2,
      WorkerGroup: 'design',
      QualificationLevel: 'mid-level'
    },
    {
      WorkerID: 'W004',
      WorkerName: 'David Wilson',
      Skills: 'java,spring,microservices,docker',
      AvailableSlots: '[1,2,4,5,6]',
      MaxLoadPerPhase: 3,
      WorkerGroup: 'backend',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W005',
      WorkerName: 'Emma Brown',
      Skills: 'react,vue.js,css,html,sass',
      AvailableSlots: '[2,3,5,6]',
      MaxLoadPerPhase: 3,
      WorkerGroup: 'frontend',
      QualificationLevel: 'mid-level'
    },
    {
      WorkerID: 'W006',
      WorkerName: 'Frank Miller',
      Skills: 'devops,kubernetes,jenkins,terraform',
      AvailableSlots: '[1,2,3,4,5,6]',
      MaxLoadPerPhase: 2,
      WorkerGroup: 'devops',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W007',
      WorkerName: 'Grace Lee',
      Skills: 'qa,selenium,cypress,testing',
      AvailableSlots: '[3,4,5,6]',
      MaxLoadPerPhase: 4,
      WorkerGroup: 'qa',
      QualificationLevel: 'mid-level'
    },
    {
      WorkerID: 'W008',
      WorkerName: 'Henry Garcia',
      Skills: 'c#,.net,azure,sql-server',
      AvailableSlots: '[1,3,5]',
      MaxLoadPerPhase: 2,
      WorkerGroup: 'backend',
      QualificationLevel: 'junior'
    },
    {
      WorkerID: 'W009',
      WorkerName: 'Ivy Chen',
      Skills: 'mobile,react-native,ios,android',
      AvailableSlots: '[2,4,6]',
      MaxLoadPerPhase: 3,
      WorkerGroup: 'mobile',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W010',
      WorkerName: 'Jack Taylor',
      Skills: 'data-science,python,machine-learning,tensorflow',
      AvailableSlots: '[1,2,5,6]',
      MaxLoadPerPhase: 2,
      WorkerGroup: 'data-science',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W011',
      WorkerName: 'Kate Anderson',
      Skills: 'project-management,agile,scrum,jira',
      AvailableSlots: '[1,2,3,4,5,6]',
      MaxLoadPerPhase: 5,
      WorkerGroup: 'management',
      QualificationLevel: 'senior'
    },
    {
      WorkerID: 'W012',
      WorkerName: 'Luke Thompson',
      Skills: 'javascript,node.js,mongodb,express',
      AvailableSlots: '[3,4,5]',
      MaxLoadPerPhase: 3,
      WorkerGroup: 'backend',
      QualificationLevel: 'junior'
    }
  ];
}

function generateSampleTasks(): TaskData[] {
  return [
    {
      TaskID: 'T001',
      TaskName: 'Frontend Dashboard Development',
      Category: 'development',
      Duration: 2,
      RequiredSkills: 'javascript,react,css',
      PreferredPhases: '[1,2]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T002',
      TaskName: 'API Integration',
      Category: 'development',
      Duration: 1,
      RequiredSkills: 'javascript,api-integration',
      PreferredPhases: '[2,3]',
      MaxConcurrent: 3
    },
    {
      TaskID: 'T003',
      TaskName: 'Database Design',
      Category: 'architecture',
      Duration: 3,
      RequiredSkills: 'database,sql,design',
      PreferredPhases: '[1,2,3]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T004',
      TaskName: 'User Authentication System',
      Category: 'security',
      Duration: 2,
      RequiredSkills: 'security,authentication,backend',
      PreferredPhases: '[2,3,4]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T005',
      TaskName: 'Mobile App UI Design',
      Category: 'design',
      Duration: 1,
      RequiredSkills: 'ui/ux,mobile,design',
      PreferredPhases: '[1]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T006',
      TaskName: 'Payment Gateway Integration',
      Category: 'integration',
      Duration: 2,
      RequiredSkills: 'payment,api,security',
      PreferredPhases: '[3,4]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T007',
      TaskName: 'Data Analytics Dashboard',
      Category: 'analytics',
      Duration: 3,
      RequiredSkills: 'data-science,visualization,python',
      PreferredPhases: '[4,5,6]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T008',
      TaskName: 'Cloud Infrastructure Setup',
      Category: 'devops',
      Duration: 1,
      RequiredSkills: 'devops,cloud,aws',
      PreferredPhases: '[1]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T009',
      TaskName: 'Automated Testing Suite',
      Category: 'testing',
      Duration: 2,
      RequiredSkills: 'testing,automation,qa',
      PreferredPhases: '[5,6]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T010',
      TaskName: 'Performance Optimization',
      Category: 'optimization',
      Duration: 1,
      RequiredSkills: 'performance,optimization,profiling',
      PreferredPhases: '[6]',
      MaxConcurrent: 3
    },
    {
      TaskID: 'T011',
      TaskName: 'Machine Learning Model',
      Category: 'ai',
      Duration: 4,
      RequiredSkills: 'machine-learning,python,data-science',
      PreferredPhases: '[2,3,4,5]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T012',
      TaskName: 'Real-time Chat System',
      Category: 'communication',
      Duration: 2,
      RequiredSkills: 'websockets,real-time,backend',
      PreferredPhases: '[3,4]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T013',
      TaskName: 'Content Management System',
      Category: 'cms',
      Duration: 3,
      RequiredSkills: 'cms,backend,database',
      PreferredPhases: '[2,3,4]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T014',
      TaskName: 'Search Functionality',
      Category: 'search',
      Duration: 1,
      RequiredSkills: 'search,elasticsearch,backend',
      PreferredPhases: '[4,5]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T015',
      TaskName: 'Email Notification System',
      Category: 'notification',
      Duration: 1,
      RequiredSkills: 'email,notification,backend',
      PreferredPhases: '[5]',
      MaxConcurrent: 3
    },
    {
      TaskID: 'T016',
      TaskName: 'Blockchain Integration',
      Category: 'blockchain',
      Duration: 3,
      RequiredSkills: 'blockchain,smart-contracts,security',
      PreferredPhases: '[4,5,6]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T017',
      TaskName: 'IoT Device Management',
      Category: 'iot',
      Duration: 2,
      RequiredSkills: 'iot,embedded,protocols',
      PreferredPhases: '[3,4]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T018',
      TaskName: 'Game Engine Development',
      Category: 'gaming',
      Duration: 4,
      RequiredSkills: 'game-development,c++,graphics',
      PreferredPhases: '[1,2,3,4]',
      MaxConcurrent: 2
    },
    {
      TaskID: 'T019',
      TaskName: 'AR/VR Experience',
      Category: 'ar-vr',
      Duration: 3,
      RequiredSkills: 'ar,vr,3d-modeling,unity',
      PreferredPhases: '[3,4,5]',
      MaxConcurrent: 1
    },
    {
      TaskID: 'T020',
      TaskName: 'Social Media Integration',
      Category: 'social',
      Duration: 1,
      RequiredSkills: 'social-media,api,integration',
      PreferredPhases: '[5,6]',
      MaxConcurrent: 3
    }
  ];
}