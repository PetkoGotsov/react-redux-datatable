import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'DisplayTitleTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'First Name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      key: 'surname',
    },
    {
      title: 'Email Address',
      key: 'email',
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'DisplayTitleTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table', // This title will display above the table
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'First Name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      key: 'surname',
    },
    {
      title: 'Email Address',
      key: 'email',
    },
  ],
};

const DataTable = () => (
    <DataTable
      tableSettings={tableSettings}
      apiLocation={apiLocation}
    />
);
`;

const DataTable = () => <Story sourceCode={sourceCode} tableSettings={tableSettings} />;

export default DataTable;
