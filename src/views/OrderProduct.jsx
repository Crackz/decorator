
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import React, { Component } from "react";
import { Button } from 'reactstrap';
import NumericEditor from '../components/Shared/NumericEditor';
import TextEditor from '../components/Shared/TextEditor';

import moment from 'moment';
import { UncontrolledTooltip } from 'reactstrap';
class OrderProduct extends Component {

    tableDataOpts = {
        columnDefs: [

            {
                headerName: "اسم المنتج",
                field: "name",
                cellEditor: 'agTextCellEditor',
                minWidth: 250,
                checkboxSelection: true,
                cellClass: "cell-wrap-text",
                autoHeight: true,
            },
            {
                headerName: "السعر",
                field: "price",
                minWidth: 80,

                cellEditor: 'numericEditor',
            },
            {
                headerName: "الكمية",
                field: "amount",
                minWidth: 80,
                cellEditor: 'numericEditor',
            },
            {
                headerName: "الوحدة",
                field: "unit",
                minWidth: 80,
                cellEditor: 'textEditor',
            },
            {
                headerName: "الاجمالى",
                field: 'totalPrice',
                minWidth: 80,
                editable: false,
                suppressNavigable: true,
                valueGetter: (params) => {
                    const price = params.getValue("price");
                    const amount = params.getValue("amount");

                    return price && amount ? +(price * amount).toFixed(2) : '';
                }
            },
        ],
        rowDeselection: true,
        defaultColDef: {
            resizable: true,
            editable: true
        },
        pinnedBottomRowData: [{
            name: 'الاجمالي',
            totalPrice: 100
        }],
        frameworkComponents: {
            numericEditor: NumericEditor,
            textEditor: TextEditor
        },
        rowSelection: 'multiple'
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        params.columnApi.autoSizeColumns();
    }

    onFirstDataRendered = (params) => {
        params.api.sizeColumnsToFit();
    }

    onCreatingProduct = () => {
        this.gridApi.updateRowData({
            add: [{}],
            addIndex: 0
        });
        this.gridApi.setFocusedCell(0, 'name')
        this.gridApi.startEditingCell({
            rowIndex: 0,
            colKey: "name"
        });

    }

    onDeletingProduct = () => {
        const selectedData = this.gridApi.getSelectedRows();
        this.gridApi.updateRowData({ remove: selectedData });
        this.props.onProductChange();
    }

    onColumnResized() {
        this.gridApi.resetRowHeights();
    }

    onCellValueChanged() {
        this.gridApi.resetRowHeights();
        this.props.onProductChange();
    }

    validateAndGetAllProducts() {
        const requiredProductsAttributes = ['name', 'price', 'amount', 'unit'];
        const gridApi = this.gridApi;
        const products = [];
        let isAllProductsValid = true;;
        gridApi.forEachNode(function (node) {
            for (let requiredAttr of requiredProductsAttributes) {
                if (!node.data[requiredAttr]) {
                    gridApi.setFocusedCell(node.rowIndex, requiredAttr)
                    gridApi.flashCells({
                        rowNodes: [node],
                        columns: [requiredAttr]
                    });
                    isAllProductsValid = false;
                    break;
                }
            }
            products.push(node.data);
        });

        return isAllProductsValid ? products : null;

    }


    render() {

        return (
            <>
                <div className="d-flex flex-column shadow-lg rounded" >
                    <div className="d-flex justify-content-between mx-3 my-3">
                        <div>
                            <Button color="primary" size="sm" onClick={this.onCreatingProduct}>اضف منتج</Button>
                            <Button color="danger" size="sm" onClick={this.onDeletingProduct}>حذف منتج</Button>
                        </div>
                        <div className="d-flex flex-column p-2" id="creationAndUpdatingDate">
                            <i className="far fa-calendar-alt"></i>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #ccc' }} ></div>
                    <div className="d-flex flex-grow-1" style={{ minHeight: '400px' }}>
                        <div className="ag-theme-material flex-grow-1">
                            <AgGridReact
                                animateRows
                                onGridReady={this.onGridReady}
                                columnDefs={this.tableDataOpts.columnDefs}
                                defaultColDef={this.tableDataOpts.defaultColDef}
                                rowData={this.props.products}
                                onFirstDataRendered={this.onFirstDataRendered}
                                frameworkComponents={this.tableDataOpts.frameworkComponents}
                                stopEditingWhenGridLosesFocus={true}
                                enableCellChangeFlash={true}
                                enableBrowserTooltips={true}
                                singleClickEdit={true}
                                rowSelection={this.tableDataOpts.rowSelection}
                                suppressRowClickSelection={true}
                                onColumnResized={this.onColumnResized.bind(this)}
                                onCellValueChanged={this.onCellValueChanged.bind(this)}
                            >
                            </AgGridReact>
                        </div>
                    </div>
                </div>
                <UncontrolledTooltip target="creationAndUpdatingDate" fade >
                    <h3 className="mt-2">تاريخ الانشاء</h3>
                    <p className="font-weight-light">{moment.utc(this.props.createdAt).format('lll')}</p>
                    <h3>اخر تاريخ تحديث</h3>
                    <p className="font-weight-light">{moment.utc(this.props.updatedAt).format('lll')}</p>
                </UncontrolledTooltip>
            </>
        )
    }
}



export default OrderProduct;