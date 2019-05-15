import React, { PureComponent } from 'react';
import isEqual from 'lodash/isEqual';

import Filter from '../../components/filter';

import { loopFilters } from './utils';

import { filterOperators } from '../../constants';

export const FilterContext = React.createContext();

export default class FilterProvider extends PureComponent {
  state = {
    data: [...(this.props.data || [])],
    selectedFilters: [],
    filterDisabled: false,
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!isEqual(nextProps.data, this.props.data)) {
  //     return true;
  //   }
  //   if (!isEqual(nextState.data, this.state.data)) {
  //     return true;
  //   }
  //   if (!isEqual(nextState.selectedFilters, this.state.selectedFilters)) {
  //     return true;
  //   }
  //   if (nextState.filterDisabled !== this.state.filterDisabled) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate(prevProps) {
    if ((this.props.data || []) && !isEqual(this.props.data, prevProps.data)) {
      this.applyFilter();
    }
  }

  updateSelectedFilters = (attribute, value, index) => {
    const { selectedFilters: filters } = this.state;
    const { columns } = this.props;
    let filterToBeUpdated = filters[index];

    if (index === 1 && attribute === 'predicate') {
      filters.slice(2).forEach(element => (element.predicate = value));
    }

    if (attribute === 'value') {
      filterToBeUpdated[attribute] = value;
    }
    if (attribute === 'attribute') {
      const currentColumn = columns.find(i => i.field === value) || {};
      filterToBeUpdated['type'] = currentColumn.type || '';
      filterToBeUpdated.label = currentColumn.headerName;
      filterToBeUpdated.attribute = currentColumn.field;
      filterToBeUpdated['value'] = undefined;

      const newQuery = ((filterOperators[filterToBeUpdated.type] || [])[0] || {}).value;
      if (newQuery) filterToBeUpdated.query = newQuery;
    }

    this.setState({ selectedFilters: [...filters] });
  };

  addFilter = () => {
    const { columns } = this.props;

    const firstFilterableAttribute = columns.find(d => d.isFilterable && d.type === 'String');
    const filters = this.state.selectedFilters;
    let newFilter = {};
    let predicate = 'Where';
    const filtersLength = filters.length;
    if (filtersLength >= 2) {
      predicate = filters[1].predicate;
    } else if (filtersLength === 1) {
      predicate = 'And';
    }
    newFilter.predicate = predicate;
    newFilter.attribute = firstFilterableAttribute.field;
    newFilter.label = firstFilterableAttribute.headerName;
    const newQuery = ((filterOperators[firstFilterableAttribute.type] || [])[0] || {}).value;
    newQuery ? (newFilter.query = newQuery) : (newFilter.query = 'contains');
    newFilter.value = '';
    newFilter.type = firstFilterableAttribute.type;
    filters.push(newFilter);

    this.setState({ selectedFilters: [...filters] });
  };

  removeFilter = index => {
    const filters = this.state.selectedFilters;
    if (index === 0) index = filters.length - 1;

    filters.splice(index, 1);
    this.setState({ selectedFilters: [...filters] });
    this.applyFilter(filters);
  };

  applyFilter = filters => {
    this.setState({ filterDisabled: true });
    const selectedFilters = filters && filters.length ? filters : this.state.selectedFilters;
    const searchedData = [...this.props.data] || [];
    if (!selectedFilters.length) return this.setFilteredData(searchedData);

    console.time('Start-Filter');
    const filteredData = loopFilters(searchedData, selectedFilters);
    this.setFilteredData(filteredData);
    console.timeEnd('Start-Filter');
  };

  setFilteredData = (data = []) => this.setState({ data, filterDisabled: false });

  render() {
    const { children, filterableColumns } = this.props;
    const parentDataCount = (this.props.data || []).length;
    const stateDataCount = (this.state.data || []).length;

    return (
      <FilterContext.Provider value={{ ...this.state }}>
        <Filter
          addFilter={this.addFilter}
          applyFilter={this.applyFilter}
          disabled={!parentDataCount}
          filterDisabled={this.state.filterDisabled}
          filterableColumns={filterableColumns}
          removeFilter={this.removeFilter}
          selectedFilters={this.state.selectedFilters}
          updateSelectedFilters={this.updateSelectedFilters}
        />
        {children}

        {parentDataCount && !stateDataCount ? (
          <div
            className="noRecordsDiv"
            style={{
              fontSize: '1.1em',
              letterSpacing: '0.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 0,
              paddingRight: 0,
              margin: 0,
              borderTop: 'none',
            }}>
            {'No Results Found'}
          </div>
        ) : null}
      </FilterContext.Provider>
    );
  }
}