import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Axios from "axios";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";


export const statusMappings = {
    'PENDING': 'قيد الانتظار',
    'WORK_IN_PROGRESS': 'قيد العمل',
    'FINISHED': 'تم الانتهاء'
}

export const getOrderStatusColor = (value) => {
    let orderStatusColor;
    switch (value) {
        case 'PENDING':
            orderStatusColor = "light";
            break;
        case 'WORK_IN_PROGRESS':
            orderStatusColor = "info";
            break;
        case 'FINISHED':
            orderStatusColor = "success";
            break;
        default:
            return null;
    }

    return orderStatusColor;
}
const Order = (props) => {
    let gridApi;
    const limit = 20;
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
                            <Link to={`/dashboard/clients/${props.clientId}/orders/${params.value}`}>
                                <i className="fa fa-eye fa-lg" />
                            </Link>
                        );
                    } else {
                        return <LoadingSpinner />
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
                headerName: "Status",
                field: "status",
                editable: true,
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: Object.keys(statusMappings).map((key) => key)
                },
                refData: statusMappings,
                singleClickEdit : true,
                cellRendererFramework: function (params) {
                    let badgeColor = getOrderStatusColor(params.value);
                    if (!badgeColor)
                        return <span style={{ 'color': 'red' }}>{params.value}</span>;

                    return <h2><Badge color={badgeColor} pill>{statusMappings[params.value]}</Badge></h2>
                }
            },
            {
                headerName: "Last Update",
                field: "updatedAt",
                valueFormatter: (params) => params.value ? moment.utc(params.value).format('MM/DD/YYYY') : null
            }
        ],
        defaultColDef: {
            resizable: true,
        },
        rowModelType: "infinite",
        maxConcurrentDatasourceRequests: 1,
        infiniteInitialRowCount: 1,
        getRowNodeId: function (item) {
            return item._id;
        },
    }



    const onGridReady = async params => {
        gridApi = params.api;

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

                gridApi.sizeColumnsToFit();
                gridApi.resetRowHeights();
            }
        }

        gridApi.setDatasource(dataSource);


    };


    const onOrderStatusChange = async (event) => {
        const body = new FormData();
        body.append('status', event.value);

        try {
            await Axios({
                method: 'patch',
                data: body,
                url: `${process.env.REACT_APP_API_URL}/clients/${props.clientId}/orders/${event.data._id}`,
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            event.node.setDataValue("status", 'فشل التحديث تاكد من الانترنت وحاول مرة اخري');
            alert(error);
        }
    }

    const getPaginatedData = async (params) => {
        const res = await Axios({
            mathod: 'get',
            url: `${process.env.REACT_APP_API_URL}/clients/${props.clientId}/orders`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            params,
        });
        return res.data;
    }

    return (
        <div className="ag-theme-material" style={props.style}>
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
                onCellEditingStopped={onOrderStatusChange}
            >
            </AgGridReact>
        </div>
    )
}



export default Order;