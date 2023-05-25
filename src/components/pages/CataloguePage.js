import React from 'react';
import PropTypes from "prop-types";
import CatalogueSidebar from '../CatalogueSidebar';
import CatalogueFeed from '../CatalogueFeed';
import {get, serialize, handleSelectFilter, parseQuery} from "../../utils/functions";
import BreadCrumbs from '../BreadCrumbs'

class CataloguePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        const categoryId = parseQuery(this.props.location.search).category;
        this.state = {
            categoryName: categoryId ? this.props.categories.find(el => el.id === Number(categoryId)).title : '',
            feed: undefined,
            pages: undefined,
            goods: undefined,
            filters: {
                page: 1,
                categoryId,
                ...this.handleResetFilters()
            },
            availableFilters: undefined,
            fSearch: '',
            productTypeFromProductPage: '',
            categoryFromDroppedMenu: '',
            itemFromDroppedMenu: ''
        };
        this.handleSelectFilter = handleSelectFilter.bind(this);
    }

    componentDidMount() {
        if(this.props.location.state) {
            
                this.setState({
                    productTypeFromProductPage: this.props.location.state.productTypeFromProductPage,
                    categoryFromDroppedMenu: this.props.location.state.categoryFromDroppedMenu,
                    itemFromDroppedMenu: this.props.location.state.itemFromDroppedMenu
                })
            }
        this.setState({
            fSearch: this.props.location.search.includes('search') ? this.props.location.search : this.state.fSearch
        })
        const filters = serialize(this.state.filters);
        !this.props.location.search.includes('search') ?
        Promise.all([
            this.getFilteredProducts(filters),
            this.getAllFilterValues()
        ])
            .then(responce => {
                
                this.setState({
                    pages: responce[0].pages,
                    goods: responce[0].goods,
                    feed: responce[0].data,
                    availableFilters: responce[1],
                    filters: {
                        ...this.state.filters,
                        sortBy: responce[1].sortBy[0].value
                    }
                })
            }) :
        Promise.all([

            this.getSearchProducts(filters),
            this.getAllFilterValues()
        ])
                .then(responce => {
                    this.setState({
                        pages: responce[0].pages,
                        goods: responce[0].goods,
                        feed: responce[0].data,
                        availableFilters: responce[1],
                        filters: {
                        ...this.state.filters,
                        sortBy: responce[1].sortBy[0].value
                    }
                    })
                });   
    }

    componentDidUpdate(prevProps, prevState) {
        if((prevProps.location.state !== this.props.location.state) && this.props.location.state ) {
            this.setState({
                    categoryFromDroppedMenu: this.props.location.state.categoryFromDroppedMenu,
                    itemFromDroppedMenu: this.props.location.state.itemFromDroppedMenu
                })
        }
        const
            filters = serialize(this.state.filters),
            categoryId = parseQuery(this.props.location.search).category,
            prevCategoryId = parseQuery(prevProps.location.search).category,
            categoryName = categoryId ? this.props.categories.find(el => el.id === Number(categoryId)).title : '';

        if (categoryId !== prevCategoryId) {
            this.setState({
                categoryName,
                filters: {
                    page: 1,
                    categoryId,
                    ...this.handleResetFilters()
                }
            })
        }

        if (serialize(prevState.filters) !== filters) {
            if (this.props.location.search.includes('search')) {
                this.getSearchProducts(filters)
                .then(responce => {
                    this.setState({
                        pages: responce.pages,
                        goods: responce.goods,
                        feed: responce.data
                    })
                });
            } else {
                this.getFilteredProducts(filters)
                .then(responce => {
                    this.setState({
                        pages: responce.pages,
                        goods: responce.goods,
                        feed: responce.data
                    })
                });

            }
        }
    }
    
    handleResetFilters = (setState) => {
        document.querySelectorAll('.filter').forEach(filter => {
           filter.classList.remove('chosen') 
        })
        
        const reset = {
            maxPrice: undefined,
            minPrice: undefined,
            type: undefined,
            color: undefined,
            sortBy: undefined,
            size: [],
            heelSize: [],
            brand: undefined,
            season: undefined,
            reason: undefined,
            search: undefined,
            discounted:[]
        };

        if (setState) {

            this.setState({
                filters: {
                    ...this.state.filters,
                    ...reset
                }
            });
        } else {
            
            return reset;
        }
    };

    handleResetFilter = (reset) => {
        this.setState({
            filters: {
                ...this.state.filters,
                ...reset
            }
        });
    };

    handleUpdatePriceFilter = (minPrice, maxPrice) => {
        this.setState({
            filters: {
                ...this.state.filters,
                maxPrice,
                minPrice
            }
        });
    };

    handleSelectPage = (page) => {
        this.setState({
            filters: {
                ...this.state.filters,
                page
            }
        });
    };

    getAllFilterValues = () => {
        const {filters} = this.context.newApi;
        return new Promise(resolve => {
            get(filters())
                .then(({data: filters}) => {
                    filters.sortBy = [
                        {
                            value: 'popularity',
                            title: 'По популярности'
                        },
                        {
                            value: 'price',
                            title: 'По цене'
                        }
                    ];
                    resolve(filters);
                });
        });
    };

    getFilteredProducts = filters => {
        const {products} = this.context.newApi;
        return new Promise(resolve => {
            get(products(filters))
                .then(responce => resolve(responce));
        })
    };

    getSearchProducts = filters => {
        const {products} = this.context.newApi;
        return new Promise(resolve => {
            get(products()+this.props.location.search+"&"+filters)
                .then(responce => resolve(responce));
        })  
    };

    getName = () => {
        const {fSearch, categoryName } = this.state;
        if (fSearch) return 'Результаты поиска';
        else return categoryName;
  };
  
    render() {
        const {feed, goods, pages, categoryName, availableFilters, filters,} = this.state;
        return (
            <React.Fragment>
            <BreadCrumbs path={[{title: this.getName()}]} />
                <main className="product-catalogue clearfix">
                    {
                        availableFilters ?
                            <CatalogueSidebar
                                onSelectFilter={this.handleSelectFilter}
                                availableFilters={availableFilters}
                                onChangePriceFilter={this.handleUpdatePriceFilter}
                                filters={filters}
                                onResetFilters={() => this.handleResetFilters(true)}
                                handleResetFilter={this.handleResetFilter}
                                productTypeFromProductPage={this.state.productTypeFromProductPage}
                                categoryFromDroppedMenu={this.state.categoryFromDroppedMenu}
                                itemFromDroppedMenu={this.state.itemFromDroppedMenu}
                            /> :
                            undefined
                    }
                    {
                        pages && goods && feed ?
                            <CatalogueFeed
                                feed={feed}
                                goods={goods}
                                pages={pages}
                                page={this.state.filters.page}
                                categoryName={categoryName}
                                fSearch={this.state.fSearch}
                                availableFilters={availableFilters}
                                filters={filters}
                                onSelectFilter={this.handleSelectFilter}
								handleFavoriteToggle={this.props.handleFavoriteToggle}
                            /> :
                            undefined
                    }
                </main>
            </React.Fragment>
        )
    }
}

CataloguePage.contextTypes = {
    newApi: PropTypes.object.isRequired
};

export default CataloguePage;