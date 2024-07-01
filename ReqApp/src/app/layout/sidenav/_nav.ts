import { IMenu } from "./sidenav_item.interface";
export const sidenavItems: IMenu[] = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'dashboard',
        color: '#D32F2F',
        role: 'Admin'
    }, 
    {
        name: 'Requests',
        role: 'User',
        children: [
            {
                name: 'Create Request',
                url: '/request/form-entry',
                icon: 'note_add',
                color: '#AB47BC',
                role: 'User'
            },
            {
                name: 'History',
                url: '/request/request-history',
                icon: 'format_list_numbered',
                color: '#651FFF',
                role: 'User'
            },
            // {
            //     name: 'TRF',
            //     url: '/request/talent-requisition',
            //     icon: 'note_add',
            //     color: '#AB47BC',
            //     role: 'User'
            // },
            //  {
            //     name: 'FUND LIQ.',
            //     url: '/request/fund-liquidation',
            //     icon: 'note_add',
            //     color: '#AB47BC',
            //     role: 'User'
            // },
        ],
    }, 
    {
        name: 'Approved Requests',
        role: 'User',
        children: [
            {
                name: 'Request List',
                url: '/viewer/approved',
                icon: 'format_list_numbered_rtl',
                color: '#E040FB',
                role: 'User'
            },
            {
                name: ' Closed',
                url: '/viewer/close-rfp',
                icon: 'lock',
                color: '#dc3545',
                role: 'User'
            }
        ]
    },
    {
        name: 'Approvals',
        role: 'User',
        children: [
            {
                name: 'Monitoring',
                url: '/approver/approval-monitoring',
                icon: 'check_circle',
                color: '#FF4081',
                role: 'User'
            },
            {
                name: 'Approved',
                url: '/approver/approval-history',
                icon: 'format_list_numbered_rtl',
                color: '#E040FB',
                role: 'User'
            },
            {
                name: 'Rejected',
                url: '/approver/rejected-history',
                icon: 'block',
                color: '#F44336',
                role: 'User'
            }
        ]
    },
    {
        name: 'Account',
        role: 'User',
        children: [
            {
                name: 'Profile',
                url: '/master/user-profile',
                icon: 'account_circle',
                color: '#112F56',
                role: 'User'
            },
            // {
            //     name: 'Change Password',
            //     url: '/master/change-password',
            //     icon: 'key',
            //     color: '#f44336',
            //     role: 'User'
            // }
        ]
    },
     // Master Files
    {
        name: 'Master Files',
        role: 'Admin',
        children: [ 
        {
            name: 'User Master',
            url: '/master/user-list',
            icon: 'assignment_ind',
            color: '#007C32'
        },
        {
            name: 'User Activation',
            url: '/master/user-list/inactive',
            icon: 'assignment_turned_in',
            color: '#7c004a'
        },
        {
            name: 'User Approver',
            url: '/master/user-approver',
            icon: 'assignment_turned_in',
            color: '#03A9F4'
        },
        {
            name: 'User Branches',
            url: '/master/user-branch',
            icon: 'person_pin_circle',
            color: '#03A9F4'
        }
    ]},    

]
