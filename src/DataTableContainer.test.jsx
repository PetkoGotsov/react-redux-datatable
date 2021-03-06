import React from 'react';
import 'babel-polyfill';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { DataTableContainer } from './DataTableContainer';
import LoadingGif from './LoadingGif/LoadingGif';

const testTableSettings = {
  tableID: 'ExampleDataTable',
  wrapperType: 'section',
  displayTitle: 'Requests Table',
  keyField: 'request_id',
  defaultSort: ['request_id', 'desc'],
  minWidth: 880,
  useLocalStorage: true,
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '=' },
      width: 74,
    },
    {
      title: 'User ID',
      key: 'user_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '=' },
      width: 74,
      export: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      width: 90,
    },
    {
      title: 'Last Name',
      key: 'surname',
      width: 90,
    },
    {
      title: 'Email Address',
      key: 'email',
      width: 164,
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      disableSearchAll: true,
      width: 120,
    },
    {
      title: 'Type',
      key: 'type',
      filter: 'SelectFilter',
      filterOptions: {
        Add: 'Add',
        Amend: 'Amend',
        Remove: 'Remove',
      },
    },
    {
      title: 'System',
      key: 'system_type',
      filter: 'SelectFilter',
      filterOptions: {
        training: 'training',
        staging: 'staging',
        production: 'production',
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      searchable: false,
      sortable: false,
      export: false,
    },
  ],
};

