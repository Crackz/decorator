import React from 'react';

export const LoadingSpinner = (props) => (
    <div>
        <i className="fa fa-spinner fa-spin" style={{ fontWeight: 'bolder', fontSize: props.fontSize || "30px" }} />
    </div>
);
