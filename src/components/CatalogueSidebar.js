import React from 'react';
import PropTypes from 'prop-types';
import RangeSlider from './RangeSlider';
import {debounce, transliterate} from "../utils/functions";

class Toggler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: this.props.hidden ? this.props.hidden : false,
            marginTop: '0px',
            marginTopToHide: undefined
        }
    }

    componentDidMount() {

        this.setState({
            marginTopToHide: this.contentWrapper.offsetHeight + 1,
            marginTop: this.state.hidden ? `-${this.contentWrapper.offsetHeight + 1}px` : '0px'
        })
    }

    animate(from, to, duration, callback, afterCallback) {
        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timePassed = time - start;

            if (timePassed < 0) {
                timePassed = 0;
            } else if (timePassed > duration) {
                timePassed = duration;
            }

            if (callback) {
                const value = from + (to - from) * (timePassed / duration);
                callback(value);
            }


            if (timePassed < duration) {
                requestAnimationFrame(animate);
            } else if (afterCallback) {
                afterCallback();
            }
        });
    }

    handleToggleHidden = () => {
        const {hidden, marginTopToHide} = this.state;
        let from, to;

        if (hidden) {
            from = marginTopToHide;
            to = 0
        } else {
            to = marginTopToHide;
            from = 0
        }

        this.animate(
            from,
            to,
            this.props.speed ? this.props.speed : 300,
            mt => this.setState({marginTop: `-${mt}px`}),
            () => this.setState({hidden: !hidden})
        );
    };

    render() {
        const {marginTop, hidden} = this.state;

        return (
            <section className="sidebar__division">
                <div className="sidebar__division-title" onClick={this.handleToggleHidden}>
                    <h3>{this.props.header || 'Header'}</h3>
                    <div className={hidden ? "opener-down" : "opener-up"}/>
                </div>
                <div ref={el => this.contentWrapper = el} style={{overflow: 'hidden'}}>
                    <div className="sidebar__division-content" style={{marginTop}}>
                        {
                            this.props.children
                        }
                    </div>
                </div>
            </section>
        )
    }
}

class CatalogueSidebar extends React.Component {
    handleCheckboxSelect(stack, checkbox) {
        const {onSelectFilter} = this.props;

        if (checkbox.checked && !Array.isArray(stack)) {
            onSelectFilter({
                [checkbox.filterName]: [checkbox.value]
            });
        } else if (checkbox.checked && !stack.includes(checkbox.value)) {
            onSelectFilter({
                [checkbox.filterName]: [...stack, checkbox.value]
            });
        } else if (!checkbox.checked && stack.includes(checkbox.value)) {
            onSelectFilter({
                [checkbox.filterName]: stack.filter(el => el !== checkbox.value)
            });
        }
    }

    handleFormSubmit = event => {
        const {onSelectFilter} = this.props;
        event.preventDefault();
        onSelectFilter({
            [event.currentTarget.input.dataset.filterName]: event.currentTarget.input.value
        })
    };

    componentDidMount () {
        if(this.props.productTypeFromProductPage) {
            this.props.onSelectFilter({type: this.props.productTypeFromProductPage})
        }
        if(this.props.categoryFromDroppedMenu) {
            this.props.onSelectFilter({[this.props.categoryFromDroppedMenu]: this.props.itemFromDroppedMenu})
        }
        
    }

    componentDidUpdate (prevProps) {
        
        if(prevProps.itemFromDroppedMenu !== this.props.itemFromDroppedMenu) {
            this.props.onResetFilters()
            this.props.onSelectFilter({[this.props.categoryFromDroppedMenu]: this.props.itemFromDroppedMenu})
        }
    }

    render() {
        const {availableFilters, filters, onSelectFilter, onResetFilters:handleResetFilters, handleResetFilter} = this.props;

        return (
            <section className="sidebar">
                <Toggler header="Каталог" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.type.map(type =>

                                <li
                                    className="filter"
                                    key={type}
                                    onClick={(event) => {
                                            event.target.classList.toggle('chosen');
                                            event.target.classList.contains('chosen') ? 
                                                onSelectFilter({type}) :
                                                handleResetFilter({type:undefined})
                                        }
                                    }
                                >{type}</li>)
                        }
                    </ul>
                </Toggler>

                <Toggler header="Цена" speed={100} hidden={true}>
                    <RangeSlider
                        minVal={0}
                        maxVal={100000}
                        onChange={debounce((minPrice, maxPrice) => onSelectFilter({minPrice, maxPrice}), 500)}
                    />
                </Toggler>

                <Toggler header="Цвет" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.color.map(color =>
                                <li
                                    className="filter"
                                    key={color}
                                    onClick={(event) => {

                                            event.target.classList.toggle('chosen');
                                            event.target.classList.contains('chosen') ? 
                                                onSelectFilter({color}) :
                                                handleResetFilter({color:undefined});

                                        }
                                    }
                                >
                                    <div className={`color-circle ${transliterate(color).toLowerCase()}`}/>
                                    <div className="color-name">{color}</div>
                                </li>
                            )
                        }
                    </ul>
                </Toggler>

