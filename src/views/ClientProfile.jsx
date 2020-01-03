import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";
import RequireAuth from '../components/Shared/RequireAuth';
import PhoneModal from '../components/Modals/PhoneModal';
import AddressModal from '../components/Modals/AddressModal';
import ClientModal from '../components/Modals/ClientModal';

const ClientProfile = (props) => {
  const [client, setClient] = useState({})
  const [isFetching, setFetching] = useState(false);
  const [isPhoneModelOpened, setPhoneModelOpened] = useState(false);
  const [isAddressModelOpened, setAddressModelOpened] = useState(false);
  const [isClientModelOpened, setClientModelOpened] = useState(false);

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

      setClient(res.data);
    } catch (error) {
      alert(error);
    }

    setFetching(false);
  }


  useEffect(() => {
    fetchClientData();
  }, [])

  const renderClientActions = () => {
    return (
      <div style={{ textAlign: 'center', cursor: 'pointer', marginRight: 15 }}>
        <UncontrolledDropdown>
          <DropdownToggle tag="span">
            <i className="fas fa-ellipsis-h"></i>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 40 }} onClick={() => setClientModelOpened(true)}>
                <i style={{ color: "#5e72e4" }} className="fas fa-user-edit mr-1"></i>
                <span>Edit</span>
              </div>
            </DropdownItem>
            <DropdownItem>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 40 }}>
                <i style={{ color: '#f5365c' }} className="fas fa-trash-alt mr-1"></i>
                <span>Delete</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>)
  }

  const renderClientContact = () => {
    return (
      <div style={{ display: "flex", flexDirection: 'column' }}>
        <span style={{ borderBottom: '1px solid #ccc', marginBottom: 10, textAlign: 'center' }}>{client.name}</span>
        <div className="clientData" style={{ display: 'flex', justifyContent: "space-between" }}>
          <div className="icon-sm icon-shape bg-green text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
            onClick={() => setPhoneModelOpened(true)}>
            <i className="fa fa-phone fa-rotate-90"></i>
          </div>
          <div className="icon-sm icon-shape bg-blue text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
            onClick={() => setAddressModelOpened(true)}>
            <i className="fa fa-address-book"></i>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {
        isPhoneModelOpened && <PhoneModal phones={(client && client.phones) || []} isOpened={isPhoneModelOpened}
          setOpened={setPhoneModelOpened} />
      }
      {
        isAddressModelOpened && <AddressModal address={client.address} isOpened={isAddressModelOpened}
          setOpened={setAddressModelOpened} />
      }
      {
        isClientModelOpened && <ClientModal setOpen={setClientModelOpened} isOpenModel={isClientModelOpened}
          updatedClientHandler={(client) => setClient(client)}
          existingClient={client} />
      }
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', backgroundColor: "#f5f7f7" }}>
        <div style={{ display: 'flex', margin: 10, justifyContent: "space-between", alignItems: 'center' }}>
          <Button color="primary">Add New Order</Button>

          {Object.keys(client).length > 0 && renderClientContact()}

          {Object.keys(client).length > 0 && renderClientActions()}

          {isFetching && <LoadingSpinner />}
        </div>

        <div className="ag-theme-balham" style={{ flex: 1 }}>
          <AgGridReact
            animateRows
            columnDefs={tableDataOpts.columnDefs}
            defaultColDef={tableDataOpts.defaultColDef}
            rowSelection={tableDataOpts.rowSelection}
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
