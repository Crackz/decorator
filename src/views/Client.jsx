import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import React from "react";
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import ClientModal from '../components/Modals/ClientModal';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';


class Client extends React.Component {
  limit = 20;
  gridApi;
  constructor(props) {
    super(props);
    this.state = {
      isOpenModel: false,
      columnDefs: [
        {
          headerName: "View",
          field: "_id",
          width: 40,
          minWidth: 30,
          sortable: false,
          cellClass: "grid-cell-centered",
          cellRendererFramework: function (params) {
            if (params.value !== undefined)
              return (
                <Link to={`/dashboard/clients/${params.value}/profile`}>
                  <i className="fa fa-eye fa-lg" />
                </Link>
              );
            else
              return <LoadingSpinner />
          },
        },
        {
          headerName: "ID",
          field: "_id",
          minWidth: 55,
          width: 55,
          cellClass: "grid-cell-centered",
          sortable: false,
        },
        {
          headerName: "Name",
          field: "name",
          minWidth: 100,
          autoHeight: true,
          cellClass: "cell-wrap-text",

          filter: "agTextColumnFilter",
          floatingFilterComponentParams: { suppressFilterButton: true },
          filterParams: {
            filterOptions: ["contains"],
            debounceMs: 300,
          },
          suppressMenu: true

        }, {
          headerName: "Phones",
          field: "phones",
          filter: "agTextColumnFilter",
          floatingFilterComponentParams: { suppressFilterButton: true },
          filterParams: {
            filterOptions: ["contains"],
            debounceMs: 300,
          },
          suppressMenu: true
        }, {
          headerName: "Address", field: "address",
          filter: "agTextColumnFilter",
          floatingFilterComponentParams: { suppressFilterButton: true },
          filterParams: {
            filterOptions: ["contains"],
            debounceMs: 300,
          },
          suppressMenu: true
        },
        {
          headerName: "Gender",
          field: "gender",
          sortable: false,
          cellRendererFramework: function (params) {
            if (params.value == null)
              return <span></span>

            return <i className={`fas fa-${params.value === 'MALE' ? 'male' : 'female'} fa-2x`}
              style={{
                  color: `${params.value === 'MALE' ? '#02A3FE' : '#EC49A6'}`
              }}></i>
          }
        },

      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
      },
      rowSelection: "multiple",
      rowModelType: "infinite",
      paginationPageSize: 7,
      maxConcurrentDatasourceRequests: 1,
      infiniteInitialRowCount: 1,
      getRowNodeId: function (item) {
        return item._id;
      },
    }
  }


  async getPaginatedData(params) {
    const res = await axios({
      mathod: 'get',
      url: `${process.env.REACT_APP_API_URL}/clients`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      params,
    });
    return res.data;
  }

  mapFilterModelToQueryString(filterModel) {
    const filter = {};

    Object.keys(filterModel).forEach((key) => {
      if (key === 'phones')
        filter["phone"] = filterModel[key]["filter"]
      else
        filter[key] = filterModel[key]["filter"]
    });

    return filter;
  }


  mapSortModelToQueryString(sortModel) {
    const sort = {};

    sortModel.forEach((singleSortModel) => {
      if (singleSortModel.colId === 'name') {
        sort.sortByName = singleSortModel.sort;
      }
      else if (singleSortModel.colId === 'phones') {
        sort.sortByPhone = singleSortModel.sort;
      }
      else if (singleSortModel.colId === 'address') {
        sort.sortByAddress = singleSortModel.sort;
      }
    });

    return sort;
  }

  onGridReady = async params => {
    this.gridApi = params.api;

    const paginatedDataRequester = this.getPaginatedData.bind(this);

    const dataSource = {
      getRows: async (params) => {
        try {
          const recievedPaginatedData = await paginatedDataRequester({
            ...this.mapFilterModelToQueryString(params.filterModel),
            ...this.mapSortModelToQueryString(params.sortModel),
            page: params.startRow / this.limit + 1,
            limit: this.limit,
          });

          const rowsThisPage = recievedPaginatedData.data
          const lastRow = recievedPaginatedData.totalCount;
          params.successCallback(rowsThisPage, lastRow);
        } catch (err) {
          params.failCallback();
        }

        this.gridApi.sizeColumnsToFit();
        this.gridApi.resetRowHeights();
      }
    }

    this.gridApi.setDatasource(dataSource);
  };


  setOpenModel = (isOpenModel) => {
    this.setState({ isOpenModel })
  }


  addNewClient = (data) => {
    this.gridApi.updateRowData({ add: [data], addIndex: 0 });
  }

  componentWillMount() {
    this.props.setNavbarOpts({ text: 'Clients' });
  }

  render() {
    return (
      <>
        {
          this.state.isOpenModel && <ClientModal isOpened={this.state.isOpenModel} setOpened={this.setOpenModel}
            addNewClient={this.addNewClient} />
        }
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="bg-white">
          <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '1%' }}>
            <Button color="primary" onClick={() => this.setOpenModel(true)}>Add New Client</Button>
            <Button color="primary" onClick={() => this.gridApi.setFilterModel(null)}>Clear</Button>
          </div>

          <div className="ag-theme-material mx-1" style={{ flex: 1 }} >
            <AgGridReact
              animateRows
              columnDefs={this.state.columnDefs}
              floatingFilter={true}
              defaultColDef={this.state.defaultColDef}
              rowSelection={this.state.rowSelection}
              rowDeselection={true}
              rowModelType={this.state.rowModelType}
              maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
              infiniteInitialRowCount={this.state.infiniteInitialRowCount}
              getRowNodeId={this.state.getRowNodeId}
              onGridReady={this.onGridReady}
              cacheBlockSize={this.limit}
              >
            </AgGridReact>
          </div>
        </div>
      </>
    );
  }
}

export default Client;