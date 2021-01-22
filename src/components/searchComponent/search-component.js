import './search-component.scss';
import searchIcon from '../../assets/search.svg'
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
export default function SearchComponent() {

        const history = useHistory();
        const [search , setSearch] = useState("");

        const handleSubmit = (evt) => {
            evt.preventDefault();
            if(!search) {
                alert(`Campo de busqueda vacio`);
                return;
            }
            history.push(`/items?search=${search}`);
        }

        return (<div id="search-box">
                <form className="search-form" onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input 
                            type="text"
                            name="search" 
                            placeholder="Nunca dejes de buscar"
                            id="search"
                            className="form-control width-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            >
                        </input>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary btn-light" type="submit" >
                                <img src={searchIcon} alt="searchIcon"></img>
                            </button>
                        </div>
                    </div>
                </form>
            </div>);
}

