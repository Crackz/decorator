import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import moment from 'moment';
import React from "react";
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';


class Order extends React.Component {
  limit = 20;
  gridApi;
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "View",
          field: "_id",
          width: 40,
          minWidth: 30,
          cellClass: "grid-cell-centered",
          cellRendererFramework: function (params) {
            if (params.value !== undefined)
              return (
                <Link to={`/dashboard/clients/${params.value}/orders/`}>
                  <i className="fa fa-eye fa-lg" />
                </Link>
              );
            else
              return <LoadingSpinner />
          },
        },
        {
          headerName: "Order ID",
          field: "_id",
          cellClass: "grid-cell-centered",
        },
        {
          headerName: "Client Name",
          field: "client.name",
        }, {
          headerName: "Last Update Date",
          field: "updatedAt",
          valueFormatter: (params) => params.value ? moment.utc(params.value).format('MM/DD/YYYY hh:mm A') : null
        }
      ],
      defaultColDef: {
        resizable: true,
      },
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
      url: `${process.env.REACT_APP_API_URL}/orders?status=PENDING&status=WORK_IN_PROGRESS`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      params,
    });
    return res.data;
  }

  onGridReady = async params => {
    this.gridApi = params.api;

    const paginatedDataRequester = this.getPaginatedData.bind(this);

    const dataSource = {
      getRows: async (params) => {
        try {
          const recievedPaginatedData = await paginatedDataRequester({
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

  componentWillMount() {
    this.props.setNavbarOpts({ text: 'Orders' });
  }

  render() {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="bg-white">
        <div className="ag-theme-material mx-1" style={{ flex: 1 }} >
          <AgGridReact
            animateRows
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowSelection={this.state.rowSelection}
            rowDeselection={true}
            rowModelType={this.state.rowModelType}
            maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
            infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            getRowNodeId={this.state.getRowNodeId}
            onGridReady={this.onGridReady}
            cacheBlockSize={this.limit}
            rowHeight={50}
          >
          </AgGridReact>
        </div>
      </div>
    );
  }
}

export default Order;