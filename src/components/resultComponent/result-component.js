import './result-component.scss';
import BreadcrumComponent from '../share-components/breadcrum-component'
import { Link, useLocation} from 'react-router-dom';
import freeshiping from '../../assets/ic_shipping.png';
import React, { useState, useEffect } from "react";
import CurrencyFormat from 'react-currency-format';

export default function ResultComponent() {

        const location = useLocation();
        let query = useQuery();
        let [productos, setProductos] = useState();
        let [error, setError] = useState(false);
        useEffect(() =>{
            getData();
        },[location])

        const getData = () => {
            fetch('/api/items?q='+query.get("search"))
            .then(response => {
                if (!response.ok) {
                    setError(true);
                    setProductos(null);
                } else {
                    response.json().then(data => {
                        setProductos(data);
                    });
                }
            })
            
        }
    
        return (<div id="resultComponent" className="container">

                    <BreadcrumComponent categories={productos?.categories}></BreadcrumComponent>

                    <div id="list-results">
                        {productos ? productos.items.map(producto => (
                            <div key={producto.id}>
                                <Link to={`/items/${producto.id}`}>
                                    <div className="row resElement align-items-start">
                                        <div>
                                            <img src={producto.picture} alt="imagegoo" className="image-product"></img>
                                        </div>
                                        <div className="price-description ">
                                            <div className="price">
                                                <span className="pricevalue">
                                                    <CurrencyFormat value={producto.price.amount} displayType={'text'} thousandSeparator={true} prefix={'$'}></CurrencyFormat>
                                                </span>
                                                { producto.free_shipping ?
                                                <span className="freeshipping">
                                                    <img src={freeshiping} alt="freeShiping"></img>
                                                </span> : "" }
                                            </div>
                                            <span className="description">
                                                {producto.title}
                                            </span>
                                        </div>
                                        <div className="city pull-right">
                                            <span className="pull-right">{producto.city}</span>
                                        </div>
                                    </div>
                                </Link>
                                <hr className="line-div"></hr>
                            </div>
                        )) : error ?  <div><h2>Product Not Found</h2></div> : <h1>Cargando...</h1>}
                        
                        
                    </div>
                </div>);
}

function useQuery(){
return new URLSearchParams(useLocation().search);
}