describe('<DataTableContainer>', () => {
  it('should call componentDidMount', () => {
    sinon.spy(DataTableContainer.prototype, 'componentDidMount');
    mount(<DataTableContainer dispatch={() => {}} tableSettings={testTableSettings} apiLocation="fake/location" />);
    expect(DataTableContainer.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  let Component;
  beforeEach(() => {
    Component = mount(
      <DataTableContainer dispatch={() => {}} tableSettings={testTableSettings} apiLocation="fake/location" />,
    );
  });

  it('should render', () => {
    expect(Component).to.have.length(1);
  });

  it('should display pagination with 0 results', () => {
    expect(Component.find('.react-bootstrap-table-pagination').text()).contains('Showing 0 to 0 of 0 Results');
  });

  it('should display a section toolbar title', () => {
    expect(
      Component.find('.section-toolbar-title')
        .first()
        .text(),
    ).to.equal('Requests Table');
  });

  it('should display a Fullscreen toggle', () => {
    expect(
      Component.find('.section-toolbar-fullscreen')
        .first()
        .text(),
    ).to.equal('Fullscreen');
  });

  it('should display a LoadingGif', () => {
    expect(Component.contains(<LoadingGif />)).to.equal(true);
  });

  it('should toggle full screen when clicking Toggle Fullscreen', () => {
    expect(Component.find('.section-isFullscreen')).to.have.length(0);
    Component.find('.section-toolbar-fullscreen')
      .first()
      .simulate('click');
    expect(Component.find('.section-isFullscreen')).to.have.length(1);
    Component.find('.section-toolbar-fullscreen')
      .first()
      .simulate('click');
    expect(Component.find('.section-isFullscreen')).to.have.length(0);
  });

  describe('The table data has loaded', () => {
    beforeEach(() => {
      Component.setProps({
        DataTableData: {
          ExampleDataTable: {
            fetched: true,
          },
        },
      });
    });

    it('should NOT display a LoadingGif', () => {
      expect(Component.contains(<LoadingGif />)).to.equal(false);
    });
  });

  it('should refresh the table on refresh click', () => {
    expect(Component.state().lastRefresh).to.equal(0);
    Component.find('.refresh-icon')
      .parents()
      .at(0)
      .simulate('click');
    expect(Component.state().lastRefresh).to.be.greaterThan(0);
  });

  it('should hide/show column filters when clicking hide/show Filters', () => {
    expect(Component.find('.hide-filter')).to.have.length(9);
    Component.find('.filter-icon')
      .parents()
      .at(0)
      .simulate('click');
    expect(Component.find('.hide-filter')).to.have.length(0);
    Component.find('.filter-icon')
      .parents()
      .at(0)
      .simulate('click');
    expect(Component.find('.hide-filter')).to.have.length(9);
  });

  it('should display an export button', () => {
    expect(
      Component.find('.export-icon')
        .first()
        .parents()
        .at(0)
        .text(),
    ).to.equal('Export');
  });

  it('should display an empty search input', () => {
    expect(
      Component.find('.react-bs-table-search-form input')
        .first()
        .props().defaultValue,
    ).to.equal('');
  });

  it('should display a search input with a default search term', () => {
    const newTableSettings = Object.assign({}, Component.props().tableSettings, {
      defaultSearch: 'my search term',
    });
    const NewComponent = mount(
      <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
    );
    expect(
      NewComponent.find('.react-bs-table-search-form input')
        .first()
        .props().defaultValue,
    ).to.equal('my search term');
  });

  it('should display empty column filters', () => {
    expect(
      Component.find('.number-filter-input')
        .first()
        .prop('defaultValue'),
    ).to.be.undefined;
    expect(
      Component.find('TextFilter')
        .first()
        .prop('defaultValue'),
    ).to.equal('');
    expect(
      Component.find('CustomDateFilter')
        .first()
        .prop('defaultValue'),
    ).to.deep.equal({});
    expect(
      Component.find('SelectFilter')
        .first()
        .prop('defaultValue'),
    ).to.equal('');
  });

  describe('Default values are set', () => {
    let NewComponent;
    const fromDate = new Date('2017-01-01');
    const toDate = new Date('2017-01-02');
    const dateRangeDefault = { from: fromDate, to: toDate };
    beforeEach(() => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=', number: 66 },
            width: 74,
          },
          {
            title: 'User ID',
            key: 'user_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=' },
            width: 74,
            export: false,
          },
          {
            title: 'First Name',
            key: 'first_name',
            width: 90,
            defaultValue: 'Dave',
          },
          {
            title: 'Last Name',
            key: 'surname',
            width: 90,
          },
          {
            title: 'Email Address',
            key: 'email',
            width: 164,
          },
          {
            title: 'Request Date',
            key: 'created_at',
            filter: 'CustomDateRangeFilter',
            disableSearchAll: true,
            width: 120,
            defaultValue: dateRangeDefault,
          },
          {
            title: 'Type',
            key: 'type',
            filter: 'SelectFilter',
            filterOptions: {
              Add: 'Add',
              Amend: 'Amend',
              Remove: 'Remove',
            },
            defaultValue: 'Amend',
          },
          {
            title: 'System',
            key: 'system_type',
            filter: 'SelectFilter',
            filterOptions: {
              training: 'training',
              staging: 'staging',
              production: 'production',
            },
          },
          {
            title: 'Actions',
            key: 'actions',
            searchable: false,
            sortable: false,
            export: false,
          },
        ],
      });
      NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
    });

    it('should display column filters with default values', () => {
      expect(
        NewComponent.find('.number-filter-input')
          .first()
          .prop('defaultValue'),
      ).to.equal(66);
      expect(
        NewComponent.find('TextFilter')
          .first()
          .prop('defaultValue'),
      ).to.equal('Dave');
      expect(
        NewComponent.find('CustomDateFilter')
          .first()
          .prop('defaultValue'),
      ).to.equal(dateRangeDefault);
      expect(
        NewComponent.find('SelectFilter')
          .first()
          .prop('defaultValue'),
      ).to.equal('Amend');
    });

    it('should clear all filters when clear filters is clicked', () => {
      NewComponent.find('.filter-icon-clear')
        .first()
        .simulate('click');
      expect(
        NewComponent.find('.number-filter-input')
          .first()
          .prop('defaultValue'),
      ).to.equal('');
      expect(
        NewComponent.find('TextFilter')
          .first()
          .prop('defaultValue'),
      ).to.equal('');
      expect(
        NewComponent.find('CustomDateFilter')
          .first()
          .prop('defaultValue'),
      ).to.deep.equal({});
      expect(
        NewComponent.find('SelectFilter')
          .first()
          .prop('defaultValue'),
      ).to.equal('');
    });
  });

  describe('With no export columns', () => {
    it('should not display the export button', () => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
            export: false,
          },
          {
            title: 'First Name',
            key: 'first_name',
            export: false,
          },
        ],
      });
      const NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.find('.export-icon')).to.have.length(0);
    });

    it('should only display the export button with an exportable column', () => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
          },
          {
            title: 'First Name',
            key: 'first_name',
            export: false,
          },
        ],
      });
      const NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.find('.export-icon')).to.have.length(1);
    });
  });

  describe('With no searchable columns', () => {
    it('should not display any filter icons or the global search', () => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
            searchable: false,
          },
          {
            title: 'First Name',
            key: 'first_name',
            width: 90,
            searchable: false,
          },
        ],
      });
      const NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.find('.filter-icon')).to.have.length(0);
      expect(NewComponent.find('.react-bs-table-search-form')).to.have.length(0);
    });

    it('should only display filter icons and the global search with a searchable column', () => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
            searchable: false,
          },
          {
            title: 'First Name',
            key: 'first_name',
            width: 90,
          },
        ],
      });
      const NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.find('.filter-icon')).to.have.length(1);
      expect(NewComponent.find('.react-bs-table-search-form')).to.have.length(1);
      expect(NewComponent.find('.react-bs-table-search-form input').props().defaultValue).to.equal('');
    });

    it('should display global search with a default value', () => {
      const newTableSettings = Object.assign({}, Component.props().tableSettings, {
        defaultSearch: 'ted',
        tableColumns: [
          {
            title: 'Ref',
            key: 'request_id',
            searchable: false,
          },
          {
            title: 'First Name',
            key: 'first_name',
            width: 90,
          },
        ],
      });
      const NewComponent = mount(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.find('.react-bs-table-search-form input').props().defaultValue).to.equal('ted');
    });
  });

  describe('With 119 (fake) results', () => {
    const testDataRow = {
      request_id: 1,
      user_id: 7,
      first_name: 'Ted',
      surname: 'Stevens',
      email: 'ted.stevens@test.com',
      created_at: '2018-09-18 03:13:39',
      type: 'Add',
      system_type: 'staging',
      actions: '4',
    };
    let NewComponent;
    beforeEach(() => {
      NewComponent = mount(
        <DataTableContainer
          dispatch={() => {}}
          tableSettings={testTableSettings}
          apiLocation="fake/location"
          DataTableData={{
            ExampleDataTable: {
              data: [testDataRow],
              dataTotalSize: 119,
              error: null,
              fetched: true,
              fetching: false,
            },
          }}
        />,
      );
    });

    it('should display pagination with 1 to 10 of 119 results', () => {
      expect(NewComponent.find('.react-bootstrap-table-pagination').text()).contains('Showing 1 to 10 of 119 Results');
    });

    it('should display pagination with 1-10 of 119 with a custom pagination total', () => {
      const PaginationTotal = (start, to, total) => (
        <div>
          {start}-{to} of {total}
        </div>
      );
      const newTableSettings = Object.assign({}, NewComponent.props().tableSettings, {
        customPaginationTotal: PaginationTotal,
      });
      NewComponent.setProps({ tableSettings: newTableSettings });

      expect(NewComponent.find('.react-bootstrap-table-pagination').text()).contains('1-10 of 119');
    });

    it('should display the expected test data', () => {
      expect(
        NewComponent.find('.react-bootstrap-table table tr th')
          .first()
          .text(),
      ).contains('Ref');
      expect(
        NewComponent.find('.react-bootstrap-table table tr td')
          .first()
          .text(),
      ).contains(1);
      expect(
        NewComponent.find('.react-bootstrap-table table tr th')
          .at(4)
          .text(),
      ).contains('Email Address');
      expect(
        NewComponent.find('.react-bootstrap-table table tr td')
          .at(4)
          .text(),
      ).contains('ted.stevens@test.com');
      expect(
        NewComponent.find('.react-bootstrap-table table tr th')
          .at(7)
          .text(),
      ).contains('System');
      expect(
        NewComponent.find('.react-bootstrap-table table tr td')
          .at(7)
          .text(),
      ).contains('staging');
    });
  });

  describe('With an api error', () => {
    const DataTableData = {
      ExampleDataTable: {
        data: [],
        dataTotalSize: 0,
        error: {
          test: 'error',
        },
        fetched: true,
        fetching: false,
      },
    };

    it('should return the default error', () => {
      const NewComponent = mount(
        <DataTableContainer
          dispatch={() => {}}
          tableSettings={testTableSettings}
          apiLocation="fake/location"
          DataTableData={DataTableData}
        />,
      );
      expect(NewComponent.text()).to.equal(
        'The table failed to initialise. Please check you are connected to the internet and try again.',
      );
    });

    it('should return a custom error when set', () => {
      const customApiError = errorObject => (
        <div className="status_message offline">
          <p>{errorObject.test}</p>
        </div>
      );
      const newTableSettings = {
        ...Component.props().tableSettings,
        customApiError,
      };
      const NewComponent = mount(
        <DataTableContainer
          dispatch={() => {}}
          tableSettings={newTableSettings}
          apiLocation="fake/location"
          DataTableData={DataTableData}
        />,
      );
      expect(NewComponent.text()).to.equal('error');
    });
  });

  describe('With no tableID', () => {
    it('should return an error if no tableID is set', () => {
      const newTableSettings = {
        ...Component.props().tableSettings,
        tableID: null,
      };
      const NewComponent = shallow(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.text()).to.equal('Missing tableID');
    });

    it('should return an error if no tableID is blank', () => {
      const newTableSettings = {
        ...Component.props().tableSettings,
        tableID: '',
      };
      const NewComponent = shallow(
        <DataTableContainer dispatch={() => {}} tableSettings={newTableSettings} apiLocation="fake/location" />,
      );
      expect(NewComponent.text()).to.equal('Missing tableID');
    });
  });
});
