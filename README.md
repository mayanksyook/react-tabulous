# Syook-Table 🎉

```js
import Table from 'syook-table-v5';
import moment from 'moment';

...

tableConfig = [
  {
    heading: 'Name',
    column: 'name',
    type: 'String',
    cell: ({ row }) => row.name,
    isSortable: true,
    isSearchable: true,
    isFilterable: true,
  },
  {
    heading: 'Description',
    column: 'description',
    type: 'String',
    cell: ({ row }) => row.description,
    isSortable: true,
    isSearchable: true,
    isFilterable: true,
  },
  {
    heading: 'Category',
    column: 'category',
    type: 'Select',
    cell: ({ row }) => row.category,
    options: [{ value: 'Electrical', label: 'Electrical' }, { value: 'Mechanical', label: 'Mechanical' }],
    isSortable: true,
    isSearchable: true,
    isFilterable: true,
  },
  {
    heading: 'Availability',
    column: 'availability',
    type: 'Boolean'
    cell: ({ row }) => row.availability ? 'Yes' : 'No',
    isSortable: true,
    isSearchable: true,
  },
  {
    heading: 'Created at',
    column: 'createdAt',
    type: 'Date'
    cell: ({ row }) => moment(row.createdAt).formatOf('DD-MMM-YYYY hh:mm A'),
    isSortable: true,
    isSearchable: true,
  }
];

actionConfig = [
  {
    action: 'Show',
    function: this.onShow,
    icon: 'eye',
    show: _row => true,
  },
  {
    action: 'Edit',
    function: this.onShow,
    icon: 'pencil',
    show: _row => true,
  },
  {
    action: 'Delete',
    show: _row => true,
    function: this.onDelete,
    icon: 'trash',
  },
];

...

<Table
  actionConfig={actionConfig}
  bulkActions={[{ action: 'delete', function: onDelete }]}
  data={this.props.objects}
  includeAction={true}
  mandatoryFields={['Name']}
  name='Menu Items'
  records={tableConfig}
/>

...
```

a. Available Column Options 

| Command | Description | Type |
| --- | --- | --- |
| `headerName` | Name of Column to be shown in header | String |
| `field` | field name as in the data | String |
| `type` | type of the field | String |
| `cell` | returns the value to be shown in the column cell| Function |
| `isSortable` | is column sortable| Boolean |
| `isSearchable` | is column searchable| Boolean |
| `isFilterable` | is column filterable| Boolean |
| `omitInHideList` | should the column be omitted in table and show/hide dropdown | Boolean |
| `options` | array of options if the type is MultiSelect or Single Select | Boolean |


b. Action Config Options : actions will be shown in action column in table

| Command | Description | Type |
| --- | --- | --- |
| `isVisible` | Function which returns if the action is visible or not | Function |
  `isDisabled` | Function which returns if the action is disabled or not | Function |
  `function` | Function to be executed on action event | Function |
  `icon` | Icon name to represent the action | Function |
  `name` | Name of action | string
  `color` | color of action component | string
  `iconColor` | color of icon | string
  `size` | size of icon | string
  `inverted` | to enable inverted behaviour of action element | function 
  `iconInverted` | to enable inverted behaviour of icon | boolean
  `className` | any custom classname to be applied for action element | string
  `iconClassName` | any custom classname to be applied for icon| string
  `hasCustomComponent` | if the action is any custom component other than button | boolean
  `customComponent` | the component that needs to returned if the action has custom component | function 
