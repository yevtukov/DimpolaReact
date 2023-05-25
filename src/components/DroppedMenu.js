import '../css/normalize.css';
import '../css/font-awesome.min.css';
import '../css/style.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

let all = 'Все'

class DroppedMenu extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      reason: undefined,
      type: undefined,
      season: undefined,
      brand: undefined,
      category: ''
    }
  }
      
  componentDidMount() {
    const filters = this.getFilteredProducts();
    Promise.all([filters]).then(([filters]) => {
      this.setState({
        reason: filters.reason,
        type: filters.type,
        season: filters.season,
        brand: filters.brand
      });
    },
      reason => {
        alert(reason)
      });
  }

    getFilteredProducts = () => {
    return new Promise((resolve, reject) => {
      fetch(`https://api-neto.herokuapp.com/bosa-noga/filters`)
      .then(result => {
        if (result.ok) return result;
        throw new Error(result.statusText);
      })
      .then(result => result.json())
      .then(result => {
        
        resolve(result.data)
      })
      .catch(error => {
        reject(error)
      });
    })
  }

  getDroppedItems(Arr) {
    let newArr = [];
    newArr = Arr.slice(0)
    if(newArr.length>7) {
      newArr
        .sort((a, b) => Math.random() - 0.5)
        .splice(6)
      newArr.push(all)
      return newArr
    } else {
      return newArr
    }
  }

  mainSubmenuHidden(event) {
    document.querySelector('.dropped-menu').classList.remove('dropped-menu_visible')
    document.querySelectorAll('.main-menu__item ').forEach(item => {
      item.classList.remove('main-menu__item_active')
    })
  }

  getItimes(Arr, item) {
    if(!Arr) {
      return null
    } else {
      return this.getDroppedItems(Arr).map(
        item => (

          <li 
            className="dropped-menu__item"
            onClick={this.mainSubmenuHidden}
            key={ item }
          >

          {
            item !== all ? 
                <Link to={{
                  pathname: `/products/`,
                  search: `?category=${this.props.activeCategory}`,
                  state:{
                    categoryFromDroppedMenu: arguments[1],
                    itemFromDroppedMenu: item
                  }

                }}>
              { item }
            </Link> :

            <Link to={`/products/?category=${this.props.activeCategory}`}>
              { item }
            </Link>
          }
            
          </li>)
      )
    }
  }

  render() {
   
    return (
      <div className="dropped-menu">
        <div className="wrapper">
          <div className="dropped-menu__lists dropped-menu__lists_women">
            <h3 className="dropped-menu__list-title">Повод:</h3>
            <ul className="dropped-menu__list">
                {this.getItimes(this.state.reason, "reason")}
            </ul>
          </div>
          <div className="dropped-menu__lists">
            <h3 className="dropped-menu__list-title">Категории:</h3>
            <ul className="dropped-menu__list">
              {this.getItimes(this.state.type, "type")}
              
            </ul>
          </div>
          <div className="dropped-menu__lists">
            <h3 className="dropped-menu__list-title">Сезон:</h3>
            <ul className="dropped-menu__list">
              {this.getItimes(this.state.season, "season")}
              
            </ul>
          </div>
          <div className="dropped-menu__lists dropped-menu__lists_three-coloumns">
            <h3 className="dropped-menu__list-title">Бренды:</h3>
            <ul className="dropped-menu__list">
                {this.getItimes(this.state.brand, "brand")}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default DroppedMenu;

DroppedMenu.contextTypes = {
    newApi: PropTypes.object.isRequired
};