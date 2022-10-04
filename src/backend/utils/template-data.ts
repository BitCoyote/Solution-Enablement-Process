import {
  KnockoutFollowupTemplate,
  KnockoutFollowupType,
  KnockoutScreenTemplate,
} from '../../shared/types/Knockout';
import {
  TaskDependencyTemplate,
  TaskPhase,
  TaskStatus,
  TaskTemplate,
} from '../../shared/types/Task';
import {
  DataFieldOptionTemplate,
  DataFieldTemplate,
  DataFieldType,
} from '../../shared/types/DataField';
import { DepartmentID } from '../../shared/types/Department';
/**
 *  The knockout question data will be hardcoded here for the MVP of this project.
 */

const getAllTaskTemplatesByDeptIDs = (
  taskTemplates: TaskTemplate[],
  deptNames: DepartmentID[]
) => {
  return taskTemplates.filter((taskTemplate) =>
    deptNames.includes(taskTemplate.departmentID as DepartmentID)
  );
};

export const taskTemplates: TaskTemplate[] = [
  {
    id: 1,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.legal,
    review: true,
    name: 'Please provide more more detail around data that will be in scope for this review.',
    defaultAssignee: 'requestor',
    description: `
    For help with my review, please provide:

  1. Describe the software (what should we call this? – software, system, what?), its purpose
  
  2. Is there a vendor involved with this software? 
  Vendor is MCC. 
   
  3. Will any Constellation data be shared with the vendor through use of this software?
  
  4. Does the software allow access to other Constellation databases or sources of information?
   
  5. If yes to Question 3 or 4, what type of data?
  
  6. Will any export controlled information (ECI) be inserted into or accessible from the software?
  
  If there is ECI, please answer these questions, as well:
  7. If ECI is involved, explain how data is managed (explain carefully how it  is shared or not shared with the vendor) and how and where any data used in the software is stored.
  
  8. Is the vendor a foreign company vendor?
  
  9. What is the nationality of the developers/support personnel and where are the vendor personnel located (what country)?
  
  10. If data is shared with the vendor, where is it stored?  On prem?  In a cloud?  Which cloud?
  
  Attachments of data samples or field descriptions are also welcome.`,
  },
  {
    id: 2,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.legal,
    review: false,
    name: 'Please update the APM data classification and regulatory information.',
  },
  {
    id: 3,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.po,
    review: false,
    name: 'Please update the APM data classification and regulatory information.',
  },
  {
    id: 4,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.sec,
    review: true,
    name: 'Please have Vendor complete the Cloud Security Requirements Matrix (CSRM)',
    defaultAssignee: 'requestor',
    description: `Please download the most recent CSRM from <CSRM URL>. You will need to complete the first tab. Then Send the CSRM to complete the remaining questions. Please tell them not to spend more than about a minute on each question. If there are problems with any answers we will circle back with the vendor after the Security Review. Please attach the completed CSRM to this task when ready.`,
  },
  {
    id: 5,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.sec,
    review: true,
    name: 'Please complete the Project Security Questionaire (PSQ)',
    defaultAssignee: 'requestor',
    description: `Please download the most recent PSQ from <PSQ URL>. You can attached the completed PSQ to this task when ready.`,
  },
  {
    id: 6,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.sec,
    review: false,
    name: 'Please create a Security Exception for this request. See Detail for more information.',
    defaultAssignee: 'requestor',
    description: `Security Exceptions are submitted in the ServiceNow system. <url> <Free form>`,
  },
  {
    id: 7,
    phase: TaskPhase.design,
    departmentID: DepartmentID.sec,
    review: true,
    name: 'Please provide Security with the device to perform penetration testing.',
    defaultAssignee: 'requestor',
  },
  {
    id: 8,
    phase: TaskPhase.design,
    departmentID: DepartmentID.ea,
    review: true,
    name: 'Please provide a Level 2 (Conceptial/Logical) Diagram',
    description:
      'Please provide a logical diagram depicting conceptual interactions with other applications systems and shared services. Please attach the diagram to this task when complete. See our resources on creating architecture diagrams (url) for sample diagrams and insturctions.',
    defaultAssignee: 'requestor',
  },
  {
    id: 9,
    phase: TaskPhase.design,
    departmentID: DepartmentID.ea,
    review: true,
    name: 'Please provide a Level 3 (Physical) Diagram',
    description:
      'Please provide  a physical diagram depicting details of physical compenents and infrastructure supporting the project deployment. Please attach the diagram to this task when complete. See our resources on creating architecture diagrams (url) for sample diagrams and insturctions. ',
    defaultAssignee: 'requestor',
  },
  {
    id: 10,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Please update APL. See Details for more information.',
  },
  {
    id: 11,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Engage Production Readiness Process to determine if a Production Readiness Review is required.',
    description:
      'See Production Readiness Engagement URL <url> to determine requirements for presenting this effort for Production Readiness Review.',
    defaultAssignee: 'requestor',
  },
  {
    id: 12,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Review request with the DR Team',
    description:
      'Contact the DR Team <DR Team Distribution List> to verify DR requirements are met for this request.',
    defaultAssignee: 'requestor',
  },
  {
    id: 13,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Review request with the Application Monitoring Team',
    description:
      'Contact the Application Monitoring Team <App Mon Team Distribution List> to assure appropriate monitoring is in place for this request. ',
    defaultAssignee: 'requestor',
  },
  {
    id: 14,
    phase: TaskPhase.implement,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Map/update Production Infrastructure in ServiceNow CMDB',
    description:
      'Map all Production Ingrastructure Objects in ServiceNow CMDB (Including IaaS/PaaS)',
    defaultAssignee: 'requestor',
  },
  {
    id: 15,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.sa,
    review: false,
    name: 'Solution Architect Review Complete',
  },
  {
    id: 16,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.po,
    review: false,
    name: 'Portfolio Owner Review Complete',
  },
  {
    id: 17,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.legal,
    review: false,
    name: 'Legal Review Complete',
  },
  {
    id: 18,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.tps,
    review: false,
    name: 'Review SRA',
  },
  {
    id: 19,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.tps,
    review: false,
    name: 'TPS Review Complete',
  },
  {
    id: 20,
    phase: TaskPhase.design,
    departmentID: DepartmentID.supply,
    review: false,
    name: 'Supply Review Complete',
  },
  {
    id: 21,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.sec,
    review: false,
    name: 'Initiate Review Complete',
  },
  {
    id: 22,
    phase: TaskPhase.design,
    departmentID: DepartmentID.sec,
    review: false,
    name: 'Design Review Complete',
  },
  {
    id: 23,
    phase: TaskPhase.initiate,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Initiate Review Complete',
  },
  {
    id: 24,
    phase: TaskPhase.design,
    departmentID: DepartmentID.ea,
    review: false,
    name: 'Design Review Complete',
  },
  {
    id: 25,
    phase: TaskPhase.design,
    departmentID: DepartmentID.ncs,
    review: false,
    name: 'Design Review Complete',
  },
];

