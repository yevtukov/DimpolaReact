import React from 'react';
import PropsTypes from 'prop-types';

const Pagination = props => {
    const
        {page, pages, onSelectFilter} = props,
        elements = [];

    for (let i = 1; i <= pages; i++) {
        elements.push(
            <li
                key={i}
                className={i === page ? 'active' : ''}
                data-page={i}
                onClick={() => onSelectFilter({page: i})}
            >{i}</li>
        );
    }
    
    return (
        <div className="product-catalogue__pagination">
            <div className="page-nav-wrapper">
                {
                    (page === 1) ? 
                        null : 
                        <div class="angle-back" onClick={() => onSelectFilter({page: page-1})}>
                            <a></a>
                        </div>
                }
                    <ul>
                        {
                            elements
                        }
                    </ul>
                {
                    (page === elements.length) ? 
                        null : 
                        <div class="angle-forward" onClick={() => onSelectFilter({page: page+1})}>
                            <a></a>
                        </div>
                }
            </div>
        </div>
    )
};

Pagination.propTypes = {
    onSelectFilter: PropsTypes.func.isRequired,
    pages: PropsTypes.oneOfType([
        PropsTypes.number,
        PropsTypes.string
    ]).isRequired,
    page: PropsTypes.oneOfType([
        PropsTypes.number,
        PropsTypes.string
    ]).isRequired,
};

export default Pagination;