                <Toggler header="Размер" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.sizes.map(el =>
                                <li key={el}>
                                    <div className="custom-checkbox">
                                        <label className="custom-checkbox__label">
                                            <input
                                                type="checkbox"
                                                className="custom-checkbox__input"
                                                checked={Array.isArray(filters.size) && filters.size.includes(el)}
                                                onChange={e => this.handleCheckboxSelect(filters.size, {
                                                    filterName: 'size',
                                                    value: el,
                                                    checked: e.currentTarget.checked
                                                })}
                                            />
                                            <span className="custom-checkbox__content">{el}</span>
                                        </label>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </Toggler>

                <Toggler header="Размер каблука" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.heelSize.map(el =>
                                <li key={el}>
                                    <div className="custom-checkbox">
                                        <label className="custom-checkbox__label">
                                            <input
                                                type="checkbox"
                                                className="custom-checkbox__input"
                                                checked={Array.isArray(filters.heelSize) && filters.heelSize.includes(el)}
                                                onChange={e => this.handleCheckboxSelect(filters.heelSize, {
                                                    filterName: 'heelSize',
                                                    value: el,
                                                    checked: e.currentTarget.checked
                                                })}
                                            />
                                            <span className="custom-checkbox__content">{el}</span>
                                        </label>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </Toggler>

                <Toggler header="Повод" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.reason.map(reason =>
                                <li
                                    className="filter"
                                    key={reason}
                                    onClick={(event) => {
                                            event.target.classList.toggle('chosen');
                                            event.target.classList.contains('chosen') ? 
                                                onSelectFilter({reason}) :
                                                handleResetFilter({reason:undefined}) 
                                        }
                                    }
                                >{reason}</li>
                            )
                        }
                    </ul>
                </Toggler>

                <Toggler header="Сезон" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.season.map(season =>
                                <li
                                    className="filter"
                                    key={season}
                                    onClick={(event) => {
                                            event.target.classList.toggle('chosen');
                                            event.target.classList.contains('chosen') ? 
                                                onSelectFilter({season}) :
                                                handleResetFilter({season:undefined}) 
                                        }
                                    }
                                >{season}</li>
                            )
                        }
                    </ul>
                </Toggler>

                <Toggler header="Бренд" speed={100} hidden={true}>
                    <ul className="vertical-list">
                        {
                            availableFilters.brand.map(brand =>
                                <li
                                    className="filter"
                                    key={brand}
                                    onClick={(event) => {
                                            event.target.classList.toggle('chosen');
                                            event.target.classList.contains('chosen') ? 
                                                onSelectFilter({brand}) :
                                                handleResetFilter({brand:undefined}) 
                                        }
                                    }
                                >{brand}</li>
                            )
                        }
                    </ul>
                </Toggler>

                <section className="sidebar__division">
                    <form
                        className="brand-search"
                        onSubmit={this.handleFormSubmit}
                    >
                        <input name="input" data-filter-name="search" type="search" className="brand-search" id="brand-search" placeholder="Поиск"/>
                        <input type="submit" className="submit"/>
                    </form>
                    <label>
                    <input 
                        type="checkbox" class="checkbox" name="checkbox-disc"
                        checked={Array.isArray(filters.discounted) && filters.discounted.includes('discounted')}
                        onChange={e => this.handleCheckboxSelect(filters.discounted, {
                                                    filterName: 'discounted',
                                                    value: 'discounted',
                                                    checked: e.currentTarget.checked
                                                })}
                    />
                        <span class="checkbox-discount"></span> 
                        <span class="text-discount">Со скидкой</span>
                    </label>
                </section>

                <section className="sidebar__division">
                    <span onClick={handleResetFilters} className="clear-filters">Сбросить</span>
                </section>
            </section>
        )
    }
}

CatalogueSidebar.propTypes = {
    onResetFilters: PropTypes.func.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    handleResetFilter: PropTypes.func.isRequired,
    onChangePriceFilter: PropTypes.func.isRequired,
    availableFilters: PropTypes.object.isRequired
};

export default CatalogueSidebar;