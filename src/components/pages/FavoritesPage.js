import React from 'react';
import PropTypes from "prop-types";
import BreadCrumbs from '../BreadCrumbs';
import FavoritesFeed from '../FavoritesFeed';
import Pagination from '../Pagination';
import {get, serializeFavorites, handleSelectFilter} from "../../utils/functions";

const Selector = props => {
    return (
        <select
            id="sorting"
            value={props.value}
            onChange={event => props.onSelectFilter({sortBy: event.currentTarget.value})}
        >
            {
                props.options.map(option =>
                    <option
                        key={option.value}
                        value={option.value}
                    >{option.title}</option>
                )
            }
        </select>
    )
};


class FavoritesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            feed: [],
            feedLength: 0,
            pagesCount: undefined,
            sortBy: [
                {
                    value: 'popularity',
                    title: 'По популярности'
                },
                {
                    value: 'price',
                    title: 'По цене'
                }
            ],
            filters: {
                sortBy: "popularity",
                page: 1,
                id: []
            }
        };
        this.handleSelectFilter = handleSelectFilter.bind(this);
    }

    componentDidMount() {
        this.setState({
            filters: {
                ...this.state.filters,
                id: this.props.favorites
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (serializeFavorites(this.props.favorites) !== serializeFavorites(prevProps.favorites)) {
            this.setState({
                filters: {
                    ...this.state.filters,
                    id: this.props.favorites
                }
            })
        }

        if (serializeFavorites(this.state.filters) !== serializeFavorites(prevState.filters)) {
            this.getFilteredProducts(serializeFavorites(this.state.filters))
                .then(responce => {
                    this.setState({
                        feed: responce.data,
                        feedLength: responce.goods,
                        pagesCount: responce.pages
                    })
                });
        }

    }

    getFilteredProducts = filters => {
        const {products} = this.context.newApi;

        return new Promise(resolve => {
            get(products(filters))
                .then(responce => resolve(responce));
        })
    };

    render() {
        const
            {feed, feedLength, pagesCount, filters, sortBy} = this.state,
            {handleFavoriteToggle} = this.props;
        return (
            <div className="wrapper wrapper_favorite">
                <BreadCrumbs path={[{title: "Избранное"}]} />
                <main className="product-catalogue product-catalogue_favorite">
                    <section className="product-catalogue__head product-catalogue__head_favorite">
                        <div className="product-catalogue__section-title">
                            {
                                feed.length ? 
                                    <div>
                                        <h2 className="section-name">В вашем избранном</h2>
                                        <span className="amount">{`${feedLength} наименований`}</span>
                                    </div> :
                                    <h2 className="section-name">В вашем избранном пока ничего нет</h2>
                            }
                        </div>
                        {
                            feed.length ?
                                <div className="product-catalogue__sort-by">
                                    <p className="sort-by">Сортировать</p>
                                    <Selector
                                        value={filters.sortBy}
                                        options={sortBy}
                                        onSelectFilter={this.handleSelectFilter}
                                    />
                                </div>:
                                null
                        }
                    </section>
                    {
                        feed.length ?
                            <FavoritesFeed
                                feedArray={feed}
                                handleFavoriteToggle={handleFavoriteToggle}
                            /> :
                            null
                    }
                    {
                        pagesCount > 1 ?
                            <Pagination onSelectFilter={this.handleSelectFilter} page={filters.page}
                                        pages={pagesCount}/> :
                            undefined
                    }
                </main>
            </div>
        )
    }
}

FavoritesPage.contextTypes = {
    newApi: PropTypes.object.isRequired,
    favoriteStorageKey: PropTypes.string.isRequired
};

FavoritesPage.propTypes = {
    handleFavoriteToggle: PropTypes.func.isRequired,
    favorites: PropTypes.array.isRequired
};

export default FavoritesPage;