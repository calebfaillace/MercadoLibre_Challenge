import './detail-component.scss';
import { useParams } from "react-router";
import React, { useState, useEffect } from "react";
import BreadcrumComponent from '../share-components/breadcrum-component';
import CurrencyFormat from 'react-currency-format';

export default function DetailComponent(){
    
    let {id} = useParams();

    let [ producto, setProducto] = useState();
    let [ error, setError] = useState(false); 
    useEffect(() =>{
        getData();
    },[])

    const getData = () => {
        fetch(`/api/items/${id}`)
        .then(res => {
            if(!res.ok) {
                setError(true);
                setProducto(null);
            } else {
                res.json().then(producto => {
                    setProducto(producto);
                })
            }
        })
    }
    
    return (<div id="detail-box" >
             <div className="container ">

                <BreadcrumComponent categories={producto?.categories}></BreadcrumComponent>
                
                {producto ? <div className="detail-info">
                    <div className="row"> 
                        <div className="col-md-8 img-prd">
                            <img src={producto.item.picture} alt="imgprod" className="img-fluid image-size"></img>
                        </div>
                        <div className="col-md-4 name-price">
                            <div className="newOld">
                                <span>{producto.item.condition} - {producto.item.sold_quantity} Vendidos</span>
                            </div>
                            <div className="name-prod">
                                Deco Reverse Sombrero Oxford
                            </div>
                            <div className="price-prod">
                                <CurrencyFormat value={producto.item.price.amount} displayType={'text'} thousandSeparator={true} prefix={'$'}></CurrencyFormat>
                            </div>
                            
                            <div className="">
                                <button id="button-buy" className="btn">Comprar</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8 left-margin">
                            <div className="desc-title">
                                <span>Descripción del producto</span>
                            </div>
                            <div className="desc-text">
                                <p>{producto.item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div> : error ? <div><h2>Product Not Found</h2></div> : <h3>Cargando...</h3>}
             </div>
            
        </div>)
    
}