export const taskDependencyTemplates: TaskDependencyTemplate[] = [
  {
    dependentTaskTemplateID: 4, // Please have Vendor complete the Cloud Security Requirements Matrix (CSRM)
    taskTemplateID: 17, // Legal review complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 10, // update apl
    taskTemplateID: 22, // Design review complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 10, // update apl
    taskTemplateID: 24, // Design review complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 10, // update apl
    taskTemplateID: 25, // Design review complete (NCS)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 11, // production readiness
    taskTemplateID: 22, // Design review complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 11, // production readiness
    taskTemplateID: 24, // Design review complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 11, // production readiness
    taskTemplateID: 25, // Design review complete (NCS)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 12, // DR team review
    taskTemplateID: 22, // Design review complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 12, // DR team review
    taskTemplateID: 24, // Design review complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 12, // DR team review
    taskTemplateID: 25, // Design review complete (NCS)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 13, // app monitoring
    taskTemplateID: 22, // Design review complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 13, // app monitoring
    taskTemplateID: 24, // Design review complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 13, // app monitoring
    taskTemplateID: 25, // Design review complete (NCS)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 14, // Update ServiceNow
    taskTemplateID: 22, // Design review complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 14, // Update ServiceNow
    taskTemplateID: 24, // Design review complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 14, // Update ServiceNow
    taskTemplateID: 25, // Design review complete (NCS)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 18, // Review SRA
    taskTemplateID: 17, // legal review complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 19, // TPS Review Complete
    taskTemplateID: 18, // Review SRA
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 20, // Supply Review Complete
    taskTemplateID: 21, // Initiate Review Complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 20, // Supply Review Complete
    taskTemplateID: 23, // Initiate Review Complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 20, // Supply Review Complete
    taskTemplateID: 18, // Review SRA
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 20, // Supply Review Complete
    taskTemplateID: 4, // Please have Vendor complete the Cloud Security Requirements Matrix (CSRM)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 21, // Initiate Review Complete (Security)
    taskTemplateID: 17, // Legal Review complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 21, // Initiate Review Complete (Security)
    taskTemplateID: 19, // TPS Review complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 21, // Initiate Review Complete (Security)
    taskTemplateID: 4, // Please have Vendor complete the Cloud Security Requirements Matrix (CSRM)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 21, // Initiate Review Complete (Security)
    taskTemplateID: 5, // Please complete the Project Security Questionaire (PSQ)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 22, // Design Review Complete (Security)
    taskTemplateID: 21, // Initiate Review Complete (Security)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 22, // Design Review Complete (Security)
    taskTemplateID: 7, // Please provide Security with the device to perform penetration testing.
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 23, // Initiate Review Complete (EA)
    taskTemplateID: 16, // Portfolio Owner Review Complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 23, // Initiate Review Complete (EA)
    taskTemplateID: 17, // Legal Review Complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 23, // Initiate Review Complete (EA)
    taskTemplateID: 19, // TPS Review Complete
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 24, // Design Review Complete (EA)
    taskTemplateID: 23, // Initiate Review Complete (EA)
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 24, // Design Review Complete (EA)
    taskTemplateID: 8, // Please provide a Level 2 (Conceptial/Logical) Diagram
    status: TaskStatus.complete,
  },
  {
    dependentTaskTemplateID: 24, // Design Review Complete (EA)
    taskTemplateID: 9, // Please provide a Level 3 (Physical) Diagram
    status: TaskStatus.complete,
  },
] // automatically apply ids since nothing points to the TaskDependencyTemplates
  .map((f, idx) => ({ ...f, id: idx + 1 }));

