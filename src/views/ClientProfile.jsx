import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import moment from "moment";
import RequireAuth from '../components/Shared/RequireAuth';

const ClientProfile = (props) => {
  const [clientData, setClientData] = useState({})
  const [isFetching, setFetching] = useState(false);
  const { profileId } = useParams();
  const limit = 50;

  const tableDataOpts = {
    isOpenModel: false,
    columnDefs: [
      {
        headerName: "View",
        field: "_id",
        width: 50,
        minWidth: 40,
        sortable: false,
        cellClass: "grid-cell-centered",
        cellRendererFramework: function (params) {
          if (params.value !== undefined) {
            return (
              <Link to={`/dashboard/clients/profile/${params.value}`}>
                <i className="fa fa-eye fa-lg" />
              </Link>
            );
          } else {
            return (<img alt="loading..." src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif" />)
          }
        },
      },
      {
        headerName: "ID",
        field: "_id",
        minWidth: 100,
        width: 50,
        cellClass: "grid-cell-centered",
        sortable: false,
      },
      {
        headerName: "notes", field: "notes",
      },
      {
        headerName: "Last Update",
        field: "updatedAt",
        valueFormatter: (params) => moment.utc(params.value).format('MM/DD/YYYY')
      }
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




  const getPaginatedData = async (params) => {
    const res = await Axios({
      mathod: 'get',
      url: `${process.env.REACT_APP_API_URL}/clients/${profileId}/orders`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      params,
    });
    return res.data;
  }




  const onGridReady = async params => {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights();

    const dataSource = {
      getRows: async (params) => {
        try {
          const recievedPaginatedData = await getPaginatedData({
            page: params.startRow / limit + 1,
            limit,
          });

          const rowsThisPage = recievedPaginatedData.data
          const lastRow = recievedPaginatedData.totalCount;
          params.successCallback(rowsThisPage, lastRow);
        } catch (err) {
          params.failCallback();
        }
      }
    }

    params.api.setDatasource(dataSource);
  };



  const fetchClientData = async () => {
    try {
      setFetching(true)
      const res = await Axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/clients/${profileId}`,
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
      });

      setClientData(res.data);
    } catch (error) {
      alert(error);
    }

    setFetching(false);
  }


  useEffect(() => {
    fetchClientData();
  }, [])

  return (
    <>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', backgroundColor: "#f5f7f7" }}>
        <div style={{ display: 'flex', margin: 20 }}>
          <span style={{ flex: 1 }}>Orders</span>
          <span style={{ flex: 1, alignSelf: 'center' }}>{clientData.name}</span>
        </div>

        <div className="ag-theme-balham" style={{ flex: 1 }}>
          <AgGridReact
            animateRows
            columnDefs={tableDataOpts.columnDefs}
            floatingFilter={true}
            defaultColDef={tableDataOpts.defaultColDef}
            rowSelection={tableDataOpts.rowSelection}
            rowDeselection={true}
            rowModelType={tableDataOpts.rowModelType}
            maxConcurrentDatasourceRequests={tableDataOpts.maxConcurrentDatasourceRequests}
            infiniteInitialRowCount={tableDataOpts.infiniteInitialRowCount}
            getRowNodeId={tableDataOpts.getRowNodeId}
            onGridReady={onGridReady}
            cacheBlockSize={limit}
            rowHeight={50}
          >
          </AgGridReact>
        </div>
      </div>
    </>
  );
}



export default RequireAuth(ClientProfile);
