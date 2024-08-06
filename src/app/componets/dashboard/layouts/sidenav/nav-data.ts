import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: 'proposeidea',
    icon: 'fa fa-lightbulb',
    label: 'Propose Idea',
    role: 'admin,null,Operator,Team Leader,Committe'
  },
  {
    routeLink: 'proposeidea',
    icon: 'fa fa-lightbulb',
    label: 'Propose Ideas',
    role: 'TeamLeader,null'
  },
  {
    routeLink: 'proposeidea',
    icon: 'fa fa-lightbulb',
    label: 'My Teams Ideas',
    role: 'TeamLeader,null'
  },
  {
    routeLink: 'managerresources',
    icon: 'fa fa-users',
    label: 'Manage Resources',
    role: 'admin',
    expanded: false,
    items: [
      { routeLink: 'managerresources/users', label: 'Users' },
      { routeLink: 'managerresources/team-leader', label: 'Team Leaders' },
      { routeLink: 'managerresources/committees', label: 'Committees' },
      // { routeLink: 'managerresources/supervisor', label: 'Supervisor' }
    ]
  },
  {
    routeLink: 'masterdata',
    icon: 'fa fa-database',
    label: 'Master Data',
    role: 'admin',
    expanded: true,
    items: [
      { routeLink: 'masterdata/plants', label: 'Plants' },
      { routeLink: 'masterdata/departement', label: 'Departements' },
      { routeLink: 'masterdata/areas', label: 'Areas' },
      { routeLink: 'masterdata/project', label: 'Projects' },
      { routeLink: 'masterdata/machines', label: 'Machines' },
      { routeLink: 'masterdata/roles', label: 'Roles' },
      { routeLink: 'masterdata/titles', label: 'Titles' },
      { routeLink: 'masterdata/status', label: 'Status' },
      { routeLink: 'masterdata/impact', label: 'Impacts' }
    ]
  },
  {
    routeLink: 'Approval_committee',
    icon: 'fa fa-check-circle',
    label: 'Approval Committee',
    role: 'admin,Committe',
    expanded: true,
    items: [
      { routeLink: 'Approval_committee/Committee', label: 'Committee' }
    ]
  },
  {
    routeLink: 'Approval_teamleader',
    icon: 'fa fa-check-circle',
    label: "My Team's Ideas",
    role: 'admin,Team Leader',
    expanded: true,
    items: [
      { routeLink: 'Approval_teamleader/Team_Leader', label: "My Team's Ideas" }
    ]
  }
];