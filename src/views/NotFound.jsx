import React from 'react';
import { useEffect } from 'react';


const NotFound = (props) => {
    useEffect(() => {
        props.setNavbarOpts({ hide: true });
        return () => props.setNavbarOpts({ hide: false });
    }, []);
    return (
        <div class="d-flex flex-grow-1 justify-content-center align-items-center">
            <div className="bg-white flex-grow-1 text-center">
                <span>صفحة غير موجودة</span>
            </div>
        </div>
    )
}


export default NotFound;