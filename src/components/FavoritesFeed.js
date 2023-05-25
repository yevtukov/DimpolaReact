import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';

class FavoritesFeed extends React.Component {
    handleFavoriteClick(e, id) {
        e.preventDefault();
        this.props.handleFavoriteToggle(id);
    }

    render() {
        const {feedArray} = this.props;

        const
            {favoriteStorageKey} = this.context,
            storageStr = localStorage.getItem(favoriteStorageKey),
            storageParsed = storageStr ? JSON.parse(storageStr) : [];

        return (
            <section className="product-catalogue__item-list product-catalogue__item-list_favorite">
                {
                    feedArray.map(item => {
                        return (
                            <NavLink key={item.id} className="item-list__item-card item"
                                     to={`/product/?id=${item.id}`}>
                                <div className="item-pic">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                    />
                                    <div
                                        onClick={(e) => this.handleFavoriteClick(e, item.id)}
                                        className={`product-catalogue__product_favorite${storageParsed.includes(item.id) ? ' favorite' : ''}`}
                                    >
                                        <p></p>
                                    </div>
                                </div>
                                <div className="item-desc">
                                    <h4 className="item-name">{item.title}</h4>
                                    <p className="item-producer">Производитель: <span
                                        className="producer">{item.brand}</span></p>
                                    <p className="item-price">{item.price}</p>
                                </div>
                            </NavLink>
                        )
                    })
                }
            </section>
        )
    }
}

FavoritesFeed.contextTypes = {
    favoriteStorageKey: PropTypes.string.isRequired
};

FavoritesFeed.propTypes = {
    feedArray: PropTypes.array.isRequired,
    handleFavoriteToggle: PropTypes.func.isRequired
};

export default FavoritesFeed;