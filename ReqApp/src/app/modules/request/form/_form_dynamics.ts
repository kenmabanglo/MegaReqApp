export const dynamic_form = [
    {
      type:'date',
      key: 'requirementDate',
      label: 'Required Date',
      placeholder: 'MM/DD/YYYY',
      requestTypes: ['RFP'],
      disabled: true
    },
    {
        type:'text',
        key: 'referenceAdb',
        label: 'Activity Name/Reference ADB',
        placeholder: '',
        requestTypes: ['RFP'],
        search: true,
        disabled: true
    },
    {
        type:'text',
        key: 'referenceRfp',
        label: 'RFP/Reference No.',
        placeholder: '',
        requestTypes: ['FL'],
        search: true,
        disabled: true
    },
    {
        type:'text',
        key: 'assignedTo',
        label: 'Assigned To',
        placeholder: '',
        requestTypes: ['RFA'],
        search: false,
        class:'full-width-field',
        disabled: true
    },
    {
        type:'text',
        key: 'assignedTo',
        label: 'To',
        placeholder: '',
        requestTypes: ['RFB'],
        search: false,
        class:'full-width-field',
        disabled: true
    },
    {
        type:'textarea',
        key: 'objective',
        label: 'Objectives & Justification',
        placeholder: '',
        requestTypes: ['ADB'],
        class:'full-width-field',
        disabled: true
    },
    {
        type:'textarea',
        key: 'objective',
        label: 'Reason',
        placeholder: '',
        requestTypes: ['RFB'],
        class:'full-width-field',
        disabled: true
    },
    {
        type:'textarea',
        key: 'description',
        label: 'Description',
        placeholder: '',
        requestTypes: ['ADB','RFP'],
        class:'full-width-field',
        disabled: true
    },
    {
        type:'textarea',
        key: 'description',
        label: 'For (Event / Activity Name)',
        placeholder: '',
        requestTypes: ['FL'],
        class:'full-width-field',
        disabled: true
    },
    {
        type:'text',
        key: 'supplierName',
        label: 'Supplier',
        placeholder: '',
        requestTypes: ['RS'],
        class:'full-width-field',
        search: true,
        disabled: true
    },
    {
        type:'hidden',
        key: 'supplierCode',
        label: 'Supplier',
        placeholder: '',
        requestTypes: ['RS'],
        class:'full-width-field',
        search: false,
        disabled: true
    },
    {
        type:'number',
        key: 'quantity',
        label: 'Qty',
        placeholder: '',
        requestTypes: [],
        disabled: true
    },
    {
        type:'number',
        key: 'cost',
        label: 'Cost',
        placeholder: '',
        requestTypes: [],
        disabled: true
    },
    {
        type:'number',
        key: 'extendedAmount',
        label: 'Amount of Fund Received:',
        placeholder: '',
        requestTypes: ['FL'],
        disabled: true
    },
    {
        type:'number',
        key: 'refundAmount',
        label: 'Amount for Return or Refund',
        placeholder: '',
        requestTypes: ['FL'],
        disabled: true
    },
    {
        type:'number',
        key: 'ewt',
        label: 'EWT',
        placeholder: '',
        requestTypes: ['RFP'],
        disabled: true
    },
  
    {
        type:'number',
        key: 'extendedAmount',
        label: 'Estimated Amount',
        placeholder: '',
        requestTypes: ['RFA','RFP'],
        disabled: true
    },
    {
        type:'text',
        key: 'payableTo',
        label: 'Make Payable To',
        placeholder: '',
        requestTypes: ['RFP'],
        class:'full-width-field',
        disabled: true
    }, 
    {
        type:'text',
        key: 'reference',
        label: 'Reference',
        placeholder: '',
        requestTypes: ['RS'],
        disabled: true
    },
    {
        type:'toggle',
        key: 'rstype',
        label: 'RS Type',
        placeholder: '',
        requestTypes: ['RS'],
        datas:[
            {name:'Service',value:'SER'},
            {name:'Deduction',value:'DED'},
            {name:'Replacement',value:'REP'},
        ],
        disabled: true
    },
    // {
    //     type:'checkbox',
    //     key: 'isReferral',
    //     label: 'Is this from Referral',
    //     placeholder: '',
    //     requestTypes: ['RFP'],
    //     disabled: true
    // },
    {
        type:'select',
        key: 'rfpSource',
        label: 'Source',
        placeholder: '',
        requestTypes: ['RFP'],
        datas: [{name: 'REFERRAL', value:'REF'},{name: 'PETTY CASH', value:'PETTY'}],
        disabled: true
    },
    {
        type:'select',
        key: 'requestItemsType',
        label: 'Items Type',
        placeholder: '',
        requestTypes: ['RTO'],
        datas: [{name: 'BIG APPS', value:'BIG'},{name: 'SMALL APPS', value:'SMALL'},{name: 'FURNITURE', value:'FUR'}],
        disabled: true
    }
];

