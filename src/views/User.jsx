import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import { default as axios, default as Axios } from 'axios';
import React from "react";
import PhotoModal from '../components/Modals/PhotoModal';

const RolesMapping = {
  'SUPER_ADMIN': "Super Admin",
  'ADMIN': 'Admin',
  'USER': 'User'
}

const getRoleColor = (roles) => {
  if (roles)
    roles = roles[0];

  switch (roles) {
    case 'SUPER_ADMIN':
      return 'text-primary';
    case 'ADMIN':
      return 'text-info';
    case 'USER':
      return 'text-dark';
    default:
      return ''
  }
}
class User extends React.Component {
  limit = 20;
  gridApi;
  constructor(props) {
    super(props);
    this.state = {
      isPhotoModalOpened: false,
      photoModalSrc: ''
    }
  }

  tableOpts = {
    columnDefs: [
      {
        headerName: "User ID",
        field: "_id",
        cellClass: "grid-cell-centered",
      },
      {
        headerName: "Name",
        field: "name",
      },
      {
        headerName: "Phone",
        field: "phone",
      },
      {
        headerName: "Picture",
        field: "profileImg",
        sortable: false,
        cellClass: "grid-cell-centered",
        cellRendererFramework: function (params) {
          if (params.value !== undefined)
            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a href="#" onClick={() => this.openPhotoModalHandler(params.value)}>
                <i className="fa fa-image fa-lg fa-2x" />
              </a>
            );
          else
            return '';
        }.bind(this),
      },
      {
        headerName: "Role",
        field: "roles",
        editable: true,
        cellEditor: "agSelectCellEditor",
        singleClickEdit : true,
        cellEditorParams: {
          values: Object.keys(RolesMapping).map((key) => key)
        },
        refData: RolesMapping,
        cellRendererFramework: function (params) {
          return (
            <div style={{ cursor: 'pointer', fontWeight: 'bolder' }}>
              <h3 className={getRoleColor(params.value)}>{params.valueFormatted ? params.valueFormatted : params.value}</h3>
            </div>
          )
        }
      },
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


  async getPaginatedData(params) {
    const res = await axios({
      mathod: 'get',
      url: `${process.env.REACT_APP_API_URL}/users`,
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
    this.props.setNavbarOpts({ text: 'Users' });
  }

  openPhotoModalHandler(imgSrc) {
    this.setState((state) => ({
      ...state,
      photoModalSrc: imgSrc,
      isPhotoModalOpened: true
    }))
  }


  async onUserRoleChange(event) {
    try {
      await Axios({
        method: 'patch',
        data: {
          userId: event.data._id,
          userRole: event.value
        },
        url: `${process.env.REACT_APP_API_URL}/admins`,
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      const errorRes = error.response;
      if (errorRes.status === 400) {
        for (let errorMessage of errorRes.data.error.errors || []) {
          if (errorMessage.param === 'role') {
            event.node.setDataValue("roles", errorMessage.message);
            return;
          } else
            alert(errorMessage.message)
        }
        return;
      }
      alert(error);
    }
  }


  render() {
    return (
      <>
        {
          this.state.isPhotoModalOpened && <PhotoModal isOpened={this.state.isPhotoModalOpened}
            setOpened={(toggleVal) => { this.setState({ isPhotoModalOpened: toggleVal }) }}
            imgSrc={this.state.photoModalSrc} />
        }

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="bg-white">
          <div className="ag-theme-material mx-1" style={{ flex: 1 }} >
            <AgGridReact
              animateRows
              columnDefs={this.tableOpts.columnDefs}
              defaultColDef={this.tableOpts.defaultColDef}
              rowSelection={this.tableOpts.rowSelection}
              rowDeselection={true}
              rowModelType={this.tableOpts.rowModelType}
              maxConcurrentDatasourceRequests={this.tableOpts.maxConcurrentDatasourceRequests}
              infiniteInitialRowCount={this.tableOpts.infiniteInitialRowCount}
              getRowNodeId={this.tableOpts.getRowNodeId}
              onGridReady={this.onGridReady}
              cacheBlockSize={this.limit}
              onCellEditingStopped={this.onUserRoleChange}
              rowHeight={50}
            >
            </AgGridReact>
          </div>
        </div>
      </>
    );
  }
}

export default User;