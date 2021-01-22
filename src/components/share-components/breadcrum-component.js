 import './breadcrum-component.scss';
 import {Link } from 'react-router-dom';

export default function BreadcrumComponent(props) {

    return (<div className="breadcrumb-content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {props?.categories?.map(x =>
                            <li  key={x} className="breadcrumb-item"><Link to={`/items?search=${x}`}>{x}</Link></li>
                        )}
                    </ol>
                </nav>
            </div>)
    
}