export const dynamic_items = [
    {
        type:'text',
        key: 'itemCode',
        label: 'Barcode',
        placeholder: '',
        requestTypes: [], 
        search: true,
        disabled: true
    },
    {
        type:'number',
        key: 'onhand',
        label: 'Inventory On Hand',
        placeholder: '',
        requestTypes: ['RTO'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'description',
        label: 'Item Code/Description',
        placeholder: '',
        requestTypes: ['RFA','RFS','RS','RTO'], 
        search: true,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'description',
        label: 'Item Description',
        placeholder: '',
        requestTypes: ['FL'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'description',
        label: 'Model/Barcode',
        placeholder: '',
        requestTypes: ['RFB'], 
        search: true,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'remarks',
        label: 'Reference',
        placeholder: '',
        requestTypes: ['FL'], 
        search: false,
        disabled: true,
        decimal:false
    },  
    {
        type:'hidden',
        key: 'itemCode',
        label: '',
        placeholder: '',
        requestTypes: ['RS'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'number',
        key: 'quantity',
        label: 'Qty',
        placeholder: '',
        requestTypes: ['RFA','RS','RTO','RFB','RFS'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'status',
        label: 'Status',
        placeholder: '',
        requestTypes: ['RS'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'remarks',
        label: 'Remarks',
        placeholder: '',
        requestTypes: ['RS','RTO','RFS'], 
        search: false,
        disabled: true,
        decimal:false
    },   
 
    {
        type:'number',
        key: 'cost',
        label: 'Unit Cost',
        placeholder: '',
        requestTypes: [], //'RFS'
        search: false,
        disabled: true,
        decimal:true
    },
    {
        type:'number',
        key: 'totalCost',
        label: 'Total Cost',
        placeholder: '',
        requestTypes: [], 
        search: false,
        disabled: true,
        decimal: true
    },
    {
        type:'number',
        key: 'price',
        label: 'Unit Price',
        placeholder: '',
        requestTypes: [],//'RTO' 
        search: false,
        disabled: true,
        decimal:true
    },
    {
        type:'number',
        key: 'price',
        label: 'Amount',
        placeholder: '',
        requestTypes: ['FL'],//'RTO' 
        search: false,
        disabled: true,
        decimal:true
    },
    {
        type:'number',
        key: 'totalPrice',
        label: 'Total Amount',
        placeholder: '',
        requestTypes: [],//'RTO' 'RFS'
        search: false,
        disabled: true,
        decimal:true
    },
    
    {
        type:'number',
        key: 'totalPrice',
        label: 'Estimated Amount',
        placeholder: '',    
        requestTypes: ['ADB'],
        disabled: true
    }, 
    {
        type:'button',
        key: 'serialNo',
        label: 'Serial No',
        placeholder: '',
        requestTypes: ['RS'], 
        search: true,
        disabled: true,
        decimal:false
    },
    {
        type:'select',
        key: 'locationCode',
        label: 'Location',
        placeholder: '',
        requestTypes: ['RS'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'hidden',
        key: 'supplierCode',
        label: 'Supplier',
        placeholder: '',
        requestTypes: ['RTO'], 
        search: false,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'supplierName',
        label: 'Supplier',
        placeholder: '',
        requestTypes: ['RTO','ADB'], 
        search: true,
        disabled: true,
        decimal:false
    },
    {
        type:'text',
        key: 'description',
        label: 'Description',
        placeholder: '',
        requestTypes: ['ADB'], 
        search: false,
        disabled: true,
        decimal:false
    },
];

export const approvers = [
    {
        type:'text',
        key: 'approver',
        label: 'Approver',
        placeholder: '',
        requestTypes: ['RFP','RFS','RFA','RS','RTO','ADB','RFB','FL'],  
        search: true,
        disabled: true
    },
    {
        type:'text',
        key: 'processedByAp',
        label: 'Processed By AP',
        placeholder: '',
        requestTypes: ['RFP'], 
        search: false,
        disabled: true
    },
    {
        type:'text',
        key: 'liquidatedBy',
        label: 'Liquidated By',
        placeholder: '',
        requestTypes: ['RFP'], 
        search: false,
        disabled: true
    },
    {
        type:'text',
        key: 'liquidatedBy',
        label: 'Requested By',
        placeholder: '',
        requestTypes: ['RFB'], 
        search: false,
        disabled: true
    }
    
];