export const knockoutScreenTemplates: KnockoutScreenTemplate[] = [
  {
    id: 1,
    name: "Let's get started! What kind of request is this?",
    description:
      'Choose the area that best fits the item you need to put through the SEP process.',
    starter: true,
  },
  {
    id: 2,
    name: "Installed Software: Let's get a little more specific.",
    description: 'Choose the type of software that best fits.',
  },
  {
    id: 3,
    name: 'Desktop: What are the details?',
  },
  {
    id: 4,
    name: 'Product Renewal/Extension: What are the details?',
  },
  {
    id: 5,
    name: 'New Ventures: What are the details?',
  },
  {
    id: 6,
    name: 'Cloud: Which kind of cloud are we talking about here?',
  },
  {
    id: 7,
    name: "Constellation Cloud: Let's get a little more specific.",
    description: 'Choose the type of service that best fits.',
  },
  {
    id: 8,
    name: "External Cloud: Let's get a little more specific.",
    description: 'Choose the type of service that best fits.',
  },
  {
    id: 9,
    name: "Great! Let's get some more information.", // screen for SaaS, PaaS, SalesForce, and App Exchange
  },
  {
    id: 10,
    name: "IaaS: Great! Let's get some more information.",
  },
  {
    id: 11,
    name: 'Mobile: What are the details?',
  },
  {
    id: 12,
    name: "Integration: Let's get a little more specific.",
  },
  {
    id: 13,
    name: "Hardware: Let's get a little more specific.",
  },
  {
    id: 14,
    name: "Identity and Access Management (IAM): Let's get a little more specific.",
  },
];
export const dataFieldTemplates: DataFieldTemplate[] = [
  {
    id: 1,
    name: 'Request Area',
    description: 'Choose an area for your SEP.',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 1, // Let's get started! What kind of request is this?
    required: true,
  },
  {
    id: 2,
    name: 'Installed Software Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 2, // Installed Software: Let's get a little more specific.
    required: true,
  },
  {
    id: 3,
    name: 'Does the desktop software send data externally (outside the Constellation Network)?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 3, // Desktop: What are the details?
    required: false,
  },
  {
    id: 4,
    name: 'Was the Application internally developed?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 3, // Desktop: What are the details?
    required: true,
  },
  {
    id: 5,
    name: 'Are there any changes to configuration or data schema?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 4, // Product Renewal/Extension: What are the details?
    required: false,
  },
  {
    id: 6,
    name: 'Will this interface with any systems on the Constellation Network?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 5, // New Ventures: What are the details?
    required: false,
  },
  {
    id: 7,
    name: 'Cloud Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 6, // Cloud: Which kind of cloud are we talking about here?
    required: true,
  },
  {
    id: 8,
    name: 'Service Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 7, // Constellation Cloud: Let's get a little more specific.
    required: true,
  },
  {
    id: 9,
    name: 'Service Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 8, // External Cloud: Let's get a little more specific.
    required: true,
  },
  {
    id: 10,
    name: 'Is this service currently in use by other approved applications with the same data classification?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 9, // screen for SaaS, PaaS, SalesForce, and App Exchange
    required: false,
  },
  {
    id: 11,
    name: 'Will it require additional licensing?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 9, // screen for SaaS, PaaS, SalesForce, and App Exchange
    required: false,
  },
  {
    id: 12,
    name: 'Is this a Constellation Standard IaaS Configuration?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 10, // IaaS
    required: false,
  },
  {
    id: 13,
    name: 'Will it require additional licensing?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 10, // IaaS
    required: false,
  },
  {
    id: 14,
    name: 'Does this align to the Mobile 2.0 Strategy?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 11, // Mobile
    required: false,
  },
  {
    id: 15,
    name: 'Does the application send data outside of the Constellation network?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 11, // Mobile
    required: false,
  },
  {
    id: 16,
    name: 'Does the integration use one of the standard integration platforms?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 12, // Integration
    required: false,
  },
  {
    id: 17,
    name: 'Is the destination data classification equal or greater than the source data classification?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 12, // Integration
    required: false,
  },
  {
    id: 18,
    name: 'Will this require additional licensing?',
    type: DataFieldType.yesNo,
    knockoutScreenTemplateID: 12, // Integration
    required: false,
  },
  {
    id: 19,
    name: 'Hardware Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 13, // Hardware
    required: true,
  },
  {
    id: 20,
    name: 'IAM Type',
    type: DataFieldType.select,
    knockoutScreenTemplateID: 14, // IAM
    required: true,
  },
];
export const dataFieldOptionTemplates: DataFieldOptionTemplate[] = [
  {
    id: 1,
    dataFieldTemplateID: 1, // Request Area
    value: 'Product Renewal/Extension',
  },
  {
    id: 2,
    dataFieldTemplateID: 1, // Request Area
    value: 'New Ventures',
  },
  {
    id: 3,
    dataFieldTemplateID: 1, // Request Area
    value: 'Installed Software',
  },
  {
    id: 4,
    dataFieldTemplateID: 1, // Request Area
    value: 'Cloud',
  },
  {
    id: 5,
    dataFieldTemplateID: 1, // Request Area
    value: 'Mobile',
  },
  {
    id: 6,
    dataFieldTemplateID: 1, // Request Area
    value: 'Integration',
  },
  {
    id: 7,
    dataFieldTemplateID: 1, // Request Area
    value: 'Hardware',
  },
  {
    id: 8,
    dataFieldTemplateID: 1, // Request Area
    value: 'Identity and Access Management (IAM)',
  },
  {
    id: 9,
    dataFieldTemplateID: 1, // Request Area
    value: 'Network (B2B VPN)',
  },
  {
    id: 10,
    dataFieldTemplateID: 1, // Request Area
    value: 'Hosting Migration',
  },
  {
    id: 11,
    dataFieldTemplateID: 1, // Request Area
    value: 'R&D',
  },
  {
    id: 12,
    dataFieldTemplateID: 1, // Request Area
    value: 'Consulting or Professional Services',
  },
  {
    id: 13,
    dataFieldTemplateID: 2, // Installed Software Type
    value: 'Desktop',
  },
  {
    id: 14,
    dataFieldTemplateID: 2, // Installed Software Type
    value: 'On-Prem Server',
  },
  {
    id: 15,
    dataFieldTemplateID: 2, // Installed Software Type
    value: 'IaaS',
  },
  {
    id: 16,
    dataFieldTemplateID: 7, // Cloud Type
    value: 'Constellation Cloud (Azure)',
  },
  {
    id: 17,
    dataFieldTemplateID: 7, // Cloud Type
    value: 'External Cloud',
  },
  {
    id: 18,
    dataFieldTemplateID: 8, // Service Type (Constellation Cloud)
    value: 'SaaS',
  },
  {
    id: 19,
    dataFieldTemplateID: 8, // Service Type (Constellation Cloud)
    value: 'PaaS',
  },
  {
    id: 20,
    dataFieldTemplateID: 8, // Service Type (Constellation Cloud)
    value: 'IaaS',
  },
  {
    id: 21,
    dataFieldTemplateID: 9, // Service Type (External Cloud)
    value: 'SaaS',
  },
  {
    id: 22,
    dataFieldTemplateID: 9, // Service Type (External Cloud)
    value: 'PaaS',
  },
  {
    id: 23,
    dataFieldTemplateID: 9, // Service Type (External Cloud)
    value: 'IaaS',
  },
  {
    id: 24,
    dataFieldTemplateID: 9, // Service Type (External Cloud)
    value: 'Salesforce',
  },
  {
    id: 25,
    dataFieldTemplateID: 9, // Service Type (External Cloud)
    value: 'App Exchange',
  },
  {
    id: 26,
    dataFieldTemplateID: 19, // Hardware Type
    value: 'New Server',
  },
  {
    id: 27,
    dataFieldTemplateID: 19, // Hardware Type
    value: 'IoT',
  },
  {
    id: 28,
    dataFieldTemplateID: 20, // IAM Type
    value: 'Citrix or vendor access',
  },
  {
    id: 29,
    dataFieldTemplateID: 20, // IAM Type
    value: 'Single Sign-on',
  },
  {
    id: 30,
    dataFieldTemplateID: 20, // IAM Type
    value: 'External Data Sharing',
  },
];
export const knockoutFollowupTemplates: KnockoutFollowupTemplate[] = [
  /*
   ** KNOCKOUT FOLLOWUPS
   */
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Installed Software',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 2,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Cloud',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 6,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Mobile',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 11,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Integration',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 12,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Hardware',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 13,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Identity and Access Management (IAM)',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 14,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'New Ventures',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 5,
  },
  {
    dataFieldTemplateID: 1, // Request Area
    value: 'Product Renewal/Extension',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 4,
  },
  {
    dataFieldTemplateID: 7, // Cloud Type
    value: 'Constellation Cloud (Azure)',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 7,
  },
  {
    dataFieldTemplateID: 7, // Cloud Type
    value: 'External Cloud',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 8,
  },
  {
    dataFieldTemplateID: 8, // Service Type (Constellation)
    value: 'SaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 8, // Service Type (Constellation)
    value: 'PaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 8, // Service Type (Constellation)
    value: 'IaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 10,
  },
  {
    dataFieldTemplateID: 9, // Service Type (External)
    value: 'SaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 9, // Service Type (External)
    value: 'PaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 9, // Service Type (External)
    value: 'IaaS',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 10,
  },
  {
    dataFieldTemplateID: 9, // Service Type (External)
    value: 'Salesforce',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 9, // Service Type (External)
    value: 'App Exchange',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 9,
  },
  {
    dataFieldTemplateID: 2, // Installed Software Type
    value: 'Desktop',
    followupType: KnockoutFollowupType.KnockoutScreen,
    followupID: 3,
  },

  /*
   ** TASK FOLLOWUPS
   */
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.po,
    DepartmentID.sec,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 3, // Does the desktop software send data externally (outside the Constellation Network)?
    value: false,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [DepartmentID.tps]).map(
    (taskTemplate) => ({
      dataFieldTemplateID: 4, // Was the Application internally developed?
      value: false,
      followupType: KnockoutFollowupType.Task,
      followupID: taskTemplate.id,
    })
  ),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.legal,
    DepartmentID.tps,
    DepartmentID.sec,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 5, // Are there any changes to configuration or data schema?
    value: false,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.legal,
    DepartmentID.tps,
    DepartmentID.sec,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 6, // Will this interface with any systems on the Constellation Network?
    value: false,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.legal,
    DepartmentID.tps,
    DepartmentID.sec,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 6, // Will this interface with any systems on the Constellation Network?
    value: false,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [DepartmentID.sa]).map(
    (taskTemplate) => ({
      dataFieldTemplateID: 10, // Is this service currently in use by other approved applications with the same data classification?
      value: true,
      followupType: KnockoutFollowupType.Task,
      followupID: taskTemplate.id,
    })
  ),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.po,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 11, // Will it require additional licensing?
    value: true,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [DepartmentID.sa]).map(
    (taskTemplate) => ({
      dataFieldTemplateID: 12, // Is this a Constellation Standard IaaS Configuration??
      value: true,
      followupType: KnockoutFollowupType.Task,
      followupID: taskTemplate.id,
    })
  ),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.po,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 13, // Will it require additional licensing? (IaaS)
    value: true,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [DepartmentID.sa]).map(
    (taskTemplate) => ({
      dataFieldTemplateID: 14, // Does this align to the Mobile 2.0 Strategy?
      value: true,
      followupType: KnockoutFollowupType.Task,
      followupID: taskTemplate.id,
    })
  ),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.po,
    DepartmentID.supply,
    DepartmentID.tps,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 15, // Does the application send data outside of the Constellation network?
    value: true,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.sa,
    DepartmentID.po,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 16, // Does the integration use one of the standard integration platforms?
    value: true,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.sa,
    DepartmentID.po,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 17, // Is the destination data classification equal or greater than the source data classification?
    value: true,
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [DepartmentID.supply]).map(
    (taskTemplate) => ({
      dataFieldTemplateID: 18, // Will this require additional licensing? (Integration)
      value: true,
      followupType: KnockoutFollowupType.Task,
      followupID: taskTemplate.id,
    })
  ),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.supply,
    DepartmentID.sec,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 20, // IAM Type
    value: 'Citrix or vendor access',
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.sa,
    DepartmentID.sec,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 20, // IAM Type
    value: 'Single Sign-on',
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.legal,
    DepartmentID.sec,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 20, // IAM Type
    value: 'External Data Sharing',
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
  ...getAllTaskTemplatesByDeptIDs(taskTemplates, [
    DepartmentID.sa,
    DepartmentID.sec,
    DepartmentID.po,
    DepartmentID.supply,
  ]).map((taskTemplate) => ({
    dataFieldTemplateID: 1, // Request Area
    value: 'Network (B2B VPN)',
    followupType: KnockoutFollowupType.Task,
    followupID: taskTemplate.id,
  })),
]
  // automatically apply ids since nothing points to the KnockoutFollowupTemplates
  .map((f, idx) => ({ ...f, id: idx + 